const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
		cursor.style.top = `${e.clientY}px`;
		cursor.style.left = `${e.clientX}px`;
});


document.addEventListener('DOMContentLoaded', () => {
	const overlay = document.querySelector('.background-overlay');
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	overlay.appendChild(canvas);

	canvas.width = overlay.offsetWidth;
	canvas.height = overlay.offsetHeight;

	const dots = [];
	const mouse = { x: null, y: null };

	// Generate random dots
	for (let i = 0; i < 100; i++) {
		dots.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: 1,
		});
	}

	// Draw all dots
	dots.forEach(dot => {
		ctx.beginPath();
		ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
		ctx.fillStyle = "white";
		ctx.fill();
	});

	// Handle mouse movement
	document.addEventListener('mousemove', (event) => {
		const rect = canvas.getBoundingClientRect();
		mouse.x = event.clientX - rect.left;
		mouse.y = event.clientY - rect.top;
		connectToNearbyDots();
	});

	function connectToNearbyDots() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		console.log("draw line to each dot")

		// Draw all dots
		dots.forEach(dot => {
			ctx.beginPath();
			ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
			ctx.fillStyle = "white";
			ctx.fill();
		});

		// Find and draw lines to nearby dots
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
		}, 1000); // Adjust the fade-out duration
	}

	// Handle resizing
	window.addEventListener('resize', () => {
		canvas.width = overlay.offsetWidth;
		canvas.height = overlay.offsetHeight;
	});
});