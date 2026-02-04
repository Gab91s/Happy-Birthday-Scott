const book = document.getElementById('book');
const cornerLeft = document.getElementById('cornerLeft');
const cornerRight = document.getElementById('cornerRight');
const candlesEl = document.getElementById('candles');
const resetBtn = document.getElementById('resetBtn');
const celebrateBtn = document.getElementById('celebrateBtn');
const audio = document.getElementById('birthdaySong');

let isOpen = false;
let candlesOutCount = 0;
let celebrateLock = false;

const confettiColors = ["#5A9CB5","#FACE68","#FAAC68","#FA6868","rgba(180,140,255,0.9)"];

function safePlayAudio(){
  // Browsers require user gesture — opening the card counts.
  audio.play().catch(() => {});
}
function stopAudio(){
  audio.pause();
  audio.currentTime = 0;
}

function toggleOpen(){
  isOpen = !isOpen;
  book.classList.toggle('open', isOpen);
  document.body.classList.toggle('stars-on', isOpen);
  if (isOpen) safePlayAudio();
  else stopAudio();
}

function toggleCat(){
  document.body.classList.toggle('cat-on', isOpen);
}

cornerLeft.addEventListener('click', (e) => { e.stopPropagation(); toggleCat(); });
cornerRight.addEventListener('click', (e) => { e.stopPropagation(); toggleOpen(); });
function makeCandle({ digitText = null } = {}){
  const c = document.createElement('div');
  c.className = 'candle';
  const flame = document.createElement('div');
  flame.className = 'flame';
  const body = document.createElement('div');
  body.className = 'body';
  const stripe = document.createElement('div');
  stripe.className = 'stripe';
  if (digitText !== null){
    c.classList.add('digit');
    body.textContent = digitText;
  } else {
    body.appendChild(stripe);
  }
  c.appendChild(flame);
  c.appendChild(body);
  c.addEventListener('click', (e) => {
    e.stopPropagation();
    blowOut(c);
  });
  return c;
}

const CANDLE_COUNT = 9; // change to 29 anytime
function createCandles(){
  candlesEl.innerHTML = "";
  candlesOutCount = 0;
  for (let i = 0; i < CANDLE_COUNT; i++){
    candlesEl.appendChild(makeCandle());
    }
  }
  function blowOut(candle){
    if (candle.classList.contains('out')) return;
    candle.classList.add('out');
    candlesOutCount++;
    // When all candles are out, confetti drops again.
    const total = candlesEl.querySelectorAll('.candle').length;
    if (candlesOutCount >= total){
    // trigger the same path as the button
      document.getElementById('celebrateBtn').click();
      }
    }
  function resetCandles(){
    // tiny match "light" animation
    resetBtn.classList.add('lit');
    setTimeout(() => resetBtn.classList.remove('lit'), 450);
    candlesEl.querySelectorAll('.candle').forEach(c => c.classList.remove('out'));
    candlesOutCount = 0;
  }
 
  function celebrate(){
    if (celebrateLock) return;
    celebrateLock = true;
    setTimeout(() => celebrateLock = false, 850);
    for (let i = 0; i < 70; i++){
      setTimeout(() => {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = (Math.random() * 100) + 'vw';
        conf.style.top = '-12px';
        conf.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        conf.style.animation = `fall ${2 + Math.random()*2.2}s linear forwards`;
        conf.style.transform = `rotate(${Math.random()*360}deg)`;
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 4500);
      }, i * 22);
    }
  }
  // Init
  createCandles();
  
  function spawnPawTrail(){
  // Start position: near the paw button on screen // Changed pawBtn to CelebrateBtn for space on card
  const r = celebrateBtn.getBoundingClientRect();
  let x = r.left + r.width / 2;
  let y = r.top - 6;

  // Trail settings
  const steps = 12;              // how many paw marks
  const stepDist = 34;           // distance per step
  const wobble = 18;             // sideways randomness
  const driftX = (Math.random() < 0.5 ? -1 : 1) * (12 + Math.random()*18); // overall drift
  const driftY = -1 * (18 + Math.random()*18); // generally upward-ish
  let leftRight = 1;             // alternate paws

  for (let i = 0; i < steps; i++){
    setTimeout(() => {
      // add some non-straight movement
      const dx = driftX + (Math.random()*wobble - wobble/2);
      const dy = driftY + (Math.random()*10 - 5);

      x += dx;
      y += dy;

      const paw = document.createElement('div');
      paw.className = 'pawprint';
      paw.textContent = '🐾';

      // alternate offset left/right so it feels like steps
      const side = leftRight * (8 + Math.random()*6);
      leftRight *= -1;

      paw.style.left = (x + side) + 'px';
      paw.style.top = (y) + 'px';
      paw.style.transform = `translate(-50%, -50%) rotate(${(Math.random()*50 - 25)}deg) scale(${0.9 + Math.random()*0.25})`;

      document.body.appendChild(paw);

      // show
      requestAnimationFrame(() => paw.classList.add('show'));

      // after a bit, drift + fade
      setTimeout(() => {
        paw.classList.add('fade');
        paw.style.transform =
          `translate(-50%, -50%) rotate(${(Math.random()*60 - 30)}deg) scale(${0.85 + Math.random()*0.2}) translateY(-18px)`;
      }, 900 + i*40);

      // remove
      setTimeout(() => paw.remove(), 2600);
    }, i * 110);
  }
}

const catSoundA = document.getElementById('catSoundA');
const catSoundB = document.getElementById('catSoundB');

let pawToggle = false;

function playCatSound(){
  const a = catSoundA;
  const b = catSoundB;

  // stop both so rapid clicking behaves nicely
  [a,b].forEach(x => {
    try { x.pause(); x.currentTime = 0; } catch {}
  });

  pawToggle = !pawToggle;
  const chosen = pawToggle ? a : b;

  chosen.play().catch(() => {});
}
// Duplicate functions to assign to resetBtn: spawnPawTrail() = dropPawTrail()
// and playCatSound() = playMeowPurr() -- this is just to see more than one way of doing it.
const catAudioA = new Audio("meow.mp3");
const catAudioB = new Audio("purr.mp3");
let catToggle = false;

function playMeowPurr(){
  const a = catToggle ? catAudioA : catAudioB;
  catToggle = !catToggle;
  a.currentTime = 0;
  a.play().catch(()=>{});
}

function dropPawTrail(){
  const steps = 12;
  const startX = 18 + Math.random() * 64; // vw-ish feel
  const startY = 18 + Math.random() * 56;
  let x = startX, y = startY, angle = (Math.random()*40 - 20);

  for (let i = 0; i < steps; i++){
    setTimeout(() => {
      const p = document.createElement("div");
      p.className = "pawprint";
      p.textContent = "🐾";

      // wander (not straight)
      angle += (Math.random() * 26 - 13);
      x += Math.cos(angle * Math.PI/180) * (4 + Math.random()*5);
      y += Math.sin(angle * Math.PI/180) * (4 + Math.random()*5);

      // clamp into viewport-ish space
      x = Math.max(6, Math.min(94, x));
      y = Math.max(8, Math.min(92, y));

      p.style.left = x + "vw";
      p.style.top  = y + "vh";
      p.style.transform = `translate(-50%,-50%) rotate(${Math.random()*40-20}deg) scale(${0.9 + Math.random()*0.25})`;

      document.body.appendChild(p);

      requestAnimationFrame(() => p.classList.add("show"));
      setTimeout(() => p.classList.add("fade"), 1600);
      setTimeout(() => p.remove(), 2600);
    }, i * 85);
  }
}
// Button handlers - Event Listeners
 resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetCandles();
    playMeowPurr();
    dropPawTrail();
    spawnPawTrail();
  });
  celebrateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    celebrate();
    spawnPawTrail()
    playCatSound(); 
    spawnPawTrail();
  });
// const pawBtn = document.getElementById('pawBtn'); // commenting out, changing to celebrateBtn for space on card

// pawBtn.addEventListener('click', (e) => {
//   e.stopPropagation();
//   // a tiny “purr” moment: extra confetti + relight, or a gentle message
//   celebrate();
//   spawnPawTrail()
//   pawBtn.addEventListener('click', (e) => {
//   e.stopPropagation();
//   playCatSound();
//   spawnPawTrail();
// });
// });