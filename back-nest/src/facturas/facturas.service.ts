import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FacturasService {

  constructor(@InjectRepository(Factura) private facturaRepository:Repository<Factura>){}

  createFactura(Factura: CreateFacturaDto){
    const newFactura = this.facturaRepository.create(Factura)
    return this.facturaRepository.save(newFactura), 
    new HttpException('La factura se guardo con exito.', HttpStatus.ACCEPTED)
  }

  getFacturas(){
    return this.facturaRepository.find({
      where:{
        eliminado: false
      }
    })
  }

  async getFactura(facturaId: number){
    const facturaFound = await this.facturaRepository.findOne({
      where:{
        facturaId
      }
    })
    if(!facturaFound){
      return new HttpException('Factura no encontrada.', HttpStatus.NOT_FOUND)
    }
    return facturaFound
  }

  async updateFactura(facturaId: number, factura: UpdateFacturaDto){

    const facturaFound = await this.facturaRepository.findOne({
      where:{
        facturaId
      }
    });
    if(!facturaFound){
      return new HttpException('Factura no Encontrada.', HttpStatus.NOT_FOUND)
    }
    const updateFactura = Object.assign(facturaFound, factura);
    return this.facturaRepository.save(updateFactura)
  }
  
  async deleteFactura(facturaId:number){
    const facturaFound = await this.facturaRepository.findOne({
      where:{
        facturaId
      }
    })
    if(!facturaFound){
      return new HttpException('Factura no encontrada.', HttpStatus.ACCEPTED);
    }
    facturaFound.eliminado = true;
    await this.facturaRepository.save(facturaFound);
    throw new HttpException('Factura Eliminada.', HttpStatus.ACCEPTED);
  }

  update(id: number, updateFacturaDto: UpdateFacturaDto) {
    return `This action updates a #${id} factura`;
  }

  remove(id: number) {
    return `This action removes a #${id} factura`;
  }
}
