import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServicioService {

  //Produccion
  private apiUrl = 'http://147.93.15.196:3000/categorias';

  //Desarrollo
  //private apiUrl = 'http://localhost:3000/categorias'; 

  constructor(private http: HttpClient) { }

  getCategoriasServicio(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getCategoriaServicio(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nombre}`);
  }

  createCategoriaServicio(categoria: { nombre: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, categoria);
  }

  deleteCategoriaServicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateCategoriaServicio(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }
}