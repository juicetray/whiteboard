const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

//selecting color picker & brush size elements
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");

const cursor = document.getElementById("cursor");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let drawing = false;
let currentColor = colorPicker.value; //initial color
let currentBrushSize = brushSize.value; // initial brush size

colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value
    cursor.style.backgroundColor = currentColor;
});

brushSize.addEventListener("input", (e) => {
    currentBrushSize = e.target.value;
    cursor.style.width = `${currentBrushSize}px`;
    cursor.style.height = `${currentBrushSize}px`;
});

canvas.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
})

canvas.addEventListener("mouseenter", () => {
    cursor.style.display = "block";
})

canvas.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
});

//initializing user drawing and the starting point
function startPosition(e) {
    drawing = true;
    draw(e);
}

//ending the path once the user stops drawing
function endPosition() {
    drawing = false;
    ctx.beginPath();
}

//drawing function
function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = currentBrushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

//event listeners
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);
