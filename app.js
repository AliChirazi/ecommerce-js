const productos = [
    { id: 1, nombre: "Pijama 1", precio: 10000, img: "https://plataforma.iduo.com.ar/Panelcontenidos/Contenidos/Pijama-pima-1681698855-0-1.jpeg" },
    { id: 2, nombre: "Pijama 2", precio: 15000, img: "https://acdn-us.mitiendanube.com/stores/630/942/products/pijama-juana-camisero-3-d967c524015b71c91717746182967353-480-0.webp" },
    { id: 3, nombre: "Pijama 3", precio: 20000, img: "https://acdn-us.mitiendanube.com/stores/001/938/010/products/diseno-sin-titulo-59-3d03416b3eb197b06d17435418492759-1024-1024.webp" }
];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contenedor = document.getElementById("productos");

productos.forEach(prod => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
  <img src="${prod.img}" />
  <h3>${prod.nombre}</h3>
  <p>$${prod.precio}</p>
  <button>Agregar</button>
`;

    div.querySelector("button").addEventListener("click", () => {
        agregarAlCarrito(prod.id);
    });

    contenedor.appendChild(div);
});
function agregarAlCarrito(id) {
    const existe = carrito.find(prod => prod.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        const producto = productos.find(p => p.id === id);
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
}
function actualizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const total = document.getElementById("total");

    lista.innerHTML = "";

    carrito.forEach(prod => {
        const li = document.createElement("li");

        li.innerHTML = `
    ${prod.nombre} 
    <button class="restar" data-id="${prod.id}">➖</button>
    x${prod.cantidad}
    <button class="sumar" data-id="${prod.id}">➕</button>
    - $${prod.precio * prod.cantidad}
    <button class="eliminar" data-id="${prod.id}">❌</button>
  `;

        lista.appendChild(li);
    });
    // ➕ SUMAR
    document.querySelectorAll(".sumar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            cambiarCantidad(id, 1);
        });
    });

    // ➖ RESTAR
    document.querySelectorAll(".restar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            cambiarCantidad(id, -1);
        });
    });

    // ❌ ELIMINAR
    document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            eliminarProducto(id);
        });
    });
    const totalFinal = carrito.reduce(
        (acc, prod) => acc + prod.precio * prod.cantidad,
        0
    );

    total.textContent = totalFinal;
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
function cambiarCantidad(id, cambio) {
    const producto = carrito.find(prod => prod.id === id);

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        carrito = carrito.filter(prod => prod.id !== id);
    }

    actualizarCarrito();
}
function eliminarProducto(id) {
    carrito = carrito.filter(prod => prod.id !== id);

    actualizarCarrito();
}
const botonCarrito = document.getElementById("verCarrito");
const carritoHTML = document.getElementById("carrito");

botonCarrito.addEventListener("click", () => {
    carritoHTML.classList.toggle("oculto");
});

document.getElementById("finalizarCompra").addEventListener("click", () => {
    carrito = [];

    localStorage.removeItem("carrito");

    actualizarCarrito();

    alert("Compra realizada ✅");
});
actualizarCarrito();