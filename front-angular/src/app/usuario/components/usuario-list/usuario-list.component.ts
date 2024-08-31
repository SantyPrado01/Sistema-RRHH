import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/ususario.models';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuarioListComponent {

  usuarios: Usuario[] = [];
  isLoading = true;

  constructor (private usuarioService: UsuarioService){}

  ngOnInit(): void {
    this.loadCiudades();
  }

  loadCiudades(): void{
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.isLoading = false; // Cambia el estado de carga cuando los datos están listos
      },
      error: (err) => {
        console.error('Error al cargar los usuarios', err);
        this.isLoading = false; // Cambia el estado de carga incluso si ocurre un error
      }
    });
  }


}
