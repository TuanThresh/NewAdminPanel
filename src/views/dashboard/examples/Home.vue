<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecentSales from '@/components/examples/RecentSales.vue';
import Overview from '@/components/examples/Overview.vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import { onMounted,ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { useCustomerStore } from '@/stores/customerStore';
import { useOrderStore } from '@/stores/orderStore';
import { useDomainProductStore } from '@/stores/domainProductStore';

const employeeStore = useEmployeeStore();
const customerStore = useCustomerStore();
const orderStore = useOrderStore();
const domainProductStore = useDomainProductStore();


const date = ref<[Date,Date]>([new Date(),new Date()]);
const totalCustomer = ref(0);
const totalEmployee = ref(0);
const totalRevenueOrder = ref(0);
const totalDomainProduct = ref(0);

const onDateChange = async () => {
  const dateOnly = {
    from : date.value[0].toISOString().split('T')[0],
    to: date.value[1].toISOString().split('T')[0]
  }
  totalEmployee.value = await employeeStore.getStatistic(dateOnly);
  totalCustomer.value = await customerStore.getStatistic(dateOnly);
  totalRevenueOrder.value = await orderStore.getStatistic(dateOnly);
  totalDomainProduct.value = await domainProductStore.getStatistic(dateOnly);




}

onMounted(async() => {
  date.value[0] = new Date();
  date.value[1] = new Date(new Date().setDate(new Date().getDate() + 7));

  await onDateChange()

})
</script>

<template>
  <div>
    <page-header title="Thống kê">
      <div class="flex items-center space-x-2">
        <VueDatePicker :enable-time-picker="false" 
          :format="'yyyy-MM-dd'"
          placeholder="Chọn khoảng ngày"
          range
          v-model="date"
          @update:model-value="onDateChange()"
        ></VueDatePicker>
      </div>
    </page-header>

    <Tabs default-value="overview" class="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="reports">
          Reports
        </TabsTrigger>
        <TabsTrigger value="notifications">
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ totalRevenueOrder }} đ
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Số lượng khách hàng
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ totalCustomer }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Số lượng nhân viên
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ totalEmployee }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Số lượng miền hoạt động
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ totalDomainProduct }}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card >
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent class="pl-2">
              <Overview />
            </CardContent>
          </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
