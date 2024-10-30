import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuscarEmpresaComponent } from '../buscar-empresa/buscar-empresa.component';

@Component({
  selector: 'app-buscar-empleado',
  standalone: true,
  imports: [],
  templateUrl: './buscar-empleado.component.html',
  styleUrl: './buscar-empleado.component.css'
})
export class BuscarEmpleadoComponent {
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
