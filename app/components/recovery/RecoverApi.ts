import { api } from "app/api/apiHelper";
import { Endpoints } from "app/api/apiConst";
import { ApiResponse } from "app/api/models";
import { RecoverPasswordRequestType, RecoverPasswordResponseType } from "./RecoverType";

/** Patient Password Recover */
export const adminRecoverPassword = async (
  params: RecoverPasswordRequestType
): Promise<ApiResponse<RecoverPasswordResponseType>> => {
  const url = Endpoints.ADMIN_RECOVER_PASSWORD;
  
  const resp = await api.post<ApiResponse<RecoverPasswordResponseType>>(url,  {
    ...params
  });
  return resp.data;
};
