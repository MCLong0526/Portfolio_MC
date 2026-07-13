// ═══ theme toggle (persisted) ═══
const root = document.documentElement;
if (localStorage.theme === "dark" || (!localStorage.theme && matchMedia("(prefers-color-scheme: dark)").matches)) {
  root.dataset.theme = "dark";
}
document.getElementById("themeToggle").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "" : "dark";
  localStorage.theme = root.dataset.theme;
};

// ═══ typewriter hero ═══
const roles = ["Software Engineer", "Java Backend Developer", "Flutter App Founder", "AI-assisted Builder"];
const tw = document.getElementById("typewriter");
let ri = 0, ci = 0, deleting = false;
(function type() {
  const word = roles[ri];
  tw.textContent = word.slice(0, ci);
  if (!deleting && ci === word.length) { deleting = true; return setTimeout(type, 1800); }
  if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  ci += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 90);
})();

// ═══ scroll reveal ═══
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    // reveal when entering viewport — or already above it (anchor jumps, fast scrolls)
    if (e.isIntersecting || e.boundingClientRect.top < 0) e.target.classList.add("in");
  });
}, { threshold: 0.15 });
document.querySelectorAll("main .reveal").forEach(el => io.observe(el));

// ═══ animated stat counters ═══
const statIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    statIO.unobserve(e.target);
    const target = parseFloat(e.target.dataset.count);
    const decimals = (e.target.dataset.count.split(".")[1] || "").length;
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1200, 1);
      e.target.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: 0.6 });
document.querySelectorAll(".stat-num").forEach(el => statIO.observe(el));

// ═══ experience accordion ═══
document.querySelectorAll(".xp-head").forEach(btn => {
  btn.onclick = () => {
    const xp = btn.parentElement;
    xp.classList.toggle("open");
    btn.setAttribute("aria-expanded", xp.classList.contains("open"));
  };
});

// ═══ skill filter ═══
document.querySelectorAll(".filter").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".chip").forEach(c =>
      c.classList.toggle("dim", f !== "all" && c.dataset.cat !== f));
  };
});

// ═══ project card tilt ═══
const card = document.getElementById("tiltCard");
card.addEventListener("mousemove", e => {
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
});
card.addEventListener("mouseleave", () => (card.style.transform = ""));

// ═══ scrollspy nav ═══
const spyIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll("[data-spy]").forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main .section").forEach(s => spyIO.observe(s));

// ═══ gallery: cover-flow carousel + lightbox ═══
const lightbox = document.getElementById("lightbox");
lightbox.querySelector(".lightbox-close").onclick = () => lightbox.close();
lightbox.onclick = e => e.target === lightbox && lightbox.close();

const items = [...document.querySelectorAll(".c-item")];
const dotsBox = document.getElementById("cDots");
let active = 1; // start on Home

items.forEach((_, i) => {
  const d = document.createElement("button");
  d.className = "c-dot";
  d.setAttribute("aria-label", "Go to screen " + (i + 1));
  d.onclick = () => go(i);
  dotsBox.append(d);
});

// tidy deck: even spacing in item-widths, graduated scale/opacity, no rotation
const SCALES = [1, .8, .62];
const FADES = [1, .5, .18];
function go(i) {
  active = (i + items.length) % items.length;
  items.forEach((el, j) => {
    const off = j - active;
    const d = Math.min(Math.abs(off), 2);
    el.style.transform = `translateX(calc(-50% + ${off * 68}%)) scale(${SCALES[d]})`;
    el.style.zIndex = 10 - Math.abs(off);
    el.style.opacity = Math.abs(off) > 2 ? 0 : FADES[d];
    el.classList.toggle("active", !off);
  });
  [...dotsBox.children].forEach((d, j) => d.classList.toggle("active", j === active));
}
go(active);

// swipe / drag to navigate
let dragX = null, dragged = false;
const stage = document.getElementById("cStage");
stage.addEventListener("pointerdown", e => (dragX = e.clientX));
stage.addEventListener("pointerup", e => {
  if (dragX === null) return;
  const dx = e.clientX - dragX;
  dragX = null;
  dragged = Math.abs(dx) > 40;
  if (dragged) go(active + (dx < 0 ? 1 : -1));
});

items.forEach((el, i) => {
  el.onclick = () => {
    if (dragged) return (dragged = false); // swipe already handled it
    if (i !== active) return go(i);
    lightbox.querySelector("img").src = el.querySelector("img").src;
    lightbox.showModal();
  };
});
document.getElementById("cPrev").onclick = () => go(active - 1);
document.getElementById("cNext").onclick = () => go(active + 1);

// ═══ copy email ═══
document.getElementById("copyEmail").onclick = async () => {
  await navigator.clipboard.writeText("Chia5040@gmail.com");
  const hint = document.getElementById("copyHint");
  hint.textContent = "[copied ✓]";
  setTimeout(() => (hint.textContent = "[copy]"), 1500);
};
