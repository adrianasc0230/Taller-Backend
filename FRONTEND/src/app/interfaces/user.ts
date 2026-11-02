export interface User {
    _id?: string 
    name: string
    email: string
    rol: 'user' | 'admin';
    idCard: string
    telefono: string
    password: string
    image: string 
}

export interface ServerResponse {
    result: string;
    message: string;
    data: User | any;
}
