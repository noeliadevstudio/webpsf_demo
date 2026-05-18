#  PSF - Proyecto Intermodular - Desarrollo de aplicaciones web (DAW)

Aplicación web desarrollada con **Node.js, Express, MySQL y EJS** para la gestión de un equipo de fútbol.  
Incluye gestión de plantilla, estadísticas, votos, partidos y panel de administración.

---

## Requisitos previos: 

Herramientas para poder ejecutar el proyecto en local:

- Node.js
- npm
- MySQL

###  Verificar instalación: 

```bash
node -v
npm -v
mysql --version
```

---

## Instalación del proyecto

### 1. Clonar el repositorio
### 2. Instalar dependencias

```bash
npm install
```

---

## Configuración de la base de datos

### Crear base de datos

```sql
CREATE DATABASE webpsf_demo; 
```

---

## Tablas de la base de datos

### Tabla: `jugadores`

```sql
CREATE TABLE jugadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  mote VARCHAR(100),
  dorsal INT, 
  posicion VARCHAR(50),
  URL_foto VARCHAR(255),
);
```

### Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('user', 'admin') DEFAULT 'user'
); 
```

### Tabla: `estadisticas`

```sql
CREATE TABLE estadisticas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jugador_id INT NOT NULL UNIQUE,
  partidos INT DEFAULT 0,
  goles INT DEFAULT 0,
  asistencias INT DEFAULT 0,
  tarjetas_amarillas INT DEFAULT 0,
  tarjetas_rojas INT DEFAULT 0,
  historico TEXT,
  cant_estrellas INT DEFAULT 0,
  FOREIGN KEY (jugador_id) REFERENCES jugadores(id) ON DELETE CASCADE
);

```

### Tabla: `votos`

```sql
CREATE TABLE votos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_jugador INT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_jugador) REFERENCES jugadores(id) ON DELETE CASCADE
);

```
### Tabla: `partido`

```sql
CREATE TABLE partido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    rival VARCHAR(255) NOT NULL,
    terminado BOOLEAN NOT NULL DEFAULT FALSE,
    resultado VARCHAR(50) DEFAULT NULL
);

```

---

## Configuración del entorno 
 Cambiar credenciales en el archivo admin.js para crear usuario administrador
 ejecutar: 
 
```bash
node admin.js
```
## Ejecutar el proyecto en local

```bash
npm run start
```


