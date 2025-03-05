import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})

export class LoginService{

    //Produccion
    //private baseUrl = 'http://147.93.15.196:3000/auth';

    //Desarrollo
    private baseUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient){}

    getUsuarios():Observable<any>{
        return this.http.get<any>(`${this.baseUrl}`);
    }

    login(data:any): Observable<any>{
        return this.http.post<any>(`${this.baseUrl}/login`, data);
    }

    register(data:any): Observable<any>{
        return this.http.post<any>(`${this.baseUrl}/register`, data);
    }

    changePassword(userId: number, newPassword: string ): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/${userId}/change-password`, { newPassword });
      }
}