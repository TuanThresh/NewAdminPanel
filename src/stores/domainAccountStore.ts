import type { APIResponse, DomainAccount } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useAppStore } from "./app";

export const useDomainAccountStore = defineStore('domainAccountStore',() => {
    

  const domainAccounts = ref<DomainAccount[]>([]);

      const appStore = useAppStore();
  

  const getDomainAccounts = async (currentPage : string = "1") => {
    try {
      const response = await axios.get<DomainAccount[]>(`/domain_account?currentPage=${currentPage}`) as APIResponse<DomainAccount[]>;

      domainAccounts.value = response.data;

        appStore.setLoading(false);


      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      handleError(error);
    }
  }
  
  const addDomainAccount = async (form : Record<string,string|number>) => {
    try {

      const response = await axios.post("/domain_account",form);

      await getDomainAccounts();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
        appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const editDomainAccount = async (form : Record<string,string|number>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/domain_account/${id}`,dataWithoutId)

      await getDomainAccounts();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
        appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteDomainAccount = async (id : string) => {
    try {
      const response = await axios.delete(`/domain_account/${id}`)

      await getDomainAccounts();

        appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

        appStore.setLoading(false);

      handleError(error);
    }
  }

  return {getDomainAccounts,addDomainAccount,editDomainAccount,deleteDomainAccount,domainAccounts};
})