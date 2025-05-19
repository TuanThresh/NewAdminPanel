<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import type { Employee, StatusType } from "@/interfaces/index";
const store = useEmployeeStore();

const formSchema = toTypedSchema(z.object({
  status: z.string().default("ChoXacThuc"),
  email: z.string().min(1,{
    message : "Email không được để trống"
  }).email({
    message : "Email phải bao gồm @gmail.com"
  }).default(""),
  name: z.string().min(1,{
    message : "Tên nhân viên không được để trống"
  }).default(""),
  phoneNumber: z.string().min(1,"Số điện thoại không được để trống").default(""),
  address: z.string().min(1,"Địa chỉ không được để trống").default("")
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);

const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editEmployee(values)
  }
  else await store.addEmployee(values);
})

const tagVariants: StatusType[] = [
  { tag: 'success', title: 'Kích hoạt', value: 'KichHoat' },
  { tag: 'warning', title: 'Chờ xác thực', value: 'ChoXacThuc' },
];

const editMode = ref(false);



const defaultValues = {
  status: 'ChoXacThuc',
  email: '',
  name: '',
  phoneNumber: '',
  address: '',
};

const clearForm = () => {
  editMode.value = false;
  setValues({ ...defaultValues });
};

// Cấu hình cột cho DataTable
const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'id', header: 'Mã nhân viên' },  // Hiển thị mã nhân viên
  { accessorKey: 'name', header: 'Họ tên' },
  { accessorKey: 'address', header: 'Địa chỉ' },
  { accessorKey: 'phoneNumber', header: 'Số điện thoại' },

  { accessorKey: 'hasRoles', header: 'Chức vụ' },
  { accessorKey: 'email', header: 'Email' },
  {
  accessorKey: 'status',
  header: 'Trạng thái',
  enableSorting: false,
  cell: ({ row }) => {
    const statusTag = tagVariants.find(tag => tag.value === row.original.status);
    return h(Badge, { variant: statusTag?.tag }, () => statusTag?.title);
  }
  },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) => h('div', {}, [
      h(Button, {
        variant: "outline",
        class: 'mr-2',
        onClick: () => {
          editMode.value = true;
          setValues({ ...row.original }); // Cập nhật form khi sửa
        },
      }, () => "Sửa"),
      h(Button, { variant: "destructive", onClick: async() => {
        await store.deleteEmployee(row.original.id)
      } }, () => "Xóa")
    ])
  },
];

onMounted(async () => {
  await store.getEmployees();
})
</script>

<template>
  <div>
    <page-header title="Quản lý nhân viên"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="name">
            <FormItem class="mb-4">
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Họ tên" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="email">
            <FormItem class="mb-4">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="example@mail.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="status">
            <FormItem class="mb-4">
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ChoXacThuc">Chờ xác thực</SelectItem>
                      <SelectItem value="KichHoat">Kích hoạt</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <FormField v-slot="{ componentField }" name="address">
            <FormItem class="mb-4">
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" placeholder="Địa chỉ"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="phoneNumber">
            <FormItem class="mb-4">
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" placeholder="Số điện thoại"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>  
      <div></div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm nhân viên" }}</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>
    </form>
    <DataTable :columns="columns" :data="store.employees"></DataTable>
  </div>
</template>
