import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../models/servicio.models';


@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:3000/servicios'; // URL de tu API en NestJS

  constructor(private http: HttpClient) {}

  // Obtener todos los servicios
  getServicios(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}`);
  }

  // Obtener un servicio por su ID
  getServicioById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo servicio
  createServicio(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }

  // Actualizar un servicio existente
  updateServicio(id: number, empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, empresa);
  }

  // Eliminar un servicio
  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}