const fs = require('fs');
const path = require('path');

const targetPath = path.join('c:', 'Users', 'prsnl', 'OneDrive', 'Desktop', 'newport', 'src', 'main.js');
let code = fs.readFileSync(targetPath, 'utf8');

const regex = /\/\/ ─── CURSOR TRAIL ─────────────────────────────[\s\S]*?window\.addEventListener\('resize', \(\) => \{\s*canvas\.width = window\.innerWidth;\s*canvas\.height = window\.innerHeight;\s*\}\);\s*\}/;

const newCode = `// ─── CURSOR TRAIL (PLEXUS) ───────────────────
function initCursorTrail() {
  const canvas = document.getElementById('cursorTrail');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const points = [];

  class PlexusPoint {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.life = 1;
      this.decay = 0.012;
      this.hue = \`hsl(\${(x / window.innerWidth) * 360}, 80%, 65%)\`;
      this.isGodMode = document.body.classList.contains('god-mode-active');
    }
    update() {
      this.life -= this.decay;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.life * 3), 0, Math.PI * 2);
      ctx.fillStyle = this.isGodMode ? \`rgba(0, 255, 65, \${this.life})\` : this.hue;
      ctx.fill();
    }
  }

  document.addEventListener('mousemove', (e) => {
    points.push(new PlexusPoint(e.clientX, e.clientY));
  });

  function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = points.length - 1; i >= 0; i--) {
      let p = points[i];
      p.update();
      
      for (let j = i - 1; j >= Math.max(0, i - 15); j--) {
        let p2 = points[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 80) {
           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(p2.x, p2.y);
           ctx.lineWidth = 1;
           if (p.isGodMode) {
             ctx.strokeStyle = \`rgba(0, 255, 65, \${p.life * 0.4 * (1 - dist/80)})\`;
           } else {
             ctx.strokeStyle = \`rgba(255, 255, 255, \${p.life * 0.3 * (1 - dist/80)})\`;
           }
           ctx.stroke();
        }
      }
      p.draw();
      if (p.life <= 0) {
        points.splice(i, 1);
      }
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}`;

if (regex.test(code)) {
  fs.writeFileSync(targetPath, code.replace(regex, newCode), 'utf8');
  console.log("Success");
} else {
  console.log("Failed to match regex");
}
