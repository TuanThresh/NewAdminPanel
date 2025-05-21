import type { APIResponse, DomainProduct } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useDomainProductStore = defineStore('domainProductStore',() => {
    

  const domainProducts = ref<DomainProduct[]>([]);

    const appStore = useAppStore();
  

  const getDomainProducts = async () => {
    try {
      const response = await axios.get<DomainProduct[]>("/domain_product") as APIResponse<DomainProduct[]>;

      domainProducts.value = response.data;

        appStore.setLoading(false);


      return response.data;
    } catch (error) {
        appStore.setLoading(false);
      
      handleError(error);
    }
  }
  
  const addDomainProduct = async (form : Record<string,string|number>) => {
    try {

      const response = await axios.post("/domain_product",form);

      await getDomainProducts();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const editDomainProduct = async (form : Record<string,string|number>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/domain_product/${id}`,dataWithoutId)

      await getDomainProducts();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
        appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteDomainProduct = async (id : string) => {
    try {
      const response = await axios.delete(`/domain_product/${id}`)

      await getDomainProducts();

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
      const response = await axios.post(`/domain_product/statistic?domainTypeEnum=${status}`,form);

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
      const response = await axios.get(`/domain_product/overview?domainTypeEnum=${status}`);

        appStore.setLoading(false);


      return response.data;
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);
;
    }
  }

  return {getDomainProducts,addDomainProduct,editDomainProduct,deleteDomainProduct,getStatistic,getOverview,domainProducts};
})