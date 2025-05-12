<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import axios from "axios";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label/Label.vue";
import Button from "@/components/ui/button/Button.vue";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-vue-next";
import jsPDF from "jspdf";
import { OpenSansFont } from "@/assets/font/vietfont";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Hosting from "../service/Hosting.vue";


// Danh sách hóa đơn từ API
const invoices = ref<any[]>([]);

// Danh sách trạng thái hóa đơn
const statusOptions = [
  { value: "unpaid", label: "Chưa thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "overdue", label: "Quá hạn" },
];

// Lấy danh sách hóa đơn từ API
const fetchInvoices = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/invoices");
    invoices.value = response.data;
  } catch (error) {
    console.error("Lỗi lấy hóa đơn:", error);
  }
};

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: "id", header: "Mã hóa đơn" },
  { accessorKey: "user_id", header: "Mã khách hàng" },
  { accessorKey: "order_id", header: "Mã đơn hàng" },
  { accessorKey: "amount", header: "Tổng tiền" },
  {
    accessorKey: "issued_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = new Date(row.original.issued_at);
      return date.toLocaleDateString("vi-VN"); 
    },
  },
  {
    accessorKey: "due_date",
    header: "Ngày hết hạn",
    cell: ({ row }) => {
      const date = new Date(row.original.due_date);
      return date.toLocaleDateString("vi-VN"); 
    },
  },

  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        unpaid: "bg-red-500 text-white",
        paid: "bg-green-500 text-white",
        overdue: "bg-gray-500 text-white",
      };

      return h(Badge, { class: `mr-2 ${statusColors[status] || "bg-gray-200"}` }, () => {
        return statusOptions.find((s) => s.value === status)?.label || "";
      });
    },
  },
  {
    accessorKey: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const invoice = row.original;
      const buttons = [];
      buttons.push(
        h(
          Button,
          {
            variant: "outline",
            onClick: () => editInvoice(invoice),
          },
          () => "Sửa"
        )
      );
      buttons.push(
        h(
          Button,
          {
            variant: "destructive",
            onClick: () => deleteInvoice(invoice.id),
          },
          () => "Xóa"
        )
      );
      if (invoice.status === "unpaid") {
        buttons.push(
          h(
            Button,
            {
              variant: "outline",
              onClick: () => approveInvoice(invoice.id),
            },
            () => "Chấp thuận"
          ),
          h(
            Button,
            {
              variant: "outline",
              onClick: () => exportInvoice(invoice.id),
            },
            () => "Xuất"
          )
        );
        buttons.push(h(Button, { onClick: () => sendInvoiceEmail(invoice.id) }, () => "📩 Gửi Email"));
      }

      return h("div", { class: "flex space-x-2" }, buttons);
    },
  },

];

// Dữ liệu form
const form = ref({
  id: null,
  order_id: "",
  user_id: "",
  amount: 0,
  status: "unpaid",
  issued_at: "",
  due_date: "",
  payment_method: "",
});

// Xử lý khi ấn "Thêm" hoặc "Cập nhật"
const saveInvoice = async () => {
  try {
    const data = {
      order_id: Number(form.value.order_id),
      user_id: Number(form.value.user_id),
      amount: Number(form.value.amount),  // Ép kiểu về số
      status: form.value.status,
      issued_at: form.value.issued_at ? new Date(form.value.issued_at).toISOString() : null,
      due_date: form.value.due_date ? new Date(form.value.due_date).toISOString() : null,
      payment_method: form.value.payment_method,
    };

    console.log("📌 Dữ liệu gửi lên:", data);

     if(form.value.id){
      await axios.put(`http://127.0.0.1:8000/api/invoices/${form.value.id}`, data);
     }else{
      await axios.post("http://127.0.0.1:8000/api/invoices", data);
     }
    
    fetchInvoices();
  } catch (error) {
    console.error("🔥 Lỗi khi lưu hóa đơn:", error);
  }
};

// Sửa hóa đơn
const editInvoice = (invoice: any) => {
  form.value = { ...invoice };
};

// Xóa hóa đơn
const deleteInvoice = async (id: number) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/invoices/${id}`);
    fetchInvoices();
  } catch (error) {
    console.error("Lỗi khi xóa hóa đơn:", error);
  }
};
const showPopup = ref(false);
const Accounts = ref<any[]>([]);
const selectedAccount = ref<any>(null);
const selectedInvoice = ref<any>(null);
const selectedOrder = ref<any>(null);
const selectedCustomer = ref<any>(null);
const qrImage = ref<string | null>(null);

const handleQRUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      qrImage.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Hàm xuất hóa đơn ra file PDF
const exportInvoice = async (invoiceId: number) => {
  try {
    console.log("📌 ID hóa đơn:", invoiceId);
    
    // Lấy thông tin hóa đơn
    const invoiceRes = await axios.get(`http://127.0.0.1:8000/api/invoices/${invoiceId}`);
    const invoice = invoiceRes.data;

    // Lấy thông tin đơn hàng
    const orderRes = await axios.get(`http://127.0.0.1:8000/api/orders/${invoice.order_id}`);
    const order = orderRes.data;

    // Lấy thông tin khách hàng
    const customerRes = await axios.get(`http://127.0.0.1:8000/api/customers/${invoice.user_id}`);
    const customer = customerRes.data;

    const serviceType = order.service_type;
    console.log("service_id:", order.service_id);

    let accountApiUrl = "";
    if (serviceType === "hosting") {
      accountApiUrl = `http://127.0.0.1:8000/api/hosting_accounts`;
    } else if (serviceType === "vps") {
      accountApiUrl = `http://127.0.0.1:8000/api/vps_accounts`;
    } else if (serviceType === "domain") {
      accountApiUrl = `http://127.0.0.1:8000/api/domain_accounts`;
    }

    if (accountApiUrl) {
      try {
        const accountRes = await axios.get(accountApiUrl);
        const allAccounts = accountRes.data;

        let filteredAccounts =[];
       
        if (serviceType === "hosting") {
           filteredAccounts = allAccounts.filter(account => account.hosting_id === order.service_id);
        } else if (serviceType === "vps") {
           filteredAccounts = allAccounts.filter(account => account.vps_id === order.service_id);
        } else if (serviceType === "domain") {
           filteredAccounts = allAccounts.filter(account => account.domain_id === order.service_id);
        }
      

        if (filteredAccounts.length > 0) {
          Accounts.value = filteredAccounts;
          selectedInvoice.value = invoice;
          selectedOrder.value = order;
          selectedCustomer.value = customer;
          showPopup.value = true;
        } else {
          console.warn("Không tìm thấy tài khoản phù hợp.");
          generatePDF(invoice, order, null, customer);
        }
      } catch (error) {
        console.error("🔥 Lỗi khi lấy danh sách tài khoản:", error);
      }
    } else {
      generatePDF(invoice, order, null, customer);
    }
  } catch (error) {
    console.error("🔥 Lỗi khi xuất hóa đơn:", error);
  }
};

const confirmExport = () => {
  if (!selectedAccount.value) {
    alert("Vui lòng chọn tài khoản trước khi xuất hóa đơn!");
    return;
  }

  generatePDF(selectedInvoice.value, selectedOrder.value, selectedAccount.value,selectedCustomer.value);
  showPopup.value = false;
  selectedAccount.value =null;
};
const generatePDF = (invoice: any, order: any, account: any, customer : any) => {
  const doc = new jsPDF();
  OpenSansFont(doc);
  doc.setFont("OpenSans");

  doc.text("HÓA ĐƠN THANH TOÁN", 20, 20);
  doc.text(`Mã hóa đơn: ${invoice.id}`, 20, 40);
  doc.text(`Mã đơn hàng: ${order.id}`, 20, 50);
  doc.text(`Dịch vụ: ${order.service_type}`, 20, 60);
  doc.text(`Tổng tiền: ${invoice.amount.toLocaleString()} đồng`, 20, 70);

  doc.text("Thông tin của bạn", 130, 20);
  doc.text(`họ tên: ${customer.name}`, 130, 40);
  doc.text(`email: ${customer.email}`, 130, 50);
  doc.text(`địa chỉ: ${customer.dia_chi}`, 130, 60);
  doc.text(`số điện thoại: ${customer.sdt}`, 130, 70);

  if (account) {
    doc.text("Thông tin tài khoản:", 20, 90);
    doc.text(`Tài khoản: ${account.username}`, 20, 100);
    doc.text(`Mật khẩu: ${account.password}`, 20, 110);
    if (order.service_type === "domain") {
      doc.text(`Quản trị: ${account.registrar_panel}`, 20, 120);
    }else if(order.service_type === 'hosting'){
      doc.text(`Quản trị: ${account.control_panel}`, 20, 120);
    }else{
      doc.text(`Hệ điều hành: ${account.os}`, 20, 120);
      doc.text(`IP: ${account.ip_address}`, 20, 130);
    }
  }
  if (qrImage.value) {
    doc.text("Quét mã QR để thanh toán:", 20, 140);
    doc.addImage(qrImage.value, "PNG", 20, 150, 50, 50);
  }
  doc.save(`invoice_${invoice.id}.pdf`);
};
const sendInvoiceEmail = async (invoiceId: number) => {
  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/send-email/${invoiceId}`);
    alert(response.data.message);
  } catch (error) {
    console.error("🔥 Lỗi khi gửi email:", error);
    alert("Không thể gửi email.");
  }
};



// Lấy dữ liệu khi load trang
onMounted(fetchInvoices);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Hóa Đơn</h1>

    <form class="grid grid-cols-2 gap-5 mb-10" @submit.prevent="saveInvoice">
      <div>
        <Label for="order_id">Mã đơn hàng</Label>
        <Input id="order_id" v-model="form.order_id" />
      </div>

      <div>
        <Label for="user_id">Mã khách hàng</Label>
        <Input id="user_id" v-model="form.user_id" />
      </div>

      <div>
        <Label for="amount">Tổng tiền</Label>
        <Input id="amount" type="number" v-model="form.amount" />
      </div>

      <div>
        <Label for="payment_method">Phương thức thanh toán</Label>
        <Input id="payment_method" v-model="form.payment_method" />
      </div>

      <div>
        <Label for="issued_at">Ngày tạo</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ form.issued_at || "Chọn ngày" }}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar v-model="form.issued_at" />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label for="due_date">Ngày hết hạn</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ form.due_date || "Chọn ngày" }}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar v-model="form.due_date" />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label for="status">Trạng thái</Label>
        <Select v-model="form.status" @update:modelValue="(value) => form.status = value">
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">{{ form.id ? "Cập nhật" : "Thêm" }} hóa đơn</Button>
    </form>

    <DataTable :columns="columns" :data="invoices" />
  </div>
  <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div class="bg-white p-5 rounded-md relative">
    <!-- Nút đóng popup -->
    <button @click="showPopup = false" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
      ✖
    </button>

    <h2 class="text-lg font-bold mb-4">Chọn tài khoản</h2>
    <ul>
      <li v-for="account in Accounts" :key="account.id" class="cursor-pointer p-2 hover:bg-gray-100" 
          @click="selectedAccount = account">
        {{ account.username }} - {{ account.password }}
      </li>
    </ul>

    <!-- Upload mã QR -->
    <div class="mt-4">
      <label for="qrUpload" class="block text-sm font-medium text-gray-700">Tải mã QR</label>
      <input id="qrUpload" type="file" accept="image/*" @change="handleQRUpload" />
    </div>

    <!-- Nút Xuất Hóa Đơn -->
    <button @click="confirmExport" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
      Xuất Hóa Đơn
    </button>
  </div>
</div>
</template>
