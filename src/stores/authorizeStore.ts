import type { APIResponse, Authorize} from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useAuthorizeStore = defineStore('authorizeStore',() => {
    
  const authorizes = ref<Authorize[]>([]);


  const getAuthorizes = async () => {
    try {
      const response = await axios.get<Authorize[]>("/authorize") as APIResponse<Authorize[]>;

      authorizes.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const authorize = async (form : Record<string,string>) => {
    try {

      const response = await axios.post(`/employee/authorize`,form);

      await getAuthorizes();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }


  const removeAuthorize = async (form : Record<string,string>) => {
    console.log(form);
    try {
      const response = await axios.delete(`/employee/remove_authorize`,{data: form,})

      await getAuthorizes();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  return {getAuthorizes,authorize,removeAuthorize,authorizes};
})