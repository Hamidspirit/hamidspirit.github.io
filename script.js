const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dots = [];
const mouse = { x: null, y: null };

// Generate random dots
for (let i = 0; i < 100; i++) {
    dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 3,
    });
}

// Handle mouse movement
canvas.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    connectToNearbyDots();
});

function connectToNearbyDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all dots
    dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    });

    // Find and draw lines to random nearby dots
    dots.forEach(dot => {
    const distance = Math.hypot(mouse.x - dot.x, mouse.y - dot.y);
    if (distance < 150) { // Adjust the proximity range as needed
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(dot.x, dot.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    });

    // Fade out the lines smoothly
    setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });
    }, 300); // Adjust the fade-out duration
}