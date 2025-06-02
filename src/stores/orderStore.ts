import type { APIResponse, Order } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useOrderStore = defineStore('orderStore',() => {
    

  const orders = ref<Order[]>([]);

  const appStore = useAppStore();
  

  const getOrders = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<Order[]>(`/order?currentPage=${currentPage}`) as APIResponse<Order[]>;

      orders.value = response.data;

      appStore.setLoading(false);


      return response.data;
    } catch (error) {
      appStore.setLoading(false);

      handleError(error);
    }
  }

  const editOrder = async (form : Record<string,string|number|Date>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/order/${id}`,dataWithoutId)

      await getOrders();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      appStore.setLoading(false);
            handleError(error);

    }
  }

  const deleteOrder = async (id : string) => {
    try {
      const response = await axios.delete(`/order/${id}`)

      await getOrders();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      appStore.setLoading(false);

      handleError(error);
    }
  }

  const getTotalRevenue = async(form: Record<string,string>) => {
    try {
      const response = await axios.post("/order/total_revenue",form);

      appStore.setLoading(false);


      return response.data;
    } catch (error) {

      appStore.setLoading(false);

            handleError(error);
;
    }
  }
  const getStatistic = async(form: Record<string,string>,status : string) => {
      try {
        const response = await axios.post(`/order/statistic?orderStatusEnum=${status}`,form);

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
        const response = await axios.get(`/order/overview?orderStatusEnum=${status}`);

        appStore.setLoading(false);

  
        return response.data;
      } catch (error) {

        appStore.setLoading(false);

              handleError(error);
;
      }
    }

  return {getOrders,editOrder,deleteOrder,getStatistic,getTotalRevenue,getOverview,orders};
})