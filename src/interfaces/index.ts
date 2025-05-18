import DomainAccount from "@/views/dashboard/examples/account/DomainAccount.vue";

export interface Employee{
    id : string,
    email : string,
    status : string,
    name : string,
    phoneNumber: string,
    address: string,
    hasRoles : string[]
}
export interface APIResponse<T>{
    config : object,
    headers : object,
    status : number,
    statusText : string
    data: T
}

export interface StatusType {
    tag: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "danger" | null | undefined;
    value: string,
    title: string;
}

export interface ChangeMessage{
    message : string
}

export interface Role{
    id : string,
    roleName : string,
    givenEmployees : Employee[]
}
export interface Authorize{
    id: string,
    employee : Employee,
    role : Role
}
export interface Customer{
    id: string,
    name: string,
    email: string,
    address: string,
    phoneNumber: string,
    hasType: string,

}
export interface CustomerType{
    id: string,
    typeName: string,
    description: string
}

export interface DomainProduct{
    id: string,
    domainName: string,
    priceStart: number,
    domainType: string,
    price: number
}

export interface DomainAccount{
    id: string,
    registerPanel: string,
    username: string
}

export interface Discount{
    id: string,
    percentage: number,
    customerType: CustomerType,
    discountCode: string,
    description: string,
    expiredAt: Date,
}

export interface PaymentMethod{
    id: string,
    paymentMethodName: string,
}

export interface Order{
    id: string,
    domainProduct : DomainProduct,
    customer: Customer,
    paymentMethod: PaymentMethod,
    durationByMonth: number,
    domainFirstPart: string,
    totalPrice: number,
    status: string,
}
export interface Category{
    id: string,
    name: string,
    description: string,
}
export interface New{
    id: string,
    category: string,
    title: string,
    content: string,
    imageUrl: string,
}