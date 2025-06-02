<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import type { Order, StatusType } from "@/interfaces/index";
import { useOrderStore } from '@/stores/orderStore';
import '@vuepic/vue-datepicker/dist/main.css'
import { useAppStore } from '@/stores/app';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useRoute } from 'vue-router';

const store = useOrderStore();

const appStore = useAppStore();

onMounted(async () => {
  await store.getOrders(currentPage.value.toString());

  appStore.setPagination();

})

const currentPage = ref(1);

watch(currentPage,async (value) => {

  currentPage.value = (useRoute().query.currentPage?.toString() ?? 1) as number ;

  await store.getOrders(value.toString());

  appStore.setPagination();

})

const tagVariants: StatusType[] = [
  { tag: 'secondary', title: 'Chờ thanh toán', value: 'Pending' },
  { tag: 'success', title: 'Đã thanh toán', value: 'Paid' },
  { tag: 'danger', title: 'Đã hủy bỏ', value: 'Cancelled' },
];

const columns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'Mã đơn hàng', enableSorting: false },
  { accessorKey: 'domainProduct', header: 'Đuôi tên miền', enableSorting: false, cell: ({row}) => row.original.domainProduct.domainName },
  { accessorKey: 'customer', header: 'Tên khách hàng', enableSorting: false,cell: ({row}) => row.original.customer.name },
  { accessorKey: 'paymentMethod', header: 'Phương thức thanh toán', enableSorting: false,cell: ({row}) => row.original.paymentMethod.paymentMethodName },
  { accessorKey: 'durationByMonth', header: 'Thời gian thuê', enableSorting: false },
  { accessorKey: 'domainFirstPart', header: 'Tên miền chính' },
  { accessorKey: 'status', header: 'Trạng thái',cell: ({row}) => {
    const statusTag = tagVariants.find(tag => tag.value === row.original.status);
    return h(Badge, { variant: statusTag?.tag }, () => statusTag?.title);
  } },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, [
        h(
          Button,
          { variant: 'default', class: 'mr-2', onClick: async() => await store.editOrder({id: row.original.id,status: "Paid"}) ,disabled : row.original.status != "Pending"},
          () => 'Chấp nhận'
        ),
        h(
          Button,
          { variant: 'destructive',class: 'mr-2', onClick: async () => await store.editOrder({id: row.original.id,status: "Cancelled"}),disabled : row.original.status != "Pending" },
          () => 'Hủy bỏ'
        ),
        h(
          Button,
          { variant: 'secondary', onClick: async () => await store.deleteOrder(row.original.id.toString()) },
          () => 'Xóa'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý đơn hàng"></page-header>
    <DataTable :columns="columns" :data="store.orders"></DataTable>
    <Pagination :items-per-page="appStore.paginationGetter?.pageSize || 10" :total="appStore.paginationGetter?.totalCount" :default-page="1" class="mt-5" v-if="appStore.paginationGetter">
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious @click="currentPage --" />
        <template v-for="(item, index) in items" :key="index">
          
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="(index + 1) == currentPage"
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
