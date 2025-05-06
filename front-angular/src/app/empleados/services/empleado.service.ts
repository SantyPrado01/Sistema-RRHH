import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado.models';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  //Produccion
  //private apiUrl = 'http://147.93.15.196:3000/empleados';

  //Desarrollo
  private apiUrl = 'http://localhost:3000/empleados'; 

  constructor(private http: HttpClient) {}

  buscarEmpleados(termino: string): Observable<any[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}/buscar?nombre=${termino}`);
  }
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}`);
  }
  getEmpleadosEliminado(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(`${this.apiUrl}/true`);
  }
  getEmpleadoById(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }
  createEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }
  updateEmpleado(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.patch<Empleado>(`${this.apiUrl}/${id}`, empleado);
  }
  deleteEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
