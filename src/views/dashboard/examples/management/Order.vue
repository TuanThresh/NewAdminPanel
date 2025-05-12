<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import { Pencil, Trash, Check, X } from 'lucide-vue-next';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
const orders = ref([]);
const discountValue = ref(0);

const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã đơn hàng' },
  { accessorKey: 'name', header: 'Tên khách hàng' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'sdt', header: 'Số điện thoại' },
  { accessorKey: 'dia_chi', header: 'Địa chỉ' },
  { accessorKey: 'service_id', 
    header: 'Gói dịch vụ', 
    cell: ({ row }) => getServiceName(row.original.service_id)
  },  
  { accessorKey: 'service_type', header: 'Loại dịch vụ' },
  { accessorKey: 'discount_id', header: 'Mã giảm giá' },
  { accessorKey: 'total_price', header: 'Giá' },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClasses = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-500',
        paid: 'bg-green-100 text-green-700 border-green-500',
        cancelled: 'bg-red-100 text-red-700 border-red-500',
      };
      return h(
        'span',
        { class: `px-3 py-1 rounded border ${statusClasses[status] || 'bg-gray-100 text-gray-700 border-gray-500'}` },
        status === 'pending' ? 'Chờ xử lý' : status === 'paid' ? 'Đã chấp thuận' : 'Đã hủy'
      );
    }
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) => {
      const order = row.original;
      const isPending = order.status === 'pending';

      return h('div', { class: 'flex space-x-1' }, [
        // Nút Sửa (icon bút chì)
        h(
          Button,
          { variant: 'outline', class: 'p-1', onClick: () => editOrder(order) },
          () => h(Pencil, { class: 'w-4 h-4' })
        ),

        // Nút Xóa (icon thùng rác)
        h(
          Button,
          { variant: 'destructive', class: 'p-1', onClick: () => deleteOrder(order.id) },
          () => h(Trash, { class: 'w-4 h-4' })
        ),

        // Nếu trạng thái là "Chờ xử lý", hiển thị thêm 2 nút xác nhận / hủy
        isPending &&
          h(
            Button,
            { variant: 'success', class: 'p-1', onClick: () => updateStatus(order.id, 'paid') },
            () => h(Check, { class: 'w-4 h-4 text-green-600' })
          ),

        isPending &&
          h(
            Button,
            { variant: 'danger', class: 'p-1', onClick: () => updateStatus(order.id, 'cancelled') },
            () => h(X, { class: 'w-4 h-4 text-red-600' })
          ),
      ]);
    },
  },
];

interface OrderPayload {
  id?: number;
  name: string;
  email: string;
  sdt: string;
  dia_chi: string;
  service_id: number | null;
  service_type: string;
  total_price: number;
  status: string;
  duration_months: number;
  discount_code?: string | null;
}

const form = ref<OrderPayload>({
  name: '',
  email: '',
  sdt: '',
  dia_chi: '',
  service_id: 0,
  service_type: '',
  total_price: 0,
  status: 'pending',
  duration_months: 3,
  discount_code: null,
});
//Cập nhật trạng thái đơn hàng
const updateStatus = async (id: number, newStatus: string) => {
  try {
    console.log(`🔄 Đang cập nhật trạng thái: ID ${id}, Status: "${newStatus}"`);

    const response = await axios.put(`http://127.0.0.1:8000/api/orders/${id}`, {
      status: newStatus.trim()
    });

    console.log("✅ Cập nhật thành công:", response.data);

    if (newStatus === 'paid') {
      const order = orders.value.find(o => o.id === id);
      if (order) {
        await addCustomer(order);
        await createInvoice(order);
      }
    }
    fetchOrders();
  } catch (error: any) {
    console.error('❌ Lỗi khi cập nhật trạng thái:', error.response?.data || error);
  }
};
const addCustomer = async (order: any) => {
  try {
    console.log("🛠 Đang kiểm tra khách hàng...");
    
    const checkResponse = await axios.get(`http://127.0.0.1:8000/api/customers?email=${order.email}`);
    console.log("📩 Kết quả kiểm tra khách hàng:", checkResponse.data);
    
    if (checkResponse.data.exists) {
      console.log(`👤 Khách hàng đã tồn tại: ${order.email}`);
      return;
    }

    console.log("➕ Thêm khách hàng mới...");
    
    const addResponse = await axios.post('http://127.0.0.1:8000/api/customers', {
      name: order.name,
      email: order.email,
      sdt: order.sdt,
      dia_chi: order.dia_chi
    });

    console.log("✅ Khách hàng đã được thêm:", addResponse.data);
  } catch (error) {
    console.error("❌ Lỗi khi thêm khách hàng:",error);
  }
};
const getCustomerByEmail = async (email: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/customers`);
    const customers = response.data;

    return customers.find((customer: any) => customer.email === email) || null;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách khách hàng:", error);
    return null;
  }
};

const createInvoice = async (order: any) => {
  try {
    console.log("🔍 Đang tìm kiếm khách hàng...");

    const customer = await getCustomerByEmail(order.email);
    if (!customer) {
      console.error("❌ Không tìm thấy khách hàng!");
      return;
    }

    console.log(`📝 Đang tạo hóa đơn cho khách hàng ${customer.id}, đơn hàng ${order.id}`);

    await axios.post('http://127.0.0.1:8000/api/invoices', {
      order_id: order.id,
      user_id: customer.id,
      amount: order.total_price,
      status: 'unpaid',
      issued_at: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    console.log("✅ Hóa đơn đã được tạo thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi tạo hóa đơn:", error.response?.data || error);
  }
};


// Lưu danh sách mã dịch vụ tương ứng
const serviceOptions = ref<{ id: number; name: string; price: number }[]>([]);
const selectedServicePrice = ref(0);

// Bảng API tương ứng với từng loại dịch vụ
const typeMap: Record<string, string> = {
  domain: 'domain_products',
  hosting: 'hosting_products',
  vps: 'vps_products',
};

// Trường cần lấy (mã dịch vụ) trong từng bảng
const nameMap: Record<string, string> = {
  domain: 'domain_name',
  hosting: 'plan',
  vps: 'plan',
};

// Theo dõi khi `service_type` thay đổi
watch(() => form.value.service_type, async (newType) => {
  if (!newType) {
    serviceOptions.value = [];
    selectedServicePrice.value = 0;
    return;
  }

  const endpoint = typeMap[newType] ?? '';
  const nameField = nameMap[newType] ?? '';

  if (!endpoint) return;

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/${endpoint}`);
    serviceOptions.value = response.data.map((item: any) => ({
      id: item.id,
      name: item[nameField] ?? 'Không xác định',
      price: item.price ?? 0,
    }));

    console.log('serviceOptions:', serviceOptions.value); // Kiểm tra danh sách mã dịch vụ
  } catch (error) {
    console.error('Lỗi khi tải danh sách dịch vụ:', error);
  }
});

// Theo dõi khi service_id hoặc duration_months thay đổi
watch([() => form.value.service_id, () => form.value.duration_months], () => {
  const selectedService = serviceOptions.value.find(service => service.id === form.value.service_id);
  selectedServicePrice.value = selectedService ? selectedService.price : 0;

  // Tính tổng giá = giá dịch vụ * thời hạn thuê (tháng)
  form.value.total_price = selectedServicePrice.value * (form.value.duration_months || 1);
 
});

const updateTotalPrice = () => {
  const selectedService = serviceOptions.value.find(service => service.id === form.value.service_id);
  const basePrice = selectedService ? selectedService.price : 0;

  let subtotal = basePrice * (form.value.duration_months || 1);
  form.value.total_price = subtotal * (1 - discountValue.value / 100);

  console.log(`Tổng tiền sau giảm giá: ${form.value.total_price}`);
};


const applyDiscount = async () => {
  if (!form.value.discount_code) {
    discountValue.value = 0;
    updateTotalPrice();
    return;
  }

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/discounts/${form.value.discount_code}`);
    const discount = response.data;

    if (discount && discount.percentage) {
      discountValue.value = discount.percentage;
      console.log(`Áp dụng mã giảm giá: ${discount.code}, Giảm: ${discountValue.value}%`);
    } else {
      discountValue.value = 0;
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã giảm giá:", error);
    discountValue.value = 0;
  }

  updateTotalPrice();
};

watch(
  [() => form.value.service_id, () => form.value.duration_months, discountValue],
  () => {
    updateTotalPrice();
  }
);

watch([() => form.value.service_id, () => form.value.duration_months, discountValue], () => {
  const selectedService = serviceOptions.value.find(service => service.id === form.value.service_id);
  selectedServicePrice.value = selectedService ? selectedService.price : 0;

  let subtotal = selectedServicePrice.value * (form.value.duration_months || 1);

  // Tính tổng tiền có giảm giá
  form.value.total_price = subtotal * (1 - discountValue.value / 100);

  console.log(`Tổng tiền sau giảm giá: ${form.value.total_price}`);
});


// Lấy danh sách đơn hàng
const fetchOrders = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/orders');
  orders.value = response.data;
};
const allServices = ref<{ id: number; name: string }[]>([]);

const fetchServices = async () => {
  try {
    const responses = await Promise.all([
      axios.get('http://127.0.0.1:8000/api/domain_products'),
      axios.get('http://127.0.0.1:8000/api/hosting_products'),
      axios.get('http://127.0.0.1:8000/api/vps_products')
    ]);

    allServices.value = [
      ...responses[0].data.map((item: any) => ({ id: item.id, name: item.domain_name })),
      ...responses[1].data.map((item: any) => ({ id: item.id, name: item.plan })),
      ...responses[2].data.map((item: any) => ({ id: item.id, name: item.plan }))
    ];

    console.log('Danh sách dịch vụ:', allServices.value);
  } catch (error) {
    console.error('Lỗi khi tải danh sách dịch vụ:', error);
  }
};
const getServiceName = (id: number) => {
  const service = allServices.value.find(service => service.id === id);
  return service ? service.name : 'Không xác định';
};



// Gửi dữ liệu form
const submitForm = async () => {
  console.log("Dữ liệu gửi đi:", form.value); // Kiểm tra dữ liệu trước khi gửi

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/orders/${form.value.id}`, form.value);
    } else {
      await axios.post('http://127.0.0.1:8000/api/orders', form.value);
    }
    form.value = {
      name: '', email: '', sdt: '', dia_chi: '', service_id: 0, service_type: '', 
      total_price: 0, status: 'pending', duration_months: 3
    };
    fetchOrders();
  } catch (error) {
    console.error("Lỗi khi thêm/cập nhật đơn hàng:", error);
  }
};



// Khi nhấn "Sửa" thì điền dữ liệu vào form
const editOrder = (order: OrderPayload) => {
  form.value = { ...order };
};

// Xóa đơn hàng
const deleteOrder = async (id: number) => {
  await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`);
  fetchOrders();
};

onMounted(async () => {
  await fetchOrders();
  await fetchServices();
});

</script>
<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Đơn Hàng</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <Label for="name">Tên khách hàng</Label>
        <Input type="text" id="name" v-model="form.name" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="email">Email</Label>
        <Input type="email" id="email" v-model="form.email" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="sdt">Số điện thoại</Label>
        <Input type="text" id="sdt" v-model="form.sdt" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="dia_chi">Địa chỉ</Label>
        <Input type="text" id="dia_chi" v-model="form.dia_chi" required />
      </div>
      <div class="grid gap-y-2">
        <label for="service_type" class="block text-sm font-medium">Loại dịch vụ</label>
        <Select v-model="form.service_type" >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="domain">
                Domain
              </SelectItem>
              <SelectItem value="hosting">
                Hosting
              </SelectItem>
              <SelectItem value="vps">
                Vps
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <!-- Chọn mã dịch vụ dựa trên loại dịch vụ -->
      <div class="grid gap-y-2">
        <label for="service_id" class="block text-sm font-medium">Loại dịch vụ</label>
        <Select v-model="form.service_type" :disabled="serviceOptions.length === 0">
          <SelectTrigger>
            <SelectValue placeholder="Chọn mã dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="service in serviceOptions" :key="service.id" :value="service.id">
                {{ service.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-y-2">
        <Label for="duration_months">Thời hạn thuê (tháng)</Label>
        <Input type="number" id="duration_months" v-model="form.duration_months" min="1" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="discount_code">Mã giảm giá</Label>
        <Input type="text" id="discount_code" v-model="form.discount_code" @blur="applyDiscount" />
      </div>
      <div class="grid gap-y-2">
        <Label for="total_price">Tổng tiền</Label>
        <Input type="text" v-model="form.total_price" disabled/>
      </div>
      <div class="grid gap-y-2">
        <label for="status" class="block text-sm font-medium">Trạng thái </label>
        <Select v-model="form.status" >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="pending">
                Chờ xử lý
              </SelectItem>
              <SelectItem value="paid">
                Đã chấp thuận
              </SelectItem>
              <SelectItem value="cancelled">
                Đã hủy
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Đơn Hàng</Button>
    </form>
    <DataTable :columns="columns" :data="orders"></DataTable>
  </div>
</template>
