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
      redirect: '/dashboard/profile',
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
      redirect: '/dashboard/profile',
      meta: {
        title: 'Dashboard',
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/dashboard/examples/Home.vue'),
          meta: {
            title: 'Thống kê',
            roles:['Nhân viên phòng tài chính và kế toán'],
            requiresAuth: true,
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/dashboard/examples/Profile.vue'),
          meta: {
            title: 'Hồ sơ',
            requiresAuth: true
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'change-password',
          name: 'Change Password',
          component: () => import('@/views/dashboard/examples/ChangePassword.vue'),
          meta: {
            title: 'Đổi mật khẩu',
            requiresAuth: true
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'employee',
          name: 'employee',
          component: () => import('@/views/dashboard/system/Employee.vue'),
          meta: {
            title: 'Nhân viên',
            requiresAuth: true,roles: ['Quản trị viên']
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/dashboard/system/Role.vue'),
          meta: {
            title: 'Quyền',
            requiresAuth: true,roles: ['Quản trị viên']
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'authorize',
          name: 'authorize',
          component: () => import('@/views/dashboard/system/Authorize.vue'),
          meta: {
            title: 'Phân quyền',
            requiresAuth: true,roles: ['Quản trị viên']
          } as RouteMeta & IRouteMeta
        },

        {
          path: 'discount',
          name: 'discount',
          component: () => import('@/views/dashboard/management/Discount.vue'),
          meta: {
            title: 'Mã giảm giá',
            requiresAuth: true,roles: ['Nhân viên phòng kinh doanh và tiếp thị']
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'domain',
          name: 'domain',
          component: () => import('@/views/dashboard/service/DomainProduct.vue'),
          meta: {
            title: 'Tên miền',
            requiresAuth: true,roles: ['Nhân viên phòng kỹ thuật hỗ trợ khách hàng']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'domain-account',
          name: 'Domain Account',
          component: () => import('@/views/dashboard/account/DomainAccount.vue'),
          meta: {
            title: 'Tài khoản miền',
            requiresAuth: true,roles: ['Nhân viên phòng kỹ thuật hỗ trợ khách hàng']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'customer',
          name: 'Customer',
          component: () => import('@/views/dashboard/management/Customer.vue'),
          meta: {
            title: 'Khách hàng',
            requiresAuth: true,roles: ['Nhân viên phòng kỹ thuật hỗ trợ khách hàng','Nhân viên phòng kinh doanh và tiếp thị']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'customer-type',
          name: 'Customer Type',
          component: () => import('@/views/dashboard/category/CustomerType.vue'),
          meta: {
            title: 'Loại khách hàng',
            requiresAuth: true,roles: ['Nhân viên phòng kỹ thuật hỗ trợ khách hàng']
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('@/views/dashboard/management/Order.vue'),
          meta: {
            title: 'Đơn hàng',
            requiresAuth: true,roles: ['Nhân viên phòng kỹ thuật hỗ trợ khách hàng']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'payment-method',
          name: 'Payment Method',
          component: () => import('@/views/dashboard/management/PaymentMethod.vue'),
          meta: {
            title: 'Phương pháp thanh toán',
            requiresAuth: true,roles: ['Nhân viên phòng kỹ thuật hỗ trợ khách hàng']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'category',
          name: 'Category',
          component: () => import('@/views/dashboard/category/Category.vue'),
          meta: {
            title: 'Danh mục',
            requiresAuth: true,roles: ['Nhân viên phòng kinh doanh và tiếp thị']

          } as RouteMeta & IRouteMeta
        },
        {
          path: 'New',
          name: 'New',
          component: () => import('@/views/dashboard/management/New.vue'),
          meta: {
            title: 'Tin tức',
            requiresAuth: true,roles: ['Nhân viên phòng kinh doanh và tiếp thị']

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
        return next();
      } else {
        console.log("Không có quyền");
        return next(from);
      }
    }

    return next();
  }
  else if(!to.meta.requiresAuth && user) return next(from);
  // document.title = to.meta.title as string || "Default Title";

  next();
})

export default router
