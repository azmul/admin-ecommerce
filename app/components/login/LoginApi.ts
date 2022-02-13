import { api } from "app/api/apiHelper";
import { Endpoints } from "app/api/apiConst";
import { ApiResponse } from "app/api/models";
import { LoginRequestType } from "./LoginType";

/** Patient Login */
export const adminLogin = async (
    params: LoginRequestType
  ): Promise<ApiResponse<any>> => {
    const url = Endpoints.ADMIN_LOGIN;
    
    const resp = await api.post<ApiResponse<any>>(url,  {
      ...params
    });
    return resp.data;
};
