import type { APIResponse, Order } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useOrderStore = defineStore('orderStore',() => {
    

  const orders = ref<Order[]>([]);

  const getOrders = async () => {
    try {
      const response = await axios.get<Order[]>("/order") as APIResponse<Order[]>;

      orders.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  const editOrder = async (form : Record<string,string|number|Date>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/order/${id}`,dataWithoutId)

      await getOrders();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteOrder = async (id : string) => {
    try {
      const response = await axios.delete(`/order/${id}`)

      await getOrders();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getOrders,editOrder,deleteOrder,orders};
})