
(() => {
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn(
      'GSAP / ScrollTrigger could not load. Check your internet connection.'
    );
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);
  const $$ = (selector, parent = document) =>
    gsap.utils.toArray(selector, parent);
  const opening = $('.opening');
  const pin = $('.opening-pin');
  const paths = $$('.signature path');
  const lockup = $('.brand-lockup');
  const copy = $('.opening-copy');
  const footer = $('.opening-footer');
  const signature = $('.signature');
  const header = $('.site-header');
  const aboutContent = $('.about-content');
  const openingElements = [lockup, copy, footer].filter(Boolean);
  if (header) {
    gsap.set(header, {
      autoAlpha: 0,
      pointerEvents: 'none'
    });
  }
  if (reduceMotion) {
    gsap.set(openingElements, {
      opacity: 1,
      clearProps: 'transform,filter'
    });
    gsap.set(paths, {
      strokeDasharray: 'none',
      strokeDashoffset: 0,
      opacity: 1
    });
    if (signature) {
      gsap.set(signature, {
        opacity: 1,
        clearProps: 'filter'
      });
    }
    if (header) {
      gsap.set(header, {
        autoAlpha: 1,
        pointerEvents: 'auto'
      });
    }
    return;
  }
  paths.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1
    });
  });
  gsap.set(openingElements, {
    opacity: 0,
    y: 0
  });
  gsap.to(openingElements, {
    opacity: 1,
    duration: 1.8,
    delay: 0.5,
    ease: 'power2.out'
  });
  if (opening && pin) {
    const timeline = gsap.timeline({
      defaults: {
        ease: 'none'
      },
      scrollTrigger: {
        trigger: opening,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        pin: pin,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    if (paths.length) {
      timeline.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 3.2,
          stagger: 0.08,
          ease: 'none'
        },
        0.48
      );
    }
    if (copy) {
      timeline.to(
        copy,
        {
          opacity: 0.72,
          duration: 0.34
        },
        2.98
      );
    }
    if (paths.length) {
      timeline.to(
        paths,
        {
          opacity: 0,
          duration: 0.22
        },
        3.85
      );
    }
    if (openingElements.length) {
      timeline.to(
        openingElements,
        {
          opacity: 0,
          filter: 'blur(14px)',
          duration: 0.22
        },
        3.85
      );
    }
    if (signature) {
      timeline.to(
        signature,
        {
          opacity: 0,
          filter: 'blur(14px)',
          duration: 0.22
        },
        3.85
      );
    }
  }
  if (header && $('.about')) {
    ScrollTrigger.create({
      trigger: '.about',
      start: 'top 72%',
      end: 'bottom top',
      onEnter: () => {
        gsap.to(header, {
          autoAlpha: 1,
          duration: 0.35,
          pointerEvents: 'auto',
          overwrite: true
        });
      },
      onEnterBack: () => {
        gsap.to(header, {
          autoAlpha: 1,
          duration: 0.25,
          pointerEvents: 'auto',
          overwrite: true
        });
      },
      onLeaveBack: () => {
        gsap.to(header, {
          autoAlpha: 0,
          duration: 0.2,
          pointerEvents: 'none',
          overwrite: true
        });
      }
    });
  }
  const headerSections = [
    {
      section: '.about',
      target: '#about-title',
      theme: 'dark'
    },
    {
      section: '.story',
      target: '#projects-title',
      theme: 'dark'
    },
    {
      section: '.visuals',
      target: '#visuals',
      theme: 'dark'
    },
    {
      section: '.contact',
      target: '#contact',
      theme: 'dark'
    }
  ];
  function updateHeader(item) {
    if (!header) return;
    header.classList.toggle(
      'is-about',
      item.section === '.about'
    );
    header.classList.toggle(
      'is-light-bg',
      item.theme === 'light'
    );
    header.classList.toggle(
      'is-dark-bg',
      item.theme === 'dark'
    );
    $$('nav a', header).forEach((link) => {
      const isActive =
        link.getAttribute('href') === item.target;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
  headerSections.forEach((item) => {
    const section = $(item.section);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      onEnter: () => updateHeader(item),
      onEnterBack: () => updateHeader(item)
    });
  });
  if (aboutContent) {
    gsap.set(aboutContent, {
      opacity: 0,
      filter: 'blur(14px)',
      y: 0
    });
    gsap.to(aboutContent, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top 85%',
        end: 'top 35%',
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    });
  }
  if ($('.about-image')) {
    gsap.from('.about-image', {
      clipPath: 'inset(0 0 0 100%)',
      duration: 1.15,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '.about-image',
        start: 'top 90%',
        once: true
      }
    });
  }
  const storyImage = $('.story-image');
  if (storyImage) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            storyImage.classList.add('is-clear');
            currentObserver.unobserve(storyImage);
          }
        });
      },
      {
        threshold: 0.2
      }
    );
    observer.observe(storyImage);
  }
  const storyItems = $$('.story-copy > *');
  if (storyItems.length) {
    gsap.fromTo(
      storyItems,
      {
        opacity: 0,
        filter: 'blur(8px)',
        clipPath: 'inset(0 0 0 100%)'
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        clipPath: 'inset(0 0 0 0)',
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.story',
          start: 'top 68%',
          once: true
        }
      }
    );
  }
  const visualsTitle = $('.visuals > .eyebrow');
  if (visualsTitle) {
    gsap.fromTo(
      visualsTitle,
      {
        clipPath: 'inset(0 100% 0 0)'
      },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.3,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: visualsTitle,
          start: 'top 85%',
          once: true
        }
      }
    );
  }
const visualItems = $$('.accordion-item');
if (visualItems.length) {
  gsap.fromTo(
    visualItems,
    {
      opacity: 0,
      clipPath: 'inset(0 0 100% 0)',
      y: 25
    },
    {
      opacity: 1,
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'clipPath',
      scrollTrigger: {
        trigger: '.visual-accordion',
        start: 'top 82%',
        once: true
      }
    }
  );
}
  const contactTitle = $('.contact h2');
  if (contactTitle) {
    gsap.fromTo(
      contactTitle,
      {
        clipPath: 'inset(0 100% 0 0)'
      },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 72%',
          once: true
        }
      }
    );
  }
  const contactLink = $('.contact > a');
  if (contactLink) {
    ScrollTrigger.create({
      trigger: contactLink,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        contactLink.classList.add('is-line-visible');
      }
    });
  }
  const storyCards = $$('.story-card');
  storyCards.forEach((card) => {
    const label = $('.story-label', card);
    if (!label) return;
    gsap.fromTo(
      label,
      {
        y: -45,
        opacity: 0.8
      },
      {
        y: 55,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );
  });
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
})();
//カーソru
(() => {
  const customCursor = document.querySelector('.custom-cursor');
  if (!customCursor) return;
  const cursorText = customCursor.querySelector('span');
  window.addEventListener('mousemove', (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll('.site-header nav a').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-active');
      if (cursorText) {
        cursorText.textContent = link.textContent.trim();
      }
    });
    link.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-active');
    });
  });
  document.querySelectorAll('a, button').forEach((element) => {
    if (element.closest('.site-header nav')) return;
    element.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-active');
      if (!cursorText) return;
      if (element.classList.contains('visual-view-all')) {
        cursorText.textContent = 'VIEW ALL';
      } else if (element.classList.contains('accordion-item')) {
        cursorText.textContent = 'VIEW';
      } else if (element.closest('.contact')) {
        cursorText.textContent = 'GET IN TOUCH';
      } else {
        cursorText.textContent = 'VIEW MORE';
      }
    });
    element.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-active');
      if (cursorText) {
        cursorText.textContent = 'VIEW MORE';
      }
    });
  });
})();