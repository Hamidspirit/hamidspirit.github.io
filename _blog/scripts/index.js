console.log("hello , world");

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
} else {
    navbar.classList.remove('scrolled');
}
});
window.addEventListener('load', () => {
const navbar = document.querySelector('.navbar');
const main = document.querySelector('main'); // or any wrapper for your content
if (navbar && main) {
    const navHeight = navbar.offsetHeight;
    main.style.paddingTop = `${navHeight}px`;
}
});