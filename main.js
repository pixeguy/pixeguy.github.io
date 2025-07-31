/* jshint esversion: 6 */

//#region fullscreen button
const btnFS = document.querySelector("#btnFS");

btnFS.addEventListener("click", () => {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    // Enter fullscreen
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  }
});
//#endregion

//#region glitchText
const resolver = {
  resolve: function resolve(options, callback) {
    // The string to resolve
    const resolveString = options.resolveString || options.element.getAttribute('data-target-resolver');
    const combinedOptions = Object.assign({}, options, { resolveString: resolveString });

    function getRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomCharacter(characters) {
      return characters[getRandomInteger(0, characters.length - 1)];
    }

    function doRandomiserEffect(options, callback) {
      const characters = options.characters;
      const element = options.element;
      const partialString = options.partialString;

      let iterations = options.iterations;

      setTimeout(() => {
        if (iterations >= 0) {
          const nextOptions = Object.assign({}, options, { iterations: iterations - 1 });

          // Ensures partialString without the random character as the final state.
          if (iterations === 0) {
            element.textContent = partialString;
          } else {
            // Replaces the last character of partialString with a random character
            element.textContent = partialString.substring(0, partialString.length - 1) + randomCharacter(characters);
          }

          doRandomiserEffect(nextOptions, callback);
        } else if (typeof callback === "function") {
          callback();
        }
      }, options.timeout);
    }

    function doResolverEffect(options, callback) {
      const resolveString = options.resolveString;
      const offset = options.offset;
      const partialString = resolveString.substring(0, offset);
      const combinedOptions = Object.assign({}, options, { partialString: partialString });

      doRandomiserEffect(combinedOptions, () => {
        const nextOptions = Object.assign({}, options, { offset: offset + 1 });

        if (offset <= resolveString.length) {
          doResolverEffect(nextOptions, callback);
        } else if (typeof callback === "function") {
          if (resolveString !== strings[strings.length - 1]) {
            callback();
          }
        }
      });
    }

    doResolverEffect(combinedOptions, callback);
  }
};

/* Some GLaDOS quotes from Portal 2 chapter 9: The Part Where He Kills You
 * Source: http://theportalwiki.com/wiki/GLaDOS_voice_lines#Chapter_9:_The_Part_Where_He_Kills_You
 */
const strings = [
  'Wanna know more about Figures?',
  'You are in the right place!',
  'Let\'s learn more about Figures!'
];

let counter = 0;

const options = {
  // Initial position
  offset: 0,
  // Timeout between each random character
  timeout: 5,
  // Number of random characters to show
  iterations: 10,
  // Random characters to pick from
  characters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'x', '#', '%', '&', '-', '+', '_', '?', '/', '\\', '='],
  // String to resolve
  //if i want to auto
  resolveString: strings[counter],
  // The element
  element: document.querySelector('[data-target-resolver]')
};

// Callback function when resolve completes
function callback() {
  setTimeout(() => {
    counter++;

    if (counter >= strings.length) {
      counter = 0;
    }

    let nextOptions = Object.assign({}, options, { resolveString: strings[counter] });
    resolver.resolve(nextOptions, callback);
  }, 1000);
}

resolver.resolve(options, callback);
//#endregion

//#region drawing logo
const logoL = document.getElementById('logoleft');
const logoLctx = logoL.getContext('2d');
logoLctx.fillStyle = 'black';
logoLctx.beginPath();
logoLctx.moveTo(0, 0);
logoLctx.lineTo(150, 150);
logoLctx.lineTo(150, 125);
logoLctx.moveTo(0, 0);
logoLctx.stroke();
logoLctx.fill();

const logoR = document.getElementById('logoright');
const logoRctx = logoR.getContext('2d');
logoRctx.fillStyle = 'black';

logoRctx.beginPath();
logoRctx.moveTo(150, 0);
logoRctx.lineTo(150, 0);
logoRctx.lineTo(0, 150);
logoRctx.lineTo(0, 125);
logoRctx.lineTo(150, 0);
logoRctx.stroke();
logoRctx.fill();

const logo = document.getElementById('logo');
const logoctx = logo.getContext('2d');
logoctx.fillStyle = 'red';

logoctx.beginPath();
logoctx.moveTo(125, 125);
logoctx.lineTo(130, 90);
logoctx.lineTo(170, 90);
logoctx.lineTo(175, 125);
logoctx.lineTo(150, 150);
logoctx.lineTo(125, 125);
logoctx.stroke();
logoctx.fill();
//#endregion

//#region fade in screen (intersection observer)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //responsive for mobile
        if (window.innerWidth > 800) {
          //find all elements that need typing effect and call them
          if (entry.target.hasAttribute('data-typer')) {
            const typeroptions = {
              timeout: 70,
              typerElement: entry.target,
              resolveString: entry.target.getAttribute('data-typer')
            };
            typerResolver.resolve(typeroptions);
          }
        }
        //for simple fade in fade out
        entry.target.classList.add('visible');
        entry.target.classList.remove('not-visible');
      } else {
        entry.target.classList.remove('visible');
        entry.target.classList.add('not-visible');
      }
    });
  },
  {
    rootMargin: "0px",
    threshold: [0, 0, 1, 1],
  }
);

const tags = document.querySelectorAll('.fade-in');

tags.forEach((tag) => {
  observer.observe(tag);
});
//#endregion

//#region bunch o button click events
const hamburger = document.querySelector("#hamburger>div");
const hamburgermenu = document.querySelector("#hamburgerMenu");
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  hamburgermenu.classList.toggle('active');
});

const hamburgerBtns = document.getElementsByClassName("hamMenuBtn");
for (let i = 0; i < hamburgerBtns.length; i++) {
  const button = hamburgerBtns[i];
  hamburgerBtns[i].addEventListener('click', () => {
    var current = document.querySelectorAll("#hamburgerMenu nav ul li.active");
    if (current.length > 0) {
      current[0].classList.remove("active");
    }
    button.parentElement.classList.add("active");
  });
}

const sub2Btns = document.getElementsByClassName("sub2Btn");
const sub2Cnt = document.getElementsByClassName("sub2Content");

for (let i = 0; i < sub2Btns.length; i++) {
  const btn = sub2Btns[i];
  const cnt = sub2Cnt[i];

  btn.addEventListener('click', () => {
    const current = document.getElementsByClassName("sub2Btn active");
    const currentCnt = document.querySelectorAll(".sub2Content.sub2Show");

    if (current.length > 0) {
      currentCnt[0].classList.remove("sub2Show");
      current[0].classList.remove("active");
    }

    btn.classList.add("active");
    cnt.classList.add("sub2Show");
  });
}

const imageGalleryBtns = document.getElementsByClassName("showMoreBtn");
const imageGalleryOverlay = document.getElementsByClassName("sub2Overlay");
for (let i = 0; i < imageGalleryBtns.length; i++) {
  const btn = imageGalleryBtns[i];
  const overlay = imageGalleryOverlay[i];

  btn.addEventListener('click', () => {
    overlay.classList.add('sub2Show');
  });
}

const exitBtn = document.getElementsByClassName("exitBtn");
for (let i = 0; i < exitBtn.length; i++) {
  exitBtn[i].addEventListener('click', () => {
    var current = document.querySelectorAll('.sub2Overlay.sub2Show');
    if (current.length > 0) {
      current[0].classList.remove("sub2Show");
    }
  });
}

const startBtn = document.querySelector("#startButton");
const startScreen = document.querySelector("#gameCover");
let currentOpacity = parseFloat(startScreen.style.opacity) || 1;
let gameStarted = false;
let gameWon = false;
let clawActive = false;
startBtn.addEventListener('click', () => {
  startScreen.classList.add('started');
});

// Get the parent container of all the navigation buttons
document.querySelector('#fakeMenu').addEventListener('click', function (event) {
  // Prevent the default anchor behavior (scrolling to the section)
  event.preventDefault();
  var current = document.querySelectorAll('.topicss.canShowSection');
  if (current.length > 0) {
    current[0].classList.remove('canShowSection');
  }
  // Find the section with the corresponding id
  const section = document.querySelector(event.target.getAttribute('href'));
  if (section) {
    // Add a class to make the section visible
    section.classList.add("canShowSection");
  }

});

// Get the parent container of all the navigation buttons
document.querySelector('#hamburgerMenu').addEventListener('click', function (event) {
  // Prevent the default anchor behavior (scrolling to the section)
  event.preventDefault();
  var current = document.querySelectorAll('.topicss.canShowSection');
  if (current.length > 0) {
    current[0].classList.remove('canShowSection');
  }
  // Find the section with the corresponding id
  const section = document.querySelector(event.target.getAttribute('href'));
  if (section) {
    // Add a class to make the section visible
    section.classList.add("canShowSection");
  }

});
//#endregion

//#region history image changer (scroll Event)
const historyContent = document.getElementsByClassName("historyLayout");
const parallaxContent = document.querySelectorAll('#parallaxfinder .parallax');
window.addEventListener('scroll', () => {
  const scrollEnd = 750; //750 for game
  let scrollY = window.scrollY;
  let progress = (scrollY / scrollEnd); //scrolled divided by range
  progress = Math.max(0, Math.min(progress, 1));

  let yRange = 0;
  let yThreshold = 0;
  if (window.innerWidth > 800) {
    yRange = 279;
  }
  else {
    yRange = 236;
    yThreshold = 0;
  }
  let screenHeight = window.innerHeight;
  yRange = 0.4983 * screenHeight - 202.4;
  yThreshold = -0.3344 * screenHeight + 1325;

  const logoText = document.querySelector('.bannerText');
  const logo = document.querySelector('#bannerDrawing');
  const menulogo = document.querySelector('#topMenu li:nth-of-type(3) a');
  logo.style.transform = "translateY(-" + (progress * yRange) + "px)";
  //279
  let scaleX = 1 - 0.75 * progress;
  let scaleY = 1 - 0.75 * progress;
  logo.style.transform += "scale(-" + (scaleX) + "," + (scaleY) + ")";

  logoText.style.opacity = 1 - (progress * 2.5);
  menulogo.style.opacity = 1 - (progress);
  const prehistoricContainer = historyContent[0];
  const containerMiddle = (prehistoricContainer.getBoundingClientRect().top - prehistoricContainer.getBoundingClientRect().bottom) / 2;
  const containerHalf = prehistoricContainer.getBoundingClientRect().top - containerMiddle;

  let threshold = 1.1;
  var current = document.querySelectorAll('.topicss.canShowSection');
  const mainCover = document.getElementById("banner");
  const fakeImg = document.querySelector('#Home > img');
  if (progress >= 1) {
    mainCover.style.position = "absolute";
    fakeImg.style.display = "block";
  }
  else {

    mainCover.style.position = "fixed";
    fakeImg.style.display = "none";
  }
  if (containerHalf <= (window.innerHeight / 2) * threshold) {

    for (const content of historyContent) {
      content.style.position = "fixed";
      content.style.top = "0";
      content.style.left = "0";
      content.style.right = "0";
      content.style.bottom = "0";
      if ((scrollY - containerHalf - yThreshold) <= window.innerHeight / 2) {
        content.style.position = "absolute";
      }
    }
  }
  cuttingImages();
  console.log(cutcounter);
}
);

let cutcounter = 0;
function cuttingImages() {
  let section1 = historyContent[cutcounter];
  let parallax2 = parallaxContent[cutcounter + 1];
  let section2 = historyContent[cutcounter + 1];
  if (cutcounter >= historyContent.length - 1) {
    section1 = historyContent[cutcounter];
    parallax2 = document.getElementById("sub2");
    section2 = document.getElementById("empty");
  }
  let image1Top = section1.getBoundingClientRect().top;
  let section2Top = parallax2.getBoundingClientRect().top;
  let progress = (image1Top - section2Top) / -window.innerHeight;
  progress = Math.max(0, Math.min(1, progress));
  section1.style.clipPath = 'inset(0 0 ' + (100 - progress * 100) + '% 0)';
  section2.style.clipPath = 'inset(' + (progress * 100) + '% 0 0 0)';
  if (progress === 0 && cutcounter >= 0 && cutcounter < 1) {
    cutcounter++;
  }
  if (progress === 1 && (cutcounter === 1 || cutcounter === 2)) {
    cutcounter--;
  }
}

//#endregion

//#region simpler typing effect
const typerResolver = {
  resolve: function (options) {
    const { resolveString, typerElement, timeout } = options;
    let offset = 0;
    let called = false;
    function typeNextChar() {
      if (offset === 0) {
        called = true;
      }

      const partial = resolveString.substring(0, offset);
      typerElement.textContent = partial;
      if (offset < resolveString.length) {
        offset++;
        if (called === true && offset === 0) { return; }
        setTimeout(typeNextChar, timeout);
      }
    }

    typeNextChar();
  }
};

if (window.innerWidth <= 800) {
  const normalTypers = document.getElementsByClassName("typerText");
  normalTypers[0].innerHTML = "History Of Figures";
  normalTypers[1].innerHTML = "Types Of Figures";
  normalTypers[2].innerHTML = "Minigame";
}


//#endregion

//#region stupid stupid height
//stupidest way to do this ever
const stupidContainer = document.querySelector(".wcontainer");
const stupidChild = stupidContainer.querySelector("#sub2Container");
const resizeObserver = new ResizeObserver(() => {
  stupidContainer.style.height = (stupidChild.getBoundingClientRect().height + 80) + "px";
});
resizeObserver.observe(stupidChild);
//#endregion

//#region game

let targetX = 0, targetY = 0;// target position
let Xspeed = 3;
let Yspeed = 0.9;

const radios = document.querySelectorAll('input[name="difficulty"]');
let difficulty = 'Medium'; // default difficulty
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    difficulty = document.querySelector(`label[for="${radio.id}"]`).textContent;
    console.log(`Difficulty set to: ${difficulty}`);
    startScreen.style.opacity = 1;
    startScreen.style.display = 'flex';
    currentOpacity = parseFloat(startScreen.style.opacity) || 1;
    gameStarted = false;
    grabbableObjs.forEach(obj => {
      obj.element.remove(); // Remove the element from the DOM
    });
    grabbableObjs.length = 0; // Clear grabbable objects
    clearInterval(spawnInterval);
    spawnInterval = null;
    arcadeBG.pause();
    arcadeBG.currentTime = 0;
  });
});

class box {
  constructor(x, y, width, height, element = null) {
    this.element = element;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = 0.05;
    this.isFalling = false;
  }

  updatePosition() {
    if (this.element) {
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
    }
  }
}
const Gscreen = document.querySelector("#gameScreen");
const screenWidth = Gscreen.getBoundingClientRect().width;
const screenHeight = Gscreen.getBoundingClientRect().height;
const objSpace = document.querySelector(".Objects");
const claw = new box(0, 0, document.querySelector("#claw").getBoundingClientRect().width, document.querySelector("#claw").getBoundingClientRect().height, document.querySelector("#claw"));
const floor = new box(0, Gscreen.getBoundingClientRect().height, Gscreen.getBoundingClientRect().width, 50, document.querySelector(".floor"));
const ceiling = new box(0, -50, Gscreen.getBoundingClientRect().width, 50, document.querySelector(".floor"));
const leftWall = new box(-20, 0, 20, Gscreen.getBoundingClientRect().height, document.querySelector(".floor"));
const rightWall = new box(Gscreen.getBoundingClientRect().width, 0, 20, Gscreen.getBoundingClientRect().height, document.querySelector(".floor"));
const pitFloor = new box(screenWidth - document.querySelector("#pitFloor").getBoundingClientRect().width, screenHeight - document.querySelector("#pitFloor").getBoundingClientRect().height, document.querySelector("#pitFloor").getBoundingClientRect().width, document.querySelector("#pitFloor").getBoundingClientRect().height, document.querySelector("#pitFloor"));
const pitPillar = new box(screenWidth * 0.262, screenHeight - document.querySelector("#pitPillar").getBoundingClientRect().height, document.querySelector("#pitPillar").getBoundingClientRect().width, document.querySelector("#pitPillar").getBoundingClientRect().height, document.querySelector("#pitPillar"));

var id = 0;
const allObjs = [claw, floor, pitFloor, pitPillar];
const grabbableObjs = [];

allObjs.forEach(obj => {
  obj.updatePosition();
})
const gameArea = document.querySelectorAll(".topicss");
gameArea[2].id = "subsection3";

let AABBoverlapX = 0;
let AABBoverlapY = 0;
let isGrabbed = false;
let grabbedObj = null;
let isGrabbing = false;
let interceptedObj = null;
let yOffset = 0;
let xOffset = 0;
const activateAudio = new Audio("audio/grab.ogg");
const upAudio = new Audio("audio/grabup.ogg");
const winAudio = new Audio("audio/win.ogg");
const arcadeBG = new Audio("audio/arcadeBG.ogg");

//store the interval spawn thing
let spawnInterval = null;

function AABB(objA, objB) {
  if (objA.x + objA.width < objB.x || objB.x + objB.width < objA.x) {
    return false;
  }
  if (objA.y + objA.height < objB.y || objB.y + objB.height < objA.y) {
    return false;
  }
  AABBoverlapX = Math.min(objA.x + objA.width, objB.x + objB.width) - Math.max(objA.x, objB.x);
  AABBoverlapY = Math.min(objA.y + objA.height, objB.y + objB.height) - Math.max(objA.y, objB.y);
  //console.log(AABBoverlapX);
  return true;
}
function resolveAABB(objA, objB) {
  const overlapX = Math.min(objA.x + objA.width, objB.x + objB.width) - Math.max(objA.x, objB.x);
  const overlapY = Math.min(objA.y + objA.height, objB.y + objB.height) - Math.max(objA.y, objB.y);

  // Only resolve if overlapping
  if (overlapX > 0 && overlapY > 0) {
    if (overlapX < overlapY) {

      // Resolve along X axis
      if (objA.x < objB.x) {
        objA.x -= overlapX;
      } else {
        objA.x += overlapX;
      }
    } else {
      // Resolve along Y axis
      if (objA.y < objB.y) {
        objA.y -= overlapY;
        objA.velocityY = -objA.velocityY * 0.75; // bounce effect
      } else {
        objA.y += overlapY;
        objA.velocityY = -objA.velocityY * 0.75; // bounce effect
      }
    }
  }
}

// Update loop using requestAnimationFrame
function animate() {
  if (gameStarted) {
    grabbableObjs.sort((a, b) => a.y - b.y); //sort by y position so collision works properly

    //actual claw movement
    const xresult = moveToward(claw.x, targetX, Xspeed);
    const yresult = moveToward(claw.y, targetY, Yspeed);
    claw.x = xresult;
    claw.y = yresult;



    //apply gravity to grabbable objects
    for (let i = 0; i < grabbableObjs.length; i++) {
      const obj = grabbableObjs[i];
      obj.velocityY += obj.gravity;
      obj.y += obj.velocityY;
    }
    //if is grabbed follow claw
    if (isGrabbed) {
      grabbedObj.x = claw.x + xOffset;
      grabbedObj.y = claw.y + yOffset;
    }
    //grabbable objects collide with each other
    for (let i = 0; i < grabbableObjs.length; i++) {
      for (let j = i + 1; j < grabbableObjs.length; j++) {
        const objA = grabbableObjs[i];
        const objB = grabbableObjs[j];

        if (AABB(objA, objB)) {
          resolveAABB(objA, objB);
        }
        objA.updatePosition();
        objB.updatePosition();
      }
    }

    //check if there is anything to grab before max
    if (isGrabbing) {
      for (const obj of grabbableObjs) {
        if (AABB(claw, obj)) {
          if (AABBoverlapY > obj.height / 2) {
            if (Math.abs((obj.x + obj.width / 2) - (claw.x + claw.width / 2)) < 30) {
              interceptedObj = obj;
              targetY = interceptedObj.y - claw.height / 2;
            }
          }
        }
      }
    }

    grabbableObjs.forEach(obj => {
      if (typeof obj.updatePosition === 'function') {
        if (obj != floor) {
          if (AABB(obj, floor)) {
            if (gameWon === false) {
              won(obj);
            }
            gameWon = true;
          }
        }
      }
    });
  }

  //collide everything with floor
  allObjs.forEach(obj => {
    if (typeof obj.updatePosition === 'function') {
      if (obj != floor) {
        if (AABB(obj, floor)) {
          resolveAABB(obj, floor);
        }
      }
      if (obj != pitFloor) {
        if (AABB(obj, pitFloor)) {
          resolveAABB(obj, pitFloor);
        }
      }
      if (obj != ceiling && obj != claw) {
        if (AABB(obj, ceiling)) {
          resolveAABB(obj, ceiling);
        }
      }
      if (obj != leftWall && obj != claw) {
        if (AABB(obj, leftWall)) {
          resolveAABB(obj, leftWall);
        }
      }
      if (obj != rightWall && obj != claw) {
        if (AABB(obj, rightWall)) {
          resolveAABB(obj, rightWall);
        }
      }
      if (obj != pitPillar) {
        if (AABB(obj, pitPillar)) {
          resolveAABB(obj, pitPillar);
        }
      }
      obj.updatePosition();
    }
  });
  Constraint();


  //#region startscreen
  if (startScreen.classList.contains('started')) {
    setTimeout(() => {
      currentOpacity = moveToward(currentOpacity, 0, 0.005); // Adjust speed if needed
      startScreen.style.opacity = currentOpacity;
      if (startScreen.style.opacity <= 0.05) {
        startScreen.classList.remove('started');
        startScreen.style.display = 'none';
        gameStarted = true;
        gameWon = false;
        arcadeBG.loop = true;
        arcadeBG.play();
        if (spawnInterval == null) {
          //call it once the moment game starts then interval it
          Spawn();
          spawnInterval = setInterval(Spawn, 7000);
        }
      }
    },
      250);
  }
  //#endregion 

  requestAnimationFrame(animate);
}

function ResetPos() {
  claw.x = claw.y = targetX = targetY = 0;
  UpdateBallStyle();
}

//lerping to target for claw machine (moving claw x y to target)
function moveToward(value, target, speed) {
  const delta = target - value;
  const absDelta = Math.abs(delta);

  if (absDelta > speed) {
    value += (delta / absDelta) * speed;
  } else {
    value = target;
  }

  return value;
}

function MovePos(leftInc, topInc) {
  targetX += leftInc;
  targetY += topInc;
}

function ActivateClaw() {
  clawActive = true;
  targetY = 500;
  activateAudio.play();

  claw.element.classList.remove('clawUnactive');
  void claw.element.offsetWidth; // force reflow to restart animation
  claw.element.classList.add('clawActivate');
  isGrabbing = true;
  setTimeout(() => {
    isGrabbing = false;
    claw.element.classList.remove('clawActivate');
    void claw.element.offsetWidth; // force restart again
    claw.element.classList.add('clawGrip');
    setTimeout(() => {
      targetY = 0;
      upAudio.play();
      for (const obj of grabbableObjs) {
        if (AABB(obj, claw)) {
          if (Math.abs((obj.x + obj.width / 2) - (claw.x + claw.width / 2)) < 30) {
            isGrabbed = true;
            yOffset = obj.y - claw.y;
            xOffset = obj.x - claw.x;
            grabbedObj = obj;
          }
        }
      }
      setTimeout(() => {
        targetX = 0;
        setTimeout(() => {
          claw.element.classList.remove('clawGrip');
          void claw.element.offsetWidth; // force reflow to restart animation
          claw.element.classList.add('clawOpen');
          if (isGrabbed) {
            isGrabbed = false;
            grabbedObj.velocityY = 0;
          }
          setTimeout(() => {
            clawActive = false;
            claw.element.classList.remove('clawOpen');
            void claw.element.offsetWidth;
            claw.element.classList.add('clawUnactive');
          }, 1000);
        },
          1000);
      },
        2500);
    },
      1500);
  }, 3000);
}

document.addEventListener('keydown', (e) => {
  if (!gameStarted) return; // Ignore key events if game hasn't started
  if (clawActive) return;
  switch (e.code) {
    case "ArrowRight":
      MovePos(10, 0);
      break;
    case "ArrowLeft":
      MovePos(-10, 0);
      break;
    case "ArrowUp":
      //test.y -= 100;
      MovePos(0, -10);
      break;
    case "ArrowDown":
      //test.y -= 100;
      MovePos(0, 10);
      break;
  }
});

["buttons1", "buttons2", "buttons3"].forEach((className, index) => {
  document.querySelector(`.${className}`).addEventListener("click", () => {
    if (index === 0) {
      if (gameStarted) {
        ActivateClaw();
      }
    }
    else if (index === 1) {
      MovePos(-10, 0);
    }
    else if (index === 2) {
      MovePos(10, 0);
    }
  });
});

// constraints to keep claw within bounds
function Constraint() {
  let minX = 0;
  let maxX = Gscreen.getBoundingClientRect().width - claw.width;
  let minY = 0;
  let maxY = Gscreen.getBoundingClientRect().height - claw.height;

  targetX = Math.min(Math.max(targetX, minX), maxX);
  targetY = Math.min(Math.max(targetY, minY), maxY);
}

const figureNames = [
  "Iron Knight",
  "Shadow Warrior",
  "Mystic Mage",
  "Golden Guardian",
  "Fireblade Assassin",
  "Silver Ranger",
  "Storm Bringer",
  "Lunar Hunter",
  "Crystal Sorcerer",
  "Dark Valkyrie"
];

function Spawn() {
  //create new div and randomise it based on difficulty
  var newDiv = document.createElement('div');
  newDiv.id = 'new-id-' + (id++); //increment id
  let range = 0;
  let rangeEnd = 0;
  if (difficulty === 'Easy') {
    console.log(difficulty);
    range = screenWidth * 0.07;
    rangeEnd = screenWidth * 0.08;
  }
  else if (difficulty === 'Medium') {
    console.log(difficulty);
    range = screenWidth * 0.05;
    rangeEnd = screenWidth * 0.06;
  }
  else if (difficulty === 'Hard') {
    console.log(difficulty);
    range = screenWidth * 0.03;
    rangeEnd = screenWidth * 0.04;
  }
  let randomX = Math.random() * (rangeEnd - range) + range;
  let randomY = Math.random() * (rangeEnd - range) + range;
  newDiv.style.width = randomX + 'px';
  newDiv.style.height = randomY + 'px';
  newDiv.style.position = 'absolute';
  newDiv.style.pointerEvents = 'auto';

  //create image for the object
  var newImg = document.createElement('img');
  const crateIndex = Math.floor(Math.random() * 3) + 1; // 1 to 3
  newImg.src = `Images/crate${crateIndex}.png`;
  newImg.style.width = '100%';
  newImg.style.height = '100%';
  newImg.style.pointerEvents = 'none';
  newDiv.appendChild(newImg);

  //spawn it at a random location within the pit
  const widthRange = 0.3;
  const widthEnd = 0.9;
  let randomWidth = Math.random() * (widthEnd - widthRange) + widthRange;
  const newBox = new box(screenWidth * randomWidth, 0, randomX, randomY, newDiv);

  //#region creating overlay for item
  //create overlay for the item
  var newOverlay = document.createElement('div');
  newOverlay.classList.add("itemOverlay");
  newOverlay.id = 'overlay-' + newDiv.id;
  document.body.appendChild(newOverlay);

  //create content space for overlay
  var itemContent = document.createElement('div');
  itemContent.classList.add('itemContent');
  newOverlay.appendChild(itemContent);

  //create hidden victory text
  var victoryText = document.createElement('h1');
  victoryText.innerHTML = "Congratulations You Won A Prize!";
  victoryText.classList.add('victory');
  itemContent.appendChild(victoryText);

  //create item image in overlay
  var itemImg = document.createElement('img');
  itemImg.src = `Images/figure${crateIndex}.png`;
  itemImg.style.width = '10vw';
  itemImg.style.height = '15vw';
  if (window.innerWidth < 800) {
    itemImg.style.width = '20vw';
    itemImg.style.height = '25vw';
  }
  itemImg.style.pointerEvents = 'none';
  itemContent.appendChild(itemImg);

  //create item name and details all randomise
  var itemDetails = document.createElement('div');
  itemDetails.style.textAlign = "center";
  itemDetails.style.marginTop = "25px";
  var itemName = document.createElement('h1');
  //randomise name
  const randomIndex = Math.floor(Math.random() * figureNames.length);
  itemName.innerHTML = figureNames[randomIndex];
  itemDetails.appendChild(itemName);
  //randomise details
  var itemDescription = document.createElement('p');
  var valueamount = Math.floor(Math.random() * 5) + 1;
  var qualityamount = Math.floor(Math.random() * 5) + 1;
  var rarityamount = Math.floor(Math.random() * 5) + 1;
  //randomise item details
  var value = "$".repeat(valueamount);
  var quality = "#".repeat(qualityamount);
  var rarity = "R".repeat(rarityamount);
  itemDescription.innerHTML = `
    Value: ${value} <br>
    Quality: ${quality} <br>
    Rarity: ${rarity}
  `;
  itemDetails.appendChild(itemDescription);
  itemContent.appendChild(itemDetails);

  //create close button for content
  var closeBtn = document.createElement('div');
  closeBtn.classList.add('closeBtn');
  closeBtn.innerHTML = "X";
  itemContent.appendChild(closeBtn);
  //#endregion

  //add it to the array
  allObjs.push(newBox);
  grabbableObjs.push(newBox);
  objSpace.appendChild(newDiv);
}

objSpace.addEventListener('click', (evt) => {
  var sender = evt.target;
  const overlayId = 'overlay-' + sender.id;
  const overlay = document.getElementById(overlayId);
  overlay.classList.add('shown');
});

document.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('closeBtn')) {
    const overlay = evt.target.closest('.itemOverlay.shown');
    if (overlay) {
      if (overlay.classList.contains('won')) {
        startScreen.style.opacity = 1;
        startScreen.style.display = 'flex';
        currentOpacity = parseFloat(startScreen.style.opacity) || 1;
        gameStarted = false;
        grabbableObjs.forEach(obj => {
          obj.element.remove(); // Remove the element from the DOM
        });
        grabbableObjs.length = 0; // Clear grabbable objects
        clearInterval(spawnInterval);
        spawnInterval = null;
      }
      overlay.classList.remove('shown');

    }
  }
});

function won(obj) {
  const objId = obj.element.id;
  const number = objId.split('-').pop();
  const overlayId = 'overlay-new-id-' + number;
  const overlay = document.getElementById(overlayId);
  overlay.classList.add('won');
  overlay.getElementsByClassName('victory')[0].style.display = 'block';
  overlay.classList.add('shown');
  winAudio.play();
  arcadeBG.pause();
  arcadeBG.currentTime = 0;
}

// Start animation loop
animate();

//#endregion
