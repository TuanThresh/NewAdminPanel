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
import type {  New } from "@/interfaces/index";
import '@vuepic/vue-datepicker/dist/main.css'
import { useNewStore } from '@/stores/newStore';
import { useCategoryStore } from '@/stores/categoryStore';

const formSchema = toTypedSchema(z.object({
  id: z.string().optional(),
    title: z.string().min(1,{
    message : "Tiêu đề không được để trống"
  }).default(""),
  content: z.string().min(1,{
    message : "Nội dung không được để trống"
  }).default(""),
  categoryId: z.string().min(1,{
    message : "Loại tin tức không được để trống"
  }).default("1"),
  image: z.instanceof(File, {
  message: "Ảnh không hợp lệ hoặc chưa được chọn"
}),
}));

const {handleSubmit, values, setValues } = useForm(
  {
    validationSchema: formSchema,
  }
);

const editMode = ref(false);

const store = useNewStore();

const categoryStore = useCategoryStore();

const onSubmit = handleSubmit(async () =>{
  

  const formData = new FormData();
  
  formData.append("title",values.title as string);
  formData.append("content",values.content as string);
  formData.append("categoryId",values.categoryId as string);
  formData.append("image",values.image as Blob);

  if(editMode.value){
    await store.editNew(values.id as string,formData)
  }
  else await store.addNew(formData);
})

onMounted(async () => {
  await categoryStore.getCategories();
  categoryStore.categories.forEach(element => {
    console.log(element);
  });
  await store.getNews();
})

const columns: ColumnDef<New>[] = [
  { accessorKey: 'id', header: 'Mã tin tức', enableSorting: false },
  { accessorKey: 'title', header: 'Tiêu đề tin tức', enableSorting: false },
  { accessorKey: 'content', header: 'Nội dung', enableSorting: false },
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
          } },
          () => 'Sửa'
        ),
        h(
          Button,
          { variant: 'destructive', onClick: async () => await store.deleteNew(row.original.id.toString()) },
          () => 'Xóa'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý tin tức"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="title">
            <FormItem class="mb-4">
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Tiêu đề" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="content">
            <FormItem class="mb-4">
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nội dung" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="categoryId">
            <FormItem class="mb-4">
              <FormLabel>Loại tin tức</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="category in categoryStore.categories" :key="category.id" :value="category.id.toString()">{{ category.name }}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <div class="grid gap-y-2">
        <FormField v-slot="{ componentField }" name="image">
            <FormItem class="mb-4">
              <FormLabel>Ảnh tin tức</FormLabel>
              <FormControl>
                <Input type="file" @change="(e : Event) => {
                  const target = e.target as HTMLInputElement;

                  if(target.files && target.files[0])
                  {
                    componentField.onChange(target.files[0])
                  }
                }" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
      </div>
      <Button type="submit">{{editMode ? "Cập nhật" : "Thêm tin tức" }}</Button>
    </form>
    <DataTable :columns="columns" :data="store.news"></DataTable>
  </div>
</template>
