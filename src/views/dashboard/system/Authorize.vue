<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
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

const store = useAuthorizeStore();

const roleStore = useRoleStore();



onMounted(async () => {
  await roleStore.getRoles();
  setValues({
    roleId: roleStore.roles[0].id.toString()
  })
  await store.getAuthorizes();
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
      <Button type="submit">Thêm quyền</Button>
      </form>

    <DataTable :columns="columns" :data="store.authorizes"></DataTable>
  </div>
</template>
