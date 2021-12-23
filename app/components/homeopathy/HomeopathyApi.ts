import { api } from "../../api/apiHelper";
import { Endpoints } from "../../api/apiConst";
import { ApiResponse } from "../../api/models";
import { AppointmentCancelType } from "./HomeopathyType";

/** Get homeopathy appointment */
export const getHomeopathyAppointment = async (id: string): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.HOMEOPATHY_ADMIN_APPOINTMENT}/${id}`;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};

/** Get appointments by homeopathy doctor */
export const getHomeopathyAppointments = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.HOMEOPATHY_ADMIN_APPOINTMENT;
  
  const resp = await api.get<ApiResponse<any>>(url, {
    params: {
      ...params
    }
  });
  return resp.data;
};

/** Get appointments by homeopathy doctor */
export const getHomeopathyDoctors = async (params?: any): Promise<ApiResponse<any>> => {
  const url = Endpoints.HOMEOPATHY_DOCTOR_ADMIN;
  
  const resp = await api.get<ApiResponse<any>>(url, {
    params: {
      ...params
    }
  });
  return resp.data;
};

/** Get doctor by admin */
export const getHomeopathyDoctor = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.HOMEOPATHY_DOCTOR_ADMIN}/${id}`;
  
  const resp = await api.get<ApiResponse<any>>(url);
  return resp.data;
};


/** Cancel homeopathy appointment */
export const cancelHomeopathyAppointment = async (id: string, params: AppointmentCancelType): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.HOMEOPATHY_APPOINTMENT}/cancel/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url, {
    ...params
  });

  return resp.data;
};

/** Payment homeopathy appointment */
export const paymentHomeopathyAppointment = async (id: string, params: any): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.HOMEOPATHY_APPOINTMENT}/payment/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url, {
    ...params
  });

  return resp.data;
};


export const activeDoctor = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.HOMEOPATHY_DOCTOR_ADMIN}/${id}`;
  
  const resp = await api.patch<ApiResponse<any>>(url);
  return resp.data;
};

export const deleteDoctor = async (
  id: string,
): Promise<ApiResponse<any>> => {
  const url = `${Endpoints.HOMEOPATHY_DOCTOR_ADMIN}/${id}`;
  
  const resp = await api.delete<ApiResponse<any>>(url);
  return resp.data;
};