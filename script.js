const cursor = document.getElementById('cursor');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// cursor glow follows the mouse, stays hidden until the first move (so touch devices never see it)
document.addEventListener('pointermove', (e) => {
	if (e.pointerType !== 'mouse') return;
	cursor.style.top = `${e.clientY}px`;
	cursor.style.left = `${e.clientX}px`;
	cursor.classList.add('active');
});


// dots inside the frame, lines from the pointer to dots nearby
document.addEventListener('DOMContentLoaded', () => {
	const overlay = document.querySelector('.background-overlay');
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	overlay.appendChild(canvas);

	const RANGE = 150;     // how close a dot has to be to get a line
	const FADE_MS = 1000;  // how long lines take to fade after the pointer stops
	let dots = [];
	let width = 0;
	let height = 0;
	const pointer = { x: 0, y: 0, lastMove: -Infinity };
	let frame = null;

	function resize() {
		const dpr = window.devicePixelRatio || 1;
		width = overlay.clientWidth;
		height = overlay.clientHeight;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		// about 100 dots on a laptop screen, fewer on a phone
		const count = Math.round((width * height) / 11000);
		dots = Array.from({ length: count }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
		}));
		draw(performance.now());
	}

	function draw(now) {
		ctx.clearRect(0, 0, width, height);

		ctx.fillStyle = 'white';
		for (const dot of dots) {
			ctx.beginPath();
			ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
			ctx.fill();
		}

		const fade = 1 - (now - pointer.lastMove) / FADE_MS;
		if (fade <= 0) return false;

		ctx.lineWidth = 1;
		for (const dot of dots) {
			const distance = Math.hypot(pointer.x - dot.x, pointer.y - dot.y);
			if (distance < RANGE) {
				ctx.beginPath();
				ctx.moveTo(pointer.x, pointer.y);
				ctx.lineTo(dot.x, dot.y);
				ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / RANGE) * fade})`;
				ctx.stroke();
			}
		}
		return true;
	}

	function loop(now) {
		frame = draw(now) ? requestAnimationFrame(loop) : null;
	}

	resize();
	window.addEventListener('resize', resize);
	if (reduceMotion) return;

	document.addEventListener('pointermove', (e) => {
		const rect = canvas.getBoundingClientRect();
		pointer.x = e.clientX - rect.left;
		pointer.y = e.clientY - rect.top;
		pointer.lastMove = performance.now();
		if (!frame) frame = requestAnimationFrame(loop);
	});
});


// cards fade in as they scroll into view
const cards = document.querySelectorAll('.card');
if (!reduceMotion && 'IntersectionObserver' in window) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('in-view', entry.isIntersecting);
		});
	}, {
		threshold: 0.15, // low enough that tall cards on small screens still show up
	});

	cards.forEach((card) => {
		card.classList.add('reveal');
		observer.observe(card);
	});
}
