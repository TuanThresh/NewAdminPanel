import type { APIResponse, Employee } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useRouter } from "vue-router";
import { useAppStore } from "./app";
export const useEmployeeStore = defineStore('employeeStore',() => {
  
  const userJson = localStorage.getItem("currentEmployeeContent");

  const employee = ref<Employee|null>(userJson ? (JSON.parse(userJson) as Employee) : null);

  const employees = ref<Employee[]>([]);

  const router = useRouter();

  const appStore = useAppStore();
  
    

  const loginEmployee = async (form: Record<string, string>) => {
      
    try {
      const response = await axios.post<Employee>('/employee/login', form) as APIResponse<Employee>;
  
      employee.value = response.data;
        
      localStorage.setItem("currentEmployeeContent", JSON.stringify(response.data));

      router.replace({name : "profile"});

      appStore.setLoading(false);
        
      return response.data;

    } catch (error) {

            handleError(error);
;

      router.replace({name : "login"});

      appStore.setLoading(false);
      
      handleError(error);
    }
    
  };

  const logoutEmployee = () => {
    try {
      employee.value = null;

      localStorage.removeItem("currentEmployeeContent");

      router.replace({name : "login"});

      appStore.setLoading(false);

    } catch (error) {
      handleError(error);

      appStore.setLoading(false);
    }
  }

  const getEmployees = async () => {
    try {
      const response = await axios.get<Employee[]>("/employee") as APIResponse<Employee[]>;

      employees.value = response.data;

      appStore.setLoading(false);

      return response.data;
    } catch (error) {
      appStore.setLoading(false);

      handleError(error);
    }
  }

  const getEmployeeByName = async (name: string) => {
    try {
      const response = await axios.get<Employee>(`/employee/${name}`) as APIResponse<Employee>;

      appStore.setLoading(false);


      return response.data;
    } catch (error) {

      appStore.setLoading(false);

            handleError(error);

    }
  }
  
  const addEmployee = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/employee",form);

      await getEmployees();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data)      

      return response.data
    } catch (error) {

      appStore.setLoading(false);

            handleError(error);
;
    }
  }

  const editEmployee = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/employee/${id}`,dataWithoutId)

      await getEmployees();

      appStore.setLoading(false);

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {

      appStore.setLoading(false);

            handleError(error);

    }
  }

  const deleteEmployee = async (id : string) => {
    try {
      const response = await axios.delete(`/employee/${id}`)

      await getEmployees();

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data);

      return response.data;
    } catch (error) {
      appStore.setLoading(false);
      handleError(error);
    }
  }

  const changePassword = async (form : Record<string,string>) => {
    try {
      const response = await axios.put("/employee/change_password",form);

      appStore.setLoading(false);


      handleSucess(response.status.toString(),response.data);

      return response.data;
    } catch (error) {

      appStore.setLoading(false);

      handleError(error);
    }
  }

  const getStatistic = async(form: Record<string,string>,status : string) => {
    try {
      const response = await axios.post(`/employee/statistic?employeeStatusEnum=${status}`,form);

      appStore.setLoading(false);


      return response.data;
    } catch (error) {

      appStore.setLoading(false);

      handleError(error);

    }
  }

  const getOverview = async(status : string) => {
    try {
      const response = await axios.get(`/employee/overview?employeeStatusEnum=${status}`);

      appStore.setLoading(false);


      return response.data;
    } catch (error) {

      appStore.setLoading(false);

      handleError(error);
    }
  }

  return {loginEmployee,changePassword,logoutEmployee,getEmployees,addEmployee,editEmployee,deleteEmployee,getEmployeeByName,getStatistic,getOverview,employee,employees};
})