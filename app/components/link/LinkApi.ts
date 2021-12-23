import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";
import {LinkType} from "./LinkType";

/** Iactive  Link */
export const countInactiveLink = async (): Promise<ApiResponse<any>> => {
    const url = Endpoints.LINK_COUNT;
    
    const resp = await api.get<ApiResponse<any>>(url);
    return resp.data;
};

export const createLink = async (params: LinkType): Promise<ApiResponse<any>> => {
    const url = Endpoints.LINK;
    
    const resp = await api.post<ApiResponse<any>>(url, {
      ...params
    });
    return resp.data;
};