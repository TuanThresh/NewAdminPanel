import type { APIResponse, CustomerType } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useCustomerTypeStore = defineStore('customerTypeStore',() => {
    

  const customerTypes = ref<CustomerType[]>([]);

          const appStore = useAppStore();
  

  const getCustomerTypes = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<CustomerType[]>(`/customer_type?currentPage=${currentPage}`) as APIResponse<CustomerType[]>;

        appStore.setLoading(false);

      

      customerTypes.value = response.data;

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      handleError(error);
    }
  }
  
  const addCustomerType = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/customer_type",form);

      await getCustomerTypes();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const editCustomerType = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/customer_type/${id}`,dataWithoutId)

      await getCustomerTypes();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {


        appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteCustomerType = async (id : string) => {
    try {
      const response = await axios.delete(`/customer_type/${id}`)

      await getCustomerTypes();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      handleError(error);
    }
  }

  return {getCustomerTypes,addCustomerType,editCustomerType,deleteCustomerType,customerTypes};
})