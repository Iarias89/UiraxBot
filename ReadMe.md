# Web Uirax

## 1- Descripción.

Esta página web esta dedicada a un proveedor especializado en **movilidad electrica**.

Se tendra la opción de registrar un usuario, vinculando un producto a la cuenta y así tener acceso al certificado de circulación del producto.
También poder acceder rapidamente a los manuales y garantia del producto/productos vinculados.

Por otro lado desde el acceso de **Administrador** podras modificar todos los productos, 

añadir productos nuevos, añadir o modificar los certificados de circulación (actualizandolos 

según los cambios de normativa).

La web servira como una web corporativa (presentar productos, crear imagen de marca), como una 

forma de controlar productos vendidos y asociandolos a un cliente.

## 2- Rutas.

# Rutas Generales:

/register: Es la ruta asignada a la creación de un nuevo usuario. Introduciendo nombre, correo y contraseña.

/login: Ruta de logueo. Requiere email y contraseña.

/usuario/products: Añade un producto a un usuario creado. Requiere ID del producto.

/updateUser: Actualiza los datos del usuario.

/deleteUser: Borra la cuenta de usuario que este registrado en ese momento.

/products: Muestra todos los productos de la base de datos.

/findProduct/:id : Muestra producto por ID.

/certificados: Genera un certificado para el producto. Requiere la Id del usuario, Id del producto y el numero de bastidor unico de cada producto.

# Rutas Admin: 

/: Muestra todos los usuarios registrados.

/find: Encuentra un usuario concreto, buscandolo por Id(requerido en el body).

/crearProducto: Crea un nuevo producto añadiendolo a la base de datos.

/updateProduct: Actualiza y modifica un producto.

/deleteProduct: Borra el producto que coincida con la Id introducida por el body.

/buscarCertificados: Muestra en pantalla todos los certificados creados hasta ese momento.