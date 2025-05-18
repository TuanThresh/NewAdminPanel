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
import { RouterLink } from 'vue-router';
const router = useRouter();
const formSchema = toTypedSchema(z.object({
  password: z.string().min(3,{
    message : "Mật khẩu phải có ít nhất 3 ký tự"
  }).default("Pa$$w0rd"),
  email: z.string().email({
    message : "Email phải có đuôi @gmail.com"
  }).default("tuan92381@st.vimaru.edu.vn"),
}));

const store = useEmployeeStore();

const form = useForm({
      validationSchema: formSchema,
  });

const onSubmit = form.handleSubmit(async () => {

  await store.loginEmployee(form.values);
});
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <Card class="max-w-[320px] md:max-w-[400px] w-full">
      <CardHeader>
        <CardTitle class="text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem class="mb-4">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="example@mail.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>  
        </form>
      </CardContent>
      <CardFooter class="flex flex-col items-end">
        <RouterLink
          to="forgot-password"
          class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200 mb-3"
        >
          Quên mật khẩu?
        </RouterLink>
        <Button class="w-full" @click="onSubmit">Đăng nhập</Button>
      </CardFooter>
    </Card>
  </main>
</template>