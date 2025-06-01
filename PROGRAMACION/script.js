const figuras = document.querySelectorAll(".img");
const chicos = document.querySelectorAll(".triangulo-chico");
const grandes = document.querySelectorAll(".triangulo-grande");
const cuadrados = document.querySelectorAll(".cuadrado");

// Aplicamos un filtro (tintado) desde el inicio
chicos.forEach((f) => {
  f.style.filter = "hue-rotate(45deg) saturate(2)";
});

grandes.forEach((f) => {
  f.style.filter = "hue-rotate(0deg) saturate(2) brightness(1.1)";
});

cuadrados.forEach((f) => {
  f.style.filter = "hue-rotate(200deg) saturate(2)";
});

// Control de opacidad por posición del mouse
document.addEventListener("mousemove", (e) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const x = e.clientX;
  const y = e.clientY;


  figuras.forEach((f) => {
    if (!f.classList.contains("textura")) {
      f.style.opacity = "0.3";
    }
  });

  if (x < width / 2 && y < height / 2) {
    // Parte superior izquierda: triángulos chicos
    chicos.forEach((f) => (f.style.opacity = "1"));
  } else if (x >= width / 2) {
    // Mitad derecha: cuadrados
    cuadrados.forEach((f) => (f.style.opacity = "1"));
  } else if (x < width / 2 && y >= height / 2) {
    // Parte inferior izquierda: triángulos grandes
    grandes.forEach((f) => (f.style.opacity = "1"));
  }
});
