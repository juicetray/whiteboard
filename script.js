const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Selecting UI elements
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const cursor = document.getElementById("cursor");
const clearBtn = document.getElementById("clearBtn");

// ✅ Ensure elements exist before attaching event listeners
if (!canvas || !ctx || !colorPicker || !brushSize || !clearBtn) {
    console.error("❌ One or more elements are missing in the HTML.");
}

// ✅ Connect to backend WebSocket server
const socket = io("https://wb-be.onrender.com", { transports: ["websocket"] });

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let drawing = false;
let currentColor = colorPicker ? colorPicker.value : "#000000";
let currentBrushSize = brushSize ? brushSize.value : 5;

// Update brush settings
if (colorPicker) {
    colorPicker.addEventListener("input", (e) => {
        currentColor = e.target.value;
        if (cursor) cursor.style.backgroundColor = currentColor;
    });
}

if (brushSize) {
    brushSize.addEventListener("input", (e) => {
        currentBrushSize = e.target.value;
        if (cursor) {
            cursor.style.width = `${currentBrushSize}px`;
            cursor.style.height = `${currentBrushSize}px`;
        }
    });
}

// Update cursor position
canvas.addEventListener("mousemove", (e) => {
    if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    }
});

canvas.addEventListener("mouseenter", () => {
    if (cursor) cursor.style.display = "block";
});

canvas.addEventListener("mouseleave", () => {
    if (cursor) cursor.style.display = "none";
});

// Initialize drawing
function startPosition(e) {
    drawing = true;
    draw(e);
}

function endPosition() {
    drawing = false;
    ctx.beginPath();
}

// Drawing function
function draw(e) {
    if (!drawing) return;

    const stroke = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
        color: currentColor,
        size: currentBrushSize
    };

    drawStroke(stroke);
    socket.emit("draw", stroke);
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

// Clear whiteboard
if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit("clearWhiteboard");
    });
}

// Listen for clear event
socket.on("clearWhiteboard", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// Event listeners
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);
