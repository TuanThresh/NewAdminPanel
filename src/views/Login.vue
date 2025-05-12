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
const router = useRouter();
const formSchema = toTypedSchema(z.object({
  password: z.string().min(3,{
    message : "Password must be at least 3 characters"
  }).default("123"),
  email: z.string().email({
    message : "Email must end with @gmail.com"
  }).default("lehoangtuan783@gmail.com"),
}));

const store = useEmployeeStore();

const form = useForm({
      validationSchema: formSchema,
  });

const onSubmit = form.handleSubmit(async () => {

  await store.loginEmployee(form.values);

  router.push({name : 'home'})
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>  
        </form>
      </CardContent>
      <CardFooter>
        <Button class="w-full" @click="onSubmit">Login</Button>
      </CardFooter>
    </Card>
  </main>
</template>