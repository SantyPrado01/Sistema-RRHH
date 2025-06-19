import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private baseUrl = environment.apiUrl + '/api/empleados';

  constructor(private http: HttpClient) {}

  buscarEmpleados(termino: string): Observable<any[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/buscar?nombre=${termino}`);
  }
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}`);
  }
  getEmpleadosEliminado(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(`${this.baseUrl}/activos`);
  }
  getEmpleadoById(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/${id}`);
  }
  createEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.baseUrl, empleado);
  }
  updateEmpleado(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.patch<Empleado>(`${this.baseUrl}/${id}`, empleado);
  }
  deleteEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getHorariosEmpleado(empleadoId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${empleadoId}/horarios`);
  }
}
