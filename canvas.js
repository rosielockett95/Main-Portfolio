const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
let particleArray = [];
let adjustX = canvas2.width / 200;
let adjustY = canvas2.height / 200;
//
let xSpacing = 15,
  ySpacing = 15;

// get mouse mouse position //
let mouse2 = {
  x: null,
  y: null,
  radius: 150,
};
window.addEventListener("mousemove", function (event) {
  mouse2.x = event.x + canvas2.clientLeft / 2;
  mouse2.y = event.y + canvas2.clientTop / 2;
});

ctx2.font = "bold 20px Verdana";
ctx2.fillText("ROSIE", 0, 40);
const data = ctx2.getImageData(0, 0, canvas2.width, 100);
const sprite = new Image();
sprite.src = "https://i.ibb.co/DGqfJpG/butterflies-and-flowers.png";
class Particle2 {
  constructor(x, y) {
    ((this.x = x + 200),
      (this.y = y - 100),
      (this.size = 3),
      (this.baseX = this.x),
      (this.baseY = this.y),
      (this.density = Math.random() * 30 + 1));
    this.random = Math.random();
    this.spriteSize = Math.random() * 50 + 50;
    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 8);
    this.angle = Math.random() * 2;
  }
  draw() {
    if (this.random > 0.05) {
      ctx2.fillStyle = "white";
      ctx2.beginPath();
      ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx2.closePath();
      ctx2.fill();
    } else {
      ctx2.save();
      ctx2.translate(this.x, this.y);
      ctx2.rotate(this.angle);
      ctx2.drawImage(
        sprite,
        this.frameX * 213.3,
        this.frameY * 213.3,
        213.3,
        213.3,
        0 - this.spriteSize / 2,
        0 - this.spriteSize / 2,
        this.spriteSize,
        this.spriteSize,
      );
      ctx2.restore();
    }
  }
  update() {
    // check mouse position/particle position - collision detection
    let dx = mouse2.x - this.x;
    let dy = mouse2.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    // distance past which the force is zero
    var maxDistance = mouse2.radius;
    // convert (0...maxDistance) range into a (1...0).
    // Close is near 1, far is near 0
    // for example:
    //   250 => 0.75
    //   100 => 0.9
    //   10  => 0.99
    var force = (maxDistance - distance) / maxDistance;

    // if we went below zero, set it to zero.
    if (force < 0) force = 0;

    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse2.radius + this.size) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

function init() {
  particleArray = [];

  for (var y = 0, y2 = data.height; y < y2; y++) {
    for (var x = 0, x2 = data.width; x < x2; x++) {
      if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        //let positionX = x;
        //let positionY = y;
        // * 15 = distance between particles

        particleArray.push(new Particle2(positionX * xDist, positionY * yDist));
      }
    }
  }
}
function animate() {
  //ctx.fillStyle = 'rgba(0,0,0,0.5)';
  //ctx.fillRect(0,0,innerWidth,innerHeight);
  ctx2.clearRect(0, 0, innerWidth, innerHeight);
  connect();
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
  }

  requestAnimationFrame(animate);
}
init();
// animate();

let resizeTimeout;

// RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
window.addEventListener("resize", function () {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    canvas2.width = innerWidth;
    canvas2.height = innerHeight;
    adjustX = -60 + canvas2.width / 30;
    adjustY = -32 + canvas2.height / 30;
    init();
  }, 500);
});

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let distance =
        (particleArray[a].x - particleArray[b].x) *
          (particleArray[a].x - particleArray[b].x) +
        (particleArray[a].y - particleArray[b].y) *
          (particleArray[a].y - particleArray[b].y);

      if (distance < 2600) {
        opacityValue = 1 - distance / 2600;
        let dx = mouse2.x - particleArray[a].x;
        let dy = mouse2.y - particleArray[a].y;
        let mouseDistance = Math.sqrt(dx * dx + dy * dy);
        if (mouseDistance < mouse2.radius / 2) {
          ctx2.strokeStyle = "rgba(255,255,0," + opacityValue + ")";
        } else if (mouseDistance < mouse2.radius - 50) {
          ctx2.strokeStyle = "rgba(255,255,140," + opacityValue + ")";
        } else if (mouseDistance < mouse2.radius + 20) {
          ctx2.strokeStyle = "rgba(255,255,210," + opacityValue + ")";
        } else {
          ctx2.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
        }
        ctx2.lineWidth = 1;
        ctx2.beginPath();
        ctx2.moveTo(particleArray[a].x, particleArray[a].y);
        ctx2.lineTo(particleArray[b].x, particleArray[b].y);
        ctx2.stroke();
      }
    }
  }
}
