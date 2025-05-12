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
import type { DomainProduct } from "@/interfaces/index";
import { useDomainProductStore } from '@/stores/domainProductStore';



const formSchema = toTypedSchema(z.object({
  domainName: z.string().min(1,{
    message : "Tên miền không được để trống"
  }).default(""),
  priceStart: z.number(),
  domainType: z.string().min(1,{
    message : "Loại miền không được để trống"
  }).default("VietName"),
  price: z.number(),
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);
const store = useDomainProductStore();
const editMode = ref(false);



const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editDomainProduct(values)
  }
  else await store.addDomainProduct(values);
})

onMounted(async () => {
  await store.getDomainProducts();
})

const columns: ColumnDef<DomainProduct>[] = [
  { accessorKey: 'id', header: 'Mã miền', enableSorting: false },
  { accessorKey: 'domainName', header: 'Tên miền', enableSorting: false },
  { accessorKey: 'priceStart', header: 'Giá khởi điểm', enableSorting: false },
  { accessorKey: 'domainType', header: 'Loại miền', enableSorting: false },
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
          { variant: 'destructive', onClick: async () => await store.deleteDomainProduct(row.original.id.toString()) },
          () => 'Xóa'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý tên miền"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="domainName">
            <FormItem class="mb-4">
              <FormLabel>Tên miền</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Tên miền" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="priceStart">
            <FormItem class="mb-4">
              <FormLabel>Giá khởi điểm</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Giá khởi điểm" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="price">
            <FormItem class="mb-4">
              <FormLabel>Giá miền</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Giá miền" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>

      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="domainType">
            <FormItem class="mb-4">
              <FormLabel>Loại miền</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="VietName">Việt Nam</SelectItem>
                      <SelectItem value="International">Quốc tế</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm nhân viên" }}</Button>
      <!-- <Button v-if="editMode" @click="clearData">Hủy</Button> -->
    </form>
    <DataTable :columns="columns" :data="store.domainProducts"></DataTable>
  </div>
</template>
