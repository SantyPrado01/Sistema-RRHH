import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilidad } from '../models/disponibilidad.models'; 

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadHorariaService {

  private apiUrl = 'http://localhost:3000/disponibilidad-horaria'; 

  constructor(private http: HttpClient) { }

  findAll(): Observable<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(`${this.apiUrl}`);
  }

  findOne(id: number): Observable<Disponibilidad> {
    return this.http.get<Disponibilidad>(`${this.apiUrl}/${id}`);
  }

  create(disponibilidad: Disponibilidad): Observable<Disponibilidad> {
    return this.http.post<Disponibilidad>(`${this.apiUrl}`, disponibilidad);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(id: number, disponibilidad: Disponibilidad): Observable<Disponibilidad> {
    return this.http.patch<Disponibilidad>(`${this.apiUrl}/${id}`, disponibilidad);
  }
}
