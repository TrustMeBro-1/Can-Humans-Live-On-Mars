/* ========================================
   MARS 2050 — script.js
   ======================================== */

// ---- STARFIELD ----
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 280;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.003 + 0.001,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() < 0.15
          ? `rgba(232,150,100,`
          : Math.random() < 0.1
          ? `rgba(180,200,255,`
          : `rgba(255,255,255,`,
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = (Math.sin(t * s.twinkleSpeed + s.twinkleOffset) + 1) / 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color}${alpha * 0.9 + 0.05})`;
      ctx.fill();
    });
  }

  let lastT = 0;
  function animate(t) {
    drawStars(t);
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });
  resize();
  createStars();
  requestAnimationFrame(animate);
})();


// ---- CUSTOM CURSOR ----
(function () {
  const cursor = document.querySelector('.cursor');
  const trail = document.querySelector('.cursor-trail');
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'py';
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    // trail with slight lag
    setTimeout(() => {
      trail.style.left = mx + 'px';
      trail.style.top = my + 'px';
    }, 80);
  });

  // Scale on hover over interactive elements
  document.querySelectorAll('a, button, .card, .tech-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.background = 'rgba(232,76,30,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'var(--mars-red)';
    });
  });
})();


// ---- NAVBAR SCROLL EFFECT ----
(function () {
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(2,4,7,0.95)';
      nav.style.borderBottomColor = 'rgba(232,76,30,0.25)';
    } else {
      nav.style.background = 'rgba(2,4,7,0.75)';
      nav.style.borderBottomColor = 'rgba(232,76,30,0.12)';
    }
  });
})();


// ---- SCROLL REVEAL ----
(function () {
  const reveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    const windowH = window.innerHeight;
    reveals.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowH - 60) {
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal(); // run on load
})();


// ---- TECH BAR ANIMATION ----
(function () {
  const bars = document.querySelectorAll('.tech-fill');
  let animated = false;

  function animateBars() {
    if (animated) return;
    bars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        bar.style.width = bar.dataset.width + '%';
        animated = true;
      }
    });
  }

  // Reset animated per bar
  function checkBars() {
    bars.forEach(bar => {
      const rect = bar.closest('.tech-item').getBoundingClientRect();
      if (rect.top < window.innerHeight - 40 && bar.style.width === '0%' || bar.style.width === '') {
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, parseInt(bar.closest('.tech-item').querySelector('[data-delay]')?.dataset?.delay || 0));
      }
    });
  }

  window.addEventListener('scroll', checkBars, { passive: true });
  setTimeout(checkBars, 500);
})();


// ---- PARALLAX HERO PLANET ----
(function () {
  const planet = document.querySelector('.hero-planet');
  if (!planet) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    planet.style.transform = `translateY(${scrollY * 0.15}px)`;
  }, { passive: true });
})();


// ---- ACTIVE NAV LINK ON SCROLL ----
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--mars-red)';
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
})();


// ---- CARD TILT EFFECT ----
(function () {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `translateY(-8px) scale(1.01) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });
  });
})();


// ---- GLITCH EFFECT ON HERO TITLE ----
(function () {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  setInterval(() => {
    title.style.textShadow = `${Math.random() * 4 - 2}px 0 rgba(232,76,30,0.7)`;
    setTimeout(() => { title.style.textShadow = ''; }, 80);
  }, 4000);
})();



// ---- MARS SURFACE EXPLORER ----
(function () {
  const data = {
    moxie: {
      icon: '🤖',
      title: 'MOXIE Rover Station',
      desc: 'MOXIE (Mars Oxygen In-Situ Resource Utilization Experiment) is a device on NASA\'s Perseverance rover that extracts oxygen directly from Mars\'s atmosphere, which is 95% Carbon Dioxide. A full-scale MOXIE could produce enough oxygen to keep an entire Mars colony breathing — and to make rocket fuel for the return trip home.',
      fact: 'MOXIE already produced 122 grams of O₂ on Mars in testing — enough to breathe for ~10 minutes'
    },
    olympus: {
      icon: '🌋',
      title: 'Olympus Mons',
      desc: 'Olympus Mons is the largest volcano in the entire solar system, standing 21 km tall — nearly 3x the height of Mount Everest. It\'s so wide (550 km across) that if you stood on it, the edges would be beyond the horizon. Future settlers might use its caves and lava tubes as natural radiation shelters.',
      fact: 'Olympus Mons is so large it creates its own weather system around its base'
    },
    habitat: {
      icon: '🏠',
      title: 'StarCrete Habitat Dome',
      desc: 'Future Mars habitats will be 3D-printed using StarCrete — a material made from Starch and Martian soil — which is twice as strong as regular concrete. Instead of stacking bricks, robotic printers build entire dome structures layer by layer. These pressurized habitats would need to hold Earth-level air pressure against Mars\'s near-vacuum atmosphere.',
      fact: 'StarCrete is made partially from potato starch — proving Mars settlers could use local resources'
    },
    ice: {
      icon: '🧊',
      title: 'Polar Ice Cap',
      desc: 'Mars has polar ice caps made mostly of water ice and frozen CO₂ (dry ice). These caps are crucial for future colonization — the water ice can be melted and purified for drinking, split into hydrogen and oxygen for rocket fuel, and used for growing crops in hydroponic farms inside pressurized habitats.',
      fact: 'The Mars north polar ice cap contains enough water to cover the entire planet 5.6 meters deep'
    },
    storm: {
      icon: '🌪️',
      title: 'Global Dust Storm Zone',
      desc: 'Mars experiences massive dust storms that can cover the entire planet and last for months. The 2018 global storm lasted over 8 months and killed NASA\'s Opportunity rover by blocking all sunlight to its solar panels. This is why future colonies will need nuclear power — solar panels alone can\'t survive Mars\'s storms.',
      fact: 'Mars dust storms can reach wind speeds of 60 mph and block 99% of sunlight reaching the surface'
    },
    valles: {
      icon: '🏔️',
      title: 'Valles Marineris',
      desc: 'Valles Marineris is a canyon system that stretches 4,000 km long, 200 km wide, and 7 km deep — making the Grand Canyon look tiny. Scientists believe it may have once held liquid water, and its walls may contain mineral deposits useful for building materials. Its depth could also offer partial protection from radiation and extreme temperatures.',
      fact: 'Valles Marineris is as long as the entire width of the United States'
    }
  };

  const hotspots = document.querySelectorAll('.hotspot');
  const panel = document.getElementById('marsInfoPanel');
  const defaultEl = panel.querySelector('.mip-default');
  const contentEl = document.getElementById('mipContent');
  const iconEl = document.getElementById('mipIcon');
  const titleEl = document.getElementById('mipTitle');
  const descEl = document.getElementById('mipDesc');
  const factEl = document.getElementById('mipFact');

  hotspots.forEach(hs => {
    hs.addEventListener('click', () => {
      const id = hs.dataset.id;
      const info = data[id];
      if (!info) return;

      // Update active state
      hotspots.forEach(h => h.classList.remove('active'));
      hs.classList.add('active');

      // Fill panel
      iconEl.textContent = info.icon;
      titleEl.textContent = info.title;
      descEl.textContent = info.desc;
      factEl.textContent = '⚡ ' + info.fact;

      // Show content
      defaultEl.style.display = 'none';
      contentEl.style.display = 'block';

      // Animate in
      contentEl.style.opacity = '0';
      contentEl.style.transform = 'translateY(8px)';
      requestAnimationFrame(() => {
        contentEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        contentEl.style.opacity = '1';
        contentEl.style.transform = 'translateY(0)';
      });
    });

    // Hover glow boost
    hs.addEventListener('mouseenter', () => {
      hs.querySelector('.hs-glow').style.opacity = '1';
    });
    hs.addEventListener('mouseleave', () => {
      hs.querySelector('.hs-glow').style.opacity = '';
    });
  });
})();

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ---- SMOOTH ANCHOR SCROLL ----
(function () {
  const tag = document.querySelector('.hero-tag');
  if (!tag) return;
  const text = 'RESEARCH PROJECT 2026';
  tag.textContent = '';
  let i = 0;

  // Rebuild the ::before pseudo via a span
  const line = document.createElement('span');
  line.style.cssText = 'display:inline-block;width:30px;height:1px;background:var(--mars-red);margin-right:0.75rem;vertical-align:middle;';
  tag.appendChild(line);

  const textNode = document.createTextNode('');
  tag.appendChild(textNode);

  function type() {
    if (i < text.length) {
      textNode.textContent += text[i++];
      setTimeout(type, 60);
    }
  }

  setTimeout(type, 600);
})();


// ---- LAUNCH SIMULATION ----
(function () {

  // ── MISSION DATA ──────────────────────────────────────────────
  const phases = [
    {
      tag: 'PHASE 1 — LAUNCH',
      title: 'Engine Ignition',
      desc: 'Your Starship engines are at full power. A pressure warning just appeared in engine 3. You have 8 seconds to decide.',
      scene: 'launch',
      choices: [
        { text: 'Shut down engine 3 and continue with reduced thrust', outcome: 'safe', fuel: -10, hull: 0,  note: 'Smart call. You lose some thrust but make orbit safely. Mission continues.' },
        { text: 'Ignore it — the sensor is probably faulty', outcome: 'risky', fuel: -5,  hull: -20, note: 'Engine 3 misfires. You make orbit but the hull takes shockwave damage.' },
        { text: 'Abort launch and reschedule', outcome: 'abort', fuel: 0,   hull: 0,  note: 'Mission aborted. You never leave Earth. Mission failed.', fail: true }
      ]
    },
    {
      tag: 'PHASE 2 — EARTH ORBIT',
      title: 'Trans-Mars Injection Burn',
      desc: 'You\'re in low Earth orbit. Time to fire the engines for 8 minutes to escape Earth\'s gravity and head toward Mars. How long do you burn?',
      scene: 'orbit',
      choices: [
        { text: 'Full 8-minute burn as planned', outcome: 'safe', fuel: -20, hull: 0,  note: 'Perfect burn. You\'re on a direct trajectory to Mars. Right on schedule.' },
        { text: 'Burn for 10 minutes to get there faster', outcome: 'risky', fuel: -35, hull: 0,  note: 'Faster trajectory but you burned too much fuel. You\'ll have less margin on arrival.' },
        { text: 'Short 5-minute burn to save fuel', outcome: 'risky', fuel: -10, hull: -10, note: 'Insufficient velocity. You need a dangerous correction burn mid-journey.' }
      ]
    },
    {
      tag: 'PHASE 3 — DEEP SPACE',
      title: 'Solar Radiation Storm',
      desc: 'A massive solar flare erupts. Radiation levels outside are 400x normal. You have 3 hours before it hits. What do you do?',
      scene: 'space',
      choices: [
        { text: 'Move crew to the radiation shelter in the center of the ship', outcome: 'safe', fuel: 0,   hull: 0,  note: 'Smart. The water-lined shelter blocks most radiation. Crew is safe.' },
        { text: 'Full speed ahead — we can outrun it', outcome: 'risky', fuel: -25, hull: -25, note: 'You can\'t outrun a solar flare. The crew gets significant radiation exposure and fuel burns dangerously low.' },
        { text: 'Deploy the emergency heat shield as a radiation blocker', outcome: 'safe', fuel: -5,  hull: 0,  note: 'Creative use of equipment. The shield absorbs most of the flare. Minor fuel cost to reposition.' }
      ]
    },
    {
      tag: 'PHASE 4 — MARS APPROACH',
      title: 'Atmospheric Entry',
      desc: 'You\'re entering Mars\'s atmosphere at 12,000 mph. The heat shield is at 95% integrity. A thruster is stuck. How do you enter?',
      scene: 'entry',
      choices: [
        { text: 'Use backup thrusters to compensate and enter normally', outcome: 'safe', fuel: -15, hull: -10, note: 'Rough but controlled. Some hull stress but you\'re descending safely.' },
        { text: 'Enter at a shallower angle to reduce heat buildup', outcome: 'safe', fuel: -10, hull: 0,  note: 'Excellent piloting. The shallower angle reduces heat and compensates for the stuck thruster.' },
        { text: 'Force the stuck thruster with a power surge', outcome: 'risky', fuel: -5,  hull: -35, note: 'The thruster fires but the power surge damages hull systems. Critical integrity warning.' }
      ]
    },
    {
      tag: 'PHASE 5 — LANDING',
      title: 'Final Descent to Mars',
      desc: 'You\'re 2km above the Martian surface. A dust storm is rolling in fast. Landing zone visibility dropping to near zero. You have 90 seconds of hover fuel.',
      scene: 'landing',
      choices: [
        { text: 'Land immediately using radar — don\'t wait for visibility', outcome: 'safe', fuel: -15, hull: 0,  note: 'Radar-guided landing works perfectly. Touchdown confirmed. MISSION SUCCESS.' },
        { text: 'Hover and wait for the storm to pass', outcome: 'risky', fuel: -40, hull: 0,  note: 'You wait too long. Fuel critically low. Rough emergency landing — but you survive.' },
        { text: 'Abort and attempt orbital re-entry back to Earth', outcome: 'abort', fuel: 0,   hull: 0,  note: 'You never land on Mars. Mission failed.', fail: true }
      ]
    }
  ];

  // ── STATE ──────────────────────────────────────────────────────
  let state = { phase: 0, fuel: 100, hull: 100, alive: true, log: [] };

  // ── CANVAS ANIMATION ──────────────────────────────────────────
  const canvas = document.getElementById('simCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let scene = 'idle';
  let simStars = [];
  let particles = [];
  let rocketY = 0;
  let rocketX = 0;
  let earthR = 0;
  let marsR  = 0;
  let rocketProgress = 0;
  let animFrame = 0;

  function resizeCanvas() {
    const wrapper = canvas.parentElement;
    canvas.width  = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight || 520;
    initSimStars();
  }

  function initSimStars() {
    simStars = [];
    for (let i = 0; i < 180; i++) {
      simStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.8 + 0.1,
        speed: Math.random() * 0.4 + 0.1
      });
    }
  }

  function addParticle(x, y, color, vx, vy, life) {
    particles.push({ x, y, vx, vy, life, maxLife: life, color, r: Math.random() * 3 + 1 });
  }

  function spawnExhaust(x, y) {
    for (let i = 0; i < 3; i++) {
      addParticle(
        x + (Math.random() - 0.5) * 6,
        y,
        `hsl(${20 + Math.random()*40},100%,${50+Math.random()*30}%)`,
        (Math.random() - 0.5) * 1.5,
        Math.random() * 3 + 1,
        30 + Math.random() * 20
      );
    }
  }

  function drawScene() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    animFrame++;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    if (scene === 'launch') {
      bg.addColorStop(0, '#000510');
      bg.addColorStop(0.5, '#05142a');
      bg.addColorStop(1, '#0a2a60');
    } else if (scene === 'landing' || scene === 'entry') {
      bg.addColorStop(0, '#020100');
      bg.addColorStop(0.6, '#1a0500');
      bg.addColorStop(1, '#3d1205');
    } else {
      bg.addColorStop(0, '#000000');
      bg.addColorStop(1, '#020410');
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars
    simStars.forEach(s => {
      const twinkle = (Math.sin(animFrame * 0.02 + s.x) + 1) / 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a * (0.4 + twinkle * 0.6)})`;
      ctx.fill();
    });

    if (scene === 'idle') {
      drawIdleScene(W, H);
    } else if (scene === 'launch') {
      drawLaunchScene(W, H);
    } else if (scene === 'orbit') {
      drawOrbitScene(W, H);
    } else if (scene === 'space') {
      drawSpaceScene(W, H);
    } else if (scene === 'entry') {
      drawEntryScene(W, H);
    } else if (scene === 'landing') {
      drawLandingScene(W, H);
    } else if (scene === 'success') {
      drawSuccessScene(W, H);
    } else if (scene === 'fail') {
      drawFailScene(W, H);
    }

    // Particles
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `,${alpha})`).replace('hsl(', 'hsla(');
      ctx.fill();
      p.x += p.vx; p.y += p.vy; p.life--;
    });

    requestAnimationFrame(drawScene);
  }

  function drawIdleScene(W, H) {
    // Earth
    const ex = W * 0.2, ey = H * 0.65, er = 70;
    const eg = ctx.createRadialGradient(ex-20, ey-20, 5, ex, ey, er);
    eg.addColorStop(0, '#4fc3f7'); eg.addColorStop(0.4, '#1565c0'); eg.addColorStop(1, '#0d2137');
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI*2);
    ctx.fillStyle = eg; ctx.fill();
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(100,200,255,0.3)'; ctx.lineWidth = 3; ctx.stroke();

    // Mars
    const mx = W*0.8, my = H*0.35, mr = 45;
    const mg = ctx.createRadialGradient(mx-12, my-12, 4, mx, my, mr);
    mg.addColorStop(0, '#e84c1e'); mg.addColorStop(0.5, '#a33010'); mg.addColorStop(1, '#3d0f04');
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI*2);
    ctx.fillStyle = mg; ctx.fill();
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(232,76,30,0.4)'; ctx.lineWidth = 2; ctx.stroke();

    // Dashed path
    ctx.setLineDash([6, 8]);
    ctx.beginPath(); ctx.moveTo(ex+er, ey);
    ctx.bezierCurveTo(W*0.4, H*0.7, W*0.6, H*0.1, mx-mr, my);
    ctx.strokeStyle = 'rgba(232,76,30,0.25)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = '700 11px Orbitron,monospace';
    ctx.fillStyle = 'rgba(100,200,255,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('EARTH', ex, ey + er + 18);
    ctx.fillStyle = 'rgba(232,76,30,0.8)';
    ctx.fillText('MARS', mx, my + mr + 18);

    // Rocket on pad
    drawRocket(ex + er * 0.1, ey - er - 20, 0, 1.2);
  }

  function drawLaunchScene(W, H) {
    rocketY = Math.max(rocketY - 1.5, -20);
    const ry = H * 0.75 + rocketY * 3;

    // Earth surface
    const eg = ctx.createRadialGradient(W/2, H+200, 100, W/2, H+200, 500);
    eg.addColorStop(0, '#1565c0'); eg.addColorStop(1, '#0d2137');
    ctx.beginPath(); ctx.arc(W/2, H+200, 500, 0, Math.PI*2);
    ctx.fillStyle = eg; ctx.fill();

    // Ground horizon glow
    ctx.beginPath(); ctx.arc(W/2, H+200, 502, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(100,200,255,0.3)'; ctx.lineWidth = 4; ctx.stroke();

    // Exhaust
    if (ry < H * 0.8) spawnExhaust(W/2, ry + 28);
    drawRocket(W/2, ry, 0, 1.4);

    // Altitude text
    const alt = Math.max(0, Math.floor((H * 0.75 - ry) * 2));
    ctx.font = '600 10px Orbitron,monospace';
    ctx.fillStyle = 'rgba(232,76,30,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(`ALT: ${alt} km`, 20, 60);
  }

  function drawOrbitScene(W, H) {
    // Earth in corner
    const ex = W*0.15, ey = H*0.8, er = 90;
    const eg = ctx.createRadialGradient(ex-25,ey-25,8,ex,ey,er);
    eg.addColorStop(0,'#4fc3f7'); eg.addColorStop(0.5,'#1565c0'); eg.addColorStop(1,'#0a1a35');
    ctx.beginPath(); ctx.arc(ex,ey,er,0,Math.PI*2); ctx.fillStyle=eg; ctx.fill();

    // Orbit ring
    ctx.beginPath(); ctx.ellipse(ex,ey,er+50,er+20,-Math.PI*0.15,0,Math.PI*2);
    ctx.strokeStyle='rgba(232,76,30,0.2)'; ctx.lineWidth=1.5; ctx.setLineDash([4,6]); ctx.stroke();
    ctx.setLineDash([]);

    // Rocket on orbit
    const angle = animFrame * 0.015;
    const rx2 = ex + (er+50)*Math.cos(angle);
    const ry2 = ey + (er+20)*Math.sin(angle)*0.4;
    spawnExhaust(rx2 - Math.cos(angle)*8, ry2 - Math.sin(angle)*4);
    drawRocket(rx2, ry2, angle - Math.PI/2, 1.1);

    // Mars in distance
    const mx = W*0.82, my = H*0.22;
    const mg = ctx.createRadialGradient(mx-10,my-10,3,mx,my,30);
    mg.addColorStop(0,'#e84c1e'); mg.addColorStop(1,'#4a1005');
    ctx.beginPath(); ctx.arc(mx,my,30,0,Math.PI*2); ctx.fillStyle=mg; ctx.fill();
    ctx.font='700 10px Orbitron,monospace';
    ctx.fillStyle='rgba(232,76,30,0.7)'; ctx.textAlign='center';
    ctx.fillText('MARS — 140M MILES',mx,my+45);
  }

  function drawSpaceScene(W, H) {
    // Flare pulse
    const flareAlpha = (Math.sin(animFrame*0.05)+1)/2 * 0.3;
    const flareGrad = ctx.createRadialGradient(W,0,0,W,0,W*0.7);
    flareGrad.addColorStop(0,`rgba(255,200,50,${flareAlpha})`);
    flareGrad.addColorStop(1,'rgba(255,100,0,0)');
    ctx.fillStyle=flareGrad; ctx.fillRect(0,0,W,H);

    // Solar flare rays
    if (animFrame % 3 === 0) {
      for (let i=0;i<2;i++) {
        addParticle(
          W - Math.random()*50,
          Math.random()*H*0.3,
          `rgba(255,${150+Math.random()*100},0,`,
          -Math.random()*4-2,
          Math.random()*2-1,
          40
        );
      }
    }

    // Rocket floating in space
    const floatY = H/2 + Math.sin(animFrame*0.02)*8;
    spawnExhaust(W*0.35-12, floatY);
    drawRocket(W*0.35, floatY, -Math.PI/2, 1.3);

    // Radiation warning
    const pulse = (Math.sin(animFrame*0.08)+1)/2;
    ctx.font=`700 ${10+pulse*2}px Orbitron,monospace`;
    ctx.fillStyle=`rgba(255,${100+pulse*100},0,${0.5+pulse*0.5})`;
    ctx.textAlign='center';
    ctx.fillText('⚠ SOLAR RADIATION ALERT', W/2, H*0.12);

    // Sun
    const sg = ctx.createRadialGradient(W-20,20,5,W-20,20,120);
    sg.addColorStop(0,'rgba(255,240,100,0.9)');
    sg.addColorStop(0.3,'rgba(255,180,0,0.4)');
    sg.addColorStop(1,'rgba(255,100,0,0)');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
  }

  function drawEntryScene(W, H) {
    // Heat gradient
    const heatAlpha = 0.4 + Math.sin(animFrame*0.06)*0.15;
    const heat = ctx.createLinearGradient(0,0,0,H);
    heat.addColorStop(0,`rgba(255,80,0,0)`);
    heat.addColorStop(0.5,`rgba(255,120,0,${heatAlpha})`);
    heat.addColorStop(1,'rgba(200,60,0,0.1)');
    ctx.fillStyle=heat; ctx.fillRect(0,0,W,H);

    // Mars surface below
    ctx.fillStyle='#3d1205';
    ctx.fillRect(0, H*0.85, W, H*0.15);
    ctx.fillStyle='#5a2010';
    ctx.fillRect(0, H*0.87, W, H*0.02);

    // Entry plasma particles
    if (animFrame%2===0) {
      for (let i=0;i<4;i++){
        addParticle(
          W/2 + (Math.random()-0.5)*80,
          H*0.4,
          `hsl(${10+Math.random()*40},100%,${50+Math.random()*30}%,`,
          (Math.random()-0.5)*5,
          Math.random()*2-3,
          25
        );
      }
    }

    // Rocket descending
    rocketProgress = Math.min(rocketProgress+0.3, H*0.55);
    drawRocket(W/2, H*0.15 + rocketProgress, Math.PI, 1.3);

    ctx.font='700 10px Orbitron,monospace';
    ctx.fillStyle='rgba(255,140,0,0.8)'; ctx.textAlign='center';
    ctx.fillText('ENTERING MARTIAN ATMOSPHERE', W/2, H*0.06);
    ctx.fillText(`SPEED: ${Math.max(2000, 12000 - Math.floor(rocketProgress*40))} MPH`, W/2, H*0.1);
  }

  function drawLandingScene(W, H) {
    // Mars sky
    const sky = ctx.createLinearGradient(0,0,0,H*0.7);
    sky.addColorStop(0,'#0d0200'); sky.addColorStop(1,'#3d1205');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.7);

    // Ground
    ctx.fillStyle='#5a2010'; ctx.fillRect(0,H*0.7,W,H*0.3);
    ctx.fillStyle='#6b2a12'; ctx.fillRect(0,H*0.72,W,H*0.02);

    // Dust storm
    for (let i=0;i<3;i++){
      addParticle(
        Math.random()*W, H*0.5+Math.random()*H*0.3,
        `rgba(180,80,30,`,
        (Math.random()-0.3)*4, (Math.random()-0.5)*1,
        60
      );
    }

    // Rocket landing
    const landY = Math.max(H*0.7-50, H*0.15 + rocketProgress);
    rocketProgress = Math.min(rocketProgress+0.5, H*0.55);
    spawnExhaust(W/2, landY+28);
    drawRocket(W/2, landY, Math.PI, 1.3);

    ctx.font='700 10px Orbitron,monospace';
    ctx.fillStyle='rgba(232,76,30,0.8)'; ctx.textAlign='center';
    ctx.fillText('⚠ DUST STORM — VISIBILITY CRITICAL', W/2, H*0.07);
    ctx.fillText(`ALT: ${Math.max(0, Math.floor((H*0.55-rocketProgress)*3))} m`, W/2, H*0.11);
  }

  function drawSuccessScene(W, H) {
    // Mars surface
    ctx.fillStyle='#3d1205'; ctx.fillRect(0,H*0.75,W,H*0.25);
    ctx.fillStyle='#5a2010'; ctx.fillRect(0,H*0.77,W,H*0.02);

    // Landed rocket
    drawRocket(W/2, H*0.65, Math.PI, 1.5);

    // Victory glow
    const vg = ctx.createRadialGradient(W/2,H*0.65,10,W/2,H*0.65,200);
    vg.addColorStop(0,`rgba(232,76,30,${0.15+Math.sin(animFrame*0.05)*0.08})`);
    vg.addColorStop(1,'rgba(232,76,30,0)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // Confetti particles
    if (animFrame%4===0) {
      for (let i=0;i<3;i++){
        addParticle(
          Math.random()*W, 0,
          `hsl(${Math.random()*360},100%,60%,`,
          (Math.random()-0.5)*3, Math.random()*2+1, 120
        );
      }
    }

    ctx.font='bold 13px Orbitron,monospace';
    ctx.fillStyle='rgba(232,76,30,0.9)'; ctx.textAlign='center';
    ctx.fillText('TOUCHDOWN — MARS SURFACE', W/2, H*0.1);
  }

  function drawFailScene(W, H) {
    // Red tint
    ctx.fillStyle=`rgba(100,0,0,${0.2+Math.sin(animFrame*0.05)*0.1})`;
    ctx.fillRect(0,0,W,H);

    ctx.font='bold 14px Orbitron,monospace';
    ctx.fillStyle='rgba(255,50,50,0.9)'; ctx.textAlign='center';
    ctx.fillText('MISSION FAILED', W/2, H/2 - 20);
    ctx.font='10px Orbitron,monospace';
    ctx.fillStyle='rgba(255,100,100,0.6)';
    ctx.fillText('CREW RETURNING TO EARTH', W/2, H/2 + 10);
  }

  function drawRocket(x, y, angle, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle || 0);
    ctx.scale(scale || 1, scale || 1);

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(7, -8);
    ctx.lineTo(7, 16);
    ctx.lineTo(-7, 16);
    ctx.lineTo(-7, -8);
    ctx.closePath();
    ctx.fillStyle = '#d0d8e8';
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(7, -8);
    ctx.lineTo(-7, -8);
    ctx.closePath();
    ctx.fillStyle = '#e84c1e';
    ctx.fill();

    // Window
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI*2);
    ctx.fillStyle = '#4fc3f7';
    ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.stroke();

    // Fins
    ctx.beginPath();
    ctx.moveTo(7,10); ctx.lineTo(14,20); ctx.lineTo(7,18);
    ctx.fillStyle='#a0aabb'; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-7,10); ctx.lineTo(-14,20); ctx.lineTo(-7,18);
    ctx.fill();

    // Engine glow
    ctx.beginPath();
    ctx.arc(0, 20, 4, 0, Math.PI*2);
    const eg2 = ctx.createRadialGradient(0,20,1,0,20,4);
    eg2.addColorStop(0,'rgba(255,220,80,0.9)');
    eg2.addColorStop(1,'rgba(255,80,0,0)');
    ctx.fillStyle=eg2; ctx.fill();

    ctx.restore();
  }

  // ── UI LOGIC ──────────────────────────────────────────────────
  const screens = {
    start:    document.getElementById('simStart'),
    decision: document.getElementById('simDecision'),
    result:   document.getElementById('simResult')
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s && (s.style.display='none'));
    if (screens[name]) screens[name].style.display='flex';
  }

  function updateHUD() {
    const p = phases[state.phase] || phases[phases.length-1];
    document.getElementById('hudPhase').textContent  = `${state.phase+1} / ${phases.length}`;
    document.getElementById('hudFuel').textContent   = `${Math.max(0,state.fuel)}%`;
    document.getElementById('hudHull').textContent   = `${Math.max(0,state.hull)}%`;
    document.getElementById('hudDist').textContent   = `${Math.round(state.phase * 28)} M mi`;

    const fuelEl = document.getElementById('hudFuel');
    fuelEl.style.color = state.fuel < 25 ? '#ff4444' : state.fuel < 50 ? '#ffaa00' : '';
    const hullEl = document.getElementById('hudHull');
    hullEl.style.color = state.hull < 25 ? '#ff4444' : state.hull < 50 ? '#ffaa00' : '';
  }

  function showDecision() {
    const ph = phases[state.phase];
    if (!ph) { endMission(true); return; }

    scene = ph.scene;
    rocketProgress = 0;

    document.getElementById('decPhaseTag').textContent = ph.tag;
    document.getElementById('decTitle').textContent    = ph.title;
    document.getElementById('decDesc').textContent     = ph.desc;

    const container = document.getElementById('simChoices');
    container.innerHTML = '';
    const letters = ['A', 'B', 'C'];
    ph.choices.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 'sim-choice';
      btn.innerHTML = `<span class="choice-letter">${letters[i]}</span>${c.text}`;
      btn.addEventListener('click', () => choose(c));
      container.appendChild(btn);
    });

    showScreen('decision');
    updateHUD();
  }

  function choose(choice) {
    if (choice.fail) {
      endMission(false, choice.note);
      return;
    }

    state.fuel = Math.max(0, state.fuel + choice.fuel);
    state.hull = Math.max(0, state.hull + choice.hull);
    state.log.push({ phase: state.phase, note: choice.note, outcome: choice.outcome });
    state.phase++;

    if (state.fuel <= 0) { endMission(false, 'Fuel depleted. The mission is lost.'); return; }
    if (state.hull <= 0) { endMission(false, 'Critical hull failure. The crew did not survive.'); return; }
    if (state.phase >= phases.length) { endMission(true); return; }

    // Brief flash of the outcome note
    const noteDiv = document.createElement('div');
    noteDiv.style.cssText='position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);border:1px solid rgba(232,76,30,0.4);padding:0.8rem 1.5rem;border-radius:3px;font-size:0.82rem;color:#f0e6dc;max-width:420px;text-align:center;z-index:9999;font-family:Syne,sans-serif;line-height:1.5;transition:opacity 0.4s;';
    noteDiv.textContent = choice.note;
    document.body.appendChild(noteDiv);
    setTimeout(() => { noteDiv.style.opacity='0'; setTimeout(()=>noteDiv.remove(),400); }, 2200);

    setTimeout(showDecision, 500);
  }

  function endMission(success, failNote) {
    if (success) {
      scene = 'success';
      document.getElementById('resIcon').textContent  = '🎉';
      document.getElementById('resTitle').textContent = 'MISSION COMPLETE — HUMANS ON MARS!';
      document.getElementById('resDesc').textContent  = `Incredible work, Commander. Your crew has successfully landed on Mars. Fuel remaining: ${state.fuel}%. Hull integrity: ${state.hull}%. You made history.`;
    } else {
      scene = 'fail';
      document.getElementById('resIcon').textContent  = '💀';
      document.getElementById('resTitle').textContent = 'MISSION FAILED';
      document.getElementById('resDesc').textContent  = failNote || 'The mission could not be completed. Study what went wrong and try again.';
    }
    const statsEl = document.getElementById('resStats');
    statsEl.innerHTML = `
      <div class="res-stat"><span class="res-stat-val">${Math.max(0,state.fuel)}%</span><span class="res-stat-label">FUEL LEFT</span></div>
      <div class="res-stat"><span class="res-stat-val">${Math.max(0,state.hull)}%</span><span class="res-stat-label">HULL INTACT</span></div>
      <div class="res-stat"><span class="res-stat-val">${state.phase}/${phases.length}</span><span class="res-stat-label">PHASES DONE</span></div>
    `;
    showScreen('result');
  }

  function resetSim() {
    state = { phase: 0, fuel: 100, hull: 100, alive: true, log: [] };
    scene = 'idle';
    rocketY = 0;
    rocketProgress = 0;
    updateHUD();
    showScreen('start');
  }

  // ── INIT ──────────────────────────────────────────────────────
  document.getElementById('btnStart').addEventListener('click', () => {
    scene = 'launch';
    rocketY = 0;
    showDecision();
  });
  document.getElementById('btnRestart').addEventListener('click', resetSim);

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawScene();
  updateHUD();

})();
