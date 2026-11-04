export interface Products {
    _id?: string;
    product: string; 
    category: string; 
    description: string; 
    price: number; 
    rating: number; 
    numberOfReviews: number;   
    images: string; 
    stock: number; 
}

export interface ApiProducts{
    message: string;
    data: Products[];
}
