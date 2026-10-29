
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
  // 動きを減らす設定が有効な場合
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

  // ロゴ・文章・フッターの初期状態
  gsap.set([lockup, copy, footer].filter(Boolean), {
    opacity: 0,
    y: 0
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

    // ロゴと文章を表示
    timeline.to(
      [lockup, copy, footer].filter(Boolean),
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power1.out'
      },
      0
    );

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
    timeline.to(
      copy,
      {
        opacity: 0.72,
        duration: 0.34
      },
      2.98
    );

    // 波線・ロゴ・文章を消す
    timeline.to(
      paths,
      {
        opacity: 0,
        duration: 0.22
      },
      3.85
    );

    timeline.to(
      [lockup, copy, footer].filter(Boolean),
      {
        opacity: 0,
        filter: 'blur(14px)',
        duration: 0.22
      },
      3.85
    );

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
  // ABOUT：文字のフェードイン
  // 上下位置は変えない
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
  // PROJECTS：画像の表示
  // ========================================

  if (document.querySelector('.story-image')) {
    gsap.from('.story-image', {
      opacity: 0,
      scale: 1.04,
      duration: 1.2,
      ease: 'power2.out',

      scrollTrigger: {
        trigger: '.story',
        start: 'top 70%',
        once: true
      }
    });
  }

  // ========================================
  // PROJECTS：文字のフェードイン
  // 上下位置は変えない
  // ※このアニメーションは1回だけ設定
  // ========================================

  if (document.querySelector('.story-copy')) {
    gsap.from('.story-copy > *', {
      opacity: 0,
      y: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: 'power2.out',

      scrollTrigger: {
        trigger: '.story',
        start: 'top 68%',
        once: true
      }
    });
  }

  // ========================================
  // VISUALS：カードの表示
  // ========================================

  if (document.querySelector('.visual-grid')) {
    gsap.from('.visual-card', {
      opacity: 0,
      y: 18,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',

      scrollTrigger: {
        trigger: '.visual-grid',
        start: 'top 78%',
        once: true
      }
    });
  }

  // ========================================
  // レイアウト変更時に位置を再計算
  // ========================================

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
})();

// ========================================
// カスタムカーソル
// ========================================

const customCursor = document.querySelector('.custom-cursor');

if (customCursor) {
  window.addEventListener('mousemove', (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      customCursor.classList.add('is-active');
    });

    element.addEventListener('mouseleave', () => {
      customCursor.classList.remove('is-active');
    });
  });
}
