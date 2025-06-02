import type { APIResponse, Role } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useRoleStore = defineStore('roleStore',() => {
    
  const role = ref<Role|null>(null);

  const roles = ref<Role[]>([]);

  const appStore = useAppStore();
  


  const getRoles = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<Role[]>(`/role?currentPage=${currentPage}`) as APIResponse<Role[]>;

      roles.value = response.data;

        appStore.setLoading(false);


      return response.data;
    } catch (error) {
        appStore.setLoading(false);

      handleError(error);
    }
  }
  
  const addRole = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/role",form);

      await getRoles();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
        appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const editRole = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/role/${id}`,dataWithoutId)

      await getRoles();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
        appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteRole = async (id : string) => {
    try {
      const response = await axios.delete(`/role/${id}`)

      await getRoles();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      handleError(error);
    }
  }

  return {getRoles,addRole,editRole,deleteRole,role,roles};
})