import type { APIResponse, Authorize} from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useAuthorizeStore = defineStore('authorizeStore',() => {
    
  const authorizes = ref<Authorize[]>([]);

              const appStore = useAppStore();
  

  const getAuthorizes = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<Authorize[]>(`/authorize?currentPage=${currentPage}`) as APIResponse<Authorize[]>;

      authorizes.value = response.data;

        appStore.setLoading(false);


      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const authorize = async (form : Record<string,string>) => {
    try {

      const response = await axios.post(`/employee/authorize`,form);

      await getAuthorizes();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      handleError(error);

    }
  }


  const removeAuthorize = async (form : Record<string,string>) => {
    console.log(form);
    try {
      const response = await axios.delete(`/employee/remove_authorize`,{data: form,})

      await getAuthorizes();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getAuthorizes,authorize,removeAuthorize,authorizes};
})