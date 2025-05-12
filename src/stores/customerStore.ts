import type { APIResponse, Customer } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useCustomerStore = defineStore('customerStore',() => {
    

  const customers = ref<Customer[]>([]);

  const getCustomers = async () => {
    try {
      const response = await axios.get<Customer[]>("/customer") as APIResponse<Customer[]>;

      customers.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addCustomer = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/customer",form);

      await getCustomers();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editCustomer = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/customer/${id}`,dataWithoutId)

      await getCustomers();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCustomer = async (id : string) => {
    try {
      const response = await axios.delete(`/customer/${id}`)

      await getCustomers();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getCustomers,addCustomer,editCustomer,deleteCustomer,customers};
})