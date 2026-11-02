import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse } from '../interfaces/user';


export class UserService {
    private httpCliente = inject(HttpClient);
    private apiUrl = 'http://localhost:3002/user';
    regiterUser(formData: FormData): Observable<ServerResponse> {
        return this.httpCliente.post<ServerResponse>(this.apiUrl, formData);
    }
    getUserById(id: string): Observable<ServerResponse> {
        return this.httpCliente.get<ServerResponse>(`${this.apiUrl}/${id}`);
    }
}
