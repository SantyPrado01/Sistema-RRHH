import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-mensajes-confirmacion',
  standalone:true,
  imports:[MatDialogModule, MatButtonModule, CommonModule, MatIcon],
  templateUrl: './mensajes-confirmacion.component.ts.html',
  styleUrl: './mensajes-confirmacion.component.css'

})
export class ConfirmacionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; type: 'confirm'; }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
