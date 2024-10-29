export interface Disponibilidad {
  disponibilidadHorariaId?: number; 
  empleadoId: number; 
  diaSemana?: number; 
  horaInicio?: string; 
  horaFin?: string; 
  fechaInicio?: string; 
  fechaFin?: string; 
  fullTime: boolean; 
}
