import { Empresa } from "../../servicios/models/servicio.models";

export interface FacturaResponse {
    facturaId: number;
    numero: number;
    fecha: string;
    total: number;
    servicio: Empresa;
  }