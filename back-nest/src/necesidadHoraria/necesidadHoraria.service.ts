import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateNecesidadHorariaDto } from './dto/updateNecesidadHoraria.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { NecesidadHoraria } from './entities/necesidadHoraria.entity'; 
import { Repository } from 'typeorm';


@Injectable()
export class NecesidadHorariaService {

  constructor(
    @InjectRepository(NecesidadHoraria)
    private readonly necesidadHorariaRepository: Repository<NecesidadHoraria>
  ){}

  async findAll(): Promise<NecesidadHoraria[]> {
    return this.necesidadHorariaRepository.find({relations: ['ordenTrabajo']});
  }

  async findOne(id: number): Promise<NecesidadHoraria> {
    const necesidad = await this.necesidadHorariaRepository.findOne({
      where: {necesidadHorariaId:id},
      relations: ['ordenTrabajo'],
    });
    if(!necesidad){
      throw new NotFoundException(`Necesidad horaria con ID ${id} no encontrada`);
    }
    return necesidad;
  }

  async update(id: number, updateNecesidadHorariaDto: UpdateNecesidadHorariaDto): Promise<NecesidadHoraria> {
    const necesidad = await this.necesidadHorariaRepository.preload({
      necesidadHorariaId: id,
      ...updateNecesidadHorariaDto,
    });
    if(!necesidad){
      throw new NotFoundException(`Necesidad horaria con ID ${id} no encontrada`)
    }
    return this.necesidadHorariaRepository.save(necesidad);
  }

  async remove(id: number): Promise<void> {
    const result = await this.necesidadHorariaRepository.delete(id);
    if (result.affected === 0){
      throw new NotFoundException(`Necesidda horaria con ID ${id} no encontrada`)
    }
  }
}