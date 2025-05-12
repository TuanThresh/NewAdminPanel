import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import DashboardLayoutVue from '@/layouts/dashboard.vue';

interface IRouteMeta {
  title: string
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard/home',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'Login',
      } as RouteMeta & IRouteMeta,
    },
    {
      path: '/dashboard',
      component: DashboardLayoutVue,
      redirect: '/dashboard/home',
      meta: {
        title: 'Dashboard',
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/dashboard/examples/Home.vue'),
          meta: {
            title: 'Home',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'employee',
          name: 'employee',
          component: () => import('@/views/dashboard/examples/system/Employee.vue'),
          meta: {
            title: 'Employee',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/dashboard/examples/system/Role.vue'),
          meta: {
            title: 'Role',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'authorize',
          name: 'authorize',
          component: () => import('@/views/dashboard/examples/system/Authorize.vue'),
          meta: {
            title: 'Authorize',
          } as RouteMeta & IRouteMeta
        },

        {
          path: 'discount',
          name: 'discount',
          component: () => import('@/views/dashboard/examples/management/Discount.vue'),
          meta: {
            title: 'Discount',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'vps',
          name: 'vps',
          component: () => import('@/views/dashboard/examples/service/Vps.vue'),
          meta: {
            title: 'VPS',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'domain',
          name: 'domain',
          component: () => import('@/views/dashboard/examples/service/DomainProduct.vue'),
          meta: {
            title: 'Domain',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hosting',
          name: 'hosting',
          component: () => import('@/views/dashboard/examples/service/Hosting.vue'),
          meta: {
            title: 'Hosting',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'account-vps',
          name: 'accountVps',
          component: () => import('@/views/dashboard/examples/account/VpsAccount.vue'),
          meta: {
            title: 'AccountVps',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'domain-account',
          name: 'Tài khoản miền',
          component: () => import('@/views/dashboard/examples/account/DomainAccount.vue'),
          meta: {
            title: 'Tài khoản miền',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'account-hosting',
          name: 'accountHosting',
          component: () => import('@/views/dashboard/examples/account/HostingAccount.vue'),
          meta: {
            title: 'AccountHosting',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'customer',
          name: 'Customer',
          component: () => import('@/views/dashboard/examples/management/Customer.vue'),
          meta: {
            title: 'Customer',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'customer-type',
          name: 'Customer Type',
          component: () => import('@/views/dashboard/examples/category/CustomerType.vue'),
          meta: {
            title: 'Customer Type',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'invoice',
          name: 'invoice',
          component: () => import('@/views/dashboard/examples/management/Invoice.vue'),
          meta: {
            title: 'Invoice',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('@/views/dashboard/examples/management/Order.vue'),
          meta: {
            title: 'Order',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'contract',
          name: 'contract',
          component: () => import('@/views/dashboard/examples/management/Contract.vue'),
          meta: {
            title: 'Contract',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'settings',
          name: 'settings_index',
          component: () => import('@/views/dashboard/examples/settings/Index.vue'),
          meta: {
            title: 'Settings',
          } as RouteMeta & IRouteMeta
        },
      ],
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: () => import('@/views/404.vue'),
      meta: {
        title: 'Page Not Found',
      } as RouteMeta & IRouteMeta,
    },
  ]
});

router.beforeEach((to,from) => {
  document.title = to.meta.title as string;
})

export default router
