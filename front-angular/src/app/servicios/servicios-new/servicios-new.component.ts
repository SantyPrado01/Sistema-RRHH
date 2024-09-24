import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CategoriaServicioService } from '../services/categoria-servicios.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresas-new',
  standalone: true,
  imports: [NabvarComponent, FormsModule, CommonModule],
  templateUrl: './servicios-new.component.html',
  styleUrls: ['./servicios-new.component.css']
})
export class ServiciosNewComponent implements OnInit {

  servicio: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';

  constructor(private http: HttpClient, private categoriaEmpresaService: CategoriaServicioService, private router: Router) {}

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

  buscarCiudad(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;

    if (query.length > 2) {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}&nombre=${query}&max=10`;

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
    const selectedCity = this.ciudades.find(c => c.nombre === event.target.value);
    if (selectedCity) {
      this.servicio.ciudad = selectedCity.id; 
    }
  }
  
  guardarEmpresa() {
    const url = 'http://localhost:3000/servicios'; 
    this.http.post(url, this.servicio).subscribe({
      next: (response) => {
        console.log('Empresa guardada con éxito:', response);
        alert('Empresa guardada con éxito');
        this.limpiarFormulario();
        this.router.navigate(['/empresas']);
      },
      error: (err) => {
        console.error('Error al guardar la empresa:', err);
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
    this.router.navigate(['/empresas']);
  }
}
