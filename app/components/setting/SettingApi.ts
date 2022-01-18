import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";

export const getItem = async (): Promise<ApiResponse<any>> => {
  const url = Endpoints.SETTING;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};

export const updateItem = async (params: any): Promise<ApiResponse<any>> => {
    const url = Endpoints.SETTING
    
    const resp = await api.post<ApiResponse<any>>(url, {
      ...params
    });
    return resp.data;
  };