const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

let background = new Image();
background.src = "Imagesbicycle/background1.png";

let playerImage = new Image();
playerImage.src = "Imagesbicycle/alleyCat.png";

const gravity = 1;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.width = 70;
    this.height = 90;
  }

  draw() {
    c.fillStyle = `red`;
    c.drawImage(
      playerImage,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    // else this.velocity.y = 0;
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };

    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const image = new Image();
image.src = "Imagesbicycle/troncoImage.png";

console.log(image);

const player = new Player();
const platforms = [
  new Platform({ x: -10, y: 470, image: image }),
  new Platform({ x: image.width - 3, y: 470, image: image }),
  new Platform({ x: image.width * 2 + 100, y: 470, image: image }),
  new Platform({ x: image.width * 3 + 300, y: 470, image: image }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // draw background image
  c.drawImage(background, 0, 0, canvas.width, canvas.height);

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
  }

  // platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // WIN CONDITION & you win message
  if (scrollOffset > 2000) {
    console.log("You win!");
  }
}

// LOSE CONDITION IT DOES NOT WORK 1'27
if (player.position.y > canvas.height) {
  console.log("You lose!");
}

animate();

window.addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = true;
      break;

    case 40:
      console.log("down");
      break;

    case 39:
      console.log("right");
      keys.right.pressed = true;
      break;

    case 38:
      console.log("up");
      player.velocity.y -= 5;
      break;
  }
});

window.addEventListener("keyup", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = false;
      break;

    case 40:
      console.log("down");
      break;

    case 39:
      console.log("right");
      keys.right.pressed = false;
      break;

    case 38:
      console.log("up");
      player.velocity.y -= 20;
      break;
  }
});
