import type { APIResponse, CustomerType } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useCustomerTypeStore = defineStore('customerTypeStore',() => {
    

  const customerTypes = ref<CustomerType[]>([]);

  const getCustomerTypes = async () => {
    try {
      const response = await axios.get<CustomerType[]>("/customer_type") as APIResponse<CustomerType[]>;

      customerTypes.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addCustomerType = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/customer_type",form);

      await getCustomerTypes();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editCustomerType = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/customer_type/${id}`,dataWithoutId)

      await getCustomerTypes();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCustomerType = async (id : string) => {
    try {
      const response = await axios.delete(`/customer_type/${id}`)

      await getCustomerTypes();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getCustomerTypes,addCustomerType,editCustomerType,deleteCustomerType,customerTypes};
})