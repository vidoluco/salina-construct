(function () {
  'use strict';

  var BASE = 'assets/photos/cherry-picked/';

  var SLIDES = [
    { file: '01-inainte-structura-decopertata', stage: 'inainte', stageLabel: 'ÎNAINTE', title: 'Structura decopertată', caption: 'Pereții sunt decopertați până la cărămidă, iar instalațiile vechi rămân la vedere. Așa arată punctul de plecare al oricărei renovări serioase.', alt: 'Perete decopertat până la cărămidă cu instalații vechi expuse, înainte de renovare' },
    { file: '02-inainte-consolidare', stage: 'inainte', stageLabel: 'ÎNAINTE', title: 'Consolidare structurală', caption: 'Înainte de orice finisaj, structura este verificată și consolidată cu grinzi metalice acolo unde este nevoie.', alt: 'Grinzi metalice de consolidare montate pe tavan, structură expusă' },
    { file: '03-inainte-baie-veche', stage: 'inainte', stageLabel: 'ÎNAINTE', title: 'Baia veche', caption: 'Cadă și instalații sanitare de generație veche, complet uzate — una dintre băile care urmau să fie refăcute integral.', alt: 'Baie veche cu cadă albastră demodată, înainte de renovare' },
    { file: '04-inainte-pardoseala-veche', stage: 'inainte', stageLabel: 'ÎNAINTE', title: 'Pardoseala originală', caption: 'Mozaicul original de pe hol, păstrat ca reper de culoare pentru noua pardoseală ce avea să fie turnată.', alt: 'Hol cu pardoseală de mozaic vechi înainte de renovare' },
    { file: '05-santier-electrice', stage: 'santier', stageLabel: 'ÎN LUCRU', title: 'Instalație electrică nouă', caption: 'Canale noi în cartongips pentru cablarea electrică — totul recablat de la zero, cu circuite și prize premium.', alt: 'Canale de cabluri electrice montate în pereți de cartongips' },
    { file: '06-santier-instalatii-sanitare', stage: 'santier', stageLabel: 'ÎN LUCRU', title: 'Instalații sanitare și termice', caption: 'Centrala termică montată pe perete decopertat, alături de instalațiile sanitare noi, gata pentru finisaje.', alt: 'Centrală termică montată pe perete în lucru, instalații sanitare noi' },
    { file: '07-santier-montaj-mozaic', stage: 'santier', stageLabel: 'ÎN LUCRU', title: 'Montaj mozaic cu nivelă laser', caption: 'Montajul pardoselii de mozaic alb-negru se face cu nivelă laser, pentru un rezultat perfect aliniat pe fiecare rând.', alt: 'Muncitor montând pardoseală de mozaic alb-negru cu nivelă laser' },
    { file: '08-santier-coridor', stage: 'santier', stageLabel: 'ÎN LUCRU', title: 'Coridorul prinde formă', caption: 'Tencuieli finalizate, tavan pregătit — spațiul începe să capete forma finală, cu doar câteva etape până la predare.', alt: 'Coridor în lucru, tencuit și pregătit pentru finisaje' },
    { file: '09-dupa-coridor', stage: 'dupa', stageLabel: 'DUPĂ', title: 'Coridor finalizat', caption: 'Rezultatul final: coridor elegant cu mozaic alb-negru, exact pe linia stilului clasic ales de la început.', alt: 'Coridor finalizat cu pardoseală de mozaic alb-negru' },
    { file: '10-dupa-baie', stage: 'dupa', stageLabel: 'DUPĂ', title: 'Baie modernă', caption: 'Faianță bicromă, oglindă cu iluminat LED și mobilier suspendat — baia veche transformată complet.', alt: 'Baie modernă finalizată cu faianță bicromă și oglindă LED' },
    { file: '11-dupa-baie-dubla', stage: 'dupa', stageLabel: 'DUPĂ', title: 'Baie cu lavoar dublu', caption: 'Faianță premium în nuanță de albastru, lavoare duble și mobilier pe comandă — o baie de nivel hotelier.', alt: 'Baie cu lavoare duble și faianță albastră premium, finalizată' },
    { file: '12-dupa-bucatarie', stage: 'dupa', stageLabel: 'DUPĂ', title: 'Bucătărie completă', caption: 'Bucătărie modernă, complet utilată, cu electrocasnice integrate și pardoseală de mozaic asortată cu holul.', alt: 'Bucătărie modernă finalizată cu electrocasnice integrate' },
    { file: '13-dupa-dormitor', stage: 'dupa', stageLabel: 'DUPĂ', title: 'Dormitor elegant', caption: 'Candelabru auriu, parchet englezesc și un ambient cald — dormitorul finalizat, gata de predare către client.', alt: 'Dormitor elegant finalizat cu candelabru auriu și parchet englezesc' },
    { file: '14-dupa-dressing', stage: 'dupa', stageLabel: 'DUPĂ', title: 'Dressing pe colț', caption: 'Dressing integrat pe colț, proiectat la milimetru pentru a folosi fiecare centimetru din spațiul disponibil.', alt: 'Dressing pe colț finalizat, mobilier integrat pe comandă' }
  ];

  var track = document.getElementById('carouselTrack');
  var dotsWrap = document.getElementById('carouselDots');
  var counterEl = document.getElementById('carouselCounter');
  var liveRegion = document.getElementById('carouselLiveRegion');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var carousel = document.getElementById('progressCarousel');

  if (!track || !dotsWrap || !carousel) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 0;
  var autoplayTimer = null;
  var AUTOPLAY_MS = 5500;

  function buildSlide(slide, index) {
    var fig = document.createElement('figure');
    fig.className = 'carousel-slide';
    fig.setAttribute('role', 'group');
    fig.setAttribute('aria-roledescription', 'slide');
    fig.setAttribute('aria-label', (index + 1) + ' din ' + SLIDES.length + ': ' + slide.title);

    var picture = document.createElement('picture');

    var sourceWebp = document.createElement('source');
    sourceWebp.type = 'image/webp';
    sourceWebp.srcset = BASE + slide.file + '.webp';
    picture.appendChild(sourceWebp);

    var img = document.createElement('img');
    img.src = BASE + slide.file + '.jpg';
    img.alt = slide.alt;
    img.width = 1200;
    img.height = 900;
    img.className = 'carousel-image';
    if (index === 0) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    } else {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
    picture.appendChild(img);
    fig.appendChild(picture);

    var badge = document.createElement('span');
    badge.className = 'carousel-badge stage-' + slide.stage;
    badge.textContent = slide.stageLabel;
    fig.appendChild(badge);

    var caption = document.createElement('figcaption');
    caption.className = 'carousel-caption';
    var h3 = document.createElement('h3');
    h3.textContent = slide.title;
    var p = document.createElement('p');
    p.textContent = slide.caption;
    caption.appendChild(h3);
    caption.appendChild(p);
    fig.appendChild(caption);

    return fig;
  }

  SLIDES.forEach(function (slide, i) {
    track.appendChild(buildSlide(slide, i));

    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Mergi la imaginea ' + (i + 1) + ': ' + slide.title);
    dot.addEventListener('click', function () {
      goTo(i);
      stopAutoplay();
    });
    dotsWrap.appendChild(dot);
  });

  var dots = Array.prototype.slice.call(dotsWrap.children);

  function update() {
    var offset = current * -100;
    track.style.transform = 'translateX(' + offset + '%)';
    dots.forEach(function (d, i) {
      var active = i === current;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    counterEl.textContent = (current + 1) + ' / ' + SLIDES.length;
    liveRegion.textContent = 'Imaginea ' + (current + 1) + ' din ' + SLIDES.length + ': ' + SLIDES[current].title + ', etapa ' + SLIDES[current].stageLabel + '.';
  }

  function goTo(index) {
    current = (index + SLIDES.length) % SLIDES.length;
    update();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', function () { next(); stopAutoplay(); });
  prevBtn.addEventListener('click', function () { prev(); stopAutoplay(); });

  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); stopAutoplay(); }
    else if (e.key === 'ArrowLeft') { prev(); stopAutoplay(); }
  });

  // touch swipe
  var touchStartX = null;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    touchStartX = null;
  }, { passive: true });

  function startAutoplay() {
    if (reducedMotion) return;
    stopAutoplay();
    autoplayTimer = window.setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) { window.clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) startAutoplay(); else stopAutoplay();
      });
    }, { threshold: 0.3 });
    io.observe(carousel);
  } else {
    startAutoplay();
  }

  update();
})();
