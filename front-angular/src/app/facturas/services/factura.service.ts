import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacturaResponse } from '../models/factura.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private baseUrl = environment.apiUrl + '/facturas';

  constructor(private http: HttpClient) { }

  crearFactura(factura: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, factura);
  }

  findAll(): Observable <any>{
    return this.http.get<FacturaResponse>(this.baseUrl)
  }

  findByServicio(id: number): Observable <any>{
    return this.http.get<FacturaResponse>(`${this.baseUrl}/servicio/${id}`)
  }

  findOne(id:number): Observable <FacturaResponse>{
    return this.http.get<FacturaResponse>(`${this.baseUrl}/${id}`)
  }

  updateFactura(id: number, factura: FacturaResponse): Observable <FacturaResponse>{
    return this.http.patch<FacturaResponse>(`${this.baseUrl}/${id}`, factura)
  }

  deleteFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


}
