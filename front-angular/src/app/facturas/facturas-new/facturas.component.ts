import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BuscarEmpresaComponent } from '../../Modales/buscar-empresa/buscar-empresa.component';
import { FacturaService } from '../services/factura.service';
import { FacturaResponse } from '../models/factura.models';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.css'
})

export class CrearFacturaComponent implements OnInit {

  factura = {
    numero: null,
    fecha: '',
    servicio: null,
    items: [
      { cantidad: 0, descripcion: '', valor: 0 },
      { cantidad: 0, descripcion: '', valor: 0 },
    ],
    total: 0
  };
  empresaNombre: string = ''; 
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios = [2023, 2024, 2025]; 

  constructor(private facturaService: FacturaService, private dialog: MatDialog) { }

  abrirModalEmpresa() {
    const dialogRef = this.dialog.open(BuscarEmpresaComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresaNombre = result.nombre;
        this.factura.servicio = result
      }
    });
  }

  ngOnInit(): void {

  }

  agregarItem(): void {
    this.factura.items.push({ cantidad: 1, descripcion: '', valor: 0 });
  }

  calcularTotal(): void {
    let total = 0;
    for (const item of this.factura.items) {
      total += item.cantidad * item.valor;
    }
    this.factura.total = total; 
  }

  eliminarItem(index: number): void {
    this.factura.items.splice(index, 1);
  }

  onSubmit(): void {
    this.facturaService.crearFactura(this.factura).subscribe(
      (response: FacturaResponse) => {
        console.log('Factura creada con éxito', response);
      },
      (error) => {
        console.error('Error al crear la factura', error);
      }
    );
  }
}
