<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import { useRouter } from 'vue-router';
import { useEmployeeStore } from '@/stores/employeeStore';
import { onMounted } from 'vue';
const router = useRouter();
const formSchema = toTypedSchema(z.object({
    name: z.string().min(1,{message : "Tên không được để trống"
  }).default(""),
  email: z.string().email({
    message : "Email phải có đuôi @gmail.com"
  }).default(""),
  phoneNumber: z.string().min(1,"Số điện thoại không được để trống").default(""),
  address: z.string().min(1,"Địa chỉ không được để trống").default("")
}));

const store = useEmployeeStore();

const form = useForm({
      validationSchema: formSchema,
  });

const onSubmit = form.handleSubmit(async () => {

  await store.editEmployee(form.values);
});

onMounted(async() => {
    const value = await store.getEmployeeByName(store.employee?.name ?? "");

    form.setValues({...value});
})
</script>

<template>
  <main class="flex items-center justify-center">
    <Card class="max-w-[620px] w-full">
      <CardHeader>
        <CardTitle class="text-center">Hồ sơ nhân viên</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="name">
            <FormItem class="mb-4">
              <FormLabel>Tên nhân viên</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Tên nhân viên" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem class="mb-4">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="example@mail.com" v-bind="componentField" disabled />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="address">
            <FormItem class="mb-4">
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" placeholder="Địa chỉ"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="phoneNumber">
            <FormItem class="mb-4">
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" placeholder="Số điện thoại"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>  
        </form>
      </CardContent>
      <CardFooter class="flex flex-col items-end">
        <Button class="w-full" @click="onSubmit">Cập nhật hồ sơ</Button>
      </CardFooter>
    </Card>
  </main>
</template>