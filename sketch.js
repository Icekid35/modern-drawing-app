// ===== Variables for Drawing State and Configuration ===== //
let shapes = [],
  undoStack = [],
  redoStack = []; // Arrays for shapes and undo/redo operations
let backgroundImage,
  currentLayer = 0,
  layers = [[], []]; // Background image and layer system
let isDarkMode = false,
  recording = [],
  playMode = false,
  playIndex = 0; // Theme & playback controls
let width = window.innerWidth > 1800 ? 1800 : window.innerWidth; // Canvas width with max limit
let symmetry = { horizontal: false, vertical: false }; // Mirror drawing flags
let particleBrush = true,
  particles = []; // Particle effect toggle and data
let toolSize = 300; // Width reserved for tools panel (side UI)

// ===== UI Elements ===== //
const menuToggle = document.getElementById("menu-toggle");
const uiPanel = document.getElementById("ui-panel");

// Toggle the UI panel on mobile or small screens
menuToggle.addEventListener("click", () => {
  uiPanel.classList.toggle("show");
});

// ===== Canvas Setup ===== //
function setup() {
  // Set responsive width
  width = window.innerWidth > 1800 ? 1800 : window.innerWidth;
  if (width <= 600) toolSize = 0; // No tool panel on small screens

  // Create canvas and attach it to body
  const canvas = createCanvas(width - toolSize, window.innerHeight);
  canvas.parent(document.body);
  background(255); // Default white background

  // ===== Toolbar Button Event Listeners ===== //

  // Clear the canvas and reset shapes/layers
  document.getElementById("clearCanvas").addEventListener("click", (event) => {
    event.stopPropagation();
    shapes = [];
    layers = [[], []];
    // recording=[]
    backgroundImage = null;
  });

  // Load a background image
  document
    .getElementById("loadBackground")
    .addEventListener("click", (event) => {
      event.stopPropagation();
      const input = createFileInput(handleFile);
      input.hide(); // hide the file input from UI
      input.elt.click(); // simulate click
    });

  // Undo and redo buttons
  document.getElementById("btn-undo").addEventListener("click", (event) => {
    event.stopPropagation();
    undo();
  });

  document.getElementById("btn-redo").addEventListener("click", (event) => {
    event.stopPropagation();
    redo();
  });

  // Helper: toggle button active class
  function setActiveState(buttonId, isActive) {
    const btn = document.getElementById(buttonId);
    btn.classList.toggle("active", isActive);
  }

  // Save the canvas as image
  document.getElementById("btn-save").addEventListener("click", (event) => {
    event.stopPropagation();
    saveCanvas("myDrawing", "png");
  });

  // Toggle particle brush
  document.getElementById("btn-particle").addEventListener("click", (event) => {
    event.stopPropagation();
    particleBrush = !particleBrush;
    setActiveState("btn-particle", particleBrush);
  });

  // Toggle horizontal symmetry
  document.getElementById("btn-hsymm").addEventListener("click", (event) => {
    event.stopPropagation();
    symmetry.horizontal = !symmetry.horizontal;
    setActiveState("btn-hsymm", symmetry.horizontal);
  });

  // Toggle vertical symmetry
  document.getElementById("btn-vsymm").addEventListener("click", (event) => {
    event.stopPropagation();
    symmetry.vertical = !symmetry.vertical;
    setActiveState("btn-vsymm", symmetry.vertical);
  });

  // Toggle light/dark mode
  document.getElementById("btn-theme").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleTheme();
    document.getElementById("btn-theme").classList.toggle("active");
  });

  // Switch between layer 0 and 1
  document.getElementById("btn-layer").addEventListener("click", (event) => {
    event.stopPropagation();
    currentLayer = currentLayer === 0 ? 1 : 0;
    setActiveState("btn-layer", currentLayer === 1);
  });

  // Toggle playback of recorded drawing
  document.getElementById("btn-playback").addEventListener("click", (event) => {
    event.stopPropagation();
    togglePlayback();
    const btn = document.getElementById("btn-playback");
    btn.classList.toggle("active");
  });

  // ===== Keyboard Shortcuts ===== //
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      undo();
    }
    if (e.ctrlKey && e.key === "y") {
      e.preventDefault();
      redo();
    }
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      saveCanvas("myDrawing", "png");
    }
    if (e.key === "d") {
      e.preventDefault();
      toggleTheme();
      document.getElementById("btn-theme").classList.toggle("active");
    }
    if (e.key === "p") {
      e.preventDefault();
      particleBrush = !particleBrush;
      setActiveState("btn-particle", particleBrush);
    }
    if (e.key === "h") {
      e.preventDefault();
      symmetry.horizontal = !symmetry.horizontal;
      setActiveState("btn-hsymm", symmetry.horizontal);
    }
    if (e.key === "v") {
      e.preventDefault();
      symmetry.vertical = !symmetry.vertical;
      setActiveState("btn-vsymm", symmetry.vertical);
    }
    if (e.key === "l") {
      e.preventDefault();
      currentLayer = currentLayer === 0 ? 1 : 0;
      setActiveState("btn-layer", currentLayer === 1);
    }
    if (e.key === "k") {
      e.preventDefault();
      togglePlayback();
      document.getElementById("btn-playback").classList.toggle("active");
    }
  });
}

// ===== Draw Loop ===== //
function draw() {
  blendMode(BLEND);
  background(isDarkMode ? 30 : 255);

  if (backgroundImage) image(backgroundImage, 0, 0, width, height); // Draw background image

  // Draw all shapes from both layers
  for (let layer of layers) {
    for (let shape of layer) drawWithOptions(shape);
  }

  // Play recorded strokes one by one
  if (playMode && playIndex < recording.length) {
    drawWithOptions(recording[playIndex]);
    playIndex++;
    if (playIndex == recording.length) {
      togglePlayback();
      document.getElementById("btn-playback").classList.remove("active");
    }
  }

  updateParticles(); // Update particle visuals
}

// ===== Mouse Interaction ===== //
function mouseDragged() {
  if (mouseX > 10) {
    const shape = captureShape();
    layers[currentLayer].push(shape); // Add to current layer
    shapes.push(shape);
    recording.push(shape); // Save for playback
    undoStack.push(shape);
    redoStack = []; // Clear redo stack

    // Generate particles if enabled
    if (particleBrush) generateParticles(shape.x, shape.y, shape.color);

    // Apply symmetry if enabled
    if (symmetry.horizontal) {
      const mirror = { ...shape, x: width - toolSize - shape.x };
      layers[currentLayer].push(mirror);
    }
    if (symmetry.vertical) {
      const mirror = { ...shape, y: height - shape.y };
      layers[currentLayer].push(mirror);
    }
  }
}
function touchMoved() {
  mouseDragged();
}

// ===== Particle Brush ===== //
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    fill(p.color);
    noStroke();
    circle(p.x, p.y, p.size);
    p.y += p.speed;
    p.size *= 0.95; // Shrink over time
    if (p.size < 1) particles.splice(i, 1); // Remove small particles
  }
}

function generateParticles(x, y, color) {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: x + random(-10, 10),
      y: y + random(-10, 10),
      size: random(5, 10),
      speed: random(-1, 1),
      color: color
    });
  }
}

// ===== Playback Toggle ===== //
function togglePlayback() {
  playMode = !playMode;
  playIndex = 0;
}

// ===== Shape Utilities ===== //
function captureShape() {
  const brushSize = int(document.getElementById("brushSize").value);
  const randomness =
    map(int(document.getElementById("randomness").value), 0, 100, 0, 1) * 100;
  const shapeType = document.getElementById("shape").value;
  const baseColor = document.getElementById("color").value;
  const color = colorWithOpacity(
    baseColor,
    int(document.getElementById("opacity").value)
  );
  const blend = document.getElementById("blendMode").value;
  const hasOutline = document.getElementById("outline").checked;
  const outlineColor = document.getElementById("outlineColor").value;
  const outlineThickness = int(
    document.getElementById("outlineThickness").value
  );

  let x = mouseX + random(-randomness, randomness);
  let y = mouseY + random(-randomness, randomness);

  return createShape(
    shapeType,
    x,
    y,
    brushSize,
    color,
    blend,
    hasOutline,
    outlineColor,
    outlineThickness
  );
}

// Undo/Redo functionality
function undo() {
  if (layers[currentLayer].length > 0) {
    let shape = layers[currentLayer].pop();
    redoStack.push(shape);
  }
}

function redo() {
  if (redoStack.length > 0) {
    let shape = redoStack.pop();
    layers[currentLayer].push(shape);
  }
}

// Apply opacity to a color
function colorWithOpacity(hex, opacity) {
  const c = color(hex);
  return color(red(c), green(c), blue(c), opacity);
}

// Create shape object with all attributes
function createShape(
  type,
  x,
  y,
  size,
  color,
  blend,
  hasOutline,
  outlineColor,
  outlineThickness
) {
  if (type === "Triangle") {
    return {
      type,
      x1: x - size / 2,
      y1: y + size / 2,
      x2: x + size / 2,
      y2: y + size / 2,
      x3: x,
      y3: y - size / 2,
      color,
      blend,
      hasOutline,
      outlineColor,
      outlineThickness
    };
  } else if (type === "Star") {
    return {
      type,
      x,
      y,
      numPoints: 5,
      outerRadius: size / 2,
      innerRadius: size / 4,
      color,
      blend,
      hasOutline,
      outlineColor,
      outlineThickness
    };
  } else if (type === "Heart") {
    return {
      type,
      x,
      y,
      size,
      color,
      blend,
      hasOutline,
      outlineColor,
      outlineThickness
    };
  } else {
    return {
      type,
      x,
      y,
      size,
      color,
      blend,
      hasOutline,
      outlineColor,
      outlineThickness
    };
  }
}

// Draw shape with optional outline
function drawWithOptions(shape) {
  blendModeSwitch(shape.blend);
  noStroke();
  fill(shape.color);
  drawShapeByType(shape);

  if (shape.hasOutline) {
    stroke(shape.outlineColor);
    strokeWeight(shape.outlineThickness);
    noFill();
    drawShapeByType({ ...shape, size: shape.size + shape.outlineThickness });
  }
}

// Draw shape based on type
function drawShapeByType(shape) {
  switch (shape.type) {
    case "Ellipse":
      ellipse(shape.x, shape.y, shape.size);
      break;
    case "Rectangle":
      rectMode(CENTER);
      rect(shape.x, shape.y, shape.size, shape.size);
      break;
    case "Triangle":
      triangle(shape.x1, shape.y1, shape.x2, shape.y2, shape.x3, shape.y3);
      break;
    case "Star":
      drawStar(
        shape.x,
        shape.y,
        shape.numPoints,
        shape.outerRadius,
        shape.innerRadius
      );
      break;
    case "Heart":
      drawHeart(shape.x, shape.y, shape.size);
      break;
  }
}

// Custom star drawing logic
function drawStar(x, y, points, outerRadius, innerRadius) {
  let angle = TWO_PI / points;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = x + cos(a) * outerRadius;
    let sy = y + sin(a) * outerRadius;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * innerRadius;
    sy = y + sin(a + halfAngle) * innerRadius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// Custom heart drawing logic using bezier curves
function drawHeart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x + size / 2, y - size / 2, x + size, y + size / 3, x, y + size);
  bezierVertex(x - size, y + size / 3, x - size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

// Apply blend mode
function blendModeSwitch(mode) {
  switch (mode) {
    case "BLEND":
      blendMode(BLEND);
      break;
    case "DARKEST":
      blendMode(DARKEST);
      break;
    case "LIGHTEST":
      blendMode(LIGHTEST);
      break;
    case "DIFFERENCE":
      blendMode(DIFFERENCE);
      break;
    case "MULTIPLY":
      blendMode(MULTIPLY);
      break;
    case "EXCLUSION":
      blendMode(EXCLUSION);
      break;
    case "SCREEN":
      blendMode(SCREEN);
      break;
    default:
      blendMode(BLEND);
  }
}

// Toggle light/dark theme mode
function toggleTheme() {
  isDarkMode = !isDarkMode;
}

// Load background image from user file
function handleFile(file) {
  if (file.type === "image") {
    backgroundImage = loadImage(file.data);
  } else {
    alert("Please select an image file.");
  }
}

// Make canvas responsive on window resize
function windowResized() {
  width = window.innerWidth > 1800 ? 1800 : window.innerWidth;
  toolSize = width <= 600 ? 0 : 300;
  resizeCanvas(width - toolSize, window.innerHeight);
}
