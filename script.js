let monitor = false;

let mic;
let audioContext;
let gestorI, gestorPitch;
let pitch; 

let minimoI = 0.0;
let maximoI = 0.5;

let minNota = 30;
let maxNota = 90;

let notaAcustica = 0.60; 
let duracionAcustica = 1.5;  
let umbral = 0.03;

let c;

let multi = 4;
let antesHabiaSonido = false;

const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

let tiempoInicio = 0;
let imagenesAgudas = [];
let imagenesGraves = [];
let imagenesCortas = [];
let imagenesLargas = [];

let indiceImagen = 0;

function preload() {
  for (let i = 0; i < 7; i++) {
    imagenesAgudas.push(loadImage(`img/Agudas/agudo0${i}.png`));
    imagenesGraves.push(loadImage(`img/Graves/grave0${i}.png`));
    imagenesCortas.push(loadImage(`img/Corto/corta0${i}.png`));
    imagenesLargas.push(loadImage(`img/Largo/larga0${i}.png`));
  }
}

function setup() {
  createCanvas(656, 1020);
  background(255);
  angleMode(DEGREES);
  noStroke();

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);

  userStartAudio();

  gestorI = new GestorSenial(minimoI, maximoI);
  gestorPitch = new GestorSenial(minNota, maxNota);
}

function draw() {
  let intensidad = mic.getLevel();
  gestorI.actualizar(intensidad);

  let haySonido = gestorI.filtrada > umbral;
  let empezoElSonido = !antesHabiaSonido && haySonido;
  let terminaElSonido = antesHabiaSonido && !haySonido;

  if (empezoElSonido) {
    tiempoInicio = millis();
  }

  if (terminaElSonido) {
    let duracion = (millis() - tiempoInicio) / 1000.0;
    let notaActual = gestorPitch.filtrada;
    imageMode(CENTER);
    let x = width / 2;
    let y = height / 2;
    

    // IMAGEN AGUDA
    if (notaActual > notaAcustica) {
      let i = indiceImagen % imagenesAgudas.length;
      let paleta = random([colorBlancoGris, colorNegroGris]);
      let [r, g, b] = paleta(notaActual, duracion);
      tint(r, g, b, 200);
      image(imagenesAgudas[i], x, y);
      console.log(`Nota aguda: ${notaActual.toFixed(2)}, Duración: ${duracion.toFixed(2)}`);
    }

    // IMAGEN GRAVE
    if (notaActual < notaAcustica) {
      let i = indiceImagen % imagenesGraves.length;
      let paleta = random([colorAzulOscuro, colorAzulClaro]);
      let [r, g, b] = paleta(notaActual, duracion);
      tint(r, g, b, 200);
      image(imagenesGraves[i], x, y);
      console.log(`Nota grave: ${notaActual.toFixed(2)}, Duración: ${duracion.toFixed(2)}`);
    }

    // IMAGEN CORTA
    if (duracion < duracionAcustica) {
      let i = indiceImagen % imagenesCortas.length;
      let paleta = random([colorOcre, colorNaranja]);
      let [r, g, b] = paleta(notaActual, duracion);
      tint(r, g, b, 200);
      image(imagenesCortas[i], x, y);
      console.log(`Duración corta: ${duracion.toFixed(2)}s`);
    }

    // IMAGEN LARGA
    if (duracion > duracionAcustica) {
      let i = indiceImagen % imagenesLargas.length;
      let paleta = random([colorBordo, colorRojo]);
      let [r, g, b] = paleta(notaActual, duracion);
      tint(r, g, b, 200);
      image(imagenesLargas[i], x, y);
      console.log(`Duración larga: ${duracion.toFixed(2)}s`);
    }

    tint(255, 255);
    indiceImagen++;
  }

  if (monitor === true) {
    gestorI.dibujar(100, 100);
    gestorPitch.dibujar(100, 300);
  }

  antesHabiaSonido = haySonido;
}

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      let numeroDeNota = freqToMidi(frequency);
      gestorPitch.actualizar(numeroDeNota);
    }
    getPitch();
  });
}


function colorBordo(nota, duracion) {
  let r = map(nota, 40, 80, 88, 40);
  let g = map(nota, 40, 80, 27, 0);
  let b = map(nota, 40, 80, 33, 20);
  return [r, g, b];
}

function colorRojo(nota, duracion) {
  let r = map(nota, 40, 80, 154, 80);
  let g = map(nota, 40, 80, 46, 20);
  let b = map(nota, 40, 80, 37, 20);
  return [r, g, b];
}

function colorAzulOscuro(nota, duracion) {
  let r = map(nota, 40, 80, 24, 10);
  let g = map(nota, 40, 80, 48, 30);
  let b = map(nota, 40, 80, 70, 50);  
  return [r, g, b];
}

function colorAzulClaro(nota, duracion) {
  let r = map(nota, 40, 80, 150, 110);  
  let g = map(nota, 40, 80, 160, 120);   
  let b = map(nota, 40, 80, 180, 140);   
  return [r, g, b];
}



function colorOcre(nota, duracion) {
  let r = map(nota, 40, 80, 191, 120);
  let g = map(nota, 40, 80, 136, 80);
  let b = map(nota, 40, 80, 60, 30);
  return [r, g, b];
}

function colorNaranja(nota, duracion) {
  let r = map(nota, 40, 80, 255, 180);  
  let g = map(nota, 40, 80, 100, 50);   
  let b = map(nota, 40, 80, 20, 10);   
  return [r, g, b];
}


function colorNegroGris(nota, duracion) {
  let r = map(nota, 40, 80, 40, 10);
  let g = map(nota, 40, 80, 40, 10);
  let b = map(nota, 40, 80, 40, 10);
  return [r, g, b];
}

function colorBlancoGris(nota, duracion) {
  let r = map(nota, 40, 80, 228, 180);
  let g = map(nota, 40, 80, 227, 180);
  let b = map(nota, 40, 80, 224, 180);
  return [r, g, b];
}
