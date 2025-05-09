
# 📚 Biblioteca Backend API

Este es el backend de una plataforma de biblioteca, desarrollada como parte del Proyecto 01 del curso de Desarrollo Web Backend. La API permite a los usuarios registrarse, iniciar sesión, consultar libros, y reservarlos, con control de permisos y autenticación.

---

## 🚀 Tecnologías usadas

- Node.js
- Express
- MongoDB Atlas (Mongoose)
- JSON Web Tokens (JWT)
- Helmet, Morgan y CORS para seguridad y debugging

---

## ⚙️ Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/biblioteca-backend.git
cd biblioteca-backend
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Ejecuta el servidor

```bash
npm run dev
```

> ⚠️ Nota: En esta entrega, los valores de `JWT_SECRET` y `MONGO_URI` están embebidos directamente en el código fuente debido a problemas con la lectura del archivo `.env`.

---

## 🛠 Endpoints principales

### Autenticación

- `POST /api/auth/register` → Crear usuario
- `POST /api/auth/login` → Iniciar sesión (retorna token JWT)

### Usuarios

- `GET /api/users/:id` → Obtener datos del usuario autenticado
- `PUT /api/users/:id` → Actualizar usuario (autenticado)
- `DELETE /api/users/:id` → Soft delete de usuario

### Libros

- `POST /api/books/` → Crear libro (requiere permiso)
- `GET /api/books/` → Consultar libros con filtros
- `GET /api/books/:id` → Consultar libro por ID
- `PUT /api/books/:id` → Editar libro (requiere permiso)
- `DELETE /api/books/:id` → Soft delete de libro (requiere permiso)

### Reservas

- `POST /api/reservations/` → Reservar libro
- `GET /api/reservations/user/:userId` → Ver historial de reservas del usuario
- `GET /api/reservations/book/:bookId` → Ver historial de reservas del libro

---



## 👨‍💻 Autor

Ana María Ardila Pacheco  
Estudiante de Ingeniería de Sistemas  
Universidad del Norte

