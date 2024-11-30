import { Empresa } from "../../servicios/models/servicio.models";
import { ItemFactura } from "./items.models";

export interface FacturaResponse {
    facturaId: number;
    numero: number;
    fecha: string;
    total: number;
    servicio: Empresa;
    items: ItemFactura[];
  }