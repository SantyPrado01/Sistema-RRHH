import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacturaResponse } from '../models/factura.models';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = 'http://localhost:3000/facturas'; 

  constructor(private http: HttpClient) { }

  crearFactura(factura: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, factura);
  }

  findAll(): Observable <any>{
    return this.http.get<FacturaResponse>(this.apiUrl)
  }

  updateFactura(id: number, factura: FacturaResponse): Observable <FacturaResponse>{
    return this.http.patch<FacturaResponse>(`${this.apiUrl}/${id}`, factura)
  }

  deleteFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
