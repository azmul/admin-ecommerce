import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";
import { OrderType } from "./OrderType";

/**  Get Order */
export const getOrder = async (
  id: string
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.HOMEOPATHY_MEDICINE_ADMIN}/${id}`;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};

/** Update Order */
export const updateOrder = async (
  id:  string,
  params: OrderType
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.HOMEOPATHY_MEDICINE}/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url,  {
    ...params
  });
  return resp.data;
};

/** Get order by customer */
export const getHomeopathyMedicineOrder = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.HOMEOPATHY_MEDICINE_ADMIN;
  
  const resp = await api.get<ApiResponse<any>>(url, {
    params: {
      ...params
    }
  });
  return resp.data;
};