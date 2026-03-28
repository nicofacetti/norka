// 1. CONFIGURACIÓN
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSBGX0VLGKlV3Ld98VnAbeOXTdZka3NyHXhRO21YMdUidKMLnF1Eg1B1n47JBV22cLjbinzHSX-7fmX/pub?output=csv"; // REEMPLAZA CON TU LINK DE CSV
const RUTA_CARPETA_IMAGENES = "../assets/catalogo/";

// 2. ELEMENTOS DEL DOM
const contenedor = document.querySelector("#catalogo-container");
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

/**
 * 3. CARGAR DATOS DESDE GOOGLE SHEETS
 */
async function cargarDatosDesdeSheet() {
    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        complete: (results) => {
            console.log("DATOS QUE LLEGAN DEL EXCEL:", results.data); 

            const datosSucios = results.data;


            const productosLimpios = datosSucios.map(fila => {
                // Limpieza de precio para evitar NaN
                let precioTexto = fila.Precio || "0";
                let sinDecimales = precioTexto.split(",")[0];
                let precioLimpio = sinDecimales.replace(/[^\d]/g, "");

                // Capturamos el estado (Disponible, Vendido, Reservado)
                // Usamos toLowerCase() para que no importe si escribís "Vendido" o "vendido"
                let estadoProducto = fila.Estado ? fila.Estado.toLowerCase().trim() : "disponible";

                return {
                    nombre: fila.Producto,
                    talle: fila.Talle,
                    precio: parseInt(precioLimpio) || 0,
                    imagen: `${RUTA_CARPETA_IMAGENES}${fila.Imagen}`,
                    estado: estadoProducto
                };
            });

            renderizarCatalogo(productosLimpios);
        },
        error: (err) => {
            console.error("Error al leer el Excel:", err);
        }
    });
}

/**
 * 4. RENDERIZAR EL CATÁLOGO
 */
function renderizarCatalogo(lista) {
    console.log("Cantidad de productos recibidos para dibujar:", lista.length);
    contenedor.innerHTML = "";
    
    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos en el Excel.</p>";
        return;
    }

    lista.forEach((prod, index) => {
        // Log para ver si cada producto tiene los datos correctos
        console.log(`Producto ${index}:`, prod);

        if (!prod.nombre) {
            console.warn(`El producto en el índice ${index} no tiene nombre y fue saltado.`);
            return;
        }

        let etiquetaHTML = "";
        if (prod.estado === "vendido" || prod.estado === "reservado") {
            etiquetaHTML = `<div class="badge ${prod.estado}">${prod.estado.toUpperCase()}</div>`;
        }

        const card = document.createElement("div");
        card.classList.add("product-card");
        if (prod.estado !== "disponible") card.classList.add("no-disponible");

        card.innerHTML = `
            <div class="image-wrapper">
                ${etiquetaHTML}
                <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${prod.nombre}</h3>
                <p>Talle: ${prod.talle}</p>
                <p class="precio">$${prod.precio.toLocaleString('es-AR')}</p>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

/**
 * 5. LÓGICA DEL LIGHTBOX (ZOOM)
 */
contenedor.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        lightbox.style.display = 'flex';
        lightboxImg.src = e.target.src;
        lightboxImg.alt = e.target.alt;
    }
});

const cerrarLightbox = () => {
    lightbox.style.display = 'none';
};

if(closeBtn) closeBtn.addEventListener('click', cerrarLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) cerrarLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") cerrarLightbox();
});

// INICIO
cargarDatosDesdeSheet();