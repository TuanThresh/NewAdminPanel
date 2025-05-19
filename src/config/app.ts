
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
  roles: string[]
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
        roles: ["Quản trị viên"]
      },
      {
        title: 'Quyền',
        icon: 'UserPlus',
        path: 'role',
        roles: ["Quản trị viên"]
      },
      {
        title: 'Phân Quyền',
        icon: 'UserCog',
        path: 'authorize',
        roles: ["Quản trị viên"]
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
        roles: ["Quản trị viên","Nhân viên"]
      },
      {
        title: 'Miền',
        icon: 'MemoryStick',
        path: 'domain',
        roles: ["Quản trị viên","Nhân viên"]
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
        roles: ["Quản trị viên","Nhân viên"]
      },
      {
        title: 'Loại tin tức',
        icon: 'ReceiptText',
        path: 'category',
        roles: ["Quản trị viên","Nhân viên"]
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
        roles: ["Quản trị viên","Nhân viên"]
      },

      {
        title: 'Đơn hàng',
        icon: 'ReceiptText',
        path: 'order',
        roles: ["Quản trị viên","Nhân viên"]
      },
      {
        title: 'Phương thức thanh toán',
        icon: 'ReceiptText',
        path: 'payment-method',
        roles: ["Quản trị viên","Nhân viên"]
      },
      {
        title: 'Mã giảm giá',
        icon: 'ReceiptText',
        path: 'discount',
        roles: ["Quản trị viên","Nhân viên"]
      },
      {
        title: 'Tin tức',
        icon: 'ReceiptText',
        path: 'new',
        roles: ["Quản trị viên","Nhân viên"]
      },
    ],
  },
};

export const globalSearch = {

};
