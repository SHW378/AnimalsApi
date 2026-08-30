import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dtos/create-animal.dto';
import { Animal } from './entities/animal.entity';

type RepositoryMock = Pick<
  Repository<Animal>,
  'create' | 'save' | 'find' | 'preload' | 'delete'
>;

describe('AnimalsService', () => {
  let service: AnimalsService;
  let repository: jest.Mocked<RepositoryMock>;

  const animal: Animal = {
    id: 1,
    nombre: 'Luna',
    especie: 'Canis lupus familiaris',
    raza: null,
    edad: 3,
    peso: 18.5,
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      preload: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        {
          provide: getRepositoryToken(Animal),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
  });

  it('crea un animal y convierte una raza omitida en null', async () => {
    const dto: CreateAnimalDto = {
      nombre: animal.nombre,
      especie: animal.especie,
      edad: animal.edad,
      peso: animal.peso,
    };
    repository.create.mockReturnValue(animal);
    repository.save.mockResolvedValue(animal);

    await expect(service.create(dto)).resolves.toEqual(animal);
    expect(repository.create).toHaveBeenCalledWith({ ...dto, raza: null });
  });

  it('lista los animales ordenados por id', async () => {
    repository.find.mockResolvedValue([animal]);

    await expect(service.findAll()).resolves.toEqual([animal]);
    expect(repository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
  });

  it('actualiza un animal existente', async () => {
    const updatedAnimal = { ...animal, peso: 19 };
    repository.preload.mockResolvedValue(updatedAnimal);
    repository.save.mockResolvedValue(updatedAnimal);

    await expect(service.update(1, { peso: 19 })).resolves.toEqual(
      updatedAnimal,
    );
  });

  it('responde 404 al actualizar un animal inexistente', async () => {
    repository.preload.mockResolvedValue(undefined);

    await expect(service.update(99, { peso: 19 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('elimina un animal existente', async () => {
    repository.delete.mockResolvedValue({
      affected: 1,
      raw: [],
    });

    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('responde 404 al eliminar un animal inexistente', async () => {
    repository.delete.mockResolvedValue({
      affected: 0,
      raw: [],
    });

    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
