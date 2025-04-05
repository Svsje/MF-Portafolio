//Generar numero secreto con una funcion
function generarNumeroSecreto() {
    return Math.floor(Math.random() * 10) + 1;
  }

let numeroSecreto = generarNumeroSecreto(); 
let intentos = 0; //Contador

//Sounds load
const failsound = document.getElementById("fail")
const winsound = document.getElementById("win")


document.getElementById("formPlay").addEventListener("submit", function(e) {
  e.preventDefault(); // Evita que la página se recargue

  const numeroElegido = document.getElementById("numeroIngresado");
  const mensaje = document.getElementById("mensaje");
  const adivinar = Number(numeroElegido.value);

  if (!adivinar || adivinar < 1 || adivinar > 10) {
    alert("Por favor, ingresa un número válido entre 1 y 10.");
    return;
  }

  intentos++;
  numeroElegido.value = "";

  if (adivinar === numeroSecreto) {
    mensaje.textContent = ` ¡Adivinaste el número secreto es: ${numeroSecreto}, en ${intentos} intento${intentos > 1 ? "s" : ""}!`;
    winsound.play()
    fireworks.start();

  } else if (adivinar < numeroSecreto) {
    mensaje.textContent = "El número secreto es mayor.";
    failsound.play()
  } else {
    mensaje.textContent = "El número secreto es menor.";
    failsound.play()
  }
});

function nuevoJuego() {
    numeroSecreto = generarNumeroSecreto();
    intentos = 0;
    document.getElementById("mensaje").textContent = "";
    document.getElementById("numeroIngresado").value = "";
}
