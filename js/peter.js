const cvs = document.getElementById("peter");
const ctx = cvs.getContext("2d");

let frames = 0;
const DEGREE = Math.PI / 180;

const sprite = new Image();
sprite.src = "img/sprite10.png";

const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

document.getElementById("start").addEventListener("click", function () {
  pipes.reset();
  bird.speedReset();
  score.reset();
  state.current = state.game;
  document.getElementById("logo").classList.toggle("hidden");
  document.getElementById("welcome").classList.toggle("hidden");
});

const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
}

const startBtn = {
  x: document.body.clientWidth / 2,
  y: document.body.clientHeight / 2,
  w: 83,
  h: 29
}

cvs.addEventListener("click", function (evt) {
  switch (state.current) {
    case state.game:
      if (bird.y - bird.radius <= 0) return;
      bird.flap();
      FLAP.play();
      break;
  }
});

document.getElementById("restart").addEventListener("click", function () {
  pipes.reset();
  bird.speedReset();
  score.reset();
  state.current = state.getReady;
  window.setTimeout(() => {
    state.current = state.game;
  }, 500);
  document.getElementById("logo").classList.toggle("hidden");
  document.getElementById("gameover").classList.toggle("hidden");
});

document.onkeypress = function (e) {
  if (state.current == state.game) {
    if (bird.y - bird.radius <= 0) return;
    bird.flap();
    FLAP.play();
  }
};

const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw: function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }

}

const fg = {
  sX: 276,
  sY: 0,
  w: 220,
  h: 112,
  x: 0,
  y: cvs.height - 110,

  dx: 2,

  draw: function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  },

  update: function () {
    if (state.current == state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  }
}

function getSkin(v) {
  if (v >= 90 && v < 110) {
    return [{
      sX: 443,
      sY: 112
    }, {
      sX: 443,
      sY: 139
    }, {
      sX: 443,
      sY: 164
    }, {
      sX: 443,
      sY: 139
    }];
  }
  else if (v >= 110) {
    return [{
      sX: 412,
      sY: 112
    }, {
      sX: 412,
      sY: 139
    }, {
      sX: 412,
      sY: 164
    }, {
      sX: 412,
      sY: 139
    }];
  } else {
    return [{
      sX: 276,
      sY: 112
    }, {
      sX: 276,
      sY: 139
    }, {
      sX: 276,
      sY: 164
    }, {
      sX: 276,
      sY: 139
    }];
  }
}

const bird = {
  animation: getSkin(customGap),
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  radius: 12,
  frame: 0,
  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,

  draw: function () {
    let bird = this.animation[this.frame];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  },

  flap: function () {
    this.speed = -this.jump;
  },

  update: function () {
    this.period = state.current == state.getReady ? 10 : 5;
    this.frame += frames % this.period == 0 ? 1 : 0;
    this.frame = this.frame % this.animation.length;

    if (state.current == state.getReady) {
      this.y = 150;
      this.rotation = 0 * DEGREE;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.y + this.h / 2 >= cvs.height - fg.h) {
        this.y = cvs.height - fg.h - this.h / 2;
        if (state.current == state.game) {
          state.current = state.over;
          DIE.play();
        }
      }

      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }

  },
  speedReset: function () {
    this.speed = 0;
  }
}

const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,

  draw: function () {
    if (state.current == state.getReady) {}
  }

}

const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 90,

  draw: function () {
    if (state.current == state.over) {
      document.getElementById("logo").classList.remove("hidden");
      document.getElementById("gameover").classList.remove("hidden");
    }
  }

}

const pipes = {
  position: [],

  top: {
    sX: 553,
    sY: 0
  },
  bottom: {
    sX: 502,
    sY: 0
  },

  w: 53,
  h: 400,
  gap: customGap,
  maxYPos: -150,
  dx: 2,

  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;
      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
    }
  },

  update: function () {
    if (state.current !== state.game) return;

    if (frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1)
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let bottomPipeYPos = p.y + this.h + this.gap;

      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
        state.current = state.over;
        HIT.play();
      }
      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
        state.current = state.over;
        HIT.play();
      }

      p.x -= this.dx;

      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        SCORE_S.play();
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },

  reset: function () {
    this.position = [];
  }

}

const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,

  draw: function () {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";

    if (state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = "35px Teko";
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);

    } else if (state.current == state.over) {
      document.getElementById("score").innerHTML = this.value;
      document.getElementById("best-score").innerHTML = this.best;
    }
  },

  reset: function () {
    this.value = 0;
  }
}

function draw() {
  ctx.fillStyle = "#272461";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function update() {
  bird.update();
  fg.update();
  pipes.update();
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}
loop();