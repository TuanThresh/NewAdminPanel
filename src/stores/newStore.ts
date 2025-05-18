import type { APIResponse, DomainProduct, New } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useNewStore = defineStore('NewStore',() => {
    

  const news = ref<New[]>([]);

  const getNews = async () => {
    try {
      const response = await axios.get<New[]>("/new") as APIResponse<New[]>;

      news.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addNew = async (form : FormData) => {

    console.log(form);
    try {

      const response = await axios.post("/new",form);

      await getNews();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editNew = async (id: string,form : FormData) => {
    try {
      const response = await axios.put(`/new/${id}`,form)

      await getNews();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNew = async (id : string) => {
    try {
      const response = await axios.delete(`/new/${id}`)

      await getNews();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getNews,addNew,editNew,deleteNew,news};
})