import { Component } from '@angular/core';
import { FacturaResponse } from '../models/factura.models';
import { FacturaService } from '../services/factura.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { BuscarEmpresaComponent } from '../../Modales/buscar-empresa/buscar-empresa.component';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facturas-edit',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './facturas-edit.component.html',
  styleUrl: './facturas-edit.component.css'
})
export class FacturasEditComponent {
  factura: any = {};
  empresaNombre: string = ''; 
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios = [2023, 2024, 2025];

  constructor(
    private facturaService: FacturaService, 
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  abrirModalEmpresa() {
    const dialogRef = this.dialog.open(BuscarEmpresaComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresaNombre = result.nombre;
        this.factura.servicio = result;
      }
    });
  }

  ngOnInit(): void {
    const facturaId = this.route.snapshot.paramMap.get('id');
    if (facturaId) {
      this.facturaService.findOne(Number(facturaId)).subscribe((response: FacturaResponse) => {
        this.factura = response;
        console.log(this.factura)
        this.empresaNombre = response.servicio?.nombre || '';
      });
    }
  }

  agregarItem(): void {
    this.factura.items.push({ cantidad: 0, descripcion: '', valor: 0 });
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
    console.log(this.factura.id)
    this.facturaService.updateFactura(this.factura.facturaId,this.factura).subscribe(
      (response: FacturaResponse) => {
        this.mostrarAlerta('Operación Exitosa', 'Factura actualizada con éxito.', 'success');
        console.log('Factura actualizada con éxito', response);
        this.router.navigate(['/facturas']); 
      },
      (error) => {
        this.mostrarAlerta('Error Operación', 'Error al actualizar la Factura.', 'error');
        console.error('Error al actualizar la factura', error);
      }
    );
  }

}
