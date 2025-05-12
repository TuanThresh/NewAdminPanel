
interface Menu {
  name: string
  hidden?: boolean,
  icon: string
  children: SubMenu[]
}
interface SubMenu {
  title: string,
  icon: string,
  path: string
  description?: string
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
        icon: 'ReceiptText',
        path: 'customer-type',
      },

    ]
  },
  management: {
    name: 'Quản lý',
    icon: 'AppWindow',
    children: [
      {
        title: 'Khách hàng',
        icon: 'BookUser',
        path: 'customer',
      },

      {
        title: 'Đơn hàng',
        icon: 'ReceiptText',
        path: 'order',
      },
      {
        title: 'Hợp đồng',
        icon: 'ReceiptText',
        path: 'contract',
      },
      {
        title: 'Mã giảm giá',
        icon: 'ReceiptText',
        path: 'discount',
      },
    ],
  },
};

export const globalSearch = {

};
