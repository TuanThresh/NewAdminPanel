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
import type { DomainProduct } from "@/interfaces/index";
import { useDomainProductStore } from '@/stores/domainProductStore';
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
  domainName: z.string().min(1,{
    message : "Tên miền không được để trống"
  }).default(""),
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

const appStore = useAppStore();

const editMode = ref(false);

const defaultValues = {...values};

const clearForm = () => {
  editMode.value = false;
  setValues({...defaultValues})
}

const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editDomainProduct(values)
  }
  else await store.addDomainProduct(values);
})

const currentPage = ref(1);

watch(currentPage,async (value) => {
  await store.getDomainProducts(value.toString());

  appStore.setPagination();

})

onMounted(async () => {

  currentPage.value = (useRoute().query.currentPage?.toString() ?? 1) as number ;

  await store.getDomainProducts(currentPage.value.toString());

  appStore.setPagination();

})

const columns: ColumnDef<DomainProduct>[] = [
  { accessorKey: 'id', header: 'Mã miền', enableSorting: false },
  { accessorKey: 'domainName', header: 'Tên miền', enableSorting: false },
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
      <div></div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm miền" }}</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>
    </form>
    <DataTable :columns="columns" :data="store.domainProducts"></DataTable>
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
