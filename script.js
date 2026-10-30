
(() => {
  // GSAP / ScrollTrigger の読み込み確認
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

  const opening = document.querySelector('.opening');
  const pin = document.querySelector('.opening-pin');
  const paths = gsap.utils.toArray('.signature path');

  const lockup = document.querySelector('.brand-lockup');
  const copy = document.querySelector('.opening-copy');
  const footer = document.querySelector('.opening-footer');
  const header = document.querySelector('.site-header');

  const aboutContent = document.querySelector('.about-content');
  const backgroundVideo = document.querySelector(
    '.site-background video'
  );

  // ========================================
  // 背景映像
  // ========================================

  if (backgroundVideo) {
    backgroundVideo.muted = true;

    const playPromise = backgroundVideo.play();

    if (playPromise) {
      playPromise.catch(() => {
        console.warn(
          '背景映像を再生できません。動画のパスを確認してください。'
        );
      });
    }
  }

  // ========================================
  // ヘッダーの初期状態
  // ========================================

  if (header) {
    gsap.set(header, {
      autoAlpha: 0,
      pointerEvents: 'none'
    });
  }

  // ========================================
  // 動きを減らす設定
  // ========================================

  if (reduceMotion) {
    gsap.set([lockup, copy, footer].filter(Boolean), {
      opacity: 1,
      clearProps: 'transform,filter'
    });

    gsap.set(paths, {
      strokeDasharray: 'none',
      strokeDashoffset: 0,
      opacity: 1
    });

    if (header) {
      gsap.set(header, {
        autoAlpha: 1,
        pointerEvents: 'auto'
      });
    }

    return;
  }

  // ========================================
  // オープニングの波線
  // ========================================

  paths.forEach((path) => {
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1
    });
  });

  // ========================================
  // ロゴ・文章・フッターの初期状態
  // ========================================

  const openingElements = [lockup, copy, footer].filter(Boolean);

  gsap.set(openingElements, {
    opacity: 0,
    y: 0
  });

  // ページ読み込み後、自動でフェードイン
  gsap.to(openingElements, {
    opacity: 1,
    duration: 1.8,
    delay: 0.5,
    ease: 'power2.out'
  });

  // ========================================
  // オープニングのスクロールアニメーション
  // ========================================

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

    // 波線を描く
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

    // 文章を少し薄くする
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

    // 波線を消す
    timeline.to(
      paths,
      {
        opacity: 0,
        duration: 0.22
      },
      3.85
    );

    // ロゴ・文章・フッターを消す
    timeline.to(
      openingElements,
      {
        opacity: 0,
        filter: 'blur(14px)',
        duration: 0.22
      },
      3.85
    );

    // サインを消す
    timeline.to(
      '.signature',
      {
        opacity: 0,
        filter: 'blur(14px)',
        duration: 0.22
      },
      3.85
    );
  }

  // ========================================
  // ABOUT：ヘッダーの表示・非表示
  // ========================================

  if (header && document.querySelector('.about')) {
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

  // ========================================
  // ヘッダー：セクションごとの色と選択状態
  // ========================================

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

  function updateHeader(sectionInfo) {
    if (!header) return;

    header.classList.toggle(
      'is-about',
      sectionInfo.section === '.about'
    );

    header.classList.toggle(
      'is-light-bg',
      sectionInfo.theme === 'light'
    );

    header.classList.toggle(
      'is-dark-bg',
      sectionInfo.theme === 'dark'
    );

    header.querySelectorAll('nav a').forEach((link) => {
      const isActive =
        link.getAttribute('href') === sectionInfo.target;

      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  headerSections.forEach((item) => {
    const section = document.querySelector(item.section);

    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',

      onEnter: () => updateHeader(item),
      onEnterBack: () => updateHeader(item)
    });
  });

  // ========================================
  // ABOUT：文字のフェードイン
  // ========================================

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

  // ========================================
  // ABOUT：画像の表示
  // ========================================

  if (document.querySelector('.about-image')) {
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

  // ========================================
  // PROJECTS：画像をぼかしから鮮明に
  // ========================================

  const storyImage = document.querySelector('.story-image');

  if (storyImage) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          storyImage.classList.add('is-clear');
          observer.unobserve(storyImage);
        }
      });
    }, {
      threshold: 0.2
    });

    observer.observe(storyImage);
  }

  // ========================================
  // PROJECTS：文字を順番に表示
  // ========================================

  const storyItems = gsap.utils.toArray('.story-copy > *');

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

  // ========================================
  // VISUALS：タイトルのマスク表示
  // ========================================

  const visualsTitle = document.querySelector('.visuals > .eyebrow');

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

  // ========================================
  // VISUALS：画像を順番に表示
  // ========================================

  const visualCards = gsap.utils.toArray('.visual-card');

  if (visualCards.length) {
    gsap.fromTo(
      visualCards,
      {
        opacity: 0,
        clipPath: 'inset(0 0 100% 0)',
        scale: 0.97
      },
      {
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        scale: 1,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: '.visual-grid',
          start: 'top 82%',
          once: true
        }
      }
    );
  }

  // ========================================
  // CONTACT：見出しのマスク表示
  // ========================================

  const contactTitle = document.querySelector('.contact h2');

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

  // ========================================
  // CONTACT：リンクの下線を表示
  // ========================================

  const contactLink = document.querySelector('.contact > a');

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

  // ========================================
  // STORIES：文字をスクロールに合わせて動かす
  // ========================================

  const storyCards = gsap.utils.toArray('.story-card');

  storyCards.forEach((card) => {
    const label = card.querySelector('.story-label');

    if (label) {
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
    }
  });
  // レイアウト変更時に位置を再計算
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
})();

//カーソル
const customCursor = document.querySelector('.custom-cursor');
if (customCursor) {
  const cursorText = customCursor.querySelector('span');
  window.addEventListener('mousemove', (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll('a, button').forEach((element) => {
    if (element.closest('.site-header')) {
      return;
    }
    element.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-active');
      if (cursorText) {
        if (element.classList.contains('visual-view-all')) {
          cursorText.textContent = 'VIEW ALL';
        } else if (element.closest('.contact')) {
          cursorText.textContent = 'GET IN TOUCH';
        } else {
          cursorText.textContent = 'VIEW MORE';
        }
      }
    });
    element.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-active');
      if (cursorText) {
        cursorText.textContent = 'VIEW MORE';
      }
    });
  });
}
document.querySelectorAll(
  '.site-header nav a[href="#about-title"],' +
  '.site-header nav a[href="#projects-title"],' +
  '.site-header nav a[href="#visuals"],' +
  '.site-header nav a[href="#contact"]'
).forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(
      link.getAttribute('href')
    );
    if (!target) return;
    event.preventDefault();
    const rect = target.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const isMobile = window.matchMedia(
      '(max-width: 600px)'
    ).matches;
    const positions = {
      '#about-title': isMobile ? 0.38 : 0.35,
      '#projects-title': isMobile ? 0.38 : 0.35,
      '#visuals': isMobile ? 0.38 : 0.35,
      '#contact': isMobile ? 0.38 : 0.35
    };
    const position =
      positions[link.getAttribute('href')] ?? 0.35;
    const targetTop =
      window.scrollY +
      rect.top -
      (viewportHeight - rect.height) * position;
    window.scrollTo({
      top: Math.max(
        0,
        Math.min(
          targetTop,
          document.documentElement.scrollHeight - viewportHeight
        )
      ),
      behavior: 'smooth'
    });
    history.replaceState(
      null,
      '',
      link.getAttribute('href')
    );
  });

});
