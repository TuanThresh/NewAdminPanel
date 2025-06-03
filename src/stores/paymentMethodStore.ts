import type { APIResponse, PaymentMethod } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const usePaymentMethodStore = defineStore('PaymentMethodStore',() => {
    

  const paymentMethods = ref<PaymentMethod[]>([]);

    const appStore = useAppStore();
  


  const getPaymentMethods = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<PaymentMethod[]>(`/payment_method?currentPage=${currentPage}`) as APIResponse<PaymentMethod[]>;

      console.log(response);

      paymentMethods.value = response.data;

      appStore.setLoading(false);


      return response.data;
    } catch (error) {

      appStore.setLoading(false);

      handleError(error);
    }
  }
  
  const addPaymentMethod = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/payment_method",form);

      await getPaymentMethods();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const editPaymentMethod = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/payment_method/${id}`,dataWithoutId)

      await getPaymentMethods();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      appStore.setLoading(false);

            handleError(error);

    }
  }

  const deletePaymentMethod = async (id : string) => {
    try {
      const response = await axios.delete(`/payment_method/${id}`)

      await getPaymentMethods();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      appStore.setLoading(false);

      handleError(error);
    }
  }

  return {getPaymentMethods,addPaymentMethod,editPaymentMethod,deletePaymentMethod,paymentMethods};
})