import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class LoginService{
    private baseUrl = 'http://localhost:3000/auth'
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


}