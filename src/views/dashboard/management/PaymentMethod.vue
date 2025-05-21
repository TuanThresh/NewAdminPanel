<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
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
import type { PaymentMethod } from "@/interfaces/index";
import { usePaymentMethodStore } from '@/stores/paymentMethodStore';



const formSchema = toTypedSchema(z.object({
  paymentMethodName: z.string().min(1,{
    message : "Tên phương thức thanh toán không được để trống"
  }).default(""),
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);
const store = usePaymentMethodStore();
const editMode = ref(false);

const defaultValues = {...values};

const clearForm = () => {
  editMode.value = false;
  setValues({...defaultValues})
}

const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editPaymentMethod(values)
  }
  else await store.addPaymentMethod(values);
})

onMounted(async () => {
  await store.getPaymentMethods();
})

const columns: ColumnDef<PaymentMethod>[] = [
  { accessorKey: 'id', header: 'Mã phương thức thanh toán', enableSorting: false },
  { accessorKey: 'paymentMethodName', header: 'Tên phương thức thanh toán', enableSorting: false },
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
            console.log(row.original)
            setValues({...row.original})
          } },
          () => 'Sửa'
        ),
        h(
          Button,
          { variant: 'destructive', onClick: async () => await store.deletePaymentMethod(row.original.id.toString()) },
          () => 'Xóa'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý phương thức thanh toán"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="paymentMethodName">
            <FormItem class="mb-4">
              <FormLabel>Tên phương thức thanh toán</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Tên phương thức thanh toán" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div></div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm nhân viên" }}</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>
    </form>
    <DataTable :columns="columns" :data="store.paymentMethods"></DataTable>
  </div>
</template>
