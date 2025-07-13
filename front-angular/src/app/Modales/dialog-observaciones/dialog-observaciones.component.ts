import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HorariosAsignadosService } from '../../horariosAsignados/services/horariosAsignados.service';

@Component({
  selector: 'app-dialog-observaciones',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule

  ],
  templateUrl: './dialog-observaciones.component.html',
  styleUrl: './dialog-observaciones.component.css'
})
export class DialogObservacionesComponent {
  observacion: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { observacion: string, idHorario?: number },
    private dialogRef: MatDialogRef<DialogObservacionesComponent>,
    private horarioService: HorariosAsignadosService
  ) {
    this.observacion = data.observacion;
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }

  actualizarObservacion() {
    const body = {
      observaciones: this.observacion // Aseguramos que el idHorario se envíe si está presente
    };

    if (this.data.idHorario) {
      this.horarioService.editHorario(this.data.idHorario,body)
        .subscribe({
          next: () => {
            console.log('Observación actualizada correctamente');
            console.log('ID del horario:', this.data.idHorario);
            console.log('Nueva observación:', this.observacion);
            this.dialogRef.close(this.observacion);
          },
          error: (error) => {
            console.error('Error al actualizar la observación:', error);
          }
        });
    } else {
      this.dialogRef.close(this.observacion);
    }
  }
}
