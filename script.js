document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');

  let lastScrollY = window.scrollY;
  const updateHeader = () => {
    if (!header) return;
    const currentScrollY = window.scrollY;
    header.classList.toggle('is-scrolled', currentScrollY > 18);
    if (currentScrollY < 20 || currentScrollY < lastScrollY - 8 || nav?.classList.contains('is-open')) {
      header.classList.remove('is-hidden');
    } else if (currentScrollY > lastScrollY + 8 && currentScrollY > 80) {
      header.classList.add('is-hidden');
    }
    lastScrollY = currentScrollY;
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
    header?.classList.remove('is-hidden');
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    reveals.forEach((element) => observer.observe(element));
  }

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = `Project enquiry — ${data.get('support') || 'Web development support'}`;
    const body = [
      `Name: ${data.get('name') || ''}`,
      `Company: ${data.get('company') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Support needed: ${data.get('support') || ''}`,
      '',
      'Project details:',
      String(data.get('message') || '')
    ].join('\n');

    window.location.href = `mailto:krishnasmidhun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  document.querySelectorAll('[data-experience]').forEach((element) => {
    const startYear = Number(element.dataset.startYear);
    const currentYear = new Date().getFullYear();
    if (Number.isFinite(startYear) && startYear <= currentYear) {
      const years = currentYear - startYear;
      element.textContent = `${years} ${years === 1 ? 'year' : 'years'}`;
    }
  });

  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack && !marqueeTrack.dataset.extended) {
    [...marqueeTrack.children].forEach((item) => marqueeTrack.append(item.cloneNode(true)));
    marqueeTrack.dataset.extended = 'true';
  }

  document.querySelectorAll('.screenshot-window').forEach((preview) => {
    const viewport = preview.querySelector('.screenshot-viewport');
    const image = preview.querySelector('img');
    const button = preview.querySelector('.screenshot-toggle');
    if (!viewport || !image) return;

    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', 'Scrollable Coinpedia page preview');

    let pausedByUser = reducedMotion;
    let autoScrolling = !pausedByUser;
    let direction = 1;
    let scrollPosition = 0;
    let lastFrame = 0;
    let endPauseUntil = 0;
    let animationFrame = 0;
    let frameRunning = false;
    let resumeTimer = 0;
    const speed = () => window.matchMedia('(max-width: 760px)').matches ? 28 : 24;

    const updateButton = () => {
      if (!button) return;
      button.textContent = pausedByUser ? 'Resume preview' : 'Pause preview';
      button.setAttribute('aria-pressed', String(pausedByUser));
      button.setAttribute('aria-label', `${pausedByUser ? 'Resume' : 'Pause'} screenshot preview`);
    };

    const stopFrame = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      frameRunning = false;
      lastFrame = 0;
    };

    const tick = (now) => {
      if (!autoScrolling || pausedByUser) {
        frameRunning = false;
        animationFrame = 0;
        return;
      }
      if (!lastFrame) lastFrame = now;
      const elapsed = Math.min(now - lastFrame, 50) / 1000;
      lastFrame = now;
      const maximum = Math.max(0, viewport.scrollHeight - viewport.clientHeight);

      if (maximum > 0 && now >= endPauseUntil) {
        const next = scrollPosition + direction * speed() * elapsed;
        if (next >= maximum) {
          scrollPosition = maximum;
          viewport.scrollTop = scrollPosition;
          direction = -1;
          endPauseUntil = now + 1800;
        } else if (next <= 0) {
          scrollPosition = 0;
          viewport.scrollTop = scrollPosition;
          direction = 1;
          endPauseUntil = now + 1800;
        } else {
          scrollPosition = next;
          viewport.scrollTop = Math.round(scrollPosition);
        }
      }
      animationFrame = requestAnimationFrame(tick);
    };

    const startFrame = () => {
      if (pausedByUser || frameRunning) return;
      autoScrolling = true;
      frameRunning = true;
      scrollPosition = viewport.scrollTop;
      lastFrame = performance.now();
      animationFrame = requestAnimationFrame(tick);
    };

    const pauseForInteraction = () => {
      if (pausedByUser) return;
      scrollPosition = viewport.scrollTop;
      autoScrolling = false;
      stopFrame();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        startFrame();
      }, 2600);
    };

    button?.addEventListener('click', () => {
      pausedByUser = !pausedByUser;
      window.clearTimeout(resumeTimer);
      if (pausedByUser) {
        autoScrolling = false;
        stopFrame();
      } else {
        startFrame();
      }
      updateButton();
    });

    viewport.addEventListener('wheel', pauseForInteraction, { passive: true });
    viewport.addEventListener('touchstart', pauseForInteraction, { passive: true });
    viewport.addEventListener('pointerdown', pauseForInteraction, { passive: true });
    viewport.addEventListener('keydown', (event) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
        pauseForInteraction();
      }
    });
    image.addEventListener('load', startFrame, { once: true });
    window.addEventListener('resize', () => {
      if (!pausedByUser && !autoScrolling) {
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(startFrame, 800);
      }
    }, { passive: true });

    updateButton();
    startFrame();
  });
});
