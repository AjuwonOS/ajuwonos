/* ============================================================
   CURSOR — disabled on mobile/touch via CSS, JS just no-ops
   ============================================================ */
const dotEl = document.getElementById("cursorDot");
const ringEl = document.getElementById("cursorRing");
const projectEl = document.getElementById("cursorProject");

const isTouchDevice =
  window.matchMedia("(hover: none)").matches ||
  window.matchMedia("(max-width: 900px)").matches;

if (!isTouchDevice) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX,
    dotY = mouseY;
  let ringX = mouseX,
    ringY = mouseY;
  let projectX = mouseX,
    projectY = mouseY;

  let dotHalf = 6;
  let ringHalf = 22;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.add("cursor-visible");
  });

  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-visible");
  });

  function readSizes() {
    dotHalf = dotEl.offsetWidth / 2;
    ringHalf = ringEl.offsetWidth / 2;
  }

  function animateCursor() {
    readSizes();

    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    dotEl.style.transform = `translate3d(${dotX - dotHalf}px, ${dotY - dotHalf}px, 0)`;

    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ringEl.style.transform = `translate3d(${ringX - ringHalf}px, ${ringY - ringHalf}px, 0)`;

    projectX += (mouseX - projectX) * 0.22;
    projectY += (mouseY - projectY) * 0.22;
    projectEl.style.left = projectX + "px";
    projectEl.style.top = projectY + "px";

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll("[data-project-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-project-active");
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-project-active");
    });
  });
}

/* ============================================================
   HERO IMAGE TILT — desktop only
   ============================================================ */
if (!isTouchDevice) {
  const heroImage = document.getElementById("heroImage");

  heroImage.addEventListener("mousemove", (e) => {
    const rect = heroImage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 12;
    const rotateX = (0.5 - y) * 12;

    heroImage.style.transform = `perspective(1400px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;
  });

  heroImage.addEventListener("mouseleave", () => {
    heroImage.style.transform =
      "perspective(1400px) rotateY(0) rotateX(0) scale(1)";
  });
}

/* ============================================================
   KARAOKE — works on mobile and desktop
   ============================================================ */
const karaokeEl = document.getElementById("karaoke");
const karaokeText = karaokeEl.textContent.trim();

karaokeEl.innerHTML = karaokeText
  .split(/\s+/)
  .map((word) => `<span class="word">${word}</span>`)
  .join(" ");

const words = karaokeEl.querySelectorAll(".word");

function updateKaraoke() {
  const rect = karaokeEl.getBoundingClientRect();
  const windowH = window.innerHeight;
  const start = windowH * 0.85;
  const end = windowH * 0.25;
  const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
  const wordsToLight = Math.floor(progress * words.length);

  words.forEach((word, i) => {
    if (i < wordsToLight) word.classList.add("lit");
    else word.classList.remove("lit");
  });
}

/* ============================================================
   SMOOTH SCROLL INERTIA
   Lighter on mobile — heavy inertia on phones feels terrible
   ============================================================ */
const scrollWrap = document.getElementById("scroll-wrap");
let targetScroll = window.scrollY;
let currentScroll = window.scrollY;
const ease = isTouchDevice ? 0.15 : 0.08;

document.documentElement.style.scrollBehavior = "auto";

function smoothScroll() {
  targetScroll = window.scrollY;
  currentScroll += (targetScroll - currentScroll) * ease;
  const offset = currentScroll - targetScroll;

  scrollWrap.style.transform = `translate3d(0, ${offset * 0.4}px, 0)`;

  updateKaraoke();
  requestAnimationFrame(smoothScroll);
}
smoothScroll();
