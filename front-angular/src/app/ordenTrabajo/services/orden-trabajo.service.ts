
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

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getOrdenesPorMesAnio(mes: number, anio: number, completado: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/findByMesAnio/${mes}/${anio}/${completado}`);
  }

  getHorasPorMes(mes: number, anio: number, completado: boolean): Observable<any>{
    return this.http.get(`${this.apiUrl}/horas-mes/${mes}/${anio}/${completado}`)
  }

  getOrdenesForEmpleado(mes: number, anio: number, completado: boolean, empleadoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/findForEmpleado/${mes}/${anio}/${completado}/${empleadoId}`);
  }

  getOrdenesForServicio(mes: number, anio: number, completado: boolean, servicioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/findForServicio/${mes}/${anio}/${completado}/${servicioId}`);
  }

  obtenerEmpresas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/servicios');
  }

  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/empleados'); 
  }
}