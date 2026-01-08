const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

/* Theme */
const themeBtn = $("#themeBtn");
const rootEl = document.documentElement;

function setTheme(theme) {
  if (!themeBtn) return;
  if (theme === "light") {
    rootEl.setAttribute("data-theme", "light");
    themeBtn.textContent = "☀️";
    themeBtn.setAttribute("aria-pressed", "true");
  } else {
    rootEl.removeAttribute("data-theme");
    themeBtn.textContent = "🌙";
    themeBtn.setAttribute("aria-pressed", "false");
  }
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) setTheme(savedTheme);

themeBtn?.addEventListener("click", () => {
  const isLight = rootEl.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});

/* Mobile nav */
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

$$('#navLinks a').forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
}));

/* Typing (uniquement sur l’accueil si l’élément existe) */
const typingEl = $("#typing");
if (typingEl) {
  const typingPhrases = [
    "Développement web : HTML, CSS, JavaScript.",
    "Bac Pro SN — base technique solide.",
    "Recherche de stage en électricité."
  ];

  let tp = 0, ti = 0, deleting = false;
  (function typeLoop() {
    const phrase = typingPhrases[tp];
    typingEl.textContent = phrase.slice(0, ti) + "▌";

    if (!deleting) {
      ti++;
      if (ti > phrase.length + 8) deleting = true;
    } else {
      ti--;
      if (ti === 0) {
        deleting = false;
        tp = (tp + 1) % typingPhrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 55);
  })();
}

/* Counters (si présents) */
const counters = $$(".stat-num");
let counterStarted = false;

function animateCount(el) {
  const target = Number(el.dataset.count || "0");
  let current = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = String(current);
  }, 25);
}

function startCountersIfVisible() {
  if (counterStarted || counters.length === 0) return;
  const hero = $(".hero");
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.75) {
    counterStarted = true;
    counters.forEach(animateCount);
  }
}
window.addEventListener("scroll", startCountersIfVisible, { passive: true });
startCountersIfVisible();

/* Contact form -> Gmail (si présent) */
const contactForm = $("#contactForm");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(contactForm);

  const name = (fd.get("name") || "").toString().trim();
  const from = (fd.get("email") || "").toString().trim();
  const msg = (fd.get("message") || "").toString().trim();

  const to = "sallesromain.pro@gmail.com";
  const subject = encodeURIComponent(`Contact Portfolio — ${name || "Entreprise"}`);
  const body = encodeURIComponent(
    `Bonjour Romain,\n\n${msg}\n\n—\n${name}\n${from}`
  );

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${to}` +
    `&su=${subject}` +
    `&body=${body}`;

  window.open(gmailUrl, "_blank");
});

/* Footer year */
const y = $("#year");
if (y) y.textContent = String(new Date().getFullYear());
