# Archivo docker para configuracion de despliegue en fly.io

# Ajuste de la version de node, se puede cambiar segun necesidad (mejor usar la version LTS)
ARG NODE_VERSION=24.13.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Ejecucion aplicacion (no root)
WORKDIR /app

# Set produccion 
ENV NODE_ENV="production"


# Etapa de build para instalar node modules y compilar el codigo 
FROM base AS build

# Instalacion paquetes necesarios paranode modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Instalacion node modules
COPY package-lock.json package.json ./
RUN npm ci

# Copiar codigo app 
COPY . .


# Estado final vista
FROM base

# Copiar node modules desde la etapa de build
COPY --from=build /app /app

# Servidor por defecto en 3000
EXPOSE 3000
CMD [ "npm", "run", "start" ]
