import type { APIResponse, Category } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useCategoryStore = defineStore('CategoryStore',() => {
    

  const categories = ref<Category[]>([]);

            const appStore = useAppStore();
  

  const getCategories = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<Category[]>(`/category?currentPage=${currentPage}`) as APIResponse<Category[]>;

      categories.value = response.data;

        appStore.setLoading(false);

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      handleError(error);
    }
  }
  
  const addCategory = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/category",form);

      await getCategories();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);

    }
  }

  const editCategory = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/category/${id}`,dataWithoutId)

      await getCategories();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteCategory = async (id : string) => {
    try {
      const response = await axios.delete(`/category/${id}`)

      await getCategories();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      
            handleError(error);

    }
  }

  return {getCategories,addCategory,editCategory,deleteCategory,categories};
})