# Animals API

API REST para registrar y administrar animales mediante operaciones CRUD. Está
desarrollada con NestJS y almacena la información en PostgreSQL usando TypeORM.

## Tecnologías

- Node.js 22
- NestJS 11
- TypeScript
- TypeORM
- PostgreSQL 16
- Docker y Docker Compose
- class-validator y class-transformer
- Bruno

## Características

- Creación, consulta, actualización y eliminación de animales.
- Persistencia en PostgreSQL.
- Migraciones de base de datos con TypeORM.
- Validación de solicitudes mediante DTOs.
- Rechazo de propiedades no definidas en los DTOs.
- Respuestas `404 Not Found` al actualizar o eliminar registros inexistentes.
- Campo `raza` opcional y nullable.
- Entorno reproducible con Docker Compose.
- Colección de Bruno incluida.

## Modelo Animal

| Campo     | Tipo                    | Descripción                        |
| --------- | ----------------------- | ---------------------------------- |
| `id`      | number, autogenerado    | Identificador único                |
| `nombre`  | string                  | Nombre del animal                  |
| `especie` | string                  | Especie, por ejemplo `Canis lupus` |
| `raza`    | string o null, opcional | Raza del animal cuando aplica      |
| `edad`    | number entero           | Edad en años, mínimo `0`           |
| `peso`    | number                  | Peso en kilogramos, mayor que `0`  |

## Endpoints

| Método   | Ruta           | Respuesta | Función                       |
| -------- | -------------- | --------- | ----------------------------- |
| `POST`   | `/animals`     | `201`     | Crear un animal               |
| `GET`    | `/animals`     | `200`     | Consultar todos los animales  |
| `PATCH`  | `/animals/:id` | `200`     | Actualizar un animal          |
| `DELETE` | `/animals/:id` | `204`     | Eliminar un animal            |

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

`raza` puede enviarse como string, como `null` o puede omitirse.

### Actualizar un animal

La actualización es parcial, por lo que solo se envían los campos que deben
cambiar:

```json
{
  "nombre": "Luna actualizada",
  "edad": 5,
  "peso": 25.2
}
```

## Montaje con Docker

Requisitos:

- Docker Desktop
- Docker Compose

Levantar PostgreSQL, ejecutar las migraciones e iniciar la API:

```bash
docker compose up --build -d
```

La API estará disponible en:

```text
http://localhost:3000
```

Consultar el estado de los contenedores:

```bash
docker compose ps
```

Consultar los logs de la API:

```bash
docker compose logs api
```

Detener los servicios:

```bash
docker compose down
```

## Montaje local

Requisitos:

- Node.js 20 o superior
- npm
- PostgreSQL

Instalar las dependencias:

```bash
npm install
```

Crear `.env` a partir de `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=animals_user
DB_PASSWORD=animals_password
DB_NAME=animals_db
DB_TYPE=postgres
```

Ejecutar las migraciones e iniciar la aplicación:

```bash
npm run migration:run
npm run start:dev
```

## Migraciones

Ejecutar las migraciones pendientes:

```bash
npm run migration:run
```

Revertir la migración más reciente:

```bash
npm run migration:revert
```

Generar una migración después de modificar una entidad:

```bash
npm run migration:generate -- src/db/migrations/NombreMigracion
```

La configuración utiliza `synchronize: false`, por lo que la estructura de la
base de datos se administra exclusivamente mediante migraciones.

## Colección de Bruno

La carpeta `bruno` contiene cuatro solicitudes:

1. Crear animal.
2. Listar animales.
3. Actualizar animal.
4. Eliminar animal.

Para utilizarla:

1. Abrir Bruno.
2. Seleccionar **Open Collection**.
3. Abrir la carpeta `bruno`.
4. Seleccionar el ambiente `local`.
5. Ejecutar las solicitudes en el orden indicado.

El identificador generado por `POST /animals` se guarda automáticamente en la
variable `animalId` y se utiliza en las solicitudes de actualización y
eliminación.

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
