
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

  const opening = document.querySelector('.opening');
  const pin = document.querySelector('.opening-pin');
  const paths = gsap.utils.toArray('.signature path');

  const lockup = document.querySelector('.brand-lockup');
  const copy = document.querySelector('.opening-copy');
  const footer = document.querySelector('.opening-footer');
  const header = document.querySelector('.site-header');

  const backgroundVideo = document.querySelector(
    '.site-background video'
  );

  // 共通背景映像を再生
  if (backgroundVideo) {
    backgroundVideo.muted = true;

    const playPromise = backgroundVideo.play();

    if (playPromise) {
      playPromise.catch(() => {
        console.warn('背景映像を再生できません。動画のパスを確認してください。');
      });
    }
  }

  // ヘッダーの初期状態
  gsap.set(header, {
    autoAlpha: 0,
    pointerEvents: 'none'
  });

  if (reduceMotion) {
    gsap.set([lockup, copy, footer], {
      opacity: 1,
      clearProps: 'transform'
    });

    gsap.set(paths, {
      strokeDasharray: 'none',
      strokeDashoffset: 0
    });

    return;
  }

  // 波線をスクロールに合わせて描画できる状態にする
  paths.forEach((path) => {
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1
    });
  });

  // ロゴ・文章・フッターは最初は透明
  gsap.set([lockup, copy, footer], {
    opacity: 0,
    y: 0
  });

  // オープニングのスクロールアニメーション
  const tl = gsap.timeline({
    defaults: {
      ease: 'none'
    },

    scrollTrigger: {
      trigger: opening,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      pin,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  // ロゴと文章をゆっくり表示
  tl.to(
    [lockup, copy, footer],
    {
      opacity: 1,
      duration: 0.8,
      ease: 'power1.out'
    },
    0
  )

  // 波線を描く
  .to(
    paths,
    {
      strokeDashoffset: 0,
      duration: 3.2,
      stagger: 0.08,
      ease: 'none'
    },
    0.48
  )

  // 終盤でロゴと文章を少し薄くする
  .to(
    lockup,
    {
      opacity: 0.82,
      scale: 0.96,
      duration: 0.34
    },
    2.98
  )

  .to(
    copy,
    {
      opacity: 0.72,
      duration: 0.34
    },
    2.98
  )

  // 波線を消す
  .to(
    paths,
    {
      opacity: 0,
      duration: 0.22
    },
    3.85
  )

  // 次の画面へ移る前にロゴと文章を消す
  .to(
    [lockup, copy, footer],
    {
      opacity: 0,
      duration: 0.22
    },
    3.85
  );

  // ABOUTに入ったらヘッダーを表示
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

  // ABOUTの文章と画像
  gsap.from('.jp-intro', {
    opacity: 0,
    y: 12,
    duration: 0.9,
    ease: 'power2.out',

    scrollTrigger: {
      trigger: '.about',
      start: 'top 72%',
      once: true
    }
  });

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

  // ストーリー
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

  gsap.from('.story-copy > *', {
    opacity: 0,
    y: 10,
    duration: 0.85,
    stagger: 0.08,
    ease: 'power2.out',

    scrollTrigger: {
      trigger: '.story',
      start: 'top 68%',
      once: true
    }
  });

  // ビジュアル一覧
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

  // レイアウト変更時に位置を再計算
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
})();

// カスタムカーソル
const customCursor = document.querySelector(".custom-cursor");

if (customCursor) {
  window.addEventListener("mousemove", (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      customCursor.classList.add("is-active");
    });

    element.addEventListener("mouseleave", () => {
      customCursor.classList.remove("is-active");
    });
  });
}