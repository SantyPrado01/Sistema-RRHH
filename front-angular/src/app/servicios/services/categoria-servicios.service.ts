import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaEmpleadoService {

  private apiUrl = 'http://localhost:3000/categoria-servicio'; // URL del back-end

  constructor(private http: HttpClient) { }

  // Método para obtener todas las categorías de empleados
  getCategoriasServicio(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Método para obtener una categoría por nombre
  getCategoriaServicio(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nombre}`);
  }

  // Método para crear una nueva categoría de empleado
  createCategoriaServicio(categoria: { nombre: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, categoria);
  }

  // Método para eliminar una categoría por ID
  deleteCategoriaServicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar una categoría por ID
  updateCategoriaServicio(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }
}