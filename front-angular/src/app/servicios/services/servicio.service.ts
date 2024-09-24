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

  // Obtener todos los empleados
  getServicios(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}`);
  }

  // Obtener un empleado por su ID
  getServicioById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo empleado
  createServicio(empleado: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empleado);
  }

  // Actualizar un empleado existente
  updateServicio(id: number, empleado: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, empleado);
  }

  // Eliminar un empleado
  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}