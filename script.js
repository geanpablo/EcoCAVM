let productos = [
    {
        id: 1,
        titulo: "Sacos de papa",
        tipo: "oferta",
        precioOriginal: "S/ 50.00",
        precioOferta: "S/ 46.00",
        negocio: "Frutería Don Pedro",
        telefono: "920305486",
        imagen: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80",
        lat: -13.0308,
        lng: -75.3125
    },
    {
        id: 2,
        titulo: "Pan del día (bolsa de 20 un.)",
        tipo: "oferta",
        precioOriginal: "S/ 10.00",
        precioOferta: "S/8.00",
        negocio: "Panadería el chino",
        telefono: "920305486",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKXLQ65Gjb93-stJVn-9E0Twjr2Ai3F-z4Hh6o5weUag&s=10",
        lat: -13.0315,
        lng: -75.3130
    },
    {
        id: 3,
        titulo: "Caja de Naranjas (10 kg)",
        tipo: "oferta",
        precioOriginal: "S/ 25.00",
        precioOferta: "S/ 18.00",
        negocio: "Bodega La Esquina",
        telefono: "920305486",
        imagen: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&q=80",
        lat: -13.0322,
        lng: -75.3118
    },
    {
        id: 4,
        titulo: "Queso Andino Fresco (1 kg)",
        tipo: "oferta",
        precioOriginal: "S/ 22.00",
        precioOferta: "S/ 20.00",
        negocio: "Lácteos San Martín",
        telefono: "920305486",
        imagen: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=300&q=80",
        lat: -13.0302,
        lng: -75.3138
    },
    {
        id: 5,
        titulo: "Saco de Maíz Blanco",
        tipo: "oferta",
        precioOriginal: "S/ 40.00",
        precioOferta: "S/ 36.00",
        negocio: "Comercial Don Lucho",
        telefono: "920305486",
        imagen: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80",
        lat: -13.0328,
        lng: -75.3122
    },
    {
        id: 6,
        titulo: "Verduras Surtidas (Lote)",
        tipo: "oferta",
        precioOriginal: "S/ 8.00",
        precioOferta: "S/ 7.00",
        negocio: "Verdulería Doña María",
        telefono: "920305486",
        imagen: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80",
        lat: -13.0310,
        lng: -75.3142
    },
    {
        id: 7,
        titulo: "Miel Orgánica (500ml)",
        tipo: "oferta",
        precioOriginal: "S/ 25.00",
        precioOferta: "S/ 20.00",
        negocio: "Apícola Aurahua",
        telefono: "920305486",
        imagen: "https://dcdn-us.mitiendanube.com/stores/001/902/109/products/miel11-eff4dbebbeecfa831d16524506568641-640-0.webp",
        lat: -13.0332,
        lng: -75.3132
    },
    {
        id: 8,
        titulo: "Sacos de Yuca Limpios",
        tipo: "trueque",
        precioOriginal: "Trueque",
        precioOferta: "Por Botellas PET",
        negocio: "Comercio Ramos",
        telefono: "920305486",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy-Ir5ye3i0froFfuFCRaetdY5713zBxr0oGGna9BCvDj0FnxmJ_RfJnA&s=10",
        lat: -13.0318,
        lng: -75.3112
    },
    {
        id: 9,
        titulo: "Estiércol Orgánico (2 sacos)",
        tipo: "trueque",
        precioOriginal: "Trueque",
        precioOferta: "Por leña o herramientas",
        negocio: "Granja Esperanza",
        telefono: "920305486",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCDXwlbYEpgAbxwSgxfh5p9B46RwTtpWGbfO3YroLR-Q&s=10",
        lat: -13.0298,
        lng: -75.3120
    }
];

let mapa;
let clusterGroup;
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

function crearIcono(tipo) {
    const color = tipo === 'oferta' ? '#b5502e' : '#3c5a45';
    const icono = tipo === 'oferta' ? 'fa-tag' : 'fa-right-left';
    return L.divIcon({
        className: 'pin-eco',
        html: `<div class="pin-eco-inner" style="background:${color}"><i class="fa-solid ${icono}"></i></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30]
    });
}

function initMapa() {
    mapa = L.map('map', { zoomControl: true }).setView([-13.0315, -75.3128], 17);

    const capaCalles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 20
    }).addTo(mapa);

    const capaSatelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
        maxNativeZoom: 16
    });

    capaSatelite.on('tileerror', () => {
        if (mapa.hasLayer(capaSatelite)) {
            mapa.removeLayer(capaSatelite);
            mapa.addLayer(capaCalles);
        }
    });

    L.control.layers({ "Calles": capaCalles, "Satélite": capaSatelite }, {}, { position: 'topright' }).addTo(mapa);

    clusterGroup = L.markerClusterGroup({ spiderfyOnMaxZoom: true, maxClusterRadius: 45 });
    mapa.addLayer(clusterGroup);

    const controlUbicar = L.control({ position: 'bottomright' });
    controlUbicar.onAdd = function () {
        const div = L.DomUtil.create('div', 'btn-locate');
        div.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
        div.onclick = () => mapa.locate({ setView: true, maxZoom: 17 });
        return div;
    };
    controlUbicar.addTo(mapa);

    mapa.on('locationfound', e => {
        L.marker(e.latlng).addTo(mapa).bindPopup('Estás aquí').openPopup();
    });

    setTimeout(() => { mapa.invalidateSize(); }, 300);
    mostrarProductos(productos);
}

function mostrarProductos(lista) {
    const contenedor = document.getElementById("product-list");
    contenedor.innerHTML = "";

    if (clusterGroup) clusterGroup.clearLayers();
    marcadores = [];

    if (lista.length === 0) {
        contenedor.innerHTML = `<p style="color:#6b625a; padding: 10px 0;">Aún no hay publicaciones en esta categoría.</p>`;
    }

    lista.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${prod.imagen || 'https://via.placeholder.com/80'}" alt="${prod.titulo}" class="card-img" />
            <div class="card-content">
                <span class="badge-tag ${prod.tipo}">${prod.tipo.toUpperCase()}</span>
                <h4>${prod.titulo}</h4>
                <p class="negocio"><i class="fa-solid fa-store"></i> ${prod.negocio}</p>
                <p class="precios"><del>${prod.precioOriginal}</del> <strong>${prod.precioOferta}</strong></p>
            </div>
            <button class="btn-qr" onclick="reservar(${prod.id})"><i class="fa-solid fa-qrcode"></i> Reservar</button>
        `;
        contenedor.appendChild(card);

        if (mapa) {
            const marker = L.marker([prod.lat, prod.lng], { icon: crearIcono(prod.tipo) })
                .bindPopup(`
                    <div class="popup-eco">
                        <img src="${prod.imagen || 'https://via.placeholder.com/80'}" style="width:100%; height:80px; object-fit:cover; border-radius:6px; margin-bottom:8px;" />
                        <span class="badge-tag ${prod.tipo}">${prod.tipo.toUpperCase()}</span>
                        <h4>${prod.titulo}</h4>
                        <p class="negocio"><i class="fa-solid fa-store"></i> ${prod.negocio}</p>
                        <p class="precios"><del>${prod.precioOriginal}</del> <strong>${prod.precioOferta}</strong></p>
                        <button class="btn-qr-popup" onclick="reservar(${prod.id})">Reservar</button>
                    </div>
                `);
            clusterGroup.addLayer(marker);
            marcadores.push(marker);
        }
    });

    if (marcadores.length > 0) {
        const grupo = L.featureGroup(marcadores);
        mapa.fitBounds(grupo.getBounds().pad(0.2));
    }
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

    document.getElementById("reserva-producto").textContent = prod.titulo;
    document.getElementById("reserva-negocio").textContent = prod.negocio;
    document.getElementById("reserva-codigo").textContent = `#${codigo}`;

    const btnWhatsapp = document.getElementById("btn-whatsapp-reserva");
    const telefono = (prod.telefono || "").replace(/\D/g, "");

    if (telefono) {
        const mensaje = encodeURIComponent(
            `Hola, reservé "${prod.titulo}" en ${prod.negocio} (código ${codigo}). ¿Confirmamos el horario de recojo?`
        );
        btnWhatsapp.href = `https://wa.me/51${telefono}?text=${mensaje}`;
        btnWhatsapp.style.display = "flex";
    } else {
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

    const inputImg = document.getElementById("reg-imagen");

    datosTemp = {
        titulo: document.getElementById("reg-titulo").value,
        negocio: document.getElementById("reg-negocio").value,
        telefono: document.getElementById("reg-telefono").value.trim(),
        tipo: document.getElementById("reg-tipo").value,
        precioOriginal: document.getElementById("reg-original").value,
        precioOferta: document.getElementById("reg-oferta").value,
        imagen: inputImg && inputImg.value ? inputImg.value : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"
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
        imagen: datosTemp.imagen,
        lat: -13.0315 + (Math.random() - 0.5) * 0.003,
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