<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import Button from '@/components/ui/button/Button.vue';
import { Input } from '@/components/ui/input';
import type { PaginationInterface, Role } from '@/interfaces';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import { useRoleStore } from '@/stores/roleStore';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';
const store = useRoleStore();
const appStore = useAppStore();

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

const currentPage = ref(1);

watch(currentPage,async (value) => {
  await store.getRoles(value.toString());

  appStore.setPagination();

})



onMounted(async() => {

  currentPage.value = (useRoute().query.currentPage?.toString() ?? 1) as number ;

  await store.getRoles();

  appStore.setPagination();

})

const onSubmit = handleSubmit(async () =>{
  if(editMode.value){
    await store.editRole(values)
  }
  else await store.addRole(values);
})
const defaultValues = {...values};

const clearForm = () => {
  editMode.value = false;
  setValues({...defaultValues})
}


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
      <div></div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm quyền" }}</Button>
      <Button v-if="editMode" @click="clearForm">Hủy</Button>

      </form>

    <DataTable :columns="columns" :data="store.roles"></DataTable>
    <Pagination v-slot="{ page }" :items-per-page="appStore.paginationGetter?.pageSize || 10" :total="appStore.paginationGetter?.totalCount" :default-page="1" class="mt-5" v-if="appStore.paginationGetter">
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious @click="currentPage --" />
        <template v-for="(item, index) in items" :key="index">
          
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
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
