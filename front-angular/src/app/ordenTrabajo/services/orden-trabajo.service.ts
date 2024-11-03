
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {
  private apiUrl = 'http://localhost:3000/ordenTrabajo'; 

  constructor(private http: HttpClient) {}

  crearOrdenTrabajo(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  obtenerEmpresas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/servicios');
  }

  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/empleados'); 
  }
}