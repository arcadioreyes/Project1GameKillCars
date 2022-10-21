// window.onload = () => {
//   document.getElementById("start-button").onclick = () => {
//     startGame();
//   };

//   function startGame() {
//     isStarted = !isStarted;
//   }
// };

// let isStarted = false;

//lines 1 to 11 added to test start button not working :(

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// My canvas Size
canvas.width = 1024;
canvas.height = 576;

//Images
let background = new Image();
background.src = "Imagesbicycle/background1.png";

let playerImage = new Image();
playerImage.src = "Imagesbicycle/alleyCat.png";

let carImage = new Image();
carImage.src = "Imagesbicycle/car.png";

const gravity = 1;

class Player {
  constructor(cars) {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.width = 80;
    this.height = 100;
    this.carSpawnTime = 2;
    this.cars = cars;
    this.lives = 3;
    this.isHit = [];

    // displaying cars every 2 seconds => car.SpawnTime
    setInterval(() => {
      this.cars.push(
        new Car({ x: canvas.width, y: 540 - 75, image: carImage })
      );
    }, this.carSpawnTime * 1000);
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
    else this.velocity.y = 0;
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

// creation car and speed
class Car {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };

    this.image = image;

    this.width = image.width / 2;
    this.height = image.height / 2;
    this.speed = 6;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width / 3,
      this.image.height / 3
    );
  }

  update() {
    this.position.x -= this.speed;
  }
}

// adding platform trees
const image = new Image();
image.src = "Imagesbicycle/3troncos.png";

console.log(image);

let cars = [new Car({ x: canvas.width, y: 540 - 75, image: carImage })];

const player = new Player(cars);

// adding 1st level of platform trees
const platforms = [
  new Platform({ x: -10, y: 530, image: image }),
  new Platform({ x: image.width - 3, y: 530, image: image }),
  new Platform({ x: image.width * 2, y: 530, image: image }),
  new Platform({ x: image.width * 3, y: 530, image: image }),
  new Platform({ x: image.width * 4, y: 530, image: image }),
  new Platform({ x: image.width * 5, y: 530, image: image }),
  new Platform({ x: image.width * 6, y: 530, image: image }),

  // adding 2nd level of platform trees
  new Platform({ x: -10, y: 370, image: image }),
  new Platform({ x: image.width * 1.1, y: 340, image: image }),
  new Platform({ x: image.width * 2.3, y: 210, image: image }),
  new Platform({ x: image.width * 4, y: 310, image: image }),
  new Platform({ x: image.width * 4.6, y: 200, image: image }),
  new Platform({ x: image.width * 6, y: 370, image: image }),
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
  //YOU WIN POP UP
  const animationId = requestAnimationFrame(animate);
  if (scrollOffset > image.width * 6) {
    alert("You WIN!");
    cancelAnimationFrame(animationId);

    //GAME OVER POP UP
  } else if (player.lives <= 0) {
    // In order to make this pop up more stylish an elementbyid
    // to block can be used in order to display GAME OVER
    alert("Game Over! You were hit 3 times!");
    cancelAnimationFrame(animationId);
  }

  //requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // draw background image
  c.drawImage(background, 0, 0, canvas.width, canvas.height);

  platforms.forEach((platform) => {
    platform.draw();
  });

  cars.forEach((car) => {
    car.draw();
  });

  player.update();

  cars.forEach((car) => {
    car.update();
  });

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    // movement platform inside animate() function
    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });

      cars.forEach((car) => {
        car.position.x -= 5;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
      cars.forEach((car) => {
        car.position.x += 5;
      });
    }
  }

  // platform collision detection inside animate() function
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

  // car collision detection inside animate() function
  cars.forEach((car, index) => {
    if (
      player.position.y + player.height >= car.position.y &&
      player.position.y <= car.position.y + car.height &&
      player.position.x + player.width >= car.position.x &&
      player.position.x <= car.position.x + car.width &&
      !player.isHit.includes(index)
    ) {
      console.log("hit");
      player.isHit.push(index);

      player.lives -= 1;
    }
  });

  // WIN CONDITION & you win message inside animate() function
  if (scrollOffset > image.width * 6) {
    console.log("You win!");
  }
}

animate();

// Controlling the character with arrows
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
      player.velocity.y -= 15;
      break;
  }
});
