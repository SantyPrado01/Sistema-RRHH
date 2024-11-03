import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { ServicioService } from '../../servicios/services/servicio.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { Empresa } from '../../servicios/models/servicio.models';

@Component({
  selector: 'app-buscar-empresa',
  standalone: true,
  imports: [MatDialogModule, CommonModule, FormsModule, MatFormFieldModule, MatLabel],
  templateUrl: './buscar-empresa.component.html',
  styleUrl: './buscar-empresa.component.css'
})
export class BuscarEmpresaComponent implements OnInit {
  isLoading = true
  searchQuery: string = '';
  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<BuscarEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empresaService: ServicioService
  ) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.getServicios().subscribe({
      next: (data: Empresa[]) => {
        this.empresas = data;
        this.empresasFiltradas = data; // Inicialmente mostramos todos los libros
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar las empresas', err);
        this.isLoading = false;
      }
    });
  }

  buscarEmpresas(): void {
    this.empresasFiltradas = this.empresas.filter(empresas => 
      empresas.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  seleccionarEmpresa(empresa: any): void {
    this.dialogRef.close(empresa);
  }

}
