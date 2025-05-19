import type { APIResponse, DomainProduct } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useDomainProductStore = defineStore('domainProductStore',() => {
    

  const domainProducts = ref<DomainProduct[]>([]);

  const getDomainProducts = async () => {
    try {
      const response = await axios.get<DomainProduct[]>("/domain_product") as APIResponse<DomainProduct[]>;

      domainProducts.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addDomainProduct = async (form : Record<string,string|number>) => {
    try {

      const response = await axios.post("/domain_product",form);

      await getDomainProducts();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editDomainProduct = async (form : Record<string,string|number>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/domain_product/${id}`,dataWithoutId)

      await getDomainProducts();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteDomainProduct = async (id : string) => {
    try {
      const response = await axios.delete(`/domain_product/${id}`)

      await getDomainProducts();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  const getStatistic = async(form: Record<string,string>) => {
    try {
      const response = await axios.post("/domain_product/statistic",form);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  return {getDomainProducts,addDomainProduct,editDomainProduct,deleteDomainProduct,getStatistic,domainProducts};
})