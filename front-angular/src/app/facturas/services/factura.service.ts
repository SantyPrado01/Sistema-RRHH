import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacturaResponse } from '../models/factura.models';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  //Produccion
  private apiUrl = 'http://147.93.15.196:3000/facturas';

  //Desarrollo
  //private apiUrl = 'http://localhost:3000/facturas'; 

  constructor(private http: HttpClient) { }

  crearFactura(factura: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, factura);
  }

  findAll(): Observable <any>{
    return this.http.get<FacturaResponse>(this.apiUrl)
  }

  findByServicio(id: number): Observable <any>{
    return this.http.get<FacturaResponse>(`${this.apiUrl}/servicio/${id}`)
  }

  findOne(id:number): Observable <FacturaResponse>{
    return this.http.get<FacturaResponse>(`${this.apiUrl}/${id}`)
  }

  updateFactura(id: number, factura: FacturaResponse): Observable <FacturaResponse>{
    return this.http.patch<FacturaResponse>(`${this.apiUrl}/${id}`, factura)
  }

  deleteFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
