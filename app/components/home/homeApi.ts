import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";

export const getItems = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.ADMIN;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};
