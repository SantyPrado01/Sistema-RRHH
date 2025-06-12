
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {

  //Produccion
  //private apiUrl = 'http://147.93.15.196:3000/ordenTrabajo';

  //Desarrollo
  private apiUrl = 'http://localhost:3000/ordenTrabajo'; 

  constructor(private http: HttpClient) {}

  crearOrdenTrabajo(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getOrdenById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getOrdenesPorMesAnio(mes: number, anio: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/findByMesAnio/${mes}/${anio}`);
  }

  getHorasPorMes(mes: number, anio: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/horas-mes/${mes}/${anio}`)
  }

  getOrdenesForEmpleado(empleadoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/findForEmpleado/${empleadoId}`);
  }

  getOrdenesForServicio(servicioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/findForServicio/${servicioId}`);
  }

  obtenerEmpresas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/servicios');
  }

  obtenerEmpleados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/empleados'); 
  }

  eliminarOrden(id: number): Observable<any> {
    return this.http.patch<any[]>(`${this.apiUrl}/delete/${id}`,{})
  }

  eliminarOrdenDef(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/deletedef/${id}`,{})
  }
}