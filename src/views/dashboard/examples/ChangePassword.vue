<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormLabel, FormItem,FormMessage } from '@/components/ui/form';
import { useEmployeeStore } from '@/stores/employeeStore';

const formSchema = toTypedSchema(z.object({
    currentPassword: z.string().min(1,{message : "Mật khẩu hiện tại không được để trống"
  }).default(""),
  newPassword: z.string().min(1,{message : "Mật khẩu mới không được để trống"
  }).default(""),
}));

const store = useEmployeeStore();

const form = useForm({
      validationSchema: formSchema,
  });

const onSubmit = form.handleSubmit(async () => {

  await store.changePassword(form.values);
});

</script>

<template>
  <main class="flex items-center justify-center">
    <Card class="max-w-[620px] w-full ">
      <CardHeader>
        <CardTitle class="text-center">Sửa mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="currentPassword">
            <FormItem class="mb-4">
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mật khẩu hiện tại" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="newPassword">
            <FormItem class="mb-4">
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mật khẩu mới" v-bind="componentField" />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col items-end">
        <Button class="w-full" @click="onSubmit">Sửa mật khẩu</Button>
      </CardFooter>
    </Card>
  </main>
</template>