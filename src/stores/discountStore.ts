import type { APIResponse, Discount } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useDiscountStore = defineStore('discountStore',() => {
    

  const discounts = ref<Discount[]>([]);

        const appStore = useAppStore();
  

  const getDiscounts = async () => {
    try {
      const response = await axios.get<Discount[]>("/discount") as APIResponse<Discount[]>;

      discounts.value = response.data;

        appStore.setLoading(false);


      return response.data;
    } catch (error) {
        appStore.setLoading(false);

      handleError(error);
    }
  }
  
  const addDiscount = async (form : Record<string,string|number|Date>) => {
    try {

      const response = await axios.post("/discount",form);

      await getDiscounts();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const editDiscount = async (form : Record<string,string|number|Date>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/discount/${id}`,dataWithoutId)

      await getDiscounts();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteDiscount = async (id : string) => {
    try {
      const response = await axios.delete(`/discount/${id}`)
      

      await getDiscounts();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      handleError(error);
    }
  }
  const getStatistic = async(form: Record<string,string>,status : string) => {
    try {
      const response = await axios.post(`/discount/statistic?customerTypeId=${status}`,form);

        appStore.setLoading(false);


      return response.data;
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const getOverview = async(status : string) => {
    try {
      const response = await axios.get(`/discount/overview?customerTypeId=${status}`);

        appStore.setLoading(false);


      return response.data;
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);
;
    }
  }

  return {getDiscounts,addDiscount,editDiscount,deleteDiscount,getStatistic,getOverview,discounts};
})