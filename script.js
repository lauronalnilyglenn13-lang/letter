/* =====================================================
   ✏️  EDIT EVERYTHING HERE
   ===================================================== */
const CONFIG = {
  // Envelope greeting
  hello: "For my idol meowk!",

  // The letter
  title: "Akong idol, akong kusog!!,",
  paragraphs: [
    "hi gine uhm nothing random lang haha i couldn’t settle myself up i was aboutt to sleep na i mean i wanted to sleep na pero i cant im so bothered lang on how and why basta haha theres a lot of things going through my mind lang lately and one of that is about you i dont know why so random pero like i become more obsessed probably nimo or like infatuated i cant really explain sa kung unsa akong nafeel to the point i overthink a lot whether naba koy chance if ever i ask to court you and if ever bah nga magustuhan ko nimo i know i lack a lot compared sa imong pasts and i still have a lot of things to develop and achieve aron maka ingon ko nga deserving ra i just cant really deny to myself na i like you like a lot even though murag like on off on off akong communication nimo it doesn’t mean na sa ganahan lang ko mo chat or whatsoever its just mauwaw ko and mahadlok ko makasamok nimo, im so scared na basin ma feel uncomfortable ka kay tungod sakokg kasamok and ka annoying i tried my best not to patagad but di jud ko ka resist, anyways i coudn’t afford a boquet of flowers yet or a gift kani lang sa and by the way congratulations hehe so proud of you nag ni sayaw naka balik so nostalgic and im super super happy to see you agian in the stage hehe, hopefully you read my tiny message sorry for bothering🥰😘"
  ],
  signature: "Yours always, Alni ♥",

  // 🖼️ BACKGROUND IMAGE — put a file path or full URL. Leave "" for the pink-purple night sky.
  //   examples: "images/us.jpg"   |   "https://yoursite.com/photo.jpg"
  backgroundImage: "https://cdn.phototourl.com/anon/2026-11-16-685835ef-99c4-4410-a713-60d48ba4417b.png",
  backgroundDarkness: 0.35,   // 0 = bright photo, 0.8 = very dark (keeps the letter readable)

  // 🎵 MUSIC — add as many songs as you like (file path or URL). They play in order and loop.
  //   examples: { title: "Our Song", src: "music/our-song.mp3" }
  music: [
    { src: "https://mp3tourl.com/audio/1794851261220-d3a88a5e-f628-4446-ac8c-cb28eeeadfdf.mp3" },
    // { title: "Another One", src: "music/another.mp3" },
  ],
  volume: 0.6,

  // 🦋 Animation amounts
  butterflies: 14,
  petals: 36,
  typingSpeed: 38             // ms per letter (lower = faster)
};
/* ===================================================== */

const $ = id => document.getElementById(id);

/* ---------- apply text + background ---------- */
$('hello').textContent = CONFIG.hello;
$('title').textContent = CONFIG.title;
$('sign').textContent = CONFIG.signature;
if (CONFIG.backgroundImage) $('bg').style.backgroundImage = `url("${CONFIG.backgroundImage}")`;
$('bgShade').style.opacity = CONFIG.backgroundImage ? CONFIG.backgroundDarkness : 0;

/* ---------- music ---------- */
const player = $('player'), mBtn = $('music');
const tracks = CONFIG.music.filter(t => t.src);
let ti = 0;
player.volume = CONFIG.volume;
if (tracks.length) {
  mBtn.style.display = 'flex';
  const load = () => { player.src = tracks[ti].src; $('songName').textContent = tracks[ti].title || 'Music'; };
  load();
  player.addEventListener('ended', () => { ti = (ti + 1) % tracks.length; load(); player.play(); });
  player.addEventListener('play',  () => mBtn.classList.add('on'));
  player.addEventListener('pause', () => mBtn.classList.remove('on'));
  mBtn.onclick = () => player.paused ? player.play().catch(()=>{}) : player.pause();
}

/* ---------- open the envelope ---------- */
const env = $('env');
let opened = false;
function openLetter() {
  if (opened) return; opened = true;
  env.classList.add('open');
  $('stage').classList.add('opening');
  if (tracks.length) player.play().catch(()=>{});   // browsers need a tap first, this is it
  burst(innerWidth/2, innerHeight/2, 14);
  setTimeout(() => $('stage').classList.add('gone'), 1900);
  setTimeout(() => { $('letter').classList.add('show'); typeLetter(); }, 2300);
}
env.onclick = openLetter;
env.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); } };

/* ---------- typewriter ---------- */
async function typeLetter() {
  const body = $('body');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for (const text of CONFIG.paragraphs) {
    const p = document.createElement('p'); body.appendChild(p);
    const cur = document.createElement('span'); cur.className = 'cursor';
    p.appendChild(cur);
    for (const ch of text) {
      cur.before(ch);
      await sleep(CONFIG.typingSpeed + (',.!?'.includes(ch) ? 220 : 0));
    }
    cur.remove();
    await sleep(350);
  }
  $('sign').classList.add('show');
  burst(innerWidth/2, innerHeight/3, 24);
}

/* ---------- floating hearts on tap ---------- */
function burst(x, y, n = 8) {
  for (let i = 0; i < n; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = ['♥','💗','💖','✨','🌸'][Math.floor(Math.random()*5)];
    h.style.left = x + 'px'; h.style.top = y + 'px';
    h.style.fontSize = (14 + Math.random()*20) + 'px';
    h.style.color = '#ff7aa8';
    h.style.setProperty('--dx', (Math.random()*200 - 100) + 'px');
    h.style.setProperty('--r', (Math.random()*60 - 30) + 'deg');
    h.style.animationDelay = (Math.random()*.25) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2900);
  }
}
addEventListener('pointerdown', e => { if (opened) burst(e.clientX, e.clientY, 7); });

/* ---------- canvas: butterflies, petals, sparkles ---------- */
const cv = $('fx'), g = cv.getContext('2d');
let W, H, dpr;
function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize); resize();

const palettes = [['#ff9ec4','#ffd1e3'],['#c9a7ff','#e8d9ff'],['#ffd27a','#fff0c7'],['#8fd3ff','#d6f0ff'],['#ff8a9b','#ffc9d1']];
const rand = (a, b) => a + Math.random() * (b - a);

class Butterfly {
  constructor() { this.reset(true); }
  reset(anywhere) {
    this.x = anywhere ? rand(0, W) : (Math.random() < .5 ? -40 : W + 40);
    this.y = rand(H * .1, H * .9);
    this.size = rand(9, 20);
    this.pal = palettes[Math.floor(Math.random() * palettes.length)];
    this.t = rand(0, 100);
    this.speed = rand(.6, 1.4);
    this.flap = rand(7, 11);
    this.heading = rand(0, Math.PI * 2);
    this.target = null;
  }
  update(dt) {
    this.t += dt;
    // wander smoothly + drift toward pointer when it's close
    this.heading += Math.sin(this.t * .9) * .035 + Math.sin(this.t * 2.3) * .03;
    let vx = Math.cos(this.heading) * this.speed * 60, vy = Math.sin(this.heading) * this.speed * 40 - Math.sin(this.t * 3) * 14;
    if (mouse.on) {
      const dx = mouse.x - this.x, dy = mouse.y - this.y, d = Math.hypot(dx, dy);
      if (d < 260 && d > 30) { vx += dx / d * 60; vy += dy / d * 60; }
    }
    this.x += vx * dt; this.y += vy * dt;
    if (this.x < -80 || this.x > W + 80 || this.y < -80 || this.y > H + 80) {
      this.heading = Math.atan2(H / 2 - this.y, W / 2 - this.x) + rand(-.6, .6);
    }
    this.angle = Math.atan2(vy, vx) + Math.PI / 2;
  }
  draw() {
    const s = this.size, f = Math.abs(Math.sin(this.t * this.flap)) * .85 + .15;
    g.save(); g.translate(this.x, this.y); g.rotate(this.angle * .35);
    g.globalAlpha = .92;
    for (const side of [-1, 1]) {
      g.save(); g.scale(side * f, 1);
      let gr = g.createLinearGradient(0, 0, s * 1.6, 0);
      gr.addColorStop(0, this.pal[0]); gr.addColorStop(1, this.pal[1]);
      g.fillStyle = gr;
      g.beginPath();                                   // upper wing
      g.moveTo(0, -s * .1);
      g.bezierCurveTo(s * .9, -s * 1.9, s * 2.1, -s * 1.1, s * 1.5, -s * .1);
      g.bezierCurveTo(s * 1.2, s * .2, s * .4, s * .2, 0, 0); g.fill();
      g.beginPath();                                   // lower wing
      g.moveTo(0, 0);
      g.bezierCurveTo(s * 1.2, s * .1, s * 1.6, s * 1.1, s * .9, s * 1.3);
      g.bezierCurveTo(s * .4, s * 1.4, s * .1, s * .8, 0, 0); g.fill();
      g.fillStyle = 'rgba(255,255,255,.55)';           // wing dots
      g.beginPath(); g.arc(s * 1.15, -s * .7, s * .16, 0, 7); g.fill();
      g.beginPath(); g.arc(s * .8, s * .75, s * .1, 0, 7); g.fill();
      g.restore();
    }
    g.fillStyle = '#4a2438'; g.globalAlpha = 1;        // body
    g.beginPath(); g.ellipse(0, s * .25, s * .09, s * .7, 0, 0, 7); g.fill();
    g.restore();
  }
}

class Petal {
  constructor() { this.reset(true); }
  reset(any) {
    this.x = rand(0, W); this.y = any ? rand(0, H) : -20;
    this.s = rand(5, 11); this.vy = rand(28, 60); this.sway = rand(.6, 1.6);
    this.t = rand(0, 50); this.rot = rand(0, 6); this.vr = rand(-1.5, 1.5);
    this.c = ['#ffb3cc', '#ff8fb1', '#ffd6e4', '#ffc0d5'][Math.floor(Math.random() * 4)];
  }
  update(dt) {
    this.t += dt; this.y += this.vy * dt; this.x += Math.sin(this.t * this.sway) * 34 * dt; this.rot += this.vr * dt;
    if (this.y > H + 20) this.reset(false);
  }
  draw() {
    g.save(); g.translate(this.x, this.y); g.rotate(this.rot); g.scale(1, .55 + Math.abs(Math.sin(this.t * 2)) * .45);
    g.fillStyle = this.c; g.globalAlpha = .85;
    g.beginPath(); g.moveTo(0, -this.s);
    g.bezierCurveTo(this.s, -this.s * .6, this.s, this.s * .6, 0, this.s);
    g.bezierCurveTo(-this.s, this.s * .6, -this.s, -this.s * .6, 0, -this.s); g.fill();
    g.restore();
  }
}

const mouse = { x: 0, y: 0, on: false };
const sparks = [];
addEventListener('pointermove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true;
  if (Math.random() < .6) sparks.push({ x: e.clientX, y: e.clientY, vx: rand(-20, 20), vy: rand(-10, 30), life: 1, s: rand(1.5, 3.5) });
});
addEventListener('pointerleave', () => mouse.on = false);

const bf = Array.from({ length: CONFIG.butterflies }, () => new Butterfly());
const pt = Array.from({ length: CONFIG.petals }, () => new Petal());
const stars = Array.from({ length: 60 }, () => ({ x: rand(0, 1), y: rand(0, 1), r: rand(.4, 1.6), p: rand(0, 6) }));

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, .05); last = now;
  g.clearRect(0, 0, W, H);
  for (const s of stars) {                              // twinkling stars
    g.globalAlpha = .3 + .7 * Math.abs(Math.sin(now / 900 + s.p));
    g.fillStyle = '#fff'; g.beginPath(); g.arc(s.x * W, s.y * H, s.r, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
  pt.forEach(p => { p.update(dt); p.draw(); });
  bf.forEach(b => { b.update(dt); b.draw(); });
  for (let i = sparks.length - 1; i >= 0; i--) {        // cursor sparkle trail
    const p = sparks[i]; p.life -= dt * 1.4; p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.life <= 0) { sparks.splice(i, 1); continue; }
    g.globalAlpha = p.life; g.fillStyle = '#ffe3a3';
    g.beginPath(); g.arc(p.x, p.y, p.s * p.life, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
