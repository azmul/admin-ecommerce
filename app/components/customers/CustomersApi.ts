import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";
import {ItemType} from "./CustomersType";

export const getItems = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.CUSTOMERS;
  
  const resp = await api.get<ApiResponse<any>>(url, {
    params: {
      ...params
    }
  });
  return resp.data;
};

export const getItem = async (id: string): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.CUSTOMERS}/admin/${id}`;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};

export const deleteItem = async (id: string): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.CUSTOMERS}/${id}`;
  
  const resp = await api.delete<ApiResponse<any>>(url);
  return resp.data;
};

export const updateItem = async (id: string, params: any): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.CUSTOMERS}/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url, {
    ...params
  });
  return resp.data;
};