/**
 * 1. BASE DE DATOS DE PRODUCTOS
 * Aquí centralizas toda la información. Si mañana cambias un precio, 
 * solo lo editas aquí y se actualiza en todo el sitio.
 */
const productos = [
    {
        id: 1,
        nombre: "Hoja Urbana",
        talle: "S",
        precio: 39000,
        imagen: "../assets/catalogo/hoja_urbana.jpg"
    },
    {
        id: 2,
        nombre: "Army",
        talle: "S",
        precio: 52000,
        imagen: "../assets/catalogo/militar.jpg" 
    },
    {
        id: 3,
        nombre: "Rider",
        talle: "M",
        precio: 35000,
        imagen: "../assets/catalogo/rider_web.jpg"
    },
    {
        id: 4,
        nombre: "Saco Flora",
        talle: "S",
        precio: 32000,
        imagen: "../assets/catalogo/floral.jpg"
    },
    {
        id: 5,
        nombre: "Dakota",
        talle: "L",
        precio: 42000,
        imagen: "../assets/catalogo/dakota.jpg"
    },
    {
        id: 6,
        nombre: "Blazer Glow",
        talle: "S",
        precio: 42000,
        imagen: "../assets/catalogo/glow_web.jpg"
    },
    {
        id: 7,
        nombre: "Parisina",
        talle: "M",
        precio: 38000,
        imagen: "../assets/catalogo/parisina.jpg"
    },
    {
        id: 8,
        nombre: "Black Shine",
        talle: "L",
        precio: 36000,
        imagen: "../assets/catalogo/black_shine.jpg"
    },
    {
        id: 9,
        nombre: "Wings",
        talle: "S",
        precio: 38000,
        imagen: "../assets/catalogo/wings_web.jpg"
    },
    {
        id: 10,
        nombre: "Geo-Nude",
        talle: "M",
        precio: 36000,
        imagen: "../assets/catalogo/geonude_web.jpg"
    },
    {
        id: 11,
        nombre: "Encanto Verde",
        talle: "L",
        precio: 29000,
        imagen: "../assets/catalogo/encanto.jpg"
    },
    {
        id: 12,
        nombre: "Salvaje",
        talle: "M",
        precio: 28000,
        imagen: "../assets/catalogo/salvaje.jpg"
    },
    {
        id: 13,
        nombre: "Eclipse",
        talle: "M",
        precio: 28000,
        imagen: "../assets/catalogo/eclipse.jpg"
    },
    {
        id: 14,
        nombre: "Perla",
        talle: "M",
        precio: 46000,
        imagen: "../assets/catalogo/perla.jpg"
    },
    {
        id: 15,
        nombre: "Zebra",
        talle: "S",
        precio: 38500,
        imagen: "../assets/catalogo/zebra.jpg"
    },
    {
        id: 16,
        nombre: "Marrón Bicolor",
        talle: "M",
        precio: 40000,
        imagen: "../assets/catalogo/bicolor.jpg"
    },
];

/**
 * 2. SELECCIÓN DEL CONTENEDOR
 * Buscamos el div en el HTML donde se insertarán las tarjetas.
 */
const contenedor = document.querySelector("#catalogo-container");

/**
 * 3. FUNCIÓN PRINCIPAL (RENDERIZADO)
 * Esta función recorre el array y genera el HTML dinámicamente.
 */
function renderizarCatalogo(listaProductos) {
    // Vaciamos el contenedor por si hay contenido previo
    contenedor.innerHTML = "";

    // Usamos .forEach para iterar sobre cada objeto del array
    listaProductos.forEach(producto => {
        
        // Creamos el elemento div que contendrá la tarjeta
        const card = document.createElement("div");
        card.classList.add("product-card");

        // Rellenamos la tarjeta con Template Literals (comillas invertidas ``)
        // Usamos ${} para insertar las variables del objeto
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p class="talle">Talle: ${producto.talle}</p>
                <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
            </div>
        `;

        // Agregamos la tarjeta al contenedor principal
        contenedor.appendChild(card);
    });
}

/**
 * 4. EJECUCIÓN
 * Llamamos a la función cuando el DOM esté listo.
 */
document.addEventListener("DOMContentLoaded", () => {
    renderizarCatalogo(productos);
});

// Seleccionamos los elementos del Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

// Usamos delegación de eventos para capturar el clic en cualquier imagen del catálogo
contenedor.addEventListener('click', (e) => {
    // Si lo que clickeamos es una imagen dentro de una product-card
    if (e.target.tagName === 'IMG' && e.target.closest('.product-card')) {
        lightbox.style.display = 'flex'; // Mostramos el fondo
        lightboxImg.src = e.target.src;  // Pasamos la ruta de la imagen
    }
});

// Función para cerrar al hacer clic en la "X" o en el fondo oscuro
const cerrarLightbox = () => {
    lightbox.style.display = 'none';
};

closeBtn.addEventListener('click', cerrarLightbox);

// Cerrar también si hacen clic en el fondo oscuro (fuera de la imagen)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        cerrarLightbox();
    }
});