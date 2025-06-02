<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import type { DomainAccount} from "@/interfaces/index";
import { useDomainAccountStore } from '@/stores/domainAccountStore';
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
  registerPanel: z.string().min(1,{
    message : "Register panel không được để trống"
  }).default(""),
  username: z.string().min(1,{
    message : "Tên tài khoản không được để trống"
  }).default(""),
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);
const store = useDomainAccountStore();

const appStore = useAppStore();

const currentPage = ref(1);

watch(currentPage,async (value) => {
  await store.getDomainAccounts(value.toString());

  appStore.setPagination();

})

const editMode = ref(false);

const defaultValues = {...values};

const clearForm = () => {
  editMode.value = false;
  setValues({...defaultValues})
}

const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editDomainAccount(values)
  }
  else await store.addDomainAccount(values);
})

onMounted(async () => {

  currentPage.value = (useRoute().query.currentPage?.toString() ?? 1) as number ;

  await store.getDomainAccounts(currentPage.value.toString());

  appStore.setPagination();

})

const columns: ColumnDef<DomainAccount>[] = [
  { accessorKey: 'id', header: 'Mã miền', enableSorting: false },
  { accessorKey: 'registerPanel', header: 'Register Panel', enableSorting: false },
  { accessorKey: 'username', header: 'Tên tài khoản', enableSorting: false },
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
          { variant: 'destructive', onClick: async () => await store.deleteDomainAccount(row.original.id.toString()) },
          () => 'Xóa'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý tài khoản miền"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="registerPanel">
            <FormItem class="mb-4">
              <FormLabel>Register Panel</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Register Panel" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="username">
            <FormItem class="mb-4">
              <FormLabel>Tên người dùng</FormLabel>
              <FormControl>
                <Input type="string" placeholder="Tên người dùng" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm tài khoản miền" }}</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>

    </form>
    <DataTable :columns="columns" :data="store.domainAccounts"></DataTable>
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
