import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosService } from './servicios.service';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

describe('ServiciosService', () => {
    let servicio: ServiciosService;
    let repositorio: Repository<Servicio>;
  
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ServiciosService,
          {
            provide: getRepositoryToken(Servicio),
            useValue: mockRepository,
          },
        ],
      }).compile();
  
      servicio = module.get<ServiciosService>(ServiciosService);
      repositorio = module.get<Repository<Servicio>>(getRepositoryToken(Servicio));
    });
  
    it('debería estar definido', () => {
      expect(servicio).toBeDefined();
    });
  
    describe('createServicio', () => {
        it('debería crear un nuevo servicio', async () => {
          const servicioDto = {
            nombre: 'Limpieza',
            cuit: '30-12345678-9',
            direccion: 'Calle Falsa 123',
            ciudad: 1,
            telefono: '123456789',
            categoriaID: 1,
            descripcion: 'Servicio de limpieza general',
            necesidadHorariaID: 1,
            ordenesTrabajoID: 1,
            eliminado: false,
          };
      
          const nuevoServicio = { ...servicioDto, servicioId: 1, categoria: [], facturas: [], ordenesTrabajo: [] };
      
          mockRepository.findOne.mockResolvedValue(null);
          mockRepository.create.mockReturnValue(nuevoServicio);
          mockRepository.save.mockResolvedValue(nuevoServicio);
      
          const resultado = await servicio.createServicio(servicioDto);
          expect(resultado).toEqual(nuevoServicio);
        });
      
        it('debería lanzar una excepción de conflicto si el servicio ya existe', async () => {
          const servicioDto = {
            nombre: 'Limpieza',
            cuit: '30-12345678-9',
            direccion: 'Calle Falsa 123',
            ciudad: 1,
            telefono: '123456789',
            categoriaID: 1,
            descripcion: 'Servicio de limpieza general',
            necesidadHorariaID: 1,
            ordenesTrabajoID: 1,
            eliminado: false,
          };
      
          const servicioExistente = { servicioId: 1, ...servicioDto };
      
          mockRepository.findOne.mockResolvedValue(servicioExistente);
      
          await expect(servicio.createServicio(servicioDto)).rejects.toThrow(
            new HttpException('El servicio ya existe. Prueba nuevamente.', HttpStatus.CONFLICT),
          );
        });
      });
      

  describe('getServicios', () => {
    it('debería retornar una lista de servicios no eliminados', async () => {
      const servicios: Servicio[] = [
        { servicioId: 1, nombre: 'Limpieza', eliminado: false, cuit: '30-12345678-9', direccion: 'Calle 123', ciudad: 1, telefono: '123456789', descripcion: 'Limpieza básica', categoria: [], facturas: [], ordenesTrabajo: [] },
        { servicioId: 2, nombre: 'Seguridad', eliminado: false, cuit: '30-87654321-0', direccion: 'Avenida Siempre Viva', ciudad: 2, telefono: '987654321', descripcion: 'Seguridad perimetral', categoria: [], facturas: [], ordenesTrabajo: [] },
      ];

      jest.spyOn(repositorio, 'find').mockResolvedValue(servicios);

      const resultado = await servicio.getServicios();
      expect(resultado).toEqual(servicios);
    });
  });

  describe('getServicio', () => {
    it('debería retornar un servicio por nombre', async () => {
      const servicioEncontrado: Servicio = {
        servicioId: 1,
        nombre: 'Limpieza',
        eliminado: false,
        cuit: '30-12345678-9',
        direccion: 'Calle Falsa 123',
        ciudad: 1,
        telefono: '123456789',
        descripcion: 'Servicio de limpieza',
        categoria: [],
        facturas: [],
        ordenesTrabajo: [],
      };
      jest.spyOn(repositorio, 'findOne').mockResolvedValue(servicioEncontrado);

      const resultado = await servicio.getServicio('Limpieza');
      expect(resultado).toEqual(servicioEncontrado);
    });

    it('debería retornar null si no se proporciona un nombre', async () => {
      const resultado = await servicio.getServicio('');
      expect(resultado).toBeNull();
    });
  });

  describe('getServicioId', () => {
    it('debería retornar un servicio por ID', async () => {
      const servicioEncontrado: Servicio = {
        servicioId: 1,
        nombre: 'Limpieza',
        eliminado: false,
        cuit: '30-12345678-9',
        direccion: 'Calle Falsa 123',
        ciudad: 1,
        telefono: '123456789',
        descripcion: 'Servicio de limpieza',
        categoria: [],
        facturas: [],
        ordenesTrabajo: [],
      };
      jest.spyOn(repositorio, 'findOne').mockResolvedValue(servicioEncontrado);

      const resultado = await servicio.getServicioId(1);
      expect(resultado).toEqual(servicioEncontrado);
    });

    it('debería lanzar una excepción de no encontrado si el servicio no existe', async () => {
      jest.spyOn(repositorio, 'findOne').mockResolvedValue(null);

      await expect(servicio.getServicioId(1)).rejects.toThrow(
        new HttpException('Servicio no encontrado.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteServicio', () => {
    it('debería establecer eliminado a true y guardar el servicio', async () => {
      const servicioEncontrado: Servicio = {
        servicioId: 1,
        nombre: 'Limpieza',
        eliminado: false,
        cuit: '30-12345678-9',
        direccion: 'Calle Falsa 123',
        ciudad: 1,
        telefono: '123456789',
        descripcion: 'Servicio de limpieza',
        categoria: [],
        facturas: [],
        ordenesTrabajo: [],
      };
      jest.spyOn(repositorio, 'findOne').mockResolvedValue(servicioEncontrado);
      jest.spyOn(repositorio, 'save').mockResolvedValue({ ...servicioEncontrado, eliminado: true });

      await expect(servicio.deleteServicio(1)).rejects.toThrow(
        new HttpException('Servicio Eliminado', HttpStatus.ACCEPTED),
      );
    });

    it('debería lanzar una excepción de no encontrado si el servicio no existe', async () => {
      jest.spyOn(repositorio, 'findOne').mockResolvedValue(null);

      await expect(servicio.deleteServicio(1)).rejects.toThrow(
        new HttpException('Servicio no encontrado.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateServicio', () => {
    it('debería actualizar el servicio con el DTO proporcionado', async () => {
      const servicioEncontrado: Servicio = {
        servicioId: 1,
        nombre: 'Limpieza',
        eliminado: false,
        cuit: '30-12345678-9',
        direccion: 'Calle Falsa 123',
        ciudad: 1,
        telefono: '123456789',
        descripcion: 'Servicio de limpieza',
        categoria: [],
        facturas: [],
        ordenesTrabajo: [],
      };
      const updateDto: UpdateServicioDto = { nombre: 'Limpieza Intensiva' };
      const servicioActualizado = { ...servicioEncontrado, ...updateDto };

      jest.spyOn(repositorio, 'findOne').mockResolvedValue(servicioEncontrado);
      jest.spyOn(repositorio, 'save').mockResolvedValue(servicioActualizado);

      const resultado = await servicio.updateServicio(1, updateDto);
      expect(resultado).toEqual(servicioActualizado);
    });

    it('debería lanzar una excepción de no encontrado si el servicio no existe', async () => {
      jest.spyOn(repositorio, 'findOne').mockResolvedValue(null);
      const updateDto: UpdateServicioDto = { nombre: 'Limpieza Intensiva' };

      await expect(servicio.updateServicio(1, updateDto)).rejects.toThrow(
        new HttpException('Servicio no encontrado.', HttpStatus.NOT_FOUND),
      );
    });
  });
});
