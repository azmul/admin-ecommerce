import { api } from "app/api/apiHelper";
import { Endpoints } from "app/api/apiConst";
import { ApiResponse } from "app/api/models";

export const getItems = async (params?: any): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.BLOG}/admin`;
  
  const resp = await api.get<ApiResponse<any>>(url, {
    params: {
      ...params
    }
  });
  return resp.data;
};

export const getItem = async (id: string): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.BLOG}/${id}`;
  
  const resp = await api.get<ApiResponse<any>>(url)
  return resp.data;
};

export const deleteItem = async (id: string): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.BLOG}/${id}`;
  
  const resp = await api.delete<ApiResponse<any>>(url);
  return resp.data;
};

export const updateItem = async (id: string, params: any): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.BLOG}/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url, {
    ...params
  });
  return resp.data;
};

export const createItem = async (params: any): Promise<ApiResponse<any>> => {
    const url = Endpoints.BLOG;
    
    const resp = await api.post<ApiResponse<any>>(url, {
      ...params
    });
    return resp.data;
};

export const updateCommentItem = async (id: string, params: any): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.BLOG}/comments/${id}`;
  
  const resp = await api.post<ApiResponse<any>>(url, {
    ...params
  });
  return resp.data;
};