
import { api } from "app/api/apiHelper";
import { Endpoints } from "app/api/apiConst";
import { ApiResponse } from "app/api/models";

export const getReviewByProductId = async (id: number): Promise<ApiResponse<any>> => {
    const url = `${Endpoints.REVIEW}/product/${id}`;
    
    const resp = await api.get<ApiResponse<any>>(url);
    return resp.data;
  };

  export const updateReviewItem = async (id: string, params: any): Promise<ApiResponse<any>> => {
    const url = `${Endpoints.REVIEW}/${id}`;
    
    const resp = await api.patch<ApiResponse<any>>(url, {
      ...params
    });
    return resp.data;
  };