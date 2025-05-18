import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import DashboardLayoutVue from '@/layouts/dashboard.vue';
import type { Employee } from '@/interfaces';

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
        title: 'Đăng nhập',
      } as RouteMeta & IRouteMeta,
    },
    {
      path: '/forgot-password',
      name: 'forgot password',
      component: () => import('@/views/ForgotPassword.vue'),
      meta: {
        title: 'Quên mật khẩu',
      } as RouteMeta & IRouteMeta,
    },
    {
      path: '/reset-password',
      name: 'reset password',
      component: () => import('@/views/ResetPassword.vue'),
      meta: {
        title: 'Đổi mật khẩu',
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
            requiresAuth: true
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/dashboard/examples/Profile.vue'),
          meta: {
            title: 'Profile',
            requiresAuth: true
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'change-password',
          name: 'Change Password',
          component: () => import('@/views/dashboard/examples/ChangePassword.vue'),
          meta: {
            title: 'Change Password',
            requiresAuth: true
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'employee',
          name: 'employee',
          component: () => import('@/views/dashboard/examples/system/Employee.vue'),
          meta: {
            title: 'Employee',
            requiresAuth: true,roles: ['Quản trị viên']
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/dashboard/examples/system/Role.vue'),
          meta: {
            title: 'Role',
            requiresAuth: true,roles: ['Quản trị viên']
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'authorize',
          name: 'authorize',
          component: () => import('@/views/dashboard/examples/system/Authorize.vue'),
          meta: {
            title: 'Authorize',
            requiresAuth: true,roles: ['Quản trị viên']
          } as RouteMeta & IRouteMeta
        },

        {
          path: 'discount',
          name: 'discount',
          component: () => import('@/views/dashboard/examples/management/Discount.vue'),
          meta: {
            title: 'Discount',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'domain',
          name: 'domain',
          component: () => import('@/views/dashboard/examples/service/DomainProduct.vue'),
          meta: {
            title: 'Domain',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'domain-account',
          name: 'Tài khoản miền',
          component: () => import('@/views/dashboard/examples/account/DomainAccount.vue'),
          meta: {
            title: 'Tài khoản miền',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'customer',
          name: 'Customer',
          component: () => import('@/views/dashboard/examples/management/Customer.vue'),
          meta: {
            title: 'Customer',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'customer-type',
          name: 'Customer Type',
          component: () => import('@/views/dashboard/examples/category/CustomerType.vue'),
          meta: {
            title: 'Customer Type',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('@/views/dashboard/examples/management/Order.vue'),
          meta: {
            title: 'Order',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'payment-method',
          name: 'Payment Method',
          component: () => import('@/views/dashboard/examples/management/PaymentMethod.vue'),
          meta: {
            title: 'Payment Method',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'category',
          name: 'Category',
          component: () => import('@/views/dashboard/examples/category/Category.vue'),
          meta: {
            title: 'Category',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'New',
          name: 'New',
          component: () => import('@/views/dashboard/examples/management/New.vue'),
          meta: {
            title: 'New',
            requiresAuth: true,roles: ['Quản trị viên','Nhân viên']

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

router.beforeEach((to,from,next) => {
  

  const userJson = localStorage.getItem("currentEmployeeContent");
  const user = userJson ? (JSON.parse(userJson) as Employee) : null;

  if (to.meta.requiresAuth) {
    if (!user) {
      return next({ name: "login" });
    }

    const allowedRoles = to.meta.roles as string[] || [];

    console.log(to.meta);

    if (to.meta.roles) {
      const hasPermission = user.hasRoles?.some(role => allowedRoles.includes(role));
      if (hasPermission) {
        console.log("Có quyền");
        return next();
      } else {
        console.log("Không có quyền");
        return next(from);
      }
    }

    // Nếu không có yêu cầu vai trò cụ thể
    return next();
  }
  else if(!to.meta.requiresAuth && user) return next(from);
  document.title = to.meta.title as string || "Default Title";
  // Nếu không yêu cầu auth, tiếp tục bình thường
  next();
})

export default router
