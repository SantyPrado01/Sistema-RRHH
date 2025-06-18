import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import jwt_decode from 'jwt-decode';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class LoginService{

    private baseUrl = environment.apiUrl + '/auth';

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