// === Partículas (tsParticles) ===
// Doc recomienda usar tsParticles.load (sustituye al viejo particlesJS)
tsParticles.load("tsparticles", {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  particles: {
    number: { value: 45, density: { enable: true, area: 900 } },
    color: { value: ["#2cbec1", "#eb8136", "#6aa0ff"] },
    shape: { type: "circle" },
    opacity: { value: 0.6, random: { enable: true, minimumValue: 0.2 } },
    size: { value: { min: 1, max: 3 } },
    links: { enable: true, opacity: 0.25, distance: 120, color: "#87a0b8" },
    move: { enable: true, speed: 1.1, outModes: { default: "bounce" } }
  },
  detectRetina: true
});

// === GSAP + ScrollTrigger: reveals y sutil float ===
gsap.registerPlugin(ScrollTrigger);

// Aparece el hero
document.querySelectorAll(".reveal").forEach((el, i) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.8, delay: i * 0.08,
    scrollTrigger: { trigger: el, start: "top 85%" },
    onStart(){ el.classList.add("in"); }
  });
});

// Tarjetas con micro “float” infinito
gsap.utils.toArray(".card").forEach((card, i) => {
  gsap.to(card, { y: 6, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.15 });
});

// === Tilt 3D + efecto “magnético” en hover ===
const lerp = (a, b, n) => (1 - n) * a + n * b;

document.querySelectorAll(".tilt").forEach((card) => {
  let rx = 0, ry = 0, tx = 0, ty = 0;
  const strength = 12;

  function onMove(e){
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry = px * strength;
    rx = -py * strength;
  }
  function onLeave(){
    rx = 0; ry = 0;
  }
  function loop(){
    tx = lerp(tx, rx, 0.12);
    ty = lerp(ty, ry, 0.12);
    card.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg)`;
    requestAnimationFrame(loop);
  }
  loop();

  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);

  // Efecto magnético para botones/iconos dentro de la tarjeta
  card.querySelectorAll(".btn, .soc").forEach((el) => {
    const k = 22;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * k;
      const y = ((e.clientY - r.top) / r.height - 0.5) * k;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
});

// === Animar SVGs (sutil pulso) ===
gsap.to(".icon-wrap .icon", { scale: 1.06, transformOrigin: "50% 50%", yoyo: true, repeat: -1, ease: "sine.inOut", duration: 2 });
// ===== Mini Mapa (Leaflet + OSM) =====
(function(){
  const el = document.getElementById("miniMap");
  if (!el || !window.L || !window.gsap || !window.ScrollTrigger) return;

  // Coordenadas aproximadas de Bucaramanga (ajústalas si quieres la puerta exacta)
  const coords = [7.1193, -73.1227];    // <-- cámbialas a tu ubicación exacta si lo deseas
  let inited = false, map;

  function initMap(){
    if (inited) return; inited = true;

    map = L.map('miniMap', {
      zoomControl: true,
      scrollWheelZoom: false, // evita hacer zoom al scrollear la página
      dragging: true
    }).setView(coords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const pulsingIcon = L.divIcon({
      className: 'pulse-marker',
      html: '<span></span><span class="pulse"></span>',
      iconSize: [16,16],
      iconAnchor: [8,8]
    });

    L.marker(coords, { icon: pulsingIcon })
      .addTo(map)
      .bindPopup('ATSSAS — Punto de atención<br/>Calle 55a No. 27–22');

    // Asegura que calcule bien el tamaño al mostrarse
    setTimeout(() => map.invalidateSize(), 300);
  }

  // Crea el mapa cuando la tarjeta aparece (mejor performance)
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    once: true,
    onEnter: initMap
  });
})();
