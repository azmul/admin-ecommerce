
import { api } from "app/api/apiHelper";
import { Endpoints } from "app/api/apiConst";
import { ApiResponse } from "app/api/models";

export const getQuestionByProductId = async (id: number): Promise<ApiResponse<any>> => {
    const url = `${Endpoints.QUESTION}/product/${id}`;
    
    const resp = await api.get<ApiResponse<any>>(url);
    return resp.data;
  };

  export const updateQuestionItem = async (id: string, params: any): Promise<ApiResponse<any>> => {
    const url = `${Endpoints.QUESTION}/${id}`;
    
    const resp = await api.patch<ApiResponse<any>>(url, {
      ...params
    });
    return resp.data;
  };