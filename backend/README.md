# Backend

## Docker
El backend se ejecuta simultáneamente con el Frontend y la base de datos ORM.
Verificar existencia del archivo `.env` en raiz (/) junto a `.env-example` y luego ejecutar:

```
docker compose up --build -d
```
## Run tests

```
npm run test
```

## Migrations
Para generar una migracion, verificar existencia del archivo `.env` en `/backend` que contenga información de base de datos (o el mismo `.env` en raíz), y que esta se encuentre corriendo en Docker.

```
npm run migration:generate --name=NOMBRE_DE_MIGRACION
```

Correr la migración manualmente con:

```
npm run migration:run
```