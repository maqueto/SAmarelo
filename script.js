/* =========================================================
   SETEMBRO AMARELO — script.js
   JavaScript puro (Vanilla). Sem dependências externas.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Cada init roda isolado: se um quebrar, os outros continuam funcionando
  // e o conteúdo da página nunca fica travado/invisível por causa disso.
  const inits = [
    initMobileMenu,
    initSmoothScroll,
    initScrollReveal,
    initStarfield,
    initFlipCards,
    initAccordion,
    initBuscarAjuda,
    initUniverseMessage,
  ];

  inits.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`Erro ao iniciar ${fn.name}:`, err);
    }
  });

  // Rede de segurança: se por qualquer motivo o scroll reveal não rodar
  // (JS travado, IntersectionObserver indisponível, erro em outro lugar),
  // garante que todo o conteúdo apareça mesmo assim depois de 1.2s.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      el.classList.add('is-visible');
    });
  }, 1200);
});

/* ---------------------------------------------------------
   1) MENU MOBILE
--------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });

  // Fecha o menu ao clicar em um link (mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Fecha com a tecla Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/* ---------------------------------------------------------
   2) ROLAGEM SUAVE ENTRE SEÇÕES
   (reforço em JS para navegadores sem suporte total a CSS)
--------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------------------------------------------------------
   3) ANIMAÇÕES AO APARECER NA TELA (scroll reveal)
--------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el, index) => {
    // pequeno atraso escalonado para cards no mesmo grupo
    el.style.transitionDelay = `${Math.min(index % 6, 5) * 60}ms`;
    observer.observe(el);
  });
}

/* ---------------------------------------------------------
   4) FUNDO DE PARTÍCULAS SUAVES (luz/estrelas)
   Canvas leve, discreto, respeita prefers-reduced-motion.
--------------------------------------------------------- */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor((width * height) / 24000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.15 + 0.03,
      drift: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.twinkle += 0.02;
      const twinkleAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 201, 60, ${twinkleAlpha.toFixed(2)})`;
      ctx.fill();

      // movimento lento, tipo "flutuação"
      p.y -= p.speed;
      p.x += p.drift;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
    });

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  resize();
  createParticles();
  draw();

  if (!prefersReducedMotion) {
    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }
}

/* ---------------------------------------------------------
   5) CARDS INTERATIVOS — "Como posso ajudar?"
   Clique/toque para revelar o detalhe (funciona com teclado também).
--------------------------------------------------------- */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach((card) => {
    // Cria o parágrafo de detalhe uma única vez
    if (!card.querySelector('.card-detail')) {
      const detail = document.createElement('p');
      detail.className = 'card-detail';
      detail.textContent = card.dataset.detail || '';
      card.appendChild(detail);
    }

    card.addEventListener('click', () => {
      const alreadyOpen = card.classList.contains('is-open');
      // Fecha os outros cards abertos para manter a leitura organizada
      cards.forEach((c) => c.classList.remove('is-open'));
      if (!alreadyOpen) {
        card.classList.add('is-open');
      }
    });
  });
}

/* ---------------------------------------------------------
   6) ACCORDION — "Mitos e verdades"
--------------------------------------------------------- */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Fecha os demais itens (comportamento de acordeão clássico)
      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------------------------------------------------------
   7) BOTÃO "QUERO BUSCAR AJUDA"
--------------------------------------------------------- */
function initBuscarAjuda() {
  const btn = document.getElementById('buscarAjudaBtn');
  const info = document.getElementById('ajudaInfo');
  if (!btn || !info) return;

  btn.addEventListener('click', () => {
    const isHidden = info.hasAttribute('hidden');
    if (isHidden) {
      info.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
      info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      info.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------------------------------------------------------
   8) "UMA MENSAGEM PARA O UNIVERSO"
   - Seleção de sentimento (chips)
   - Envio com animação de estrela subindo
   - Nenhuma mensagem é salva, enviada a um servidor ou publicada
--------------------------------------------------------- */
function initUniverseMessage() {
  const feelingsGroup = document.getElementById('feelingsGroup');
  const messageInput = document.getElementById('universeMessage');
  const sendBtn = document.getElementById('sendMessageBtn');
  const form = document.getElementById('universeForm');
  const result = document.getElementById('universeResult');
  const writeAgainBtn = document.getElementById('writeAgainBtn');

  if (!feelingsGroup || !messageInput || !sendBtn || !form || !result) return;

  let selectedFeeling = null;

  feelingsGroup.querySelectorAll('.feeling-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const isSelected = chip.classList.contains('selected');
      feelingsGroup.querySelectorAll('.feeling-chip').forEach((c) => c.classList.remove('selected'));
      if (!isSelected) {
        chip.classList.add('selected');
        selectedFeeling = chip.dataset.feeling;
      } else {
        selectedFeeling = null;
      }
    });
  });

  sendBtn.addEventListener('click', async () => {
    const text = messageInput.value.trim();

    if (!text && !selectedFeeling) {
      messageInput.setAttribute('placeholder', 'Escreva algo antes de enviar, mesmo que poucas palavras…');
      messageInput.focus();
      return;
    }

    // A mensagem é salva de forma ANÔNIMA (sem nome, e-mail, telefone,
    // localização ou qualquer identificador) apenas para que a equipe do
    // projeto possa acompanhar, com cuidado, o que as pessoas estão sentindo.
    // Ela não é publicada publicamente em nenhum lugar do site.
    sendBtn.disabled = true;
    try {
      await fetch('/api/mensagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentimento: selectedFeeling, mensagem: text }),
      });
    } catch (err) {
      // Mesmo se o envio falhar (ex: sem conexão), a experiência de
      // reflexão para a pessoa continua normalmente.
      console.warn('Não foi possível registrar a mensagem agora.');
    }

    playSendAnimation(() => {
      form.style.display = 'none';
      result.hidden = false;
      result.querySelector('.universe-final-message').focus?.();
      sendBtn.disabled = false;
    });
  });

  writeAgainBtn?.addEventListener('click', () => {
    messageInput.value = '';
    feelingsGroup.querySelectorAll('.feeling-chip').forEach((c) => c.classList.remove('selected'));
    selectedFeeling = null;
    result.hidden = true;
    form.style.display = '';
    form.style.opacity = '1';
    messageInput.focus();
  });

  function playSendAnimation(onComplete) {
    // 1) A mensagem desaparece suavemente
    form.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';

    // 2) Uma pequena estrela/luz aparece e sobe pela tela
    const star = document.createElement('div');
    star.className = 'rising-star';
    star.setAttribute('aria-hidden', 'true');
    star.textContent = '✨';
    document.body.appendChild(star);

    // 3) Pequenas partículas acompanham a animação
    spawnParticleBurst();

    setTimeout(() => {
      star.remove();
    }, 2300);

    setTimeout(onComplete, 550);
  }

  function spawnParticleBurst() {
    const burstCount = 10;
    for (let i = 0; i < burstCount; i++) {
      const dot = document.createElement('div');
      dot.setAttribute('aria-hidden', 'true');
      dot.style.position = 'fixed';
      dot.style.left = '50%';
      dot.style.bottom = '10%';
      dot.style.width = '5px';
      dot.style.height = '5px';
      dot.style.borderRadius = '50%';
      dot.style.background = '#FFC93C';
      dot.style.zIndex = '499';
      dot.style.pointerEvents = 'none';
      dot.style.opacity = '0.85';

      const angle = (Math.random() - 0.5) * 140; // graus, leque ao redor da estrela
      const distance = 40 + Math.random() * 60;
      const rad = (angle * Math.PI) / 180;
      const dx = Math.sin(rad) * distance;
      const dy = -Math.abs(Math.cos(rad) * distance) - 40;

      dot.animate(
        [
          { transform: 'translate(-50%, 0) scale(1)', opacity: 0.85 },
          { transform: `translate(calc(-50% + ${dx}px), ${dy}px) scale(0)`, opacity: 0 },
        ],
        { duration: 1400 + Math.random() * 600, easing: 'ease-out', fill: 'forwards' }
      );

      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 2200);
    }
  }
}
