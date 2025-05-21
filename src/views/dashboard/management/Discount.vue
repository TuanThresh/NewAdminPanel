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
import type { Discount } from "@/interfaces/index";
import { useCustomerTypeStore } from '@/stores/customerTypeStore';
import { useDiscountStore } from '@/stores/discountStore';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useAppStore } from '@/stores/app';

const formSchema = toTypedSchema(z.object({
  percentage: z.number().default(0),
  discountCode: z.string().min(1,{
    message : "Mã giảm giá không được để trống"
  }).default(""),
  expiredAt: z.date().default(new Date()),
  customerTypeId: z.string().optional().default("null"),
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);
const customerTypeStore = useCustomerTypeStore();

const editMode = ref(false);

const appStore = useAppStore();

const store = useDiscountStore();

const defaultValues = {...values};

const clearForm = () => {
  editMode.value = false;
  setValues({...defaultValues})
}

const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editDiscount(values)
  }
  else await store.addDiscount(values);
})

onMounted(async () => {
  await customerTypeStore.getCustomerTypes();
  await store.getDiscounts();
})

const columns: ColumnDef<Discount>[] = [
  { accessorKey: 'id', header: 'Mã giảm giá', enableSorting: false },
  { accessorKey: 'discountCode', header: 'Tên mã giảm giá', enableSorting: false },
  { accessorKey: 'percentage', header: 'Phần trăm giảm giá', enableSorting: false },
  { accessorKey: 'expiredAt', header: 'Thời điểm hết hạn', enableSorting: false },
  { accessorKey: 'customerType', header: 'Loại mã giảm giá', cell : ({row}) => row.original.customerType ? row.original.customerType.typeName : "Mã giảm giá công khai" },
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
            const {customerType,expiredAt,...dataWithoutCustomerType} = row.original;
            setValues({customerTypeId : customerType ? customerType.id.toString() : "null",
            expiredAt: new Date(expiredAt),
            ...dataWithoutCustomerType})
          } },
          () => 'Sửa'
        ),
        h(
          Button,
          { variant: 'destructive', onClick: async () => await store.deleteDiscount(row.original.id.toString()) },
          () => 'Xóa'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý mã giảm giá"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="discountCode">
            <FormItem class="mb-4">
              <FormLabel>Tên mã giảm giá</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Tên mã giảm giá" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="percentage">
            <FormItem class="mb-4">
              <FormLabel>Phần trăm giảm giá</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Phần trăm giảm giá" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="expiredAt">
            <FormItem class="mb-4">
              <FormLabel>Thời điểm hết hạn</FormLabel>
              <FormControl>
                <VueDatePicker v-bind="componentField" :dark="appStore.isDark" ></VueDatePicker>
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
                      <SelectItem value="null">Mã giảm giá công khai</SelectItem>
                      <SelectItem v-for="customerType in customerTypeStore.customerTypes" :key="customerType.id" :value="customerType.id.toString()">{{ customerType.typeName }}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm mã giảm giá" }}</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>
    </form>
    <DataTable :columns="columns" :data="store.discounts"></DataTable>
  </div>
</template>
