export class CreateServicioDto {

    nombre: string
    cuit?: string
    direccion: string
    ciudad?: number
    telefono?: string
    categoriaId?: number
    descripcion: string
    horasFijas?: string
    eliminado: boolean
    necesidadHorariaID:number
    ordenesTrabajoID: number

}
