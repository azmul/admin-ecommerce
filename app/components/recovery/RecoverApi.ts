import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";
import { PhoneVerifyResponseType } from "../register/RegisterTye";
import { RecoverPasswordRequestType, RecoverPasswordResponseType } from "./RecoverType";

/** Patient Phone verfiy */
export const adminPhoneVerify = async (
    phone: string
  ): Promise<ApiResponse<PhoneVerifyResponseType>> => {
    const url = Endpoints.ADMIN_RECOVER_VERIFY;
    
    const resp = await api.get<ApiResponse<PhoneVerifyResponseType>>(url,  {
      params: {
        phone
      }
    });
    return resp.data;
};

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
