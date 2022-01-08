import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";

/** saveImage */
export const saveImage = async (
  image_data: string,
  upload_preset: string,
  ): Promise<ApiResponse<any>> => {
    const url = Endpoints.IMAGE;
    
    const resp = await api.post<ApiResponse<any>>(url,  {
      image_data,
      upload_preset
    });
    return resp.data;
};


/** destroyImage */
export const destroyImage = async (
    public_id: string
  ): Promise<ApiResponse<any>> => {
    const url = `${Endpoints.IMAGE}/destroy`;
    
    const resp = await api.post<ApiResponse<any>>(url,  {
        public_id
    });
    return resp.data;
};