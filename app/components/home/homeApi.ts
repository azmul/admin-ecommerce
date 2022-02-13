import { api } from "app/api/apiHelper";
import { Endpoints } from "app/api/apiConst";
import { ApiResponse } from "app/api/models";

export const getItems = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.ADMIN;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};
