import type { APIResponse, Customer } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useCustomerStore = defineStore('customerStore',() => {
    

  const customers = ref<Customer[]>([]);

            const appStore = useAppStore();
  

  const getCustomers = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<Customer[]>(`/customer?currentPage=${currentPage}`) as APIResponse<Customer[]>;

      customers.value = response.data;

        appStore.setLoading(false);


      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      console.log(error)
    }
  }
  
  const addCustomer = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/customer",form);

      await getCustomers();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
        appStore.setLoading(false);

            handleError(error);

    }
  }

  const editCustomer = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/customer/${id}`,dataWithoutId)

        appStore.setLoading(false);


      await getCustomers();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
        appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteCustomer = async (id : string) => {
    try {
      const response = await axios.delete(`/customer/${id}`)

        appStore.setLoading(false);


      await getCustomers();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
        appStore.setLoading(false);

            handleError(error);

    }
  }
  const getStatistic = async(form: Record<string,string>,status : string) => {
    try {
      const response = await axios.post(`/customer/statistic?customerTypeId=${status}`,form);

        appStore.setLoading(false);


      return response.data;
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);

    }
  }

  const getOverview = async(status : string) => {
    try {
      const response = await axios.get(`/customer/overview?customerTypeId=${status}`);

        appStore.setLoading(false);


      return response.data;
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);

    }
  }

  return {getCustomers,addCustomer,editCustomer,deleteCustomer,getStatistic,getOverview,customers};
})