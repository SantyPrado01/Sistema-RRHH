import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../models/servicio.models';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServicioService {

   private apiUrl = environment.apiUrl + '/api/servicios';

  constructor(private http: HttpClient) {}

   buscarEmpresas(termino: string): Observable<Empresa[]> {
      return this.http.get<Empresa[]>(`${this.apiUrl}/buscar?nombre=${termino}`);
    }

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