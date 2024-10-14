import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NabvarComponent } from '../nabvar/nabvar.component';

@Component({
  selector: 'app-disponibilidad-horaria',
  imports: [NabvarComponent],
  standalone: true,
  templateUrl: './disponibilidad-horaria.component.html',
  styleUrls: ['./disponibilidad-horaria.component.css']
})
export class DisponibilidadHorariaComponent implements OnInit {

  // Definición del objeto para almacenar la disponibilidad horaria de cada día
  disponibilidad = {
    lunesEntrada: '',
    lunesSalida: '',
    martesEntrada: '',
    martesSalida: '',
    miercolesEntrada: '',
    miercolesSalida: '',
    juevesEntrada: '',
    juevesSalida: '',
    viernesEntrada: '',
    viernesSalida: '',
    sabadoEntrada: '',
    sabadoSalida: '',
    domingoEntrada: '',
    domingoSalida: ''
  };

  constructor() { }

  ngOnInit(): void {
    // Si es necesario, aquí puedes inicializar la disponibilidad con valores predeterminados.
  }

  // Función para guardar la disponibilidad horaria
  guardarDisponibilidad(): void {
    const data = [
      { diaSemana: 1, horaInicio: this.disponibilidad.lunesEntrada, horaFin: this.disponibilidad.lunesSalida },
      { diaSemana: 2, horaInicio: this.disponibilidad.martesEntrada, horaFin: this.disponibilidad.martesSalida },
      { diaSemana: 3, horaInicio: this.disponibilidad.miercolesEntrada, horaFin: this.disponibilidad.miercolesSalida },
      { diaSemana: 4, horaInicio: this.disponibilidad.juevesEntrada, horaFin: this.disponibilidad.juevesSalida },
      { diaSemana: 5, horaInicio: this.disponibilidad.viernesEntrada, horaFin: this.disponibilidad.viernesSalida },
      { diaSemana: 6, horaInicio: this.disponibilidad.sabadoEntrada, horaFin: this.disponibilidad.sabadoSalida },
      { diaSemana: 0, horaInicio: this.disponibilidad.domingoEntrada, horaFin: this.disponibilidad.domingoSalida } // Nota: 0 para domingo
    ];
  
    //this.disponibilidadService.guardarDisponibilidad(data).subscribe(response => {
      //console.log('Datos guardados correctamente:', response);
      //alert('Disponibilidad guardada exitosamente');
    //}, error => {
      //console.error('Error al guardar los datos:', error);
    //});
  }


  cancelar(): void {
    // Si deseas restablecer los campos, puedes volver a poner los valores vacíos
    this.disponibilidad = {
      lunesEntrada: '',
      lunesSalida: '',
      martesEntrada: '',
      martesSalida: '',
      miercolesEntrada: '',
      miercolesSalida: '',
      juevesEntrada: '',
      juevesSalida: '',
      viernesEntrada: '',
      viernesSalida: '',
      sabadoEntrada: '',
      sabadoSalida: '',
      domingoEntrada: '',
      domingoSalida: ''
    };
  }

}

