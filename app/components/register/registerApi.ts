import { api } from "app/api/apiHelper";
import { Endpoints } from "app/api/apiConst";
import { ApiResponse } from "app/api/models";
import { RegisterRequestType, RegisterResponseType } from "./RegisterTye";

/** Patient Register */
export const adminRegister = async (
  params: RegisterRequestType
): Promise<ApiResponse<RegisterResponseType>> => {
  const url = Endpoints.ADMIN_REGISTER;
  
  const resp = await api.post<ApiResponse<RegisterResponseType>>(url,  {
    ...params
  });
  return resp.data;
};
