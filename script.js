let piezas = [];
let paletaColores = [
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
  "rgb(140, 35, 11)"
];
function setup() {
  createCanvas(720, 1020);
  background(255);
  angleMode(DEGREES);
  noStroke();
}
wi
function draw() {
  background(255);
  piezas.sort((a, b) => a.capa - b.capa);
  for (let p of piezas) {
    p.dibujar();
  }
}
function mousePressed() {
  let nuevaPieza;

  if (keyIsDown(SHIFT)) {
    nuevaPieza = crearPiezaAguda();         // AGUDO
  } else if (keyIsDown(CONTROL)) {
    nuevaPieza = crearPiezaTranslucida();   // VOLUMEN BAJO
  } else if (keyIsDown(ALT)) {
    nuevaPieza = crearPiezaContundente();   // VOLUMEN ALTO
  } else {
    nuevaPieza = crearPiezaGrave();         // GRAVE
  }
  piezas.push(nuevaPieza);
}
function keyPressed() {
  if (key === 's' || key === 'S') {
    piezas = []; // SHHH: desarma todo
  }
}
function colorAleatorio() {
  return color(paletaColores[int(random(paletaColores.length))]);
}
function crearPiezaAguda() {
  return {
    capa: 4,
    dibujar: function() {
      fill(colorAleatorio());
      push();
      translate(random(width), random(height));
      rotate(random(45, 135));
      triangle(0, 0, 20, 50, 40, 0);
      pop();
    }
  };
}
function crearPiezaTranslucida() {
  return {
    capa: 2,
    x: random(width),
    y: random(height),
    velocidadX: random(-0.5, 1.3), // velocidad baja
    velocidadY: random(-0.5, 1.3), // velocidad baja
    tam: random(60, 100),
    c: colorAleatorio(),
    dibujar: function () {
      let c = color(this.c);
      c.setAlpha(60);
      fill(c);
      ellipse(this.x, this.y, this.tam);
      this.x += this.velocidadX;
      this.y += this.velocidadY;
    },
  };
}

function crearPiezaContundente() {
  let puntos = [];
  let x = random(width);
  let y = random(height);
  let vx = random(-0.3, 0.5);
  let vy = random(-0.3, 0.5);
  let tam = random(50, 200);
  for (let i = 0; i < 5; i++) {
    puntos.push({
      dx: random(-tam, tam),
      dy: random(-tam, tam)
    });
  }
  return {
    capa: 5,
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    puntos: puntos,
    c: colorAleatorio(),
    dibujar: function() {
      fill(this.c);
      beginShape();
      for (let p of this.puntos) {
        vertex(this.x + p.dx, this.y + p.dy);
      }
      endShape(CLOSE);
      this.x += this.vx;
      this.y += this.vy;
    }
  };
}

function crearPiezaGrave() {
  return {
    capa: 1,
    x: random(width),
    y: random(height),
    w: random(100, 150),
    h: random(100, 150),
    vx: random(-1, 1), 
    vy: random(-1, 1), 
    c: colorAleatorio(),
    dibujar: function() {
      fill(this.c);
      rect(this.x, this.y, this.w, this.h);
      this.x += this.vx;
      this.y += this.vy;
    }
  };
}
