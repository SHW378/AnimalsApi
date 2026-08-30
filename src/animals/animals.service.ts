import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnimalDto } from './dtos/create-animal.dto';
import { UpdateAnimalDto } from './dtos/update-animal.dto';
import { Animal } from './entities/animal.entity';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    const animal = this.animalRepository.create({
      ...createAnimalDto,
      raza: createAnimalDto.raza ?? null,
    });

    return this.animalRepository.save(animal);
  }

  findAll(): Promise<Animal[]> {
    return this.animalRepository.find({ order: { id: 'ASC' } });
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.animalRepository.preload({
      id,
      ...updateAnimalDto,
    });

    if (!animal) {
      throw new NotFoundException(`No se encontró el animal con id ${id}`);
    }

    return this.animalRepository.save(animal);
  }

  async remove(id: number): Promise<void> {
    const result = await this.animalRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró el animal con id ${id}`);
    }
  }
}
