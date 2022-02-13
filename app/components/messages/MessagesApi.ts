import { api } from "app/api/apiHelper";
import { Endpoints } from "app/api/apiConst";
import { ApiResponse } from "app/api/models";
import {ItemType} from "./MessagesType";

export const getAllItems = async (): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.MESSAGES}/all`;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};

export const getItems = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.MESSAGES;
  
  const resp = await api.get<ApiResponse<any>>(url, {
    params: {
      ...params
    }
  });
  return resp.data;
};

export const getItem = async (id: string): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.MESSAGES}/${id}`;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};

export const deleteItem = async (id: string): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.MESSAGES}/${id}`;
  
  const resp = await api.delete<ApiResponse<any>>(url);
  return resp.data;
};

export const updateItem = async (id: string, params: any): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.MESSAGES}/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url, {
    ...params
  });
  return resp.data;
};

export const createItem = async (params: ItemType): Promise<ApiResponse<any>> => {
    const url = Endpoints.MESSAGES;
    
    const resp = await api.post<ApiResponse<any>>(url, {
      ...params
    });
    return resp.data;
};