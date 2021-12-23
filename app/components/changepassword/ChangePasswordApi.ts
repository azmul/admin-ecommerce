import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";
import { ChangePasswordType } from "./ChangePasswordType";

/** Patient Login */
export const changeAdminPassword = async (
    params: ChangePasswordType
  ): Promise<ApiResponse<any>> => {
    const url = Endpoints.ADMIN_PASSWORD_CHANGED;
    
    const resp = await api.patch<ApiResponse<any>>(url,  {
      ...params
    });
    return resp.data;
};
