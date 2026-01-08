/* =========================
   Deck (slide) controller
   - No-scroll PDF feeling on desktop
   - Buttons + dots + keyboard arrows
   - Remembers last slide per page via sessionStorage
   ========================= */

function initDeck(deckEl){
  const viewport = deckEl.querySelector(".deck-viewport");
  const slides = Array.from(deckEl.querySelectorAll(".slide"));
  const prevBtn = deckEl.querySelector("[data-prev]");
  const nextBtn = deckEl.querySelector("[data-next]");
  const dotsWrap = deckEl.querySelector(".dots");
  const storageKey = deckEl.dataset.key || ("deck:" + location.pathname);

  if (!slides.length) return;

  // build dots
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot";
    d.addEventListener("click", () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));

  // restore
  let index = 0;
  const saved = sessionStorage.getItem(storageKey);
  if (saved !== null && !Number.isNaN(Number(saved))) {
    index = Math.max(0, Math.min(slides.length - 1, Number(saved)));
  }

  function render(){
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    sessionStorage.setItem(storageKey, String(index));
  }

  function go(i){
    index = (i + slides.length) % slides.length;
    render();
  }
  function prev(){ go(index - 1); }
  function next(){ go(index + 1); }

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  // keyboard
  window.addEventListener("keydown", (e) => {
    // ignore if typing in input
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (["INPUT","TEXTAREA"].includes(tag)) return;

    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".deck").forEach(initDeck);

  // active pill highlight
  const path = location.pathname.split("/").pop() || "index.html";
  const map = {
    "about.html": "about",
    "development.html": "dev",
    "more.html": "more",
    "index.html": "home",
    "": "home",
  };
  const key = map[path] || "home";
  document.querySelectorAll("[data-pill]").forEach(a => {
    a.classList.toggle("active", a.dataset.pill === key);
  });
});