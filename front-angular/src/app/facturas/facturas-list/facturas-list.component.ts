import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FacturaService } from '../services/factura.service';
import { error } from 'console';

@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [NavbarComponent, FormsModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.css'
})
export class FacturasListComponent implements OnInit{

  facturas: any[] = [];

  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  anioSeleccionado: number = new Date().getFullYear(); 
  mesSeleccionado: number = new Date().getMonth() + 1; 

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private facturasService: FacturaService  
  ) {}

  ngOnInit(): void {
    this.obtenerFacturas()
  }

  obtenerFacturas(){
    this.facturasService.findAll().subscribe({
      next: (data) =>{
        this.facturas = data
        console.log(data)
      },
      error: (err) =>{
        console.error('Hubo un error al obtener las órdenes de trabajo', err);
      }
    })
  }

}
