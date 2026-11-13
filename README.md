# Plataforma de autoaprendizaje - CLENA

Plataforma de autoaprendizaje es una aplicación web diseñada para adultos mayores y usuarios con poca experiencia digital que buscan aprender de forma autónoma tareas informáticas básicas (correo, búsqueda en internet, documentos, redes sociales). El sistema ofrece un catálogo de guías paso a paso administrable por el personal, cuestionarios interactivos, seguimiento del progreso por lección y registro de solicitudes de ayuda presencial, todo enmarcado en un diseño accesible con alto contraste, letra grande y navegación por teclado.

## Integrantes
- JOSE DAVID MARTINEZ FERNANDEZ [Scrum master, Development Team]
- GABRIEL OMAR PAEZ ROLONG [Product Owner, Development Team]
- ALFREDO DE JESUS TOUS VILLAREAL [Development Team]

## Equipo de origen

G2
- Jesus Arteaga
- Carlos Salja
- Jose Mercado
- Juan Villalba

## Prerrequisitos

Asegúrate de tener instalado en tu sistema:
- [Docker](https://docs.docker.com/get-docker/)

## Pasos de Ejecución

1. Clona este repositorio:
   ```bash
   git clone https://github.com/JoseD2021/PlataformaAutoaprendizaje.git
    ```

2. Ingresar a la carpeta raiz
    ```bash
    cd PlataformaAutoaprendizaje
    ```

3. Copiar `.env-example` a `.env`

4. Ejecutar proyecto
    ```bash
    docker compose up -d --build
    ```
## Verificación de Servicios
Una vez levantados los contenedores, los servicios estarán disponibles en:

    Frontend (React): http://localhost:8080

    API Backend (NestJS): http://localhost:3000/api/v1

    Documentación OpenAPI / Swagger: http://localhost:3000/docs

## Como detener

1. `docker compose down`