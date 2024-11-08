import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-mensajes-alerta',
  standalone:true,
  imports:[MatDialogModule, MatButtonModule, CommonModule, MatIcon],
  templateUrl: './mensajes-alerta.component.html',
  styleUrl: './mensajes-alerta.component.css'

})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; type: 'success' | 'error' }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
