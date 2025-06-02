import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/ususario.models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //Produccion

  //private baseUrl = 'http://147.93.15.196:3000/users';
  //private authUrl = 'http://147.93.15.196:3000/auth';
  //private categoriaUrl = 'http://147.93.15.196:3000/categoria-usuario';

  //Desarrollo

  private baseUrl = 'http://localhost:3000/users';
  private authUrl = 'http://localhost:3000/auth';
  private categoriaUrl = 'http://localhost:3000/categoria-usuario';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}`);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.authUrl}/register`, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

  recuperarPassword(id:number): Observable<Usuario>{
    return this.http.patch<Usuario>(`${this.authUrl}/recover-password/${id}`,{});
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  createCategoriaUser(categoria: {nombre: string}): Observable<any>{
    return this.http.post(`${this.categoriaUrl}`, categoria)
  }

  getCategoriasUser(): Observable<any>{
    return this.http.get(`${this.categoriaUrl}`)
  }

  getCategoriaUser(nombre: string): Observable<any>{
    return this.http.get(`${this.categoriaUrl}/${nombre}`)
  }

  updateCategoriaUser(id: number, categoria: any): Observable<any>{
    return this.http.get(`${this.categoriaUrl}/${id}`, categoria)
  }
}