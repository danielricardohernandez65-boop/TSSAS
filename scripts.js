class ImageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.nav-btn.prev');
        this.nextBtn = document.querySelector('.nav-btn.next');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        // Event listeners
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());

        // Indicadores clickeables
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-slide cada 6 segundos
        this.startAutoSlide();

        // Pausar auto-slide al hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => this.stopAutoSlide());
        sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    nextSlide() {
        this.goToSlide((this.currentSlide + 1) % this.totalSlides);
    }

    prevSlide() {
        this.goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides);
    }

    goToSlide(index) {
        // Remover clases activas
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');

        // Añadir clase prev al slide anterior
        this.slides[this.currentSlide].classList.add('prev');

        // Remover clase prev después de la transición
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
        }, 1000);

        // Actualizar slide actual
        this.currentSlide = index;

        // Activar nuevo slide
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider();
});


// === EXTRA UI (nav activo, toTop, WhatsApp, Servicios pro, FAQ pro) ===
window.addEventListener('DOMContentLoaded', () => {
  /* ---------- 0) Año dinámico en footer ---------- */
  const yEl = document.getElementById('y');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------- 1) Menú: anclas + scroll suave + activo ---------- */
  const hero = document.querySelector('.slider-container');
  if (hero && !hero.id) hero.id = 'inicio';

  const map = { 'inicio': '#inicio', 'servicios': '#servicios', 'quienes somos': '#contacto' }; // cambia '#contacto' si luego creas #quienes-somos
  const navLinks = document.querySelectorAll('.enlaces-servicios a');
  navLinks.forEach(a => {
    const t = (a.textContent || '').trim().toLowerCase();
    if (map[t]) a.setAttribute('href', map[t]);
  });
  document.querySelectorAll('.enlaces-servicios a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const tgt = document.querySelector(a.getAttribute('href'));
      if (tgt) { e.preventDefault(); tgt.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });
  const sections = ['#inicio', '#servicios', '#faq', '#contacto']
    .map(id => document.querySelector(id))
    .filter(Boolean);
  const setActive = (id) => navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => { if (e.isIntersecting) setActive('#'+e.target.id); });
    }, { rootMargin: '-45% 0px -55% 0px', threshold: 0.01 });
    sections.forEach(sec => io.observe(sec));
  }

  /* ---------- 2) Botón “Ir arriba” ---------- */
  if (!document.getElementById('toTop')) {
    const toTop = document.createElement('button');
    toTop.id = 'toTop';
    toTop.setAttribute('aria-label','Ir arriba');
    toTop.textContent = '↑';
    document.body.appendChild(toTop);
    const toggleTop = () => window.scrollY > 600 ? toTop.classList.add('show') : toTop.classList.remove('show');
    window.addEventListener('scroll', toggleTop, {passive:true});
    toggleTop();
    toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  /* ---------- 3) Botón flotante WhatsApp ---------- */
  if (!document.getElementById('waFloat')) {
    const WA = document.createElement('a');
    WA.id = 'waFloat';
    WA.href = 'https://wa.me/573176384710';
    WA.target = '_blank';
    WA.rel = 'noopener';
    WA.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.1 17.6c-.3-.2-1.7-.8-1.9-.9-.3-.1-.5-.2-.8.2-.2.3-.9 1-.9 1s-.3.3-.8.1c-.4-.2-1.4-.5-2.7-1.8-1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.5-.7.2-.2.2-.4.3-.7 0-.2 0-.5-.1-.7-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5s-1.3 1.2-1.3 2.9 1.4 3.3 1.6 3.5c.2.3 2.7 4.1 6.5 5.6.9.4 1.6.6 2.2.8.9.3 1.7.3 2.3.2.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6 0 0-.2-.1-.3-.2zM16 3C9.4 3 4 8.4 4 14.9c0 2.6.9 5 2.3 7l-1.5 5.2 5.4-1.4c1.9 1 4 .1 5.8.1 6.6 0 12-5.4 12-12s-5.4-12-12-12z"/></svg>';
    document.body.appendChild(WA);
    const toggleWA = () => window.scrollY > 400 ? WA.classList.add('show') : WA.classList.remove('show');
    window.addEventListener('scroll', toggleWA, {passive:true});
    toggleWA();
  }

  /* ---------- 4) SERVICIOS: chips, tilt 3D, modal ---------- */
  const grid = document.querySelector('.servicios-grid');
  if (grid){
    const cards = Array.from(grid.querySelectorAll('.srv-card'));

    // Toolbar (chips) si no existe
    if (!document.querySelector('.servicios-toolbar')) {
      const toolbar = document.createElement('div');
      toolbar.className = 'servicios-toolbar';
      const chips = [];
      const addChip = (label, value) => {
        const chip = document.createElement('button');
        chip.type = 'button'; chip.className = 'chip'; chip.textContent = label; chip.dataset.value = value;
        chip.addEventListener('click', ()=>{
          chips.forEach(c=>c.classList.remove('active')); chip.classList.add('active');
          const v = chip.dataset.value;
          cards.forEach(card=>{
            const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const ok = v === '*' || title.includes(v);
            card.style.display = ok ? '' : 'none';
          });
        });
        chips.push(chip); toolbar.appendChild(chip);
      };
      addChip('Todos','*');
      [...new Set(cards.map(c => (c.querySelector('h3')?.textContent || '').trim().toLowerCase()))]
        .forEach(t => addChip(t.charAt(0).toUpperCase()+t.slice(1), t));
      grid.parentElement.insertBefore(toolbar, grid);
      chips[0].classList.add('active');
    }

    // Tilt 3D
    cards.forEach(card=>{
      const rect = () => card.getBoundingClientRect();
      card.addEventListener('mousemove', (e)=>{
        const r = rect(); const px = (e.clientX - r.left)/r.width - .5; const py = (e.clientY - r.top)/r.height - .5;
        card.style.transform = `rotateY(${px*10}deg) rotateX(${ -py*10}deg)`;
      });
      card.addEventListener('mouseleave', ()=> card.style.transform = '');
    });

    // Modal (una sola instancia reutilizable)
    if (!document.querySelector('.srv-modal')) {
      const modal = document.createElement('div');
      modal.className = 'srv-modal';
      modal.innerHTML = `
        <div class="backdrop" data-close></div>
        <div class="panel">
          <button class="close" data-close aria-label="Cerrar">✕</button>
          <h3 class="title"></h3>
          <p class="desc"></p>
          <div class="actions">
            <button class="btn ghost" data-close>Cerrar</button>
            <a class="btn primary" id="ctaWhats" target="_blank" rel="noopener">Contactar por WhatsApp</a>
          </div>
        </div>`;
      document.body.appendChild(modal);

      const openModal = (title, desc) => {
        modal.querySelector('.title').textContent = title || 'Servicio';
        modal.querySelector('.desc').textContent = desc || 'Descripción disponible próximamente.';
        const wa = 'https://wa.me/573176384710?text=' + encodeURIComponent(`Hola, quiero información sobre: ${title}`);
        modal.querySelector('#ctaWhats').href = wa;
        modal.classList.add('open'); document.documentElement.style.overflow = 'hidden';
      };
      const closeModal = () => { modal.classList.remove('open'); document.documentElement.style.overflow = ''; };
      modal.addEventListener('click', e=>{ if(e.target.hasAttribute('data-close')) closeModal(); });
      document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal.classList.contains('open')) closeModal(); });

    grid.addEventListener('click', e=>{
  const btn = e.target.closest('.btn-outline'); 
  if (!btn) return;

  // ⛔ Si es un botón que usa el panel (tiene data-key o href="#..."), NO abras el modal
  const href = btn.getAttribute('href') || '';
  if (btn.hasAttribute('data-key') || href.startsWith('#')) return;

  // ✅ Solo aquí usamos el modal para enlaces "externos" (no hash)
  e.preventDefault();
  const card  = btn.closest('.srv-card');
  const title = card.querySelector('h3')?.textContent.trim();
  const desc  = card.querySelector('p')?.textContent.trim();
  openModal(title, desc);
});

    }

    // Reveal de tarjetas
    if ('IntersectionObserver' in window) {
      const ioS = new IntersectionObserver((es)=> es.forEach(x=> x.isIntersecting && x.target.classList.add('show')), {threshold:.2});
      cards.forEach(c=>{ c.classList.add('reveal'); ioS.observe(c); });
    }
  }

  /* ---------- 5) FAQ: buscador, expandir/contraer, highlight ---------- */
  const faqWrap = document.querySelector('.sec-faq .container');
  if (faqWrap){
    const items = Array.from(faqWrap.querySelectorAll('.faq-item'));

    if (!document.querySelector('.faq-toolbar')) {
      const bar = document.createElement('div');
      bar.className = 'faq-toolbar';
      bar.innerHTML = `
        <input class="faq-search" type="search" placeholder="Buscar pregunta..." aria-label="Buscar en preguntas frecuentes">
        <button class="btn" data-act="open">Expandir todo</button>
        <button class="btn" data-act="close">Contraer todo</button>`;
      faqWrap.insertBefore(bar, items[0]);

      const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const clearHi = el => el.querySelectorAll('mark.highlight').forEach(m => m.replaceWith(m.textContent));
      const hi = (el,q)=>{
        if(!q) return;
        const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')})`,'gi');
        ['summary','p'].forEach(sel=>{
          el.querySelectorAll(sel).forEach(node=>{
            clearHi(node);
            node.innerHTML = node.innerHTML.replace(re,'<mark class="highlight">$1</mark>');
          });
        });
      };

      const search = bar.querySelector('.faq-search');
      search.addEventListener('input', ()=>{
        const q = norm(search.value.trim());
        items.forEach(it=>{
          clearHi(it);
          const text = norm(it.textContent);
          const match = !q || text.includes(q);
          it.style.display = match ? '' : 'none';
          if (match && q) hi(it, q);
        });
      });

      bar.addEventListener('click', e=>{
        const act = e.target.dataset.act; if(!act) return;
        items.forEach(it => it.open = (act === 'open'));
      });
    }

    if ('IntersectionObserver' in window) {
      const ioF = new IntersectionObserver((es)=> es.forEach(x=> x.isIntersecting && x.target.classList.add('show')), {threshold:.2});
      items.forEach(i=>{ i.classList.add('reveal'); ioF.observe(i); });
    }
  }
});
// === FOOTER: reveal + botón "Ir arriba" + WhatsApp ===
window.addEventListener('DOMContentLoaded', () => {
  // Reveal suave de las 3 columnas del footer
  (function(){
    const cols = document.querySelectorAll('.footer-grid > div');
    if (!cols.length) return;
    cols.forEach(c => c.classList.add('reveal'));
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
    }, { threshold: 0.2 });
    cols.forEach(c => io.observe(c));
  })();

  // Botón "Ir arriba" (evita duplicados)
  (function(){
    if (document.getElementById('toTop')) return;
    const toTop = document.createElement('button');
    toTop.id = 'toTop';
    toTop.setAttribute('aria-label','Ir arriba');
    toTop.textContent = '↑';
    document.body.appendChild(toTop);

    const toggle = () => window.scrollY > 600 ? toTop.classList.add('show') : toTop.classList.remove('show');
    window.addEventListener('scroll', toggle, { passive:true });
    toggle();

    toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  })();

  // Botón flotante de WhatsApp (evita duplicados)
  (function(){
    if (document.getElementById('waFloat')) return;
    const WA = document.createElement('a');
    WA.id = 'waFloat';
    WA.href = 'https://wa.me/573176384710';
    WA.target = '_blank';
    WA.rel = 'noopener';
    WA.innerHTML =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.1 17.6c-.3-.2-1.7-.8-1.9-.9-.3-.1-.5-.2-.8.2-.2.3-.9 1-.9 1s-.3.3-.8.1c-.4-.2-1.4-.5-2.7-1.8-1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.5-.7.2-.2.2-.4.3-.7 0-.2 0-.5-.1-.7-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5s-1.3 1.2-1.3 2.9 1.4 3.3 1.6 3.5c.2.3 2.7 4.1 6.5 5.6.9.4 1.6.6 2.2.8.9.3 1.7.3 2.3.2.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6 0 0-.2-.1-.3-.2zM16 3C9.4 3 4 8.4 4 14.9c0 2.6.9 5 2.3 7l-1.5 5.2 5.4-1.4c1.9 1 4 .1 5.8.1 6.6 0 12-5.4 12-12s-5.4-12-12-12z"/></svg>';
    document.body.appendChild(WA);

    const toggle = () => window.scrollY > 400 ? WA.classList.add('show') : WA.classList.remove('show');
    window.addEventListener('scroll', toggle, { passive:true });
    toggle();
  })();
});

document.addEventListener('DOMContentLoaded', () => {
  // ===== Contenido + imagen de cada servicio =====
 const SERVICIOS_DETALLE = {
  mejora: {
    titulo: 'Auditoría Interna',
    img: 'assets/auditoria.jpg',
    html: `
      <h4>Impulsa la excelencia y el cumplimiento</h4>
      <p>
        Evaluamos tus procesos con una mirada objetiva para asegurar
        <strong>calidad, seguridad y cumplimiento</strong>, y convertir los hallazgos en
        oportunidades reales de mejora.
      </p>
      <ul class="bullets">
        <li><strong>Diagnóstico claro:</strong> identificamos brechas y priorizamos acciones.</li>
        <li><strong>Mejora continua:</strong> planes prácticos y medibles que sí se implementan.</li>
        <li><strong>Confianza y reputación:</strong> fortalece tu sistema de gestión ante clientes y auditorías externas.</li>
      </ul>
      <p>
        Nuestra meta: procesos más <strong>seguros, eficientes y sostenibles</strong>, con resultados que se notan en el día a día.
      </p>
    `
  },

  consultoria: {
    titulo: 'Asesoría y Consultoría',
    img: 'assets/asesoria.jpg',
    html: `
      <h4>Soluciones a la medida que generan impacto</h4>
      <p>
        Te acompañamos a diseñar e implementar estrategias de <strong>seguridad, salud y bienestar</strong>
        alineadas con tus metas de negocio. Menos riesgo, más productividad.
      </p>
      <ul class="bullets">
        <li><strong>Estrategia personalizada:</strong> cada empresa es distinta; tu solución también.</li>
        <li><strong>Gestión del riesgo efectiva:</strong> decisiones basadas en datos y realidad operativa.</li>
        <li><strong>Bienestar del equipo:</strong> programas que mejoran clima, salud y desempeño.</li>
      </ul>
      <p>
        Deja los temas complejos en manos expertas y enfócate en crecer con
        un entorno de trabajo <strong>más seguro y humano</strong>.
      </p>
    `
  },

  capacitacion: {
    titulo: 'Capacitación y Entrenamiento',
    img: 'assets/capacitacion.jpg',
    html: `
      <h4>Equipos preparados, empresas más seguras</h4>
      <p>
        Diseñamos experiencias de aprendizaje <strong>prácticas y memorables</strong> para desarrollar
        habilidades clave: prevención, respuesta y autocuidado.
      </p>
      <ul class="bullets">
        <li><strong>Metodología activa:</strong> casos reales, práctica guiada y evaluación.</li>
        <li><strong>Competencias aplicables:</strong> lo que se aprende, se usa en el trabajo.</li>
        <li><strong>Cultura de seguridad:</strong> hábitos que reducen incidentes y mejoran la productividad.</li>
      </ul>
      <p>
        Invierte en conocimiento que <strong>salva vidas</strong> y hace que tu operación funcione mejor cada día.
      </p>
    `
  },

  habilidades: {
    titulo: 'Desarrollo y Certificación de Habilidades',
    img: 'assets/desarrollo.jpg',
    html: `
      <h4>Certifica el talento que te protege</h4>
      <p>
        Programas prácticos para validar y elevar competencias en emergencias y trabajos de alto riesgo.
        Tu equipo con la <strong>confianza</strong> y el respaldo que necesita.
      </p>
      <ul class="bullets">
        <li><strong>Entrenamiento realista:</strong> escenarios controlados y simulaciones.</li>
        <li><strong>Estandares reconocidos:</strong> certificaciones con valor para tu operación y auditorías.</li>
        <li><strong>Respuesta efectiva:</strong> personas listas para actuar cuando más importa.</li>
      </ul>
      <p>
        Convierte a tu equipo en un <strong>activo estratégico</strong> de seguridad y cumplimiento.
      </p>
    `
  }
};


  // ===== Referencias del panel =====
  const panel   = document.getElementById('detalle-servicio');
  const titleEl = document.getElementById('srv-title');
  const bodyEl  = document.getElementById('srv-body');
  const waEl    = document.getElementById('srv-wa');
  const closeEl = document.getElementById('srv-close');
  const imgEl   = document.getElementById('srv-img');

  // ===== Función abrir detalle =====
  function openDetalle(key){
    const data = SERVICIOS_DETALLE[key];
    if (!data) return;

    // Texto
    titleEl.textContent = data.titulo;
    bodyEl.innerHTML = data.html;

    // Imagen
    if (data.img) {
      imgEl.src = data.img;
      imgEl.alt = `Imagen de ${data.titulo}`;
      imgEl.style.display = 'block';
    } else {
      imgEl.style.display = 'none';
    }

    // WhatsApp
    waEl.href = 'https://wa.me/573176384710?text=' + encodeURIComponent(
      `Hola, quiero información sobre: ${data.titulo}`
    );

    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  // ===== Función cerrar =====
  function closeDetalle(){
    panel.classList.add('hidden');
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }

  // ===== Eventos =====
  const grid = document.querySelector('.servicios-grid');
  grid?.addEventListener('click', (e)=>{
    const btn = e.target.closest('.btn-outline[data-key]');
    if (!btn) return;
    const key = btn.dataset.key;
    requestAnimationFrame(()=> openDetalle(key));
  });

  closeEl?.addEventListener('click', () => {
    closeDetalle();
    document.querySelector('#servicios')?.scrollIntoView({behavior:'smooth'});
  });

  // Deep-link
  function handleHash(){
    const hash = (location.hash || '').slice(1);
    if (['mejora','consultoria','capacitacion','habilidades'].includes(hash)) {
      openDetalle(hash);
    } else {
      panel.classList.add('hidden');
    }
  }
  window.addEventListener('hashchange', handleHash);
  handleHash();
});



(() => {
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');

  // 1) Cargar preferencia guardada o del sistema
  const saved = localStorage.getItem('theme');
  if (saved) {
    root.setAttribute('data-theme', saved);
  } else if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme','dark');
  }

  // 2) Actualizar icono
  const setIcon = () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    if (btn) btn.textContent = dark ? '☀️' : '🌙';
    // opcional para la barra del navegador en móviles
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta'); meta.name='theme-color'; document.head.appendChild(meta);
    }
    meta.content = dark ? '#0e1117' : '#ffffff';
  };
  setIcon();

  // 3) Alternar al click
  btn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIcon();
  });
})();

// ===== FOOTER: partículas animadas + reveal =====
(() => {
  const canvas = document.getElementById('footerFx');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, raf = null, particles = [], visible = false;

  const themeIsDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  function resize(){
    const rect = canvas.getBoundingClientRect();
    w = canvas.width  = Math.floor(rect.width * devicePixelRatio);
    h = canvas.height = Math.floor(rect.height * devicePixelRatio);
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    makeParticles();
  }

  function makeParticles(){
    const count = Math.max(28, Math.floor(w/50));
    particles = Array.from({length: count}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      r: 2 + Math.random()*3.5,
      vx: (-0.4 + Math.random()*0.8),
      vy: (-0.2 + Math.random()*0.6),
      hue: Math.random() < 0.5 ? 28 : 184 // naranja, turquesa
    }));
  }

  function step(){
    if (!visible) { raf = requestAnimationFrame(step); return; }
    ctx.clearRect(0,0,w,h);

    // fondo tenue (para atenuar contraste si el tema es claro)
    if (!themeIsDark()){
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      ctx.fillRect(0,0,w,h);
    }

    for (const p of particles){
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w+10; if (p.x > w+10) p.x = -10;
      if (p.y < -10) p.y = h+10; if (p.y > h+10) p.y = -10;

      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
      const base = p.hue;
      const alpha = themeIsDark() ? 0.18 : 0.12;
      grad.addColorStop(0, `hsla(${base} 90% 55% / ${alpha*2})`);
      grad.addColorStop(1, `hsla(${base} 90% 55% / 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r*6, 0, Math.PI*2); ctx.fill();
    }
    raf = requestAnimationFrame(step);
  }

  // Inicia/pausa según visibilidad
  const io = new IntersectionObserver(es=>{
    visible = es.some(e=>e.isIntersecting);
  }, {threshold: 0.1});
  io.observe(canvas);

  // Reaccionar a cambios de tema en vivo
  const themeObserver = new MutationObserver(resize);
  themeObserver.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });

  window.addEventListener('resize', resize, {passive:true});
  resize();
  step();

  // Reveal de tarjetas
  const cards = document.querySelectorAll('.site-footer.pro .fcard');
  if (cards.length && 'IntersectionObserver' in window){
    const io2 = new IntersectionObserver(es=>{
      es.forEach(e=> e.isIntersecting && e.target.classList.add('show'));
    }, {threshold: .18});
    cards.forEach(c=>{ c.classList.add('reveal'); io2.observe(c); });
  }
})();
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // si no hay preferencia guardada, inicia en oscuro
    document.documentElement.setAttribute('data-theme', 'dark');
  }function toggleTheme() {
  const html = document.documentElement;
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

    // año dinámico
  (function(){
    var y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();
  })();

  // botón Ir arriba
  (function(){
    var toTop = document.getElementById('toTop');
    if(!toTop) return;
    var toggle = function(){
      if (window.scrollY > 400) toTop.classList.add('show');
      else toTop.classList.remove('show');
    };
    window.addEventListener('scroll', toggle, {passive:true});
    toggle();
    toTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });
  })();