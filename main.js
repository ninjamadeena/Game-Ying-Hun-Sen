// ====== Config ======
const IMG_COUNT = 30;
const TARGET_SIZE = 120;
const SPARK_COUNT = 10;

// ====== State ======
let score = 0;
let remainingTargets = 0;

// ====== Elements ======
const shakeRoot   = document.getElementById("shake");
const scoreDisplay= document.getElementById("score");
const gunSound    = document.getElementById("gun");
const bgm         = document.getElementById("bgm");
const startBtn    = document.getElementById("start-btn");

// ====== Start ======
startBtn.addEventListener("click", () => {
  bgm.play().catch(e => console.log("BGM error:", e));
  scoreDisplay.style.display = "block";
  document.getElementById("start-screen").remove();
  spawnTargets();
});

// ====== Spawn Targets ======
function spawnTargets() {
  remainingTargets = IMG_COUNT;
  for (let i = 0; i < IMG_COUNT; i++) createTarget();
}

function createTarget() {
  const wrapper = document.createElement("div");
  wrapper.className = "img-wrapper";
  wrapper.style.left = Math.random() * (window.innerWidth  - (TARGET_SIZE + 10)) + "px";
  wrapper.style.top  = Math.random() * (window.innerHeight - (TARGET_SIZE + 10)) + "px";

  const img = document.createElement("img");
  img.src = "Hun Sen Hua kuy.jpg";   // ใช้ชื่อไฟล์เดิมของคุณ
  img.alt = "Hun Sen";
  img.className = "img";

  img.addEventListener("click", (e) => {
    const x = e.pageX;
    const y = e.pageY;

    wrapper.remove();
    score++;
    remainingTargets--;
    scoreDisplay.innerText = `kill:${score}`;

    gunSound.currentTime = 0;
    gunSound.play().catch(err => console.log("เล่นเสียงปืนไม่ได้:", err));

    showMuzzleFlash(x, y);
    createSparks(x, y);
    screenGlow(x, y);
    cameraShake(9, 90);

    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);

    if (remainingTargets <= 0) {
      setTimeout(spawnTargets, 500);
    }
  });

  wrapper.appendChild(img);
  document.body.appendChild(wrapper);
}

// ====== FX: Muzzle Flash ======
function showMuzzleFlash(x, y) {
  const m = document.createElement("div");
  m.className = "muzzle";
  m.style.left = x + "px";
  m.style.top  = y + "px";

  const core = document.createElement("div");
  core.className = "m-core";
  const cone = document.createElement("div");
  cone.className = "m-cone";

  m.appendChild(core);
  m.appendChild(cone);
  document.body.appendChild(m);

  setTimeout(() => m.remove(), 180);
}

// ====== FX: Sparks ======
function createSparks(x, y) {
  for (let i = 0; i < SPARK_COUNT; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = (x - 2) + "px";
    s.style.top  = (y - 2) + "px";

    const ang = Math.random() * Math.PI * 2;
    const bias = (Math.random() - 0.5) * 0.6;
    const dist = 40 + Math.random() * 80;
    const dx = Math.cos(ang + bias) * dist;
    const dy = Math.sin(ang) * dist * (0.7 + Math.random()*0.6);

    const dur = 260 + Math.random() * 260;

    s.animate([
      { transform: "translate(0,0)", opacity: 1, offset: 0 },
      { transform: `translate(${dx*0.7}px, ${dy*0.7}px)`, opacity: 0.9, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy + 30}px)`, opacity: 0, offset: 1 }
    ], { duration: dur, easing: "ease-out" });

    document.body.appendChild(s);
    setTimeout(() => s.remove(), dur + 60);
  }
}

// ====== FX: Screen Glow ======
function screenGlow(x, y) {
  const g = document.createElement("div");
  g.className = "screen-glow";
  const gx = (x / window.innerWidth) * 100;
  const gy = (y / window.innerHeight) * 100;
  g.style.setProperty("--gx", gx + "%");
  g.style.setProperty("--gy", gy + "%");
  document.body.appendChild(g);
  setTimeout(() => g.remove(), 200);
}

// ====== FX: Camera Shake (decay) ======
let shakeTimer = null;
function cameraShake(intensity = 8, duration = 100) {
  const start = performance.now();
  if (shakeTimer) cancelAnimationFrame(shakeTimer);

  const tick = (now) => {
    const t = now - start;
    const p = Math.min(t / duration, 1);
    const damp = 1 - p;
    const dx = (Math.random() - 0.5) * intensity * damp;
    const dy = (Math.random() - 0.5) * intensity * damp;
    shakeRoot.style.transform = `translate(${dx}px, ${dy}px)`;

    if (p < 1) {
      shakeTimer = requestAnimationFrame(tick);
    } else {
      shakeRoot.style.transform = "translate(0,0)";
      shakeTimer = null;
    }
  };
  shakeTimer = requestAnimationFrame(tick);
}

window.addEventListener("resize", () => {});
