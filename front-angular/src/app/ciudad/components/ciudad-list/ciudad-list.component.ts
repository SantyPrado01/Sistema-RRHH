import { Component, OnInit } from '@angular/core';
import { Ciudad } from '../../models/ciudad';
import { CiudadService } from '../../services/ciudad.service';

@Component({
  selector: 'app-ciudad-list',
  standalone: true,
  imports: [],
  templateUrl: './ciudad-list.component.html',
  styleUrl: './ciudad-list.component.css'
})
export class CiudadListComponent implements OnInit {

  ciudades: Ciudad[] = [];
  isLoading = true;

  constructor (private ciudadService: CiudadService){}

  ngOnInit(): void {
    this.loadCiudades();
  }

  loadCiudades(): void{
    this.ciudadService.getCiudades().subscribe({
      next: (data: Ciudad[]) => {
        this.ciudades = data;
        this.isLoading = false; // Cambia el estado de carga cuando los datos están listos
      },
      error: (err) => {
        console.error('Error al cargar las ciudades', err);
        this.isLoading = false; // Cambia el estado de carga incluso si ocurre un error
      }
    });
  }




}
