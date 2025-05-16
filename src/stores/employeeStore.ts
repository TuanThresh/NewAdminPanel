import type { APIResponse, Employee } from "@/interfaces";
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { handleError, handleSucess } from "@/lib/utils";
import { useRouter } from "vue-router";
export const useEmployeeStore = defineStore('employeeStore',() => {
  
  const userJson = localStorage.getItem("currentEmployeeContent");

  const employee = ref<Employee|null>(userJson ? (JSON.parse(userJson) as Employee) : null);

  const employees = ref<Employee[]>([]);

  const router = useRouter();

  const loginEmployee = async (form: Record<string, string>) => {
      
    try {
      const response = await axios.post<Employee>('/employee/login', form) as APIResponse<Employee>;
  
      employee.value = response.data;
        
      localStorage.setItem("currentEmployeeContent", JSON.stringify(response.data));

      router.replace({name : "home"});
        
      return response.data;

    } catch (error) {

      console.log(error);

      router.replace({name : "login"});
      
      handleError(error);
    }
    
  };

  const logoutEmployee = () => {
    try {
      employee.value = null;

      localStorage.removeItem("currentEmployeeContent");

      router.replace({name : "login"});

    } catch (error) {
      handleError(error);
    }
  }

  const getEmployees = async () => {
    try {
      const response = await axios.get<Employee[]>("/employee") as APIResponse<Employee[]>;

      employees.value = response.data;

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  const addEmployee = async (form : Record<string,string>) => {
    try {

      const response = await axios.post("/employee",form);

      await getEmployees();

      handleSucess(response.status.toString(),response.data)

      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const editEmployee = async (form : Record<string,string>) => {
    const {id,...dataWithoutId} = form;
    try {
      const response = await axios.put(`/employee/${id}`,dataWithoutId)

      await getEmployees();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  const deleteEmployee = async (id : string) => {
    try {
      const response = await axios.delete(`/employee/${id}`)

      await getEmployees();

      handleSucess(response.status.toString(),response.data)

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  return {loginEmployee,logoutEmployee,getEmployees,addEmployee,editEmployee,deleteEmployee,employee,employees};
})