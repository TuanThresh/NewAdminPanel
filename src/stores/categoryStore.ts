import type { APIResponse, Category } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useCategoryStore = defineStore('CategoryStore',() => {
    

  const categories = ref<Category[]>([]);

  const getCategories = async () => {
    try {
      const response = await axios.get<Category[]>("/category") as APIResponse<Category[]>;

      categories.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addCategory = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/category",form);

      await getCategories();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editCategory = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/category/${id}`,dataWithoutId)

      await getCategories();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCategory = async (id : string) => {
    try {
      const response = await axios.delete(`/category/${id}`)

      await getCategories();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getCategories,addCategory,editCategory,deleteCategory,categories};
})