import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from "../../../nabvar/nabvar.component";
import { Usuario } from '../../models/ususario.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-new',
  standalone: true,
  imports: [NabvarComponent, FormsModule],
  templateUrl: './usuario-new.component.html',
  styleUrl: './usuario-new.component.css'
})
export class UsuarioNewComponent implements OnInit {

  usuario: Usuario = {
    username: '',
    password:''
  }

  ngOnInit(): void {
    
  }

  createUser(){
    console.log(this.usuario)
  }

  updateUser(){}


}
