<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import Button from '@/components/ui/button/Button.vue';
import { Input } from '@/components/ui/input';
import type { Role } from '@/interfaces';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import { useRoleStore } from '@/stores/roleStore';

const store = useRoleStore();

const formSchema = toTypedSchema(z.object({
  roleName: z.string().min(1,{
    message : "Tên quyền không được để trống"
  }).default(""),
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);
const editMode = ref(false);

onMounted(async() => {
  await store.getRoles();
})

const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editRole(values)
  }
  else await store.addRole(values);
})


// 🔹 Cấu hình cột cho DataTable
const columns: ColumnDef<Role>[] = [
  { accessorKey: 'id', header: 'Mã Quyền' },
  { accessorKey: 'roleName', header: 'Tên Quyền' },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) => h('div', {}, [
      h(Button, {
        variant: "outline",
        class : "mr-2",
        onClick: () => {
          editMode.value = true;
          setValues({ ...row.original });
        }
      }, () => "Sửa"),
      h(Button, { variant: "destructive", onClick: async() => await store.deleteRole(row.original.id) }, () => "Xóa")
    ])
  },
];
</script>

<template>
  <div>
    <page-header title="Quản lý Quyền"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="roleName">
            <FormItem class="mb-4">
              <FormLabel>Tên quyền</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Tên quyền" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm quyền" }}</Button>
      </form>

    <DataTable :columns="columns" :data="store.roles"></DataTable>
  </div>
</template>
