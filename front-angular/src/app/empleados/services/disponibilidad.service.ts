import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilidad } from '../models/disponibilidad.models'; 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadHorariaService {

  private baseUrl = environment.apiUrl + '/api/disponibilidad-horaria';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(`${this.baseUrl}`);
  }

  findOne(id: number): Observable<Disponibilidad> {
    return this.http.get<Disponibilidad>(`${this.baseUrl}/${id}`);
  }

  create(disponibilidad: Disponibilidad): Observable<Disponibilidad> {
    return this.http.post<Disponibilidad>(`${this.baseUrl}`, disponibilidad);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, disponibilidad: Disponibilidad): Observable<Disponibilidad> {
    return this.http.patch<Disponibilidad>(`${this.baseUrl}/${id}`, disponibilidad);
  }
}
