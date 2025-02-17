import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioAsignado } from '../models/horariosAsignados.models';

@Injectable({
    providedIn: 'root'
})
export class HorariosAsignadosService {

    //Produccion
    //private apiUrl = 'http://147.93.15.196:3000/horariosasignados';

    //Desarrollo
    private apiUrl = 'http://localhost:3000/horariosasignados'; 

    constructor(private http: HttpClient) {}

    getHorariosAsignados(): Observable<HorarioAsignado[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const params = {
            comprobado: 'false',
            fechaAntes: today.toISOString().split('T')[0] 
        };
        return this.http.get<HorarioAsignado[]>(`${this.apiUrl}`, { params });
    }

    updateHorario(horario: HorarioAsignado): Observable<HorarioAsignado> {
        return this.http.patch<HorarioAsignado>(`${this.apiUrl}/${horario.horarioAsignadoId}`, horario);
      }
    
    editHorario(id: number, partialHorario:Partial<HorarioAsignado>): Observable<HorarioAsignado> {
        return this.http.patch<HorarioAsignado>(`${this.apiUrl}/${id}`, partialHorario);
    }

    findAll(): Observable<HorarioAsignado[]>{
        return this.http.get<HorarioAsignado[]>(`${this.apiUrl}/all`);
    }

}
