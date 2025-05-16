<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import type { Order, StatusType } from "@/interfaces/index";
import { useOrderStore } from '@/stores/orderStore';
import '@vuepic/vue-datepicker/dist/main.css'


const store = useOrderStore();

onMounted(async () => {
  await store.getOrders();
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
          { variant: 'default', class: 'mr-2', onClick: async() => await store.editOrder({status: "Paid"}) },
          () => 'Chấp nhận'
        ),
        h(
          Button,
          { variant: 'destructive', onClick: async () => await store.editOrder({status: "Cancelled"}) },
          () => 'Hủy bỏ'
        ),
      ]),
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý đơn hàng"></page-header>
    <DataTable :columns="columns" :data="store.orders"></DataTable>
  </div>
</template>
