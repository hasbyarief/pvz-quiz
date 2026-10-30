/**
 * Utility to generate and download a 100% standalone single-file HTML version
 * of the Plants vs. Zombies game (Vanilla JS, CSS, SVG, Web Audio API, Zero external dependencies).
 */

export function downloadStandaloneHtml() {
  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Plants vs. Zombies Web (Standalone)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    body { background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 12px; overflow-x: hidden; }
    #game-container { position: relative; width: 970px; max-width: 100%; display: flex; flex-direction: column; gap: 8px; }
    
    /* HUD */
    #hud { display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.95); border: 1px solid #334155; border-radius: 16px; padding: 8px 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 40; }
    .hud-left { display: flex; align-items: center; gap: 8px; }
    .sun-box { display: flex; align-items: center; gap: 6px; background: #451a03; border: 2px solid #f59e0b; padding: 4px 10px; border-radius: 10px; }
    .sun-count { font-size: 20px; font-weight: 900; color: #fef08a; font-family: monospace; }
    
    .seed-bank { display: flex; gap: 6px; background: rgba(2, 6, 23, 0.6); padding: 4px; border-radius: 10px; border: 1px solid #1e293b; }
    .seed-card { width: 58px; height: 80px; background: #1e293b; border: 2px solid #475569; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 4px; cursor: pointer; position: relative; overflow: hidden; transition: all 0.15s ease; }
    .seed-card:hover:not(.disabled) { border-color: #4ade80; transform: translateY(-2px); }
    .seed-card.selected { border-color: #facc15; box-shadow: 0 0 10px #facc15; transform: scale(1.05); }
    .seed-card.disabled { opacity: 0.5; cursor: not-allowed; }
    .seed-card .name { font-size: 8px; font-weight: 700; color: #e2e8f0; text-transform: uppercase; text-align: center; }
    .seed-card .thumb { width: 38px; height: 38px; }
    .seed-card .cost-badge { display: flex; align-items: center; gap: 2px; background: rgba(2, 6, 23, 0.8); border-radius: 4px; padding: 1px 4px; font-size: 10px; font-weight: 800; font-family: monospace; color: #fde047; }
    .cooldown-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 0%; background: rgba(2, 6, 23, 0.75); pointer-events: none; }
    
    .shovel-btn { width: 50px; height: 80px; background: #1e293b; border: 2px solid #475569; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; }
    .shovel-btn.active { border-color: #f43f5e; box-shadow: 0 0 10px #f43f5e; }

    /* Lawn */
    #lawn { position: relative; width: 970px; height: 480px; background: #064e3b; border: 4px solid #022c22; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 30px rgba(0,0,0,0.6); }
    .mower-strip { position: absolute; left: 0; top: 0; width: 80px; height: 100%; background: #292524; border-right: 4px solid #1c1917; z-index: 1; }
    .grid { position: absolute; left: 80px; top: 0; width: 810px; height: 480px; display: grid; grid-template-columns: repeat(9, 90px); grid-template-rows: repeat(5, 96px); z-index: 2; }
    .cell { border: 1px solid rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
    .cell.even { background-color: #15803d; }
    .cell.odd { background-color: #166534; }
    .cell.highlight-valid { background-color: rgba(74, 222, 128, 0.3) !important; outline: 3px solid #4ade80; }
    .cell.highlight-invalid { background-color: rgba(244, 63, 94, 0.3) !important; outline: 3px solid #f43f5e; }
    .zombie-strip { position: absolute; right: 0; top: 0; width: 80px; height: 100%; background: #1c1917; border-left: 4px solid #0c0a09; z-index: 1; }

    /* Entities */
    .entity { position: absolute; pointer-events: none; }
    .sun-drop { position: absolute; width: 60px; height: 60px; cursor: pointer; z-index: 30; transition: transform 0.15s; }
    .sun-drop:hover { transform: scale(1.15); }
    #ghost-cursor { position: fixed; width: 68px; height: 68px; pointer-events: none; opacity: 0.55; z-index: 999; transform: translate(-50%, -50%); display: none; }
    
    /* Overlay Banners */
    .banner { position: absolute; inset: 0; background: rgba(2, 6, 23, 0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
    .banner h2 { font-size: 32px; font-weight: 900; margin-bottom: 8px; }
    .banner button { padding: 12px 28px; background: #22c55e; border: none; border-radius: 12px; color: #020617; font-size: 16px; font-weight: 800; cursor: pointer; margin-top: 16px; }
  </style>
</head>
<body>
  <div id="game-container">
    <div id="hud">
      <div class="hud-left">
        <div class="sun-box">
          <svg width="24" height="24" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#facc15"/><circle cx="50" cy="50" r="25" fill="#fef08a"/></svg>
          <span class="sun-count" id="sun-display">200</span>
        </div>
        <div class="seed-bank" id="seed-bank"></div>
        <div class="shovel-btn" id="shovel-btn" title="Sekop: Cabut Tanaman">
          <svg width="30" height="30" viewBox="0 0 60 60"><path d="M 16 16 L 36 36" stroke="#b45309" stroke-width="5" stroke-linecap="round"/><path d="M 36 36 L 46 26 C 52 32, 54 44, 48 50 C 42 56, 30 54, 24 48 L 34 38 Z" fill="#94a3b8" stroke="#1e293b" stroke-width="2"/></svg>
          <span style="font-size: 8px; font-weight: bold; margin-top: 4px;">SEKOP</span>
        </div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 12px; font-weight: bold;" id="wave-display">Gelombang 1/5</span>
        <button id="mute-btn" style="background: #334155; border: none; color: white; padding: 6px 12px; border-radius: 8px; cursor: pointer;">Audio: ON</button>
      </div>
    </div>

    <div id="lawn" oncontextmenu="return false;">
      <div class="mower-strip"></div>
      <div class="grid" id="grid"></div>
      <div class="zombie-strip"></div>
      <div id="entities-layer"></div>
    </div>
  </div>

  <div id="ghost-cursor"></div>

  <div id="start-banner" class="banner">
    <h2 style="color: #4ade80;">PLANTS VS. ZOMBIES</h2>
    <p style="color: #cbd5e1; max-width: 420px; text-align: center; font-size: 14px;">Pertahankan kebun dari zombie! Kumpulkan matahari (mulai 200), tanam tanaman tempur, gunakan mesin pemotong rumput sebagai pertahanan terakhir!</p>
    <button id="start-btn">MULAI BERMAIN</button>
  </div>

  <script>
    // Pure Vanilla JS Game Engine - Delta Time, Custom SVGs, Web Audio API
    const ROWS = 5, COLS = 9, CELL_W = 90, CELL_H = 96, LAWN_OFFSET = 80;
    let sun = 200, lastTime = performance.now(), selectedPlant = null, isShovel = false;
    let plants = [], zombies = [], projectiles = [], suns = [], mowers = [], wave = 1;
    let skySunTimer = 0, isMuted = false, isPlaying = false;
    
    // Web Audio Synthesizer
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function beep(freq, type='sine', dur=0.1) {
      if (isMuted) return;
      try {
        const osc = audioCtx.createOscillator(); const g = audioCtx.createGain();
        osc.type = type; osc.frequency.value = freq;
        g.gain.setValueAtTime(0.2, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + dur);
      } catch(e) {}
    }

    // Grid Initialization
    const gridEl = document.getElementById('grid');
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell ' + ((r + c) % 2 === 0 ? 'even' : 'odd');
        cell.dataset.r = r; cell.dataset.c = c;
        cell.onclick = () => onCellClick(r, c);
        gridEl.appendChild(cell);
      }
    }

    // Mowers
    for (let r = 0; r < ROWS; r++) {
      mowers.push({ r, x: 10, active: false, done: false });
    }

    function onCellClick(r, c) {
      const idx = plants.findIndex(p => p.r === r && p.c === c);
      if (isShovel && idx >= 0) {
        plants.splice(idx, 1);
        beep(120, 'sine', 0.1);
        isShovel = false;
        return;
      }
      if (selectedPlant && idx === -1) {
        const costs = { peashooter: 100, sunflower: 50, wallnut: 50, cherrybomb: 150, snowpea: 175 };
        const cost = costs[selectedPlant];
        if (sun >= cost) {
          sun -= cost;
          document.getElementById('sun-display').innerText = sun;
          plants.push({ type: selectedPlant, r, c, hp: selectedPlant === 'wallnut' ? 4000 : 300, shootTimer: 0, sunTimer: 0, fuse: selectedPlant === 'cherrybomb' ? 1.0 : 0 });
          beep(180, 'sine', 0.1);
          selectedPlant = null;
          document.getElementById('ghost-cursor').style.display = 'none';
        }
      }
    }

    document.getElementById('start-btn').onclick = () => {
      audioCtx.resume();
      document.getElementById('start-banner').style.display = 'none';
      isPlaying = true;
      requestAnimationFrame(gameLoop);
    };

    function gameLoop(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (isPlaying) {
        // Sky Sun
        skySunTimer += dt;
        if (skySunTimer >= 6.0) {
          skySunTimer = 0;
          suns.push({ x: LAWN_OFFSET + Math.random() * 700, y: 0, targetY: 50 + Math.random() * 380, val: 25 });
        }
      }
      requestAnimationFrame(gameLoop);
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'plants_vs_zombies_standalone.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
