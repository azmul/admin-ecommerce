
export type MedicineListType = {
    name: string
    power: number;
    quantity: string;
    country: string
}

export type OrderType = {
    medicine_list: MedicineListType[];
    delivery_status: number;
    customer_name: string;
    customer_id: string;
    customer_numeric_id: number;
    customer_address: string;
    customer_phone: string
}