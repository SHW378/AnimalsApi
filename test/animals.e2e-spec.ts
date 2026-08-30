import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AnimalsController } from '../src/animals/animals.controller';
import { AnimalsService } from '../src/animals/animals.service';
import { Animal } from '../src/animals/entities/animal.entity';

describe('AnimalsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

  const animalsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const animal: Animal = {
    id: 1,
    nombre: 'Luna',
    especie: 'Canis lupus familiaris',
    raza: null,
    edad: 3,
    peso: 18.5,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [
        {
          provide: AnimalsService,
          useValue: animalsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /animals responde 201 y permite omitir raza', async () => {
    const createAnimalDto = {
      nombre: animal.nombre,
      especie: animal.especie,
      edad: animal.edad,
      peso: animal.peso,
    };
    animalsService.create.mockResolvedValue(animal);

    await request(httpServer)
      .post('/animals')
      .send(createAnimalDto)
      .expect(201)
      .expect(animal);

    expect(animalsService.create).toHaveBeenCalledWith(createAnimalDto);
  });

  it('GET /animals responde 200 con la lista de animales', async () => {
    animalsService.findAll.mockResolvedValue([animal]);

    await request(httpServer).get('/animals').expect(200).expect([animal]);

    expect(animalsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('PATCH /animals/:id responde 200 con el animal actualizado', async () => {
    const updateAnimalDto = { raza: 'Labrador', peso: 19.25 };
    const updatedAnimal = { ...animal, ...updateAnimalDto };
    animalsService.update.mockResolvedValue(updatedAnimal);

    await request(httpServer)
      .patch('/animals/1')
      .send(updateAnimalDto)
      .expect(200)
      .expect(updatedAnimal);

    expect(animalsService.update).toHaveBeenCalledWith(1, updateAnimalDto);
  });

  it('DELETE /animals/:id responde 204 sin cuerpo', async () => {
    animalsService.remove.mockResolvedValue(undefined);

    const response = await request(httpServer).delete('/animals/1').expect(204);

    expect(response.text).toBe('');
    expect(animalsService.remove).toHaveBeenCalledWith(1);
  });

  it('POST /animals responde 400 si el cuerpo no cumple el DTO', async () => {
    await request(httpServer)
      .post('/animals')
      .send({
        nombre: '',
        especie: animal.especie,
        edad: -1,
        peso: 0,
      })
      .expect(400);

    expect(animalsService.create).not.toHaveBeenCalled();
  });

  it('PATCH rechaza null en campos requeridos aunque permita omitirlos', async () => {
    await request(httpServer)
      .patch('/animals/1')
      .send({ nombre: null })
      .expect(400);

    expect(animalsService.update).not.toHaveBeenCalled();
  });
});
