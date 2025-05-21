
interface Menu {
  name: string
  hidden?: boolean,
  icon: string
  children: SubMenu[],
  
}
interface SubMenu {
  title: string,
  icon: string,
  path: string
  description?: string,
}
export const SIDEBAR_EXPAND_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const APP_MENU: Record<string, Menu> = {
  system: {
    name: 'Hệ thống',
    icon: 'Home',
    children: [
      {
        title: 'Nhân viên',
        icon: 'User',
        path: 'employee',
      
      },
      {
        title: 'Quyền',
        icon: 'UserPlus',
        path: 'role',
      
      },
      {
        title: 'Phân Quyền',
        icon: 'UserCog',
        path: 'authorize',
      
      },

    ],
  },
  service: {
    name: 'Dịch vụ',
    icon: 'Package',
    children: [
      {
        title: 'Tài khoản miền',
        icon: 'Computer',
        path: 'domain-account',
      },
      {
        title: 'Miền',
        icon: 'MemoryStick',
        path: 'domain',
      },
    ]
  },

  account: {
    name: 'Danh mục',
    icon: 'UserCog',
    children: [
      {
        title: 'Loại khách hàng',
        icon: 'Airplay',
        path: 'customer-type',
      },
      {
        title: 'Loại tin tức',
        icon: 'BookText',
        path: 'category',
      },

    ]
  },
  management: {
    name: 'Quản lý',
    icon: 'AppWindow',
    children: [
      {
        title: 'Thống kê',
        icon: 'ReceiptText',
        path: 'home',
      },
      {
        title: 'Khách hàng',
        icon: 'BookUser',
        path: 'customer',
      },

      {
        title: 'Đơn hàng',
        icon: 'PackageOpen',
        path: 'order',
      },
      {
        title: 'Phương thức thanh toán',
        icon: 'WalletCards',
        path: 'payment-method',
      },
      {
        title: 'Mã giảm giá',
        icon: 'TicketPercent',
        path: 'discount',
      },
      {
        title: 'Tin tức',
        icon: 'Newspaper',
        path: 'new',
      },
    ],
  },
};

export const globalSearch = {

};
