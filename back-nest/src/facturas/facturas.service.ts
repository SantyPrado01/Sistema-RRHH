import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './entities/factura.entity'; 
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ItemsFactura } from 'src/items-facturas/entities/items-factura.entity'; 
import { CreateItemsFacturaDto } from 'src/items-facturas/dto/create-items-factura.dto'; 

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(ItemsFactura)
    private readonly itemsFacturaRepository: Repository<ItemsFactura>,
  ) {}

  async createFactura(createFacturaDto: CreateFacturaDto) {
    const factura = this.facturaRepository.create(createFacturaDto);
    const savedFactura = await this.facturaRepository.save(factura);
    const itemsFactura = [];
  
    for (const item of createFacturaDto.items) {
      const existingItem = await this.itemsFacturaRepository.findOne({
        where: {
          descripcion: item.descripcion,
          valor: item.valor,
          facturaId: savedFactura.facturaId,  
        },
      });
  
      let newItem;
  
      if (existingItem) {
        newItem = existingItem;
      } else {
        newItem = this.itemsFacturaRepository.create(item);
      }
  
      newItem.facturaId = savedFactura.facturaId;
      itemsFactura.push(newItem);
    }

    await this.itemsFacturaRepository.save(itemsFactura);
    savedFactura.items = itemsFactura;
  
    return savedFactura;
  }
  

  async findAll() {
    try {
      const facturas = await this.facturaRepository.find({
        relations: ['items','servicio'], 
      });
      return facturas;
    } catch (error) {
      throw new HttpException('Error al obtener las facturas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(facturaId: number) {
    try {
      const factura = await this.facturaRepository.findOne({
        where: { facturaId },
        relations: ['items'], 
      });

      if (!factura) {
        throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
      }
      return factura;
    } catch (error) {
      throw new HttpException('Error al obtener la factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByServicioId(servicioId: number) {
    try {
      const facturas = await this.facturaRepository.find({
        where: {
          servicio: { servicioId }, 
        },
        relations: ['items', 'servicio'],
      });
      if (facturas.length === 0) {
        throw new HttpException('No se encontraron facturas para este servicio', HttpStatus.NOT_FOUND);
      }
      return facturas;
    } catch (error) {
      throw new HttpException('Error al obtener las facturas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateFactura(facturaId: number, updateFacturaDto: UpdateFacturaDto) {
    const facturaFound = await this.facturaRepository.findOne({
      where: { facturaId },
      relations: ['items'], 
    });
  
    if (!facturaFound) {
      throw new HttpException('Factura no encontrada.', HttpStatus.NOT_FOUND);
    }

    const updatedFactura = Object.assign(facturaFound, updateFacturaDto);
    if (updateFacturaDto.items && updateFacturaDto.items.length > 0) {
      const itemsToUpdate = updateFacturaDto.items.map(item => {
        const existingItem = facturaFound.items.find(existingItem => existingItem.id === item.id);
  
        if (existingItem) {
          existingItem.descripcion = item.descripcion;
          existingItem.valor = item.valor;
          return existingItem;  
        } else {
          const newItem = this.itemsFacturaRepository.create({
            ...item,
            facturaId: facturaFound.facturaId, 
          });
          return newItem;
        }
      });
      await this.itemsFacturaRepository.save(itemsToUpdate);
    }

    const savedFactura = await this.facturaRepository.save(updatedFactura);
    return savedFactura;
  }
  

  async deleteFactura(facturaId: number) {
    const factura = await this.facturaRepository.findOne({
      where: { facturaId },
    });

    if (!factura) {
      throw new HttpException('Factura no encontrada', HttpStatus.NOT_FOUND);
    }
    factura.eliminado = true;
    await this.facturaRepository.save(factura);

    return { message: 'Factura marcada como eliminada con éxito' };
  }
}
