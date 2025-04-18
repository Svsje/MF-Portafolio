const contenedor = document.getElementById("noticias-container");
const detalle = document.getElementById("detalle-noticia");

fetch("noticias.json")
  .then(res => res.json())
  .then(noticias => {
    noticias.forEach(noticia => {
      const div = document.createElement("div");
      div.className = "noticia";
      div.innerHTML = `
        <img src="${noticia.imagen}" alt="${noticia.titulo}">
        <h3>${noticia.titulo}</h3>
        <p>${noticia.descripcion}</p>
      `;
      div.onclick = () => mostrarDetalle(noticia);
      contenedor.appendChild(div);
    });
  });

function mostrarDetalle(noticia) {
  detalle.classList.remove("oculto");
  document.getElementById("detalle-titulo").innerText = noticia.titulo;
  document.getElementById("detalle-imagen").src = noticia.imagen;
  document.getElementById("detalle-contenido").innerText = noticia.contenido;
}

function cerrarDetalle() {
  detalle.classList.add("oculto");
}
