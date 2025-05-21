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
import axios from '@/plugins/axios';
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from '@/stores/app';
const router = useRouter();
const formSchema = toTypedSchema(z.object({
  email: z.string().email({
    message : "Email phải có đuôi @gmail.com"
  }).default(""),
}));

const store = useEmployeeStore();

const appStore = useAppStore();

const form = useForm({
      validationSchema: formSchema,
  });

const onSubmit = form.handleSubmit(async () => {

  try {
    const response = await axios.post("employee/forgot_password",{
    email: form.values.email
  })
  handleSucess(response.status.toString(),response.data);
  appStore.setLoading(false);
  
  } catch (error) {
  appStore.setLoading(false);
    handleError(error);
  }
});
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <Card class="max-w-[320px] md:max-w-[400px] w-full">
      <CardHeader>
        <CardTitle class="text-center">Quên mật khẩu</CardTitle>
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