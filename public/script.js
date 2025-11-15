const socket = io();
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let drawing = false;
let lastX, lastY;

//adding color picker functionality
const colorPicker = document.getElementById("colorPicker");
let currentColor = colorPicker.value;

colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
  console.log("Selected color: " + currentColor);
});

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mouseup", () => (drawing = false));

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const [x, y] = [e.offsetX, e.offsetY];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLine(lastX, lastY, x, y, true);
  [lastX, lastY] = [x, y];
  drawRectangle(x, y, currentColor, true);
});

function drawLine(x1, y1, x2, y2, emit) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  //socket emits our draing data as a JSON object
  if (emit) socket.emit("draw", { x1, y1, x2, y2 });
}


//function to draw our rectangle
function drawRectangle(x1 , y1, color, emit) {
    ctx.rect(x1, y1, 180, 80); // x, y, width, height
    ctx.fillStyle = color;
    ctx.fill();


    if(emit) socket.emit("moveRectangle", {x1, y1, color});
}


//when socket receives "draw" event, it passes the JSON data to our drawLine function
socket.on("draw", ({ x1, y1, x2, y2 }) => drawLine(x1, y1, x2, y2, false));

socket.on("moveRectangle", ({x1, y1, color }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRectangle(x1, y1, color, false);
});

const clearButton = document.getElementById("clear");

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit("clear");
});

socket.on("clear", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

