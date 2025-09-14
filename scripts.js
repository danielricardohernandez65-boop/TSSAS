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
        <h4>Auditorías y sistemas de gestión</h4>
        <ul>
          <li>Sistema de Gestión en Seguridad y Salud SGSS (ISO 45001:2018)</li>
          <li>Seguridad y salud en el trabajo con enfoque en energía eléctrica (Res. 5018:2019)</li>
          <li>Registro Uniforme de Evaluación del Sistema de Gestión en Seguridad, Salud Ocupacional y Ambiente para Contratistas – RUC</li>
          <li>Sistema de Gestión de la Calidad (ISO 9001:2015)</li>
          <li>Sistemas Integrados de Gestión HSEQ</li>
          <li>Sistema de Gestión Ambiental SGA (ISO 14001:2015)</li>
          <li>Gestión del Riesgo (ISO 31000:2018)</li>
          <li>Sistema de Gestión de Seguridad Vial (ISO 39001:2012)</li>
          <li>Auditorías internas a Sistemas de Gestión (ISO 19011:2018)</li>
          <li>Gestión del Riesgo de Desastres (Decreto 2157 de 2017)</li>
          <li>Sistema de Gestión en Control y Seguridad BASC (SGCS BASC V5–2017)</li>
        </ul>
      `
    },
    consultoria: {
      titulo: 'Asesoría y Consultoría',
      img: 'assets/asesoria.jpg',
      html: `
        <h4>Acompañamiento técnico</h4>
        <ul>
          <li>Comité de Convivencia y COPASST</li>
          <li>Identificación de peligros y valoración de riesgos</li>
          <li>Investigación de incidentes y accidentes de trabajo</li>
          <li>Mediciones de Higiene Industrial y Ambiental</li>
          <li>Programas de bioseguridad y psicosocial</li>
          <li>Diagnóstico de condiciones de salud</li>
          <li>Programas de estilos de vida saludables</li>
          <li>Protocolos y toma de muestras</li>
          <li>Desinfección y sanitización</li>
          <li>Campañas y jornadas saludables</li>
        </ul>
      `
    },
    capacitacion: {
      titulo: 'Capacitación y Entrenamiento',
      img: 'assets/capacitacion.jpg',
      html: `
        <h4>Formación frente a riesgos</h4>
        <ul>
          <li>Riesgo físico</li>
          <li>Riesgo químico</li>
          <li>Riesgo biomecánico</li>
          <li>Riesgo de seguridad</li>
          <li>Riesgo locativo</li>
          <li>Riesgo eléctrico</li>
          <li>Riesgo público</li>
          <li>Riesgo psicosocial</li>
          <li>Riesgo biológico</li>
          <li>Medicina Preventiva y del Trabajo</li>
          <li>Higiene Industrial</li>
        </ul>
      `
    },
    habilidades: {
      titulo: 'Desarrollo y Certificación de Habilidades',
      img: 'assets/desarrollo.jpg',
      html: `
        <h4>Programas y certificaciones</h4>
        <ul>
          <li>Primeros auxilios</li>
          <li>Brigadas de respuesta a emergencias</li>
          <li>Técnicas de evacuación y rescate</li>
          <li>Brigadas contra incendios</li>
          <li>Trabajo seguro en alturas</li>
          <li>Trabajo seguro en espacios confinados</li>
          <li>Atención a víctimas en siniestros viales</li>
          <li>Certificación internacional de Brigadista integral</li>
        </ul>
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
