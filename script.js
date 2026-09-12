let productos = [
    {
        id: 1,
        titulo: "Caja de Plátanos Excedentes",
        tipo: "oferta",
        precioOriginal: "S/ 30.00",
        precioOferta: "S/ 15.00",
        negocio: "Frutería Don Pedro",
        telefono: "987654321",
        lat: -13.0305,
        lng: -75.3128
    },
    {
        id: 2,
        titulo: "Pan del día (Lote de 20 un.)",
        tipo: "oferta",
        precioOriginal: "S/ 10.00",
        precioOferta: "S/ 4.00",
        negocio: "Panadería El Sol",
        telefono: "987123456",
        lat: -13.0298,
        lng: -75.3135
    },
    {
        id: 3,
        titulo: "Sacos de Yute Limpios",
        tipo: "trueque",
        precioOriginal: "Trueque",
        precioOferta: "Por Botellas PET",
        negocio: "Comercio Ramos",
        telefono: "987999888",
        lat: -13.0312,
        lng: -75.3120
    }
];

let mapa;
let marcadores = [];
let mapaInicializado = false;
let datosTemp = null;

function navegar(seccion) {
    document.querySelectorAll('.seccion-pantalla').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`sec-${seccion}`).classList.add('active');

    const linkActivo = document.getElementById(`link-${seccion}`);
    if (linkActivo) linkActivo.classList.add('active');

    if (seccion === 'ofertas') {
        if (!mapaInicializado) {
            initMapa();
            mapaInicializado = true;
        } else {
            setTimeout(() => { mapa.invalidateSize(); }, 200);
        }
    }
}

function initMapa() {
    mapa = L.map('map').setView([-13.0305, -75.3128], 17);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }).addTo(mapa);

    setTimeout(() => { mapa.invalidateSize(); }, 300);
    mostrarProductos(productos);
}

function mostrarProductos(lista) {
    const contenedor = document.getElementById("product-list");
    contenedor.innerHTML = "";

    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];

    if (lista.length === 0) {
        contenedor.innerHTML = `<p style="color:#6b625a; padding: 10px 0;">Aún no hay publicaciones en esta categoría.</p>`;
    }

    lista.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div>
                <span class="badge-tag ${prod.tipo}">${prod.tipo.toUpperCase()}</span>
                <h4>${prod.titulo}</h4>
                <p class="negocio"><i class="fa-solid fa-store"></i> ${prod.negocio}</p>
                <p class="precios"><del>${prod.precioOriginal}</del> <strong>${prod.precioOferta}</strong></p>
            </div>
            <button class="btn-qr" onclick="reservar(${prod.id})"><i class="fa-solid fa-qrcode"></i> Reservar</button>
        `;
        contenedor.appendChild(card);

        if (mapa) {
            const marker = L.marker([prod.lat, prod.lng]).addTo(mapa)
                .bindPopup(`<b>${prod.titulo}</b><br>${prod.negocio}<br><b>${prod.precioOferta}</b>`);
            marcadores.push(marker);
        }
    });
}

function filtrarProductos(categoria, elemento) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    elemento.classList.add('active');

    if (categoria === 'todos') {
        mostrarProductos(productos);
    } else {
        const filtrados = productos.filter(p => p.tipo === categoria);
        mostrarProductos(filtrados);
    }
}

function reservar(id) {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    const codigo = `ECO-${id}992`;

    // Rellenar datos en el modal
    document.getElementById("reserva-producto").textContent = prod.titulo;
    document.getElementById("reserva-negocio").textContent = prod.negocio;
    document.getElementById("reserva-codigo").textContent = `#${codigo}`;

    // Armar el link de WhatsApp con mensaje prellenado
    const btnWhatsapp = document.getElementById("btn-whatsapp-reserva");
    const telefono = (prod.telefono || "").replace(/\D/g, ""); // solo dígitos

    if (telefono) {
        const mensaje = encodeURIComponent(
            `Hola, reservé "${prod.titulo}" en ${prod.negocio} (código ${codigo}). ¿Confirmamos el horario de recojo?`
        );
        btnWhatsapp.href = `https://wa.me/51${telefono}?text=${mensaje}`;
        btnWhatsapp.style.display = "flex";
    } else {
        // Si el negocio no registró teléfono, ocultamos el botón
        btnWhatsapp.style.display = "none";
    }

    document.getElementById("modal-reserva").style.display = "flex";
}

function cerrarModalReserva() {
    document.getElementById("modal-reserva").style.display = "none";
}

function abrirModal() {
    document.getElementById("modal-registro").style.display = "flex";
    document.getElementById("paso-datos").style.display = "block";
    document.getElementById("paso-pago").style.display = "none";
}

function cerrarModal() {
    document.getElementById("modal-registro").style.display = "none";
}

function irAPago(e) {
    e.preventDefault();

    datosTemp = {
        titulo: document.getElementById("reg-titulo").value,
        negocio: document.getElementById("reg-negocio").value,
        telefono: document.getElementById("reg-telefono").value.trim(),
        tipo: document.getElementById("reg-tipo").value,
        precioOriginal: document.getElementById("reg-original").value,
        precioOferta: document.getElementById("reg-oferta").value
    };

    document.getElementById("paso-datos").style.display = "none";
    document.getElementById("paso-pago").style.display = "block";
}

function volverADatos() {
    document.getElementById("paso-pago").style.display = "none";
    document.getElementById("paso-datos").style.display = "block";
}

function confirmarPago(e) {
    e.preventDefault();

    const operacion = document.getElementById("pago-operacion").value.trim();
    if (!operacion) return;

    const nuevo = {
        id: productos.length + 1,
        titulo: datosTemp.titulo,
        negocio: datosTemp.negocio,
        telefono: datosTemp.telefono,
        tipo: datosTemp.tipo,
        precioOriginal: datosTemp.precioOriginal,
        precioOferta: datosTemp.precioOferta,
        lat: -13.0305 + (Math.random() - 0.5) * 0.003,
        lng: -75.3128 + (Math.random() - 0.5) * 0.003
    };

    productos.unshift(nuevo);

    if (mapaInicializado) {
        mostrarProductos(productos);
    }

    cerrarModal();
    document.getElementById("form-registro").reset();
    document.getElementById("form-pago").reset();
    datosTemp = null;
    navegar('ofertas');
    alert(`¡Pago confirmado (operación ${operacion})!\n\nTu producto ya está publicado.`);
}