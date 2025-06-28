let monitor = true;

let mic;
let audioContext;
let gestorI, gestorPitch;

let minimoI = 0.0;
let maximoI = 0.5;

let minNota = 40;
let maxNota = 74;

let umbral = 0.05;

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
  for (let i = 0; i < 3; i++) {
    imagenesAgudas.push(loadImage(`img/Agudas/agudo0${i}.png`));
    imagenesGraves.push(loadImage(`img/Graves/grave0${i}.png`));
    imagenesCortas.push(loadImage(`img/Corto/corta0${i}.png`));
    imagenesLargas.push(loadImage(`img/Largo/larga0${i}.png`));
  }
}

function setup() {
  createCanvas(656, 1020);

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

    let x = random(width - 100);
    let y = random(height - 100);

    if (notaActual > 0.65) {
      image(imagenesAgudas[indiceImagen % imagenesAgudas.length], x, y);
      console.log("Nota aguda: " + notaActual);
    }

    if (notaActual < 0.45) {
      console.log("Nota grave: " + notaActual);
      image(imagenesGraves[indiceImagen % imagenesGraves.length], x, y);
    }

    if (duracion < 1) {
      console.log("Imagen corta: " + duracion);
      image(imagenesCortas[indiceImagen % imagenesCortas.length], x, y);
    } else if (duracion > 3) {
      image(imagenesLargas[indiceImagen % imagenesLargas.length], x, y);
      console.log("Imagen larga: " + duracion);
    }

    indiceImagen++;
  }

  if (monitor) {
    gestorI.dibujar(100, 100);
    gestorPitch.dibujar(100, 300);
  }

  antesHabiaSonido = haySonido;
}

//---------------------------------------
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
