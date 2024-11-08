import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioAsignado } from '../models/horariosAsignados.models';

@Injectable({
    providedIn: 'root'
})
export class HorariosAsignadosService {
    private apiUrl = 'http://localhost:3000/horariosasignados'; // Cambia la URL según tu API

    constructor(private http: HttpClient) {}

    getHorariosAsignados(): Observable<HorarioAsignado[]> {
        const today = new Date();
        const params = {
            comprobado: 'false',
            fechaAntes: today.toISOString().split('T')[0] // Formato YYYY-MM-DD
        };
        return this.http.get<HorarioAsignado[]>(`${this.apiUrl}`, { params });
    }

    updateHorario(horario: HorarioAsignado): Observable<HorarioAsignado> {
        return this.http.patch<HorarioAsignado>(`${this.apiUrl}/${horario.horarioAsignadoId}`, horario);
      }

}
