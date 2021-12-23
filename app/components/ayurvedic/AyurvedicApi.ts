import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";

/** Get doctors */
export const getAyurvedicDoctors = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.AYURVEDIC_DOCTOR_ADMIN;
  
  const resp = await api.get<ApiResponse<any>>(url, {
    params: {
      ...params
    }
  });
  return resp.data;
};

export const getAyurvedicDoctor = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.AYURVEDIC_DOCTOR_ADMIN}/${id}`;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};


export const activeDoctor = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.AYURVEDIC_DOCTOR_ADMIN}/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url);
  return resp.data;
};

export const deleteDoctor = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.AYURVEDIC_DOCTOR_ADMIN}/${id}`;
  
  const resp = await api.delete<ApiResponse<any>>(url);
  return resp.data;
};
