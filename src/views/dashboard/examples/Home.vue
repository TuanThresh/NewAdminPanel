<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import RecentSales from '@/components/examples/RecentSales.vue';
import Overview from '@/components/examples/Overview.vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import { onMounted,ref, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { useCustomerStore } from '@/stores/customerStore';
import { useOrderStore } from '@/stores/orderStore';
import { useDomainProductStore } from '@/stores/domainProductStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCustomerTypeStore } from '@/stores/customerTypeStore';
import { useDiscountStore } from '@/stores/discountStore';
const employeeStore = useEmployeeStore();
const customerStore = useCustomerStore();
const customerTypeStore = useCustomerTypeStore();
const orderStore = useOrderStore();
const domainProductStore = useDomainProductStore();
const discountStore = useDiscountStore();


const date = ref<[Date,Date]>([new Date(),new Date()]);

const kichHoatEmployees = ref(0);
const khoaEmployees = ref(0);
const choXacThucEmployees = ref(0);

const normalCustomers = ref(0);
const loyalCustomers = ref(0);
const newCustomers = ref(0);

const pendingOrder = ref(0);
const paidOrder = ref(0);
const cancelledOrder = ref(0);
const totalRevenue = ref(0);

const normalCustomerDiscounts = ref(0);
const loyalCustomerDiscounts = ref(0);
const newCustomerDiscounts = ref(0);
const publicDiscounts = ref(0);



const vietnamDomainProducts = ref(0);
const internationalDomainProducts = ref(0);


const onDateChange = async () => {
  const dateOnly = {
    from : date.value[0].toISOString().split('T')[0],
    to: date.value[1].toISOString().split('T')[0]
  }
  // totalEmployee.value = await employeeStore.getStatistic(dateOnly);
  kichHoatEmployees.value =  await employeeStore.getStatistic(dateOnly,"0"),
  khoaEmployees.value =  await employeeStore.getStatistic(dateOnly,"1"),
  choXacThucEmployees.value = await employeeStore.getStatistic(dateOnly,"2")
  // totalRevenueOrder.value = await orderStore.getStatistic(dateOnly);
  // totalDomainProduct.value = await domainProductStore.getStatistic(dateOnly);

  normalCustomers.value =  await customerStore.getStatistic(dateOnly,"1"),
  loyalCustomers.value =  await customerStore.getStatistic(dateOnly,"2"),
  newCustomers.value = await customerStore.getStatistic(dateOnly,"3")

  pendingOrder.value = await orderStore.getStatistic(dateOnly,"0");
  paidOrder.value = await orderStore.getStatistic(dateOnly,"1");
  cancelledOrder.value = await orderStore.getStatistic(dateOnly,"2");
  totalRevenue.value = await orderStore.getTotalRevenue(dateOnly);

  normalCustomerDiscounts.value =  await discountStore.getStatistic(dateOnly,"1"),
  loyalCustomerDiscounts.value =  await discountStore.getStatistic(dateOnly,"2"),
  newCustomerDiscounts.value = await discountStore.getStatistic(dateOnly,"3")
  publicDiscounts.value = await discountStore.getStatistic(dateOnly,"0")




  vietnamDomainProducts.value = await domainProductStore.getStatistic(dateOnly,"0");
  internationalDomainProducts.value = await domainProductStore.getStatistic(dateOnly,"1");


}

const employeeStatus = ref("0");

const customerTypeId = ref("1");

const orderStatus = ref("0");

const domainType = ref("0");




const data = ref([
  
]);

onMounted(async() => {
  date.value[0] = new Date(new Date().getFullYear(),new Date().getMonth(),1);
  date.value[1] = new Date();

  await customerTypeStore.getCustomerTypes();

  await onDateChange()

  await setData()

})

const tabState = ref("employee");

const setData = (async () => {
  

  switch (tabState.value) {
    case "employee":
      data.value = await employeeStore.getOverview(employeeStatus.value)
      break;
    case "customer":
      
        data.value = await customerStore.getOverview(customerTypeId.value)
        break;
    case "domainProduct":
        data.value = await domainProductStore.getOverview(domainType.value);
        break;
    case "order":
        data.value = await orderStore.getOverview(orderStatus.value);

        break;
    case "discount":
        data.value = await discountStore.getOverview(customerTypeId.value);

        break;
    default:
      break;
  }
})

const updateTabState = async (value: string) => {
  tabState.value = value,
  await setData();
};

</script>

<template>
  <div>
    <page-header title="Thống kê">
    </page-header>

    <Tabs default-value="employee" class="space-y-4 mb-5" v-on:update:model-value="(value) => updateTabState(value)">
      <div class="flex items-center space-x-6">
        <TabsList>
        <TabsTrigger value="employee">
          Nhân viên
        </TabsTrigger>
        <TabsTrigger value="customer">
          Khách hàng
        </TabsTrigger>
        <TabsTrigger value="domainProduct">
          Miền
        </TabsTrigger>
        <TabsTrigger value="order">
          Đơn hàng
        </TabsTrigger>
        <TabsTrigger value="discount">
          Mã giảm giá
        </TabsTrigger>
      </TabsList>
        <VueDatePicker :enable-time-picker="false" 
          :format="'yyyy-MM-dd'"
          placeholder="Chọn khoảng ngày"
          range
          v-model="date"
          @update:model-value="onDateChange()"
        ></VueDatePicker>
        
        
      </div>
      
      <TabsContent value="employee" class="space-y-4">
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Nhân viên đã kích hoạt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ kichHoatEmployees }} 
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Nhân viên đang chờ xác thực
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ choXacThucEmployees }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Nhân viên bị khóa
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ khoaEmployees }}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </TabsContent>
      <TabsContent value="customer" class="space-y-4">
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Khách hàng thường
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ normalCustomers }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Khách hàng thân thiết
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ loyalCustomers }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Khách hàng mới
              </CardTitle>
          
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ newCustomers }}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="domainProduct" class="space-y-4">
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Miền Việt Nam
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ normalCustomers }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Miền quốc tế
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ loyalCustomers }}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="order" class="space-y-4">
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Đơn hàng đang chờ thanh toán
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ pendingOrder }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Đơn hàng đã trả tiền
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ paidOrder }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Đơn hàng đã hủy
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ cancelledOrder }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ totalRevenue }}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="discount" class="space-y-4">
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Mã giảm giá cho khách hàng thường 
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ normalCustomerDiscounts }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Mã giảm giá cho khách hàng thân thiết

              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ loyalCustomerDiscounts }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Mã giảm giá cho khách hàng mới
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ newCustomerDiscounts }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Mã giảm giá công khai
              </CardTitle>
              
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ publicDiscounts }}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
    <h1 class="text-xl my-5">Thống kê qua các tháng</h1>
    <Select v-model="employeeStatus" @update:model-value="setData()" v-if="tabState == 'employee'">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Kích hoạt</SelectItem>
                      <SelectItem value="1">Khóa</SelectItem>
                      <SelectItem value="2">Chờ xác thực</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
      <Select v-model="customerTypeId" @update:model-value="setData()" v-if="tabState == 'customer' || tabState == 'discount'">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0" v-if="tabState == 'discount'">Công khai</SelectItem>
                      <SelectItem v-for="customerType in customerTypeStore.customerTypes" :key="customerType.id" :value="customerType.id.toString()">{{ customerType.typeName }}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
        <Select v-model="domainType" @update:model-value="setData()" v-if="tabState == 'domainProduct'">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Việt Nam</SelectItem>
                      <SelectItem value="1">Quốc tế</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
        <Select v-model="orderStatus" @update:model-value="setData()" v-if="tabState == 'order'">
                  <SelectTrigger>
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Đang chờ thanh toán</SelectItem>
                      <SelectItem value="1">Đã trả tiền</SelectItem>
                      <SelectItem value="2">Đã hủy</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
        <Card class="mt-5">
            <CardHeader>
              <div class="flex">
                <CardTitle >Overview</CardTitle>
              </div>
              
            </CardHeader>
            <CardContent class="pl-2">
              <Overview :data-prop="data" />
            </CardContent>
          </Card>
  </div>
</template>
