import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/ususario.models';
import { NabvarComponent } from '../../../nabvar/nabvar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-new',
  standalone: true,
  imports: [FormsModule, NabvarComponent, CommonModule],
  templateUrl: './usuario-new.component.html',
  styleUrls: ['./usuario-new.component.css']
})
export class UsuarioNewComponent implements OnInit {

  usuario: Usuario = {
    username: '',
    password: ''
  };

  isModalOpen = false; // Controla la visibilidad del modal

  ngOnInit(): void {
    // Inicialización si es necesario
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createUser() {
    console.log('Usuario creado:', this.usuario);
    this.closeModal(); // Cierra el modal después de guardar
  }

}
