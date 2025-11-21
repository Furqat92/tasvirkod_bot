let nodes = [];
let lineColors = [];
let frame = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255); // HSB rejimi
  generateNodes();
  generateColorPalette();
}

function draw() {
  background(0);
  frame++;

  updateNodes();
  drawLines();
  if (ui_get("Show Nodes")) {
    drawNodes();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateNodes();
}

function generateNodes() {
  nodes = [];
  let n = ui_get("Node Amount");
  for (let i = 0; i < n; i++) {
    nodes.push({
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      radius: min(width, height) / 3 + random(-50, 50)
    });
  }
}

function generateColorPalette() {
  lineColors = [];
  for (let i = 0; i < 360; i += 5) {
    lineColors.push(color(i, 100, 100));
  }
}

function updateNodes() {
  for (let node of nodes) {
    node.angle += node.speed;
  }
}

function drawLines() {
  strokeWeight(ui_get("Line Weight"));
  let totalLines = nodes.length;

  for (let i = 0; i < totalLines; i++) {
    let nodeA = nodes[i];
    let posA = get_xy(nodeA.radius, nodeA.angle);

    for (let j = i + 1; j < totalLines; j++) {
      let nodeB = nodes[j];
      let posB = get_xy(nodeB.radius, nodeB.angle);

      let d = dist(posA.x, posA.y, posB.x, posB.y);
      if (d < ui_get("Line Distance")) {
        stroke(getLineColor(i, totalLines));
        line(posA.x, posA.y, posB.x, posB.y);
      }
    }
  }
}

function drawNodes() {
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    let hue = map(i, 0, nodes.length, 0, 360);
    fill(hue, 80, 100);
    let pos = get_xy(nodes[i].radius, nodes[i].angle);
    circle(pos.x, pos.y, 5);
  }
}

function get_xy(r, a) {
  return {
    x: width / 2 + cos(a) * r,
    y: height / 2 + sin(a) * r
  };
}

function getLineColor(lineIndex, totalLines) {
  let mode = ui_get('Color Mode');
  let intensity = ui_get('Color Intensity') / 100;
  let speed = ui_get('Color Change Speed');

  switch(mode) {
    case 'Black & White':
      return color(0, 0, 0, 200 * intensity);

    case 'Grayscale':
      let grayVal = map(lineIndex % 100, 0, 100, 20, 100) * intensity;
      return color(0, 0, grayVal, 200);

    case 'Rainbow':
      let hue = (lineIndex * speed + frame) % 360;
      return color(hue, 100, 100, 200);

    case 'Warm Colors':
      let warmHue = (lineIndex * speed + frame) % 60; // 0-60
      return color(warmHue, 100, 100, 200);

    case 'Cool Colors':
      let coolHue = 180 + (lineIndex * speed + frame) % 180; // 180-360
      return color(coolHue, 100, 100, 200);

    case 'Custom Color':
      let customHue = (lineIndex * speed * 2 + frame) % 360;
      return color(customHue, 80, 90, 200);

    default:
      return color(0, 0, 0, 200);
  }
}
