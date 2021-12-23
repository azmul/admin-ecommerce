export type RecoverPasswordRequestType= {
    phone: string;
    code: string;
    password: string;
}

export type RecoverPasswordResponseType= {
    phone: string;
}