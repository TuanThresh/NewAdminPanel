import type { APIResponse, DomainProduct, New } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useNewStore = defineStore('NewStore',() => {
    

  const appStore = useAppStore();

  const news = ref<New[]>([]);

  const getNews = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<New[]>(`/new?currentPage=${currentPage}`) as APIResponse<New[]>;

      news.value = response.data;

      appStore.setLoading(false);

      return response.data;
    } catch (error) {
      appStore.setLoading(false);

      handleError(error);
    }
  }
  
  const addNew = async (form : FormData) => {

    console.log(form);
    try {

      const response = await axios.post("/new",form);

      await getNews();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {

      appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const editNew = async (id: string,form : FormData) => {
    try {
      const response = await axios.put(`/new/${id}`,form)

      await getNews();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteNew = async (id : string) => {
    try {
      const response = await axios.delete(`/new/${id}`)

      await getNews();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

      appStore.setLoading(false);
      
      handleError(error);
    }
  }

  return {getNews,addNew,editNew,deleteNew,news};
})