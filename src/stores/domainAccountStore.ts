import type { APIResponse, DomainAccount } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";

export const useDomainAccountStore = defineStore('domainAccountStore',() => {
    

  const domainAccounts = ref<DomainAccount[]>([]);

  const getDomainAccounts = async () => {
    try {
      const response = await axios.get<DomainAccount[]>("/domain_account") as APIResponse<DomainAccount[]>;

      domainAccounts.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addDomainAccount = async (form : Record<string,string|number>) => {
    try {

      const response = await axios.post("/domain_account",form);

      await getDomainAccounts();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editDomainAccount = async (form : Record<string,string|number>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/domain_account/${id}`,dataWithoutId)

      await getDomainAccounts();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteDomainAccount = async (id : string) => {
    try {
      const response = await axios.delete(`/domain_account/${id}`)

      await getDomainAccounts();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {getDomainAccounts,addDomainAccount,editDomainAccount,deleteDomainAccount,domainAccounts};
})