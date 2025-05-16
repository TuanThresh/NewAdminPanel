import type { APIResponse, PaymentMethod } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const usePaymentMethodStore = defineStore('PaymentMethodStore',() => {
    

  const paymentMethods = ref<PaymentMethod[]>([]);


  const getPaymentMethods = async () => {
    try {
      const response = await axios.get<PaymentMethod[]>("/payment_method") as APIResponse<PaymentMethod[]>;

      paymentMethods.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addPaymentMethod = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/payment_method",form);

      await getPaymentMethods();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editPaymentMethod = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/payment_method/${id}`,dataWithoutId)

      await getPaymentMethods();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deletePaymentMethod = async (id : string) => {
    try {
      const response = await axios.delete(`/payment_method/${id}`)

      await getPaymentMethods();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getPaymentMethods,addPaymentMethod,editPaymentMethod,deletePaymentMethod,paymentMethods};
})