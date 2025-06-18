import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaEmpleadoService {

  private baseUrl = environment.apiUrl + '/categorias';

  constructor(private http: HttpClient) { }

  getCategoriasEmpleados(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  getCategoriaEmpleado(nombre: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${nombre}`);
  }
  createCategoriaEmpleado(categoria: { nombre: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, categoria);
  }
  deleteCategoriaEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  updateCategoriaEmpleado(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, categoria);
  }
}
