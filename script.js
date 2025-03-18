const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Selecting UI elements
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const cursor = document.getElementById("cursor");
const clearBtn = document.getElementById("clearBtn");


const socket = io("https://wb-be.onrender.com"); // Ensure this is the correct Render backend URL

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let drawing = false;
let currentColor = colorPicker.value; // Initial color
let currentBrushSize = brushSize.value; // Initial brush size

// Update brush settings
colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
    cursor.style.backgroundColor = currentColor;
});

brushSize.addEventListener("input", (e) => {
    currentBrushSize = e.target.value;
    cursor.style.width = `${currentBrushSize}px`;
    cursor.style.height = `${currentBrushSize}px`;
});

// Update cursor position
canvas.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

canvas.addEventListener("mouseenter", () => {
    cursor.style.display = "block";
});

canvas.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
});

// Initialize drawing
function startPosition(e) {
    drawing = true;
    draw(e);
}

// Stop drawing
function endPosition() {
    drawing = false;
    ctx.beginPath();
}


function draw(e) {
    if (!drawing) return;

    const stroke = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
        color: currentColor,
        size: currentBrushSize
    };

    drawStroke(stroke); // Draw locally
    socket.emit("draw", stroke); // Send to server
}

// Render strokes
function drawStroke(stroke) {
    ctx.lineWidth = stroke.size;
    ctx.strokeStyle = stroke.color;
    ctx.lineCap = "round";

    ctx.lineTo(stroke.x, stroke.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(stroke.x, stroke.y);
}

// Listen for strokes from WebSockets
socket.on("draw", drawStroke);

// Load existing strokes from Render backend
socket.on("loadWhiteboard", (strokes) => strokes.forEach(drawStroke));

// Clear whiteboard (button + WebSockets)
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clearWhiteboard");
});

socket.on("clearWhiteboard", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// Event listeners
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);
