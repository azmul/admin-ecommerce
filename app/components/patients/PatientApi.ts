import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";

/** Get doctors */
export const getPatients = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.PATIENT_ADMIN;
  
  const resp = await api.get<ApiResponse<any>>(url, {
    params: {
      ...params
    }
  });
  return resp.data;
};

export const getPatient = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.PATIENT_ADMIN}/${id}`;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};

export const activePatient = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.PATIENT_ADMIN}/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url);
  return resp.data;
};

export const deletePatient = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.PATIENT_ADMIN}/${id}`;
  
  const resp = await api.delete<ApiResponse<any>>(url);
  return resp.data;
};