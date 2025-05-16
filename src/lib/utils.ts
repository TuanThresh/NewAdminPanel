import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { push } from 'notivue'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
type Error = {
  status: string,
  message: string
}
export const handleSucess = (title: string, message : string) => {
  push.success({
    title,
    message
  })
}
export const handleError = (err : any) => {

  if(typeof(err.response.data) == 'string' ){
    push.error({
    title: err.response.status,
    message : err.response.data
    })
  }
  else{
    const error = err.response.data as Error;
  push.error({
    title: err.response.status,
    message : error.message
  })
  }
  
  
}