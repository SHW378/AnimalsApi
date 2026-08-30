import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ANIMAL')
@Check('CHK_ANIMAL_EDAD_NON_NEGATIVE', '"edad" >= 0')
@Check('CHK_ANIMAL_PESO_POSITIVE', '"peso" > 0')
export class Animal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 150 })
  especie!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  raza!: string | null;

  @Column({ type: 'integer' })
  edad!: number;

  @Column({ type: 'double precision' })
  peso!: number;
}
