import {Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Products, ApiProducts } from '../interfaces/products';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
    private http = inject(HttpClient);
    private API_URL = 'http://localhost:3002/products';

    getAll(): Observable<Products[]> {
        return this.http.get<ApiProducts>(this.API_URL).pipe(map(res=>res.data));
    }

    getByCategory(category:string): Observable<Products[]>{
        return this.http.get<ApiProducts>(`${this.API_URL}?category=${category}`).pipe(map(resp =>resp.data));
    }
    create(formData: FormData): Observable<any>{
        return this.http.post(this.API_URL, formData);
    }
    update(id: string, data: FormData): Observable<any>{
        return this.http.put(`${this.API_URL}/${id}`,data);
    }
    delete(id: string): Observable<any>{
        return this.http.delete(`${this.API_URL}/${id}`);
    }
}
