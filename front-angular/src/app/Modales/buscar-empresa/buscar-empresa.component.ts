import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-buscar-empresa',
  standalone: true,
  imports: [MatDialogModule, CommonModule, FormsModule, MatFormFieldModule],
  templateUrl: './buscar-empresa.component.html',
  styleUrl: './buscar-empresa.component.css'
})
export class BuscarEmpresaComponent {
  filtroBusqueda: string = '';
  empresas: any[] = []; // Aquí debes cargar tus empresas

  constructor(
    public dialogRef: MatDialogRef<BuscarEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.empresas = data.empresas; // Recibir empresas desde el componente padre
  }

  seleccionarEmpresa(empresa: any) {
    this.dialogRef.close(empresa); // Devuelve la empresa seleccionada
  }

}
