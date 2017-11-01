
let url1 = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1,0,0/1024x512?access_token='
/////////////////////////////////////////////////////////////////lat,long,zoom,angle,angle//////////
let apiKey = 'pk.eyJ1IjoiZWZmeWZhbiIsImEiOiJjajkxdnNnZGIzZG1zMndtYmtiNTJzeXR6In0.I3-_XtcuL7WiF7eJZXIENw'
let mapImg;
let emissions;
//https://raw.githubusercontent.com/cvalenzuela/Mappa/master/tutorials/pollutionmap/data/co2_emissions.csv

// shanghai: 31.2304 N, 121.4737 E
// vancouver: 49.2827° N, 123.1207° W
let clat = 0;
let clng = 0;
let lat;
let lng;
let mag;
let zoom = 1;
let particles = [];

function preload() {
   mapImg = loadImage(url1 + apiKey)
  emissions = loadStrings('./scripts/emissions.csv',callback);
}

function callback(e){
  console.log(e);
}

function mercX(lng) {
  lng = radians(lng);
  let a = (256 / PI) * pow(2, zoom);
  let b = lng + PI;
  return a * b;
}


function mercY(lat) {
  lat = radians(lat);
  let a = (256 / PI) * pow(2, zoom);
  let b = tan(PI / 4 + lat / 2);
  let c = PI - log(b);
  return a * c;
}

function setup() {
  createCanvas(1024, 512);
  imageMode(CENTER);
}

function draw() {
  clear();
  push();
  translate(width / 2, height / 2);
  image(mapImg, 0, 0);
  let cx = mercX(clng);
  let cy = mercY(clat);

  for (let i = 0; i < emissions.length; i++) {
    let data = emissions[i].split(/,/);
    let lat = data[1];
    let lng = data[2];
    let co2 = data[3];
    let x = mercX(lng) - cx;
    let y = mercY(lat) - cy;
    let area = map(co2, 0, 10357, 0, 10000);
    let d = sqrt(area/PI);
    noStroke();
    fill(255, 0, 0, 100);
    ellipse(x, y, d, d);
    //fill(255, 0, 0, 30);
    //ellipse(x+random()*10,y+random()*10,d);

    for (let j = 0; j < 1; j++) {
    let p = new Particle(x, y, d/10);
    particles.push(p);
  }
  for (let j = particles.length - 1; j >= 0; j--) {
    particles[j].update();
    particles[j].show();
    if (particles[j].finished()) {
      // remove this particle
      particles.splice(j, 1);
    }
  }
  }
  pop();
}


class Particle {

  constructor(a, b, dia) {
    this.x = a;
    this.y = b;
    this.dia = dia;
    this.vx = random(-dia/10, dia/10);
    this.vy = random(-5, -1);
    this.alpha = 255;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    //stroke(255);
    fill(255, this.alpha);
    ellipse(this.x, this.y, 16);
  }

}
