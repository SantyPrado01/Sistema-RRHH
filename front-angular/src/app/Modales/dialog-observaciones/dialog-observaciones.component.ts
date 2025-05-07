import { Component, Inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-observaciones',
  standalone: true,
  imports: [
    MatButtonModule

  ],
  templateUrl: './dialog-observaciones.component.html',
  styleUrl: './dialog-observaciones.component.css'
})
export class DialogObservacionesComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {observacion:string},
    private dialogRef: MatDialogRef<DialogObservacionesComponent>,
  ) { }

  cerrarDialogo() {
    this.dialogRef.close();
  }
  

}
