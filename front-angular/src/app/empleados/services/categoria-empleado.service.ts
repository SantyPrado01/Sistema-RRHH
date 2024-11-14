import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaEmpleadoService {

  private apiUrl = 'http://localhost:3000/categoria-empleado';

  constructor(private http: HttpClient) { }

  getCategoriasEmpleados(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  getCategoriaEmpleado(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nombre}`);
  }
  createCategoriaEmpleado(categoria: { nombre: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, categoria);
  }
  deleteCategoriaEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateCategoriaEmpleado(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }
}
