const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Selecting UI elements
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const cursor = document.getElementById("cursor");
const clearBtn = document.getElementById("clearBtn");

// ✅ Connect to backend WebSocket server
const socket = io("https://wb-be.onrender.com"); // Replace with your actual Render backend URL

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

// Drawing function
function draw(e) {
    if (!drawing) return;

    const stroke = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
    }
}
