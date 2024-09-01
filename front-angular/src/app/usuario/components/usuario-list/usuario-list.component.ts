import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/ususario.models';
import { UsuarioNewComponent } from '../usuario-new/usuario-new.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NabvarComponent } from '../../../nabvar/nabvar.component';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [NabvarComponent,UsuarioNewComponent, FormsModule, CommonModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {

  usuarios: Usuario[] = [];
  isLoading = true;
  isModalOpen = false; // Añadido para gestionar el estado del modal

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los usuarios', err);
        this.isLoading = false;
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
