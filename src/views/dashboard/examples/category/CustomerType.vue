<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import type { Customer, CustomerType } from "@/interfaces/index";
import { useCustomerTypeStore } from '@/stores/customerTypeStore';


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

  await store.getCustomerTypes();
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
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm nhân viên" }}</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>
    </form>
    <DataTable :columns="columns" :data="store.customerTypes"></DataTable>
  </div>
</template>
