# Animals API

API REST desarrollada con NestJS, TypeORM y PostgreSQL para administrar una
colección de animales. El proyecto implementa exactamente cuatro endpoints para
crear, listar, actualizar y eliminar registros.

Repositorio: <https://github.com/SHW378/AnimalsApi>

## Tecnologías

- Node.js 22
- NestJS 11
- TypeORM
- PostgreSQL 16
- Docker y Docker Compose
- class-validator
- Jest y Supertest
- Bruno

## Modelo de datos

| Campo     | Tipo                         | Descripción                         |
| --------- | ---------------------------- | ----------------------------------- |
| `id`      | number, PK autogenerada      | Identificador único                 |
| `nombre`  | string, requerido            | Nombre del animal                   |
| `especie` | string, requerido            | Especie, por ejemplo `Canis lupus`  |
| `raza`    | string o null, opcional      | Raza, cuando aplica                 |
| `edad`    | number entero, mínimo 0      | Edad en años                        |
| `peso`    | number positivo              | Peso en kilogramos                  |

La tabla se crea mediante una migración. TypeORM tiene deshabilitada la
sincronización automática (`synchronize: false`).

## Endpoints

| Método   | Ruta           | Código exitoso | Operación                    |
| -------- | -------------- | -------------- | ---------------------------- |
| `POST`   | `/animals`     | `201`          | Crear un animal              |
| `GET`    | `/animals`     | `200`          | Listar todos los animales    |
| `PATCH`  | `/animals/:id` | `200`          | Actualizar campos del animal |
| `DELETE` | `/animals/:id` | `204`          | Eliminar un animal           |

No se expone `GET /animals/:id`, de acuerdo con el alcance de cuatro endpoints.

### Crear un animal

```json
{
  "nombre": "Luna",
  "especie": "Canis lupus",
  "raza": null,
  "edad": 4,
  "peso": 24.5
}
```

`raza` puede enviarse como un string, como `null`, o puede omitirse. Cuando se
omite al crear el registro, se guarda como `null`.

### Actualizar un animal

`PATCH` permite enviar únicamente los campos que deben cambiar:

```json
{
  "nombre": "Luna actualizada",
  "edad": 5,
  "peso": 25.2
}
```

La API devuelve `400 Bad Request` cuando los datos no cumplen el DTO o se envían
propiedades desconocidas. `PATCH` y `DELETE` devuelven `404 Not Found` cuando el
identificador no existe.

## Ejecución con Docker

Esta es la forma recomendada porque no requiere instalar PostgreSQL manualmente.

```bash
git clone https://github.com/SHW378/AnimalsApi.git
cd AnimalsApi
docker compose up --build
```

Docker Compose realiza lo siguiente:

1. Crea PostgreSQL y espera hasta que esté saludable.
2. Construye la API.
3. Ejecuta las migraciones pendientes.
4. Inicia NestJS en `http://localhost:3000`.

Para detener los servicios:

```bash
docker compose down
```

## Ejecución local

Requisitos: Node.js 20 o superior, npm y una instancia de PostgreSQL.

```bash
npm install
```

Copiar `.env.example` como `.env` y ajustar las credenciales si es necesario:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=animals_user
DB_PASSWORD=animals_password
DB_NAME=animals_db
DB_TYPE=postgres
```

Después, ejecutar la migración e iniciar la API:

```bash
npm run migration:run
npm run start:dev
```

## Migraciones

```bash
# Ejecutar migraciones pendientes
npm run migration:run

# Revertir la migración más reciente
npm run migration:revert

# Generar una migración después de modificar las entidades
npm run migration:generate -- src/db/migrations/NombreMigracion
```

La migración inicial está en
`src/db/migrations/1788048000000-CreateAnimalTable.ts` e incluye las
restricciones `edad >= 0` y `peso > 0`.

## Pruebas automatizadas

```bash
npm run build
npm run lint
npm test
npm run test:e2e
```

Las pruebas unitarias cubren el servicio, incluidos los casos inexistentes. Las
pruebas HTTP cubren los cuatro endpoints y la validación de los DTOs.

## Colección de Bruno

La colección se encuentra en [`bruno`](./bruno) y contiene exactamente estas
cuatro solicitudes:

1. `Crear animal`
2. `Listar animales`
3. `Actualizar animal`
4. `Eliminar animal`

Para usarla:

1. Abrir Bruno.
2. Seleccionar **Open Collection**.
3. Elegir la carpeta `bruno` de este repositorio.
4. Seleccionar el ambiente `local`.
5. Ejecutar las solicitudes en el orden indicado.

La solicitud de creación guarda automáticamente el `id` devuelto en la variable
de ejecución `animalId`. Las solicitudes de actualización y eliminación usan esa
misma variable, por lo que no es necesario copiar el identificador manualmente.
Cada solicitud incluye pruebas de respuesta.

Después de eliminar, se puede ejecutar nuevamente `Listar animales` para
confirmar que el registro ya no aparece. Esto reutiliza el mismo endpoint y no
añade una quinta ruta a la API.

## Guion sugerido para el video

1. Mostrar el repositorio y la estructura del módulo `animals`.
2. Ejecutar `docker compose up --build` y mostrar que la migración finaliza.
3. Abrir la colección en Bruno y seleccionar el ambiente `local`.
4. Ejecutar `Crear animal` y mostrar el código `201`, el `id` y `raza: null`.
5. Ejecutar `Listar animales` y localizar el registro creado.
6. Ejecutar `Actualizar animal` y mostrar los campos modificados.
7. Ejecutar `Eliminar animal` y mostrar el código `204` sin cuerpo.
8. Ejecutar otra vez `Listar animales` para confirmar que fue eliminado.
9. Mostrar que las pruebas incluidas en Bruno aparecen aprobadas.

## Estructura principal

```text
src/
├── animals/
│   ├── dtos/
│   ├── entities/
│   ├── animals.controller.ts
│   ├── animals.module.ts
│   └── animals.service.ts
├── config/
├── db/
│   ├── migrations/
│   └── data-source.ts
├── app.module.ts
└── main.ts
```
