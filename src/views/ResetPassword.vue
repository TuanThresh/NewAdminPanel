<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import { useRoute, useRouter } from 'vue-router';
import { useEmployeeStore } from '@/stores/employeeStore';
import { RouterLink } from 'vue-router';
import axios from '@/plugins/axios';
import { handleSucess,handleError } from '@/lib/utils';
const router = useRouter();
const route = useRoute();
const formSchema = toTypedSchema(z.object({
  newPassword: z.string().min(3,{
    message : "Mật khẩu phải có ít nhất 3 ký tự"
  }).default(""),
  confirmPassword: z.string().min(3,{
    message : "Mật khẩu phải có ít nhất 3 ký tự"
  }).default(""),
}));

const store = useEmployeeStore();

const form = useForm({
      validationSchema: formSchema,
  });

const onSubmit = form.handleSubmit(async () => {

  try {
    const response = await axios.post("employee/reset_password",{
    email: route.query.email,
    token: route.query.token,
    newPassword: form.values.newPassword,
    confirmPassword: form.values.confirmPassword
  })
  handleSucess(response.status.toString(),response.data)
  router.replace("login");
  
  } catch (error) {
        handleError(error);

  }
  
});
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <Card class="max-w-[320px] md:max-w-[400px] w-full">
      <CardHeader>
        <CardTitle class="text-center">Đổi mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="newPassword">
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" placeholder="Mật khẩu mới" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField> 
          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" placeholder="Xác nhận mật khẩu"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>  
        </form>
      </CardContent>
      <CardFooter class="flex flex-col items-end">
        <RouterLink
          to="login"
          class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200 mb-3"
        >
          Đăng nhập
        </RouterLink>
        <Button class="w-full" @click="onSubmit">Gửi</Button>
      </CardFooter>
    </Card>
  </main>
</template>