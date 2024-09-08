import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ciudad } from '../../models/ciudad.models';

@Component({
  selector: 'app-ciudad-new',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ciudad-new.component.html',
  styleUrl: './ciudad-new.component.css'
})
export class CiudadNewComponent implements OnInit{

  ciudad: Ciudad ={
    nombreCiudad: '',
    eliminado: false
  }

  isModalOpen = false

  ngOnInit(): void {
    
  }

  openModal() {
    this.isModalOpen = true;
  }

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  createCiudad(){
    
  }

}
