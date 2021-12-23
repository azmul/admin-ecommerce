export type AppointmentType = {
    _id: string;
    doctor_id: string;
    schedule_id: string;
    doctor_name: string;
    doctor_fees: number
    doctor_profile_url: string | null;
    patient_id:  string;
    patient_name:  string;
    patient_profile_url:null
    link:  string;
    created_at:  string;
    time_slot:  string;
    patient_type:null
    patient_diseases_description:  string;
    patient_rules_follow:  string | null;
    is_cancel: boolean;
    cancel_reason:string | null;
    cancel_role: number;
    is_done_by_doctor: boolean;
    is_payment_done: boolean
    medicine_shipping_status:string | null;
    patient_suggested_medicine: any;
    createdAt: string;
    updatedAt: string;
    numeric_id: string;
    doctor_numeric_id: string;
    patient_numeric_id: string;
}
export type AppointmentCreateType = {
    _id?: string;
    doctor_id: string;
    doctor_name: string;
    doctor_fees: number;
    patient_id: string;
    patient_name: string;
    link: string;
    created_at: string;
    time_slot: string;
    patient_diseases_description: string;
    patient_type: string
}

export type AppointmentCancelType = {
    is_cancel: boolean;
    cancel_reason: string;
}