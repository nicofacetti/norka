// 1. CONFIGURACIÓN INICIAL
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSBGX0VLGKlV3Ld98VnAbeOXTdZka3NyHXhRO21YMdUidKMLnF1Eg1B1n47JBV22cLjbinzHSX-7fmX/pub?gid=0&single=true&output=csv"; // Recordá que debe ser la de "Publicar en la Web" como .csv
const RUTA_CARPETA_IMAGENES = "../assets/catalogo/";

// 2. ELEMENTOS DEL DOM
const contenedor = document.querySelector("#catalogo-container");
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

/**
 * 3. FUNCIÓN: CARGAR DATOS DESDE GOOGLE SHEETS
 */
async function cargarDatosDesdeSheet() {
    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        complete: (results) => {
            const datosSucios = results.data;
            const productosLimpios = datosSucios.map(fila => {
            // 1. Tomamos el valor de la columna (ej: "$ 39.500,00")
            let precioTexto = fila.Precio || "0";

            // 2. Cortamos el texto donde aparezca la coma para eliminar los centavos
            // "39.500,00" se convierte en "39.500"
            let sinDecimales = precioTexto.split(",")[0];

            // 3. Ahora sí, quitamos todo lo que NO sea un número (puntos, símbolos, espacios)
            // "39.500" se convierte en "39500"
            let precioLimpio = sinDecimales.replace(/[^\d]/g, "");

            return {
                nombre: fila.Producto,
                talle: fila.Talle,
                precio: parseInt(precioLimpio) || 0,
                imagen: `${RUTA_CARPETA_IMAGENES}${fila.Imagen}`
            };
        });

            renderizarCatalogo(productosLimpios);
        },
        error: (err) => {
            console.error("Error al parsear el CSV:", err);
        }
    });
}

/**
 * 4. FUNCIÓN: DIBUJAR EL CATÁLOGO EN EL HTML
 */
function renderizarCatalogo(lista) {
    contenedor.innerHTML = "";
    
    lista.forEach(prod => {
        if (!prod.nombre) return; // Salta filas vacías si las hay en el Excel

        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
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
// Abrir el zoom al hacer clic en cualquier imagen del contenedor
contenedor.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        lightbox.style.display = 'flex';
        lightboxImg.src = e.target.src;
        lightboxImg.alt = e.target.alt;
    }
});

// Función para cerrar el lightbox
const cerrarLightbox = () => {
    lightbox.style.display = 'none';
};

// Cerrar con el botón X
closeBtn.addEventListener('click', cerrarLightbox);

// Cerrar al hacer clic fuera de la imagen (en el fondo oscuro)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        cerrarLightbox();
    }
});

// Cerrar con la tecla Escape (opcional, muy profesional)
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") cerrarLightbox();
});

// 6. INICIO
cargarDatosDesdeSheet();