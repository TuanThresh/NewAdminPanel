<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
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
import type { Customer } from "@/interfaces/index";
import { useCustomerStore } from '@/stores/customerStore';
import { useCustomerTypeStore } from '@/stores/customerTypeStore';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';

const formSchema = toTypedSchema(z.object({
  email: z.string().min(1,{
    message : "Email không được để trống"
  }).email({
    message : "Email phải bao gồm @gmail.com"
  }).default(""),
  name: z.string().min(1,{
    message : "Tên nhân viên không được để trống"
  }).default(""),
  address: z.string().min(1,{
    message : "Địa chỉ không được để trống"
  }).default(""),
  phoneNumber : z.string().min(1,{
    message : "Số điện thoại không được để trống"
  }).default(""),
  customerTypeId : z.string().min(1,{
    message : "Loại khách hàng không được để trống"
  }).default("1")
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);
const customerTypeStore = useCustomerTypeStore();

const editMode = ref(false);

const store = useCustomerStore();

const appStore = useAppStore();

const defaultValues = {...values};


const clearForm = () => {
  editMode.value = false;
  setValues({...defaultValues})
}

const onSubmit = handleSubmit(async () =>{
  store.editCustomer(values)
})

const currentPage = ref(1);

watch(currentPage,async (value) => {
  await store.getCustomers(value.toString());

  appStore.setPagination();

})

onMounted(async () => {

  currentPage.value = (useRoute().query.currentPage?.toString() ?? 1) as number ;

  await customerTypeStore.getCustomerTypes("-1");
  
  await store.getCustomers(currentPage.value.toString());

  appStore.setPagination();


})

const columns: ColumnDef<Customer>[] = [
  { accessorKey: 'id', header: 'Mã khách hàng', enableSorting: false },
  { accessorKey: 'name', header: 'Tên khách hàng', enableSorting: false },
  { accessorKey: 'hasType', header: 'Loại khách hàng', enableSorting: false },
  { accessorKey: 'phoneNumber', header: 'Số điện thoại', enableSorting: false },
  { accessorKey: 'email', header: 'Email', enableSorting: false },
  { accessorKey: 'address', header: 'Địa chỉ', enableSorting: false },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, [
        h(
          Button,
          { variant: 'outline', class: 'mr-2', onClick: () => {
            editMode.value = true;
            setValues({...row.original})
          } },
          () => 'Sửa'
        ),
        h(
          Button,
          { variant: 'destructive', onClick: async () => await store.deleteCustomer(row.original.id.toString()) },
          () => 'Xóa'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý khách hàng"></page-header>
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
        <FormField v-slot="{ componentField }" name="address">
            <FormItem class="mb-4">
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Địa chỉ" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="phoneNumber">
            <FormItem class="mb-4">
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Số điện thoại" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="customerTypeId">
            <FormItem class="mb-4">
              <FormLabel>Loại khách hàng</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="customerType in customerTypeStore.customerTypes" :key="customerType.id" :value="customerType.id.toString()">{{ customerType.typeName }}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div></div>
      <Button type="submit" v-if="editMode">Cập nhật</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>

    </form>
    <DataTable :columns="columns" :data="store.customers" search="name"></DataTable>
    <Pagination :items-per-page="appStore.paginationGetter?.pageSize || 10" :total="appStore.paginationGetter?.totalCount" :default-page="1" class="mt-5" v-if="appStore.paginationGetter">
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious @click="currentPage --" />
        <template v-for="(item, index) in items" :key="index">
          
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="(index + 1) == currentPage"
            @click="currentPage = item.value"
          >
            {{ item.value }}
          </PaginationItem>
          
        </template>
        <PaginationNext @click="currentPage ++"/>
        
      </PaginationContent>
    </Pagination>
  </div>
</template>
