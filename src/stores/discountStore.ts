import type { APIResponse, Discount } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useDiscountStore = defineStore('discountStore',() => {
    

  const discounts = ref<Discount[]>([]);

  const getDiscounts = async () => {
    try {
      const response = await axios.get<Discount[]>("/discount") as APIResponse<Discount[]>;

      discounts.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addDiscount = async (form : Record<string,string|number|Date>) => {
    try {

      const response = await axios.post("/discount",form);

      await getDiscounts();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editDiscount = async (form : Record<string,string|number|Date>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/discount/${id}`,dataWithoutId)

      await getDiscounts();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteDiscount = async (id : string) => {
    try {
      const response = await axios.delete(`/discount/${id}`)

      await getDiscounts();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getDiscounts,addDiscount,editDiscount,deleteDiscount,discounts};
})