<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import Button from '@/components/ui/button/Button.vue';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Authorize } from '@/interfaces';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import { useAuthorizeStore } from '@/stores/authorizeStore';
import { useRoleStore } from '@/stores/roleStore';
import { useAppStore } from '@/stores/app';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useRoute } from 'vue-router';
const store = useAuthorizeStore();

const appStore = useAppStore();

const roleStore = useRoleStore();



onMounted(async () => {

  currentPage.value = (useRoute().query.currentPage?.toString() ?? 1) as number ;
  
  await roleStore.getRoles("-1");
  setValues({
    roleId: roleStore.roles[0].id.toString()
  })
  await store.getAuthorizes(currentPage.value.toString());

  appStore.setPagination();

});
const formSchema = toTypedSchema(z.object({
  employeeId : z.string().min(1,{
    message : "Mã nhân viên không được để trống"
  }).default("1"),
  roleId: z.string().min(1,{
    message : "Tên quyền không được để trống"
  }).default(""),
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);
const onSubmit = handleSubmit(async () =>{
  await store.authorize(values);
})

const currentPage = ref(1);

watch(currentPage,async (value) => {

  

  await store.getAuthorizes(value.toString());

  appStore.setPagination();

})

const columns: ColumnDef<Authorize>[] = [
  { accessorKey: 'id', header: 'Mã phân quyền' }, 
  { accessorKey: 'employeeName', header: 'Tên nhân viên',cell : ({row}) => row.original.employee.name }, 
  { accessorKey: 'roleName', header: 'Tên quyền',cell : ({row}) => row.original.role.roleName },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center' }, [
        h(
          Button,
          {
            variant: 'destructive',
            onClick: async () => await store.removeAuthorize({roleId : row.original.role.id,employeeId : row.original.employee.id})
          },
          () => 'Xóa'
        )
      ])
  }
];

</script>

<template>
  <div>
    <page-header title="Quản lý phân quyền"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="employeeId">
            <FormItem class="mb-4">
              <FormLabel>Mã nhân viên</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Mã nhân viên" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="roleId">
            <FormItem class="mb-4">
              <FormLabel>Quyền</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem :value="role.id.toString()" v-for="role in roleStore.roles" :key="role.id">{{ role.roleName }}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <Button type="submit">Phân quyền</Button>
      </form>

    <DataTable :columns="columns" :data="store.authorizes"></DataTable>
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
