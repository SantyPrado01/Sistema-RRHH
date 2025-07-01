import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CategoriaServicioService } from '../services/categoria-servicios.service'; 
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ServicioService } from '../services/servicio.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-empresas-new',
  standalone: true,
  imports: [
    NavbarComponent, 
    FormsModule, 
    CommonModule, 
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './servicios-new.component.html',
  styleUrls: ['./servicios-new.component.css']
})
export class ServiciosNewComponent implements OnInit {
  selectedIndex = 0;
  servicio: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';

  constructor(
    private http: HttpClient, 
    private categoriaEmpresaService: CategoriaServicioService, 
    private empresaService: ServicioService,
    private router: Router, 
    private dialog: MatDialog) {}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  validarTelefono(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.servicio.telefono = input.value;
  }

  validarSoloLetras(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^a-zA-Z ]/g, '');
  }

  ngOnInit() {
    this.categoriaEmpresaService.getCategoriasServicio().subscribe({
      next: (data) => {
        console.log('Categorías obtenidas:', data);
        this.categorias = data; 
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
      }
    });
  }
  
  mostrarSeccion(seccion: string): void {
    this.selectedIndex = seccion === 'datosEmpresa' ? 0 : 1;
  }

  buscarCiudad(event: any) {
    const query = event.target.value;

    if (query.length > 2) {
      //const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}&nombre=${query}&max=10`;
      const url = `https://apis.datos.gob.ar/georef/api/localidades?&nombre=${query}&max=10`;

      this.http.get<any>(url).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
          this.ciudades = response.localidades.map((localidad: any) => {
            return {
              id: localidad.id,
              nombre: localidad.nombre,
            };
          });
        },
        error: (err) => {
          console.error('Error al obtener las ciudades', err);
          this.ciudades = [];
        }
      });
    } else {
      this.ciudades = [];
    }
  }

  seleccionarCiudad(event: any) {
    const selectedCity = event.option.value;
    if (selectedCity.nombre === 'Córdoba') {
      this.servicio.ciudad = 14014010;
      this.ciudadNombre = selectedCity.nombre;
    } else {
      this.servicio.ciudad = selectedCity.id;
      this.ciudadNombre = selectedCity.nombre;
    }
  }

  displayCiudad(ciudad: any): string {
    return ciudad ? ciudad.nombre : '';
  }
  
  guardarEmpresa() {
    this.empresaService.createServicio(this.servicio).subscribe({
      next: (response) => {
        this.mostrarAlerta('Operación Exitosa', 'Empresa guardada con éxito.', 'success');
        this.limpiarFormulario();
        this.router.navigate(['/service']);
      },
      error: (err) => {
        console.error('Error al guardar la empresa:', err);
        this.mostrarAlerta('Error Operación', 'Error al guardar la empresa.', 'error');
      }
    });
  }

  limpiarFormulario() {
    this.servicio = {
      nombre: '',
      CUIT: null,
      direccion: '',
      ciudadID: null,
      telefono: null,
      categoriaID: null,
      descripcion: ''
    };
  }
  
  cancelar() {
    this.router.navigate(['/service']);
  }
}
