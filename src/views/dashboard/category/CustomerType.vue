<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import type { Customer, CustomerType } from "@/interfaces/index";
import { useCustomerTypeStore } from '@/stores/customerTypeStore';
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const formSchema = toTypedSchema(z.object({
  typeName: z.string().min(1,{
    message : "Tên loại không được để trống"
  }).default(""),
  description: z.string().optional(),
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);
const editMode = ref(false);

const store = useCustomerTypeStore();

const appStore = useAppStore();

const currentPage = ref(1);

watch(currentPage,async (value) => {
  await store.getCustomerTypes(value.toString());

  appStore.setPagination();

})

const defaultValues = {...values};

const clearForm = () => {
  editMode.value = false;
  setValues({...defaultValues})
}

const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editCustomerType(values)
  }
  else await store.addCustomerType(values);
})

onMounted(async () => {

  currentPage.value = (useRoute().query.currentPage?.toString() ?? 1) as number ;


  await store.getCustomerTypes(currentPage.value.toString());

  appStore.setPagination();

})

const columns: ColumnDef<CustomerType>[] = [
  { accessorKey: 'id', header: 'Mã khách hàng', enableSorting: false },
  { accessorKey: 'typeName', header: 'Tên loại khách hàng', enableSorting: false },
  { accessorKey: 'description', header: 'Miêu tả', enableSorting: false },
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
          { variant: 'destructive', onClick: async () => await store.deleteCustomerType(row.original.id.toString()) },
          () => 'Xóa'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý loại khách hàng"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="typeName">
            <FormItem class="mb-4">
              <FormLabel>Tên loại khách hàng</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Tên loại khách hàng" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="description">
            <FormItem class="mb-4">
              <FormLabel>Miêu tả</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Miêu tả" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm loại khách hàng" }}</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>
    </form>
    <DataTable :columns="columns" :data="store.customerTypes"></DataTable>
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
