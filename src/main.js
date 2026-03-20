/* ================================================
   MAIN.JS — Bhoompally Kalyan Reddy Portfolio
   Three.js, GSAP, cursor trail, rotating robot
   quotes, typing effect, full interactions.
   ================================================ */

import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

const state = {
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  isLoaded: false,
  isMobile: window.innerWidth < 768,
};

// ─── ROBOT QUOTES (BHAGAVAD GITA PHILOSOPHY) ──
const robotQuotes = {
  heroSpeech: [
    '"You have the right to work, but never to the fruit of work." — Bhagavad Gita',
    '"Man is made by his belief. As he believes, so he is." — Bhagavad Gita',
    '"A person can rise through the efforts of his own mind; or draw himself down, in the same manner." — Bhagavad Gita',
  ],
  aboutSpeech: [
    '"The wise see knowledge and action as one; they see truly." — Bhagavad Gita',
    '"There is nothing so purifying on earth as wisdom and steadfast knowledge." — Bhagavad Gita',
    '"No effort is ever lost in righteous action, and there is no adverse effect." — Bhagavad Gita',
  ],
  eduSpeech: [
    '"Perform your duty equipoised, abandoning all attachment to success or failure." — Bhagavad Gita',
    '"Reshape yourself through the power of your will; never let yourself be degraded by self-will." — Bhagavad Gita',
    '"When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place." — Bhagavad Gita',
  ],
  expSpeech: [
    '"Strive constantly to serve the welfare of the world; by devotion to selfless work one attains the supreme goal." — Bhagavad Gita',
    '"Whatever happened, happened for the good. Whatever is happening, is happening for the good." — Bhagavad Gita',
    '"Action is greater than inaction. Perform therefore thy task in life." — Bhagavad Gita',
  ],
  projectsSpeech: [
    '"Whatever action a great leader performs, common people follow. And whatever standards they set, all the world pursues." — Bhagavad Gita',
    '"The calm and steadfast mind, unperturbed by distress and unattached to happiness, is the mark of leadership." — Bhagavad Gita',
    '"A mind established in equanimity is capable of great vision and action." — Bhagavad Gita',
  ],
  certsSpeech: [
    '"The mind is restless and difficult to restrain, but it is subdued by constant practice." — Bhagavad Gita',
    '"Set thy heart upon thy work, but never on its reward." — Bhagavad Gita',
    '"There is neither this world, nor the world beyond, nor happiness for the one who doubts." — Bhagavad Gita',
  ],
  contactSpeech: [
    '"He who is situated in knowledge and is free from doubt is not bound by his actions." — Bhagavad Gita',
    '"Seek refuge in the attitude of detachment and you will amass the wealth of spiritual awareness." — Bhagavad Gita',
    '"Let not the fruits of action be your motive, nor let your attachment be to inaction." — Bhagavad Gita',
  ],
};

// ─── ROTATING QUOTES ──────────────────────────
function initRotatingQuotes() {
  Object.keys(robotQuotes).forEach(speechId => {
    const el = document.getElementById(speechId);
    if (!el) return;
    const quoteEl = el.querySelector('.robot-quote');
    const quotes = robotQuotes[speechId];
    let index = 0;

    setInterval(() => {
      index = (index + 1) % quotes.length;
      gsap.to(quoteEl, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          quoteEl.textContent = quotes[index];
          gsap.fromTo(quoteEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
        },
      });
    }, 6000);
  });
}

// ─── PRELOADER ────────────────────────────────
function initPreloader() {
  const fill = document.getElementById('preloaderFill');
  const percent = document.getElementById('preloaderPercent');
  const preloader = document.getElementById('preloader');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress > 100) progress = 100;
    fill.style.width = progress + '%';
    percent.textContent = Math.floor(progress) + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('done');
        revealContent();
        state.isLoaded = true;
      }, 400);
    }
  }, 120);
}

// ─── REVEAL CONTENT ───────────────────────────
function revealContent() {
  const nav = document.getElementById('mainNav');
  const content = document.getElementById('mainContent');
  const scrollInd = document.getElementById('scrollIndicator');

  setTimeout(() => nav.classList.remove('nav-hidden'), 200);
  setTimeout(() => content.classList.remove('content-hidden'), 400);
  setTimeout(() => scrollInd.classList.add('visible'), 1500);

  setTimeout(() => {
    document.querySelectorAll('.hero-section .reveal-text').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 100);
    });
    animateCounters();
    initTypingEffect();
    initRotatingQuotes();
  }, 600);
}

// ─── TYPING EFFECT ────────────────────────────
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'AI Generalist & Developer 🤖',
    'Computer Science Student 👨‍💻',
    'Python Expert 🐍',
    'Full-Stack Web Developer 🌐',
    'Problem Solver & Innovator 🧠',
    'Machine Learning Enthusiast ⚡',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    if (!isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, 2500);
        return;
      }
      setTimeout(type, 70);
    } else {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }
  type();
}

// ─── CURSOR PARTICLE TRAIL ────────────────────
function initCursorTrail() {
  if (state.isMobile) return;

  const canvas = document.getElementById('cursorTrail');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const maxParticles = 30;

  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.life = 1;
      this.decay = Math.random() * 0.03 + 0.02;
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = (Math.random() - 0.5) * 1;
      this.hue = Math.random() > 0.5 ? 255 : 177; // purple or cyan
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.size *= 0.98;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = this.hue === 255 ? `rgba(162, 155, 254, ${this.life})` : `rgba(0, 206, 201, ${this.life})`;
      ctx.shadowColor = this.hue === 255 ? '#a29bfe' : '#00cec9';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let lastMX = 0, lastMY = 0;
  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastMX;
    const dy = e.clientY - lastMY;
    const speed = Math.sqrt(dx * dx + dy * dy);
    if (speed > 3) {
      for (let i = 0; i < 2; i++) {
        if (particles.length < maxParticles * 3) {
          particles.push(new TrailParticle(e.clientX, e.clientY));
        }
      }
    }
    lastMX = e.clientX;
    lastMY = e.clientY;
  });

  function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0 || particles[i].size < 0.3) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ─── CUSTOM CURSOR ────────────────────────────
function initCursor() {
  if (state.isMobile) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    state.mouse.targetX = e.clientX;
    state.mouse.targetY = e.clientY;
  });

  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => { dot.classList.add('expanded'); ring.classList.add('expanded'); });
    btn.addEventListener('mouseleave', () => {
      dot.classList.remove('expanded'); ring.classList.remove('expanded');
      gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'expo.out' });
    });
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'expo.out' });
    });
  });

  function animateCursor() {
    dotX += (state.mouse.targetX - dotX) * 0.2;
    dotY += (state.mouse.targetY - dotY) * 0.2;
    ringX += (state.mouse.targetX - ringX) * 0.08;
    ringY += (state.mouse.targetY - ringY) * 0.08;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ─── THREE.JS PARTICLE UNIVERSE ───────────────
function initThreeJS() {
  const canvas = document.getElementById('webgl-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x050510, 1);

  const PARTICLE_COUNT = state.isMobile ? 1500 : 4000;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const randoms = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = 2 + Math.random() * 12;
    const spinAngle = radius * 2.0;
    const branchAngle = ((i % 5) / 5) * Math.PI * 2;
    const randomness = Math.pow(Math.random(), 3) * 1.5 * (Math.random() < 0.5 ? 1 : -1);
    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomness;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3 + randomness * 0.3;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomness;
    const mixRatio = radius / 14;
    colors[i * 3] = 0.42 * (1 - mixRatio) + 0.0 * mixRatio;
    colors[i * 3 + 1] = 0.36 * (1 - mixRatio) + 0.81 * mixRatio;
    colors[i * 3 + 2] = 0.91 * (1 - mixRatio) + 0.79 * mixRatio;
    sizes[i] = Math.random() * 1.5 + 0.3;
    randoms[i] = Math.random();
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float aSize;
      attribute float aRandom;
      varying vec3 vColor;
      varying float vRandom;
      uniform float uTime;
      void main() {
        vColor = color;
        vRandom = aRandom;
        vec3 pos = position;
        pos.y += sin(uTime * 0.3 + pos.x * 0.5) * 0.15;
        pos.x += cos(uTime * 0.2 + pos.z * 0.3) * 0.1;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * (150.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vRandom;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha *= 0.25 + vRandom * 0.2;
        float glow = exp(-dist * 6.0) * 0.15;
        vec3 finalColor = vColor * 0.8 + glow;
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const orbGeometry = new THREE.IcosahedronGeometry(0.5, 4);
  const orbMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      uniform float uTime;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 pos = position;
        pos += normal * sin(pos.x * 3.0 + uTime * 0.5) * 0.05;
        pos += normal * cos(pos.y * 4.0 + uTime * 0.3) * 0.04;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform float uTime;
      void main() {
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        vec3 color1 = vec3(0.42, 0.36, 0.91);
        vec3 color2 = vec3(0.0, 0.81, 0.79);
        vec3 color = mix(color1, color2, fresnel + sin(uTime * 0.5) * 0.2);
        float alpha = fresnel * 0.4 + 0.03;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    wireframe: true,
    side: THREE.DoubleSide,
  });
  const orb = new THREE.Mesh(orbGeometry, orbMaterial);
  scene.add(orb);

  const lineCount = state.isMobile ? 100 : 300;
  const linePositions = new Float32Array(lineCount * 6);
  for (let i = 0; i < lineCount; i++) {
    const r1 = Math.random() * 4;
    const theta1 = Math.random() * Math.PI * 2;
    const phi1 = Math.random() * Math.PI;
    linePositions[i * 6] = r1 * Math.sin(phi1) * Math.cos(theta1);
    linePositions[i * 6 + 1] = r1 * Math.cos(phi1);
    linePositions[i * 6 + 2] = r1 * Math.sin(phi1) * Math.sin(theta1);
    const r2 = r1 + Math.random() * 1.5;
    const theta2 = theta1 + (Math.random() - 0.5) * 0.5;
    const phi2 = phi1 + (Math.random() - 0.5) * 0.3;
    linePositions[i * 6 + 3] = r2 * Math.sin(phi2) * Math.cos(theta2);
    linePositions[i * 6 + 4] = r2 * Math.cos(phi2);
    linePositions[i * 6 + 5] = r2 * Math.sin(phi2) * Math.sin(theta2);
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6c5ce7, transparent: true, opacity: 0.04, blending: THREE.AdditiveBlending });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    particleMaterial.uniforms.uTime.value = elapsed;
    orbMaterial.uniforms.uTime.value = elapsed;
    particles.rotation.y = elapsed * 0.02;
    particles.rotation.x = Math.sin(elapsed * 0.1) * 0.05;
    orb.rotation.x = elapsed * 0.1;
    orb.rotation.y = elapsed * 0.15;
    orb.scale.setScalar(1 + Math.sin(elapsed * 0.5) * 0.05);
    lines.rotation.y = elapsed * 0.015;
    lines.rotation.z = elapsed * 0.01;
    state.mouse.x += (state.mouse.targetX / window.innerWidth - 0.5 - state.mouse.x) * 0.02;
    state.mouse.y += (state.mouse.targetY / window.innerHeight - 0.5 - state.mouse.y) * 0.02;
    camera.position.x = state.mouse.x * 1.5;
    camera.position.y = -state.mouse.y * 1.0;
    camera.lookAt(scene.position);
    const scrollY = window.scrollY || 0;
    camera.position.z = 5 + scrollY * 0.002;
    particles.position.y = scrollY * 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.isMobile = window.innerWidth < 768;
  });
}

// ─── SCROLL REVEAL ────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.querySelector('.skill-bar')) {
            entry.target.querySelectorAll('.skill-bar').forEach((bar, i) => {
              setTimeout(() => {
                bar.style.setProperty('--level', bar.dataset.level);
                bar.classList.add('animated');
              }, i * 150);
            });
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal-text').forEach(el => {
    if (!el.closest('.hero-section')) observer.observe(el);
  });

  const projectObserver = new IntersectionObserver(
    (entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
    projectObserver.observe(card);
  });
}

// ─── COUNTERS ─────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ─── SMOOTH SCROLL & TRANSITIONS ─────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      const text = link.textContent.trim();
      triggerPageTransition(text, () => {
        target.scrollIntoView();
        const mobileMenu = document.getElementById('mobileMenu');
        const menuToggle = document.getElementById('menuToggle');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (menuToggle) menuToggle.classList.remove('active');
        }
      });
    });
  });
}

function triggerPageTransition(textMsg, scrollCallback) {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) { scrollCallback(); return; }
  
  const textEl = document.getElementById('transitionText');
  const bars = document.querySelectorAll('.transition-bars .bar');
  if (textEl) textEl.textContent = textMsg;
  
  gsap.to(bars, {
    scaleY: 1,
    transformOrigin: 'top',
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.inOut',
    onComplete: () => {
      gsap.fromTo(textEl, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
      
      // Wait to give it a 2-second grand feel
      setTimeout(() => {
        scrollCallback(); // Do the actual jump
        
        gsap.to(textEl, { opacity: 0, scale: 1.1, duration: 0.3 });
        gsap.to(bars, {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.inOut',
          delay: 0.2
        });
      }, 1500);
    }
  });
}

// ─── MOBILE MENU ──────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => { menu.classList.toggle('active'); toggle.classList.toggle('active'); });
}

// ─── SCROLL INDICATOR HIDE ────────────────────
function initScrollHide() {
  const scrollInd = document.getElementById('scrollIndicator');
  window.addEventListener('scroll', () => { if (window.scrollY > 200) scrollInd.classList.remove('visible'); });
}

// ─── NAV SCROLL ──────────────────────────────
function initNavScroll() {
  let lastScroll = 0;
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (!state.isLoaded) return;
    if (currentScroll > lastScroll && currentScroll > 100) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  });
}

// ─── 3D CARD TILT ─────────────────────────────
function initCardTilt() {
  if (state.isMobile) return;
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 800, duration: 0.4, ease: 'expo.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'expo.out' });
    });
  });
}

// ─── GLITCH TEXT ──────────────────────────────
function initGlitchText() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  document.querySelectorAll('.glitch-target').forEach(title => {
    const originalText = title.textContent;
    title.addEventListener('mouseenter', () => {
      let iterations = 0;
      const interval = setInterval(() => {
        title.textContent = originalText.split('').map((char, index) => {
          if (index < iterations) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iterations >= originalText.length) clearInterval(interval);
        iterations += 0.5;
      }, 30);
    });
  });
}

// ─── ROBOT CLICK INTERACTIONS ─────────────────
function initRobotInteractions() {
  document.querySelectorAll('.anime-companion').forEach(robot => {
    robot.style.cursor = 'none';
    robot.addEventListener('click', () => {
      // Make robot "jump" on click
      gsap.to(robot.querySelector('.anime-body-wrap'), {
        y: -20,
        duration: 0.2,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
      // Cycle quote immediately on click
      const speechEl = robot.querySelector('.anime-speech');
      if (speechEl && speechEl.id) {
        const quotes = robotQuotes[speechEl.id];
        if (quotes) {
          const quoteEl = speechEl.querySelector('.anime-quote');
          const currentIdx = quotes.indexOf(quoteEl.textContent);
          const nextIdx = (currentIdx + 1) % quotes.length;
          gsap.to(quoteEl, {
            opacity: 0, duration: 0.15,
            onComplete: () => {
              quoteEl.textContent = quotes[nextIdx];
              gsap.to(quoteEl, { opacity: 1, duration: 0.2 });
            },
          });
        }
      }
    });
  });
}

// ─── KEYBOARD SHORTCUTS ───────────────────────
function initKeyboardShortcuts() {
  let robotThemeIndex = 0;
  const robotThemes = ['', 'robot-theme-1', 'robot-theme-2', 'robot-theme-3'];
  let presentationInterval = null;
  const sections = ['#intro', '#skills', '#vision', '#projects', '#leadership', '#future', '#closing'];
  let currentSectionIndex = 0;

  document.addEventListener('keydown', (e) => {
    // Ctrl + K: Light/Dark Mode
    if (e.ctrlKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.body.classList.toggle('light-mode');
    }
    
    // Ctrl + B: Robot Themes
    if (e.ctrlKey && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      robotThemes.forEach(theme => { if (theme) document.body.classList.remove(theme); });
      robotThemeIndex = (robotThemeIndex + 1) % robotThemes.length;
      if (robotThemes[robotThemeIndex]) {
        document.body.classList.add(robotThemes[robotThemeIndex]);
      }
    }
    
    // Ctrl + R: Highlighting Mode
    if (e.ctrlKey && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      document.body.classList.toggle('highlight-mode');
    }
    
    // Ctrl + Space: Presentation Mode
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      if (presentationInterval) {
        clearInterval(presentationInterval);
        presentationInterval = null;
      } else {
        currentSectionIndex = 0;
        
        const advanceSection = () => {
          if (currentSectionIndex >= sections.length) {
            clearInterval(presentationInterval);
            presentationInterval = null;
            return;
          }
          const secId = sections[currentSectionIndex];
          const sec = document.querySelector(secId);
          const link = document.querySelector(`a.nav-link[href="${secId}"]`);
          const text = link ? link.textContent.trim() : secId.replace('#', '').toUpperCase();
          
          // Use the beautiful 2-second transition we built previously!
          triggerPageTransition(text, () => {
            if (sec) sec.scrollIntoView();
          });
          currentSectionIndex++;
        };
        
        advanceSection();
        // 8000ms ensures the 2s transition completes and the user gets ~6s of reading time.
        presentationInterval = setInterval(advanceSection, 8000);
      }
    }
  });
}

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCursor();
  initCursorTrail();
  initThreeJS();
  initScrollReveal();
  initSmoothScroll();
  initMobileMenu();
  initScrollHide();
  initNavScroll();
  initCardTilt();
  initGlitchText();
  initRobotInteractions();
  initKeyboardShortcuts();
});
