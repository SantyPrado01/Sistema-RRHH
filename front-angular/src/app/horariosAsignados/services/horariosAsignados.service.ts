import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioAsignado } from '../models/horariosAsignados.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HorariosAsignadosService {

  private apiUrl = environment.apiUrl + '/api/horariosasignados';

  constructor(private http: HttpClient) {}

  updateHorario(horario: HorarioAsignado): Observable<HorarioAsignado> {
    return this.http.patch<HorarioAsignado>(`${this.apiUrl}/${horario.horarioAsignadoId}`, horario);
  }
  
  editHorario(id: number, partialHorario:Partial<HorarioAsignado>): Observable<HorarioAsignado> {
    return this.http.patch<HorarioAsignado>(`${this.apiUrl}/${id}`, partialHorario);
  }

  findAll(): Observable<HorarioAsignado[]>{
    return this.http.get<HorarioAsignado[]>(`${this.apiUrl}/all`);
  }

  buscarHorarios(fechaInicio: string, fechaFin: string ,empleadoId?: number, servicioId?: number): Observable<any> {
    let params = new HttpParams()
    .set('fechaInicio', fechaInicio)
    .set('fechaFin', fechaFin);

    if (empleadoId) {
      params = params.set('empleadoId', empleadoId.toString());
    }

    if (servicioId) {
      params = params.set('servicioId', servicioId.toString());
    }

    return this.http.get<HorarioAsignado[]>(`${this.apiUrl}/buscar?`, { params });
  }

  obtenerResumenPorEmpresa(fechaInicio?: string, fechaFin?: string): Observable<any> {
  let params = new HttpParams();

  if (fechaInicio) {
    params = params.set('fechaInicio', fechaInicio);
  }

  if (fechaFin) {
    params = params.set('fechaFin', fechaFin);
  }

  return this.http.get<any>(`${this.apiUrl}/buscarPorFecha`, { params });
}


  getHorariosAsignados(): Observable<HorarioAsignado[]> {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const params = {
          comprobado: 'false',
          fechaAntes: today.toISOString().split('T')[0] 
      };
      return this.http.get<HorarioAsignado[]>(`${this.apiUrl}`, { params });
  }

  buscarHorariosPorEmpleado(empleadoId: number, mes?: number, anio?: number): Observable<any> {
    let params = new HttpParams()

    if (mes) {
      params = params.set('mes', mes.toString());
    }

    if (anio) {
      params = params.set('anio', anio.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/buscarPorEmpleado/${empleadoId}`, { params });
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
