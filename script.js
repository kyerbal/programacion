const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Ajustar tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// colores
const colors = [
 "rgb(22, 52, 64)",
  "rgb(57, 64, 57)",
  "rgb(191, 128, 11)",
  "rgb(166, 95, 8)",
  "rgb(166, 39, 10)",
  "rgb(8, 66, 89)",
  "rgb(57, 64, 57)",
  "rgb(166, 114, 18)",
  "rgb(166, 95, 8)",
  "rgb(166, 39, 10)",
  "rgb(28, 37, 38)",
  "rgb(140, 82, 11)",
  "rgb(166, 39, 10)",
  "rgb(140, 35, 11)",
  "rgb(166, 114, 18)",
  "rgb(89, 72, 39)",
  "rgb(140, 35, 11)",
];

const imagePaths = {
  triangle: ["img/triangulo1.png", "img/triangulo2.png", "img/triangulo3.png"],
  square: ["img/cuadrado1.png","img/cuadrado2.png","img/cuadrado3.png"],
};

const imageObjects = { triangle: [], square: [] };
const visuals = [];
const scaleFactor = 4;

// carga imagenes 
Object.entries(imagePaths).forEach(([type, paths]) => {
  paths.forEach((path) => {
    const img = new Image();
    img.src = path;
    imageObjects[type].push(img);
  });
});

// lo hace aleatorio
function createRandomVisual() {
  const shapeType = Math.random() > 0.1 ? "triangle" : "square";
  const images = imageObjects[shapeType];
  const image = images[Math.floor(Math.random() * images.length)];

  visuals.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: (shapeType === "square" ? 150 : 80) * scaleFactor,
    alpha: 1, // opaco
    angle: Math.random() * Math.PI * 1.2,
    image: image,
    tintColor: colors[Math.floor(Math.random() * colors.length)],
  });
}

// tinte
function drawTintedImage(image, x, y, size, angle, tintColor, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Dibujar imagen base
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, -size / 2, -size / 2, size, size);

  // Aplicar tinte mate
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = tintColor;
  ctx.fillRect(-size / 2, -size / 2, size, size);

  // Restaurar contexto
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

// --- Animación principal ---
function drawVisuals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  visuals.forEach((v) => {
    drawTintedImage(v.image, v.x, v.y, v.size, v.angle, v.tintColor, v.alpha);
  });

  requestAnimationFrame(drawVisuals);
}

// --- Iniciar ---
drawVisuals();
setInterval(createRandomVisual, 0.01* 1000);
