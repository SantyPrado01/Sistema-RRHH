
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

  getOrdenesPorMesAnio(mes: number, anio: number, completado: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/findByMesAnio/${mes}/${anio}/${completado}`);
  }

  getHorasPorMes(mes: number, anio: number, completado: boolean): Observable<any>{
    return this.http.get(`${this.apiUrl}/horas-mes/${mes}/${anio}/${completado}`)
  }

  obtenerEmpresas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/servicios');
  }

  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/empleados'); 
  }
}