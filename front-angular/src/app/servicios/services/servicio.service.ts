import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../models/servicio.models';


@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  //Produccion
  //private apiUrl = 'http://147.93.15.196:3000/servicios';

  //Desarrollo
  private apiUrl = 'http://localhost:3000/servicios'; 

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}`);
  }

  getServiciosEliminado(): Observable<Empresa[]>{
    return this.http.get<Empresa[]>(`${this.apiUrl}/true`);
  }

  getServicio(nombre:string): Observable<Empresa[]>{
    return this.http.get<Empresa[]>(`${this.apiUrl}/${nombre}}`);
  }

  getServicioById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  createServicio(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }

  updateServicio(id: number, empresa: Empresa): Observable<Empresa> {
    return this.http.patch<Empresa>(`${this.apiUrl}/${id}`, empresa);
  }

  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}