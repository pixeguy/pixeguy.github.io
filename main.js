//#region glitchText
const resolver = {
  resolve: function resolve(options, callback) {
    // The string to resolve
    const resolveString = options.resolveString || options.element.getAttribute('data-target-resolver');
    const combinedOptions = Object.assign({}, options, { resolveString: resolveString });

    function getRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function randomCharacter(characters) {
      return characters[getRandomInteger(0, characters.length - 1)];
    };

    function doRandomiserEffect(options, callback) {
      const characters = options.characters;
      const timeout = options.timeout;
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

          doRandomiserEffect(nextOptions, callback)
        } else if (typeof callback === "function") {
          callback();
        }
      }, options.timeout);
    };

    function doResolverEffect(options, callback) {
      const resolveString = options.resolveString;
      const characters = options.characters;
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
    };

    doResolverEffect(combinedOptions, callback);
  }
}

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


}

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
          if (entry.target.hasAttribute('typer')) {
            const typeroptions = {
              timeout: 70,
              typerElement: entry.target,
              resolveString: entry.target.getAttribute('typer')
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
    })
  },
  {
    rootMargin: "0px",
    threshold: [0, 0, 1, 1],
  },
)

const tags = document.querySelectorAll('.fade-in');

tags.forEach((tag) => {
  observer.observe(tag)
})
//#endregion

//#region smooth scrolling

let canScroll = true;
var offsetY = 0;
var speedY = 0;
const deltaMultiplier = 10;
const maxSpeed = 160;
const friction = 0.95;

function scrollVertically(ev) {
  ev.preventDefault()
  var delta = -1 * Math.sign(ev.wheelDelta);
  speedY += delta * deltaMultiplier;
  speedY = speedY > 0 ? Math.min(speedY, maxSpeed) : Math.max(speedY, -maxSpeed);
  return false;
}

function draw() {
  offsetY += speedY;

  const element = document.documentElement;
  const maxScrollLeft = element.scrollHeight - element.clientHeight;
  offsetY = Math.min(offsetY, maxScrollLeft);
  offsetY = Math.max(offsetY, 0);

  element.scrollTop = offsetY;
  speedY *= friction;

  //if(canScroll){
  // about 60 times a second
  requestAnimationFrame(draw);//}
}

// must be passive so will be cancelable
addEventListener('wheel', scrollVertically, {
  passive: false
})

draw();

//#region menu buttons to work
const menuButtons = document.getElementsByClassName("menuBtn");
let smoothscroll = true;
for (const btn of menuButtons) {
  btn.addEventListener("click", () => {
    let ref = 0;

    //so many if else is for both mobile and desktop
    if (btn === menuButtons[0]) {
      ref = "#sub1";
    } else if (btn === menuButtons[1]) {
      ref = "#sub2";
    } else if (btn === menuButtons[2]) {
      ref = "#Home";
    } else if (btn === menuButtons[3]) {
      ref = "#sub3";
    } else if (btn === menuButtons[4]) {
      ref = "#sub4";
    }
    else if (btn === menuButtons[5]) {
      ref = "#Home";
    } else if (btn === menuButtons[6]) {
      ref = "#sub1";
    } else if (btn === menuButtons[7]) {
      ref = "#sub2";
    } else if (btn === menuButtons[8]) {
      ref = "#sub3";
    } else if (btn === menuButtons[9]) {
      ref = "#sub4";
    }

    let target = document.querySelector(ref);
    let targetTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(window.scrollX, targetTop);
    offsetY = targetTop;
  })
}
//#endregion
//#endregion

//#region bunch o button click events
const hamburger = document.querySelector("#hamburger>div")
const hamburgermenu = document.querySelector("#hamburgerMenu");
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  hamburgermenu.classList.toggle('active');
})

const hamburgerBtns = document.getElementsByClassName("menuBtn");

for (let i = 5; i < hamburgerBtns.length; i++) {
  let hamburgerBtnsParent = hamburgerBtns[i].parentElement;
  hamburgerBtns[i].addEventListener('click', () => {
    var current = document.querySelectorAll("#hamburgerMenu nav li.active");
    if (current.length > 0) {
      current[0].classList.remove("active");
    }
    hamburgerBtnsParent.classList.add("active");
  })
}

const sub2Btns = document.getElementsByClassName("sub2Btn");
const sub2Cnt = document.getElementsByClassName("sub2Content");

for (let i = 0; i < sub2Btns.length; i++) {
  sub2Btns[i].addEventListener('click', () => {
    var current = document.getElementsByClassName("sub2Btn active");
    var currentCnt = document.querySelectorAll(".sub2Content.sub2Show");
    if (current.length > 0) {
      currentCnt[0].classList.remove("sub2Show");
      current[0].classList.remove("active");
    }
    sub2Btns[i].classList.add("active");
    sub2Cnt[i].classList.add('sub2Show')
  })
}

const imageGalleryBtns = document.getElementsByClassName("showMoreBtn");
const imageGalleryOverlay = document.getElementsByClassName("sub2Overlay");
for (let i = 0; i < imageGalleryBtns.length; i++) {
  imageGalleryBtns[i].addEventListener('click', () => {

    imageGalleryOverlay[i].classList.add('sub2Show');
    canScroll = !canScroll;
    if (canScroll) {
      //draw();
    }
  })
}

const exitBtn = document.getElementsByClassName("exitBtn");
for (let i = 0; i < exitBtn.length; i++) {
  exitBtn[i].addEventListener('click', () => {
    var current = document.querySelectorAll('.sub2Overlay.sub2Show');
    if (current.length > 0) {
      current[0].classList.remove("sub2Show");
    }
  })
}

const startBtn = document.querySelector("#startButton")
const startScreen = document.querySelector("#gameCover");
let currentOpacity = parseFloat(startScreen.style.opacity) || 1;
let gameStarted = false;
startBtn.addEventListener('click', () => {
  startScreen.classList.add('started');

})
//#endregion

//#region history image changer (scroll Event)
const historyContent = document.getElementsByClassName("historyLayout");
const parallaxContent = document.querySelectorAll('section .parallax');
window.addEventListener('scroll', () => {
  const scrollEnd = 1000;
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
    yThreshold = 150;
  }
  const logoText = document.querySelector('.bannerText');
  const logo = document.querySelector('#bannerDrawing');
  const menulogo = document.querySelector('#topMenu li:nth-of-type(3) a')
  logo.style.transform = "translateY(-" + (progress * yRange) + "px)";
  //279
  let scaleX = 1 - 0.75 * progress;
  let scaleY = 1 - 0.75 * progress
  logo.style.transform += "scale(-" + (scaleX) + "," + (scaleY) + ")";

  logoText.style.opacity = 1 - (progress * 2.5);
  menulogo.style.opacity = 1 - (progress);
  const prehistoricContainer = historyContent[0];
  const containerMiddle = (prehistoricContainer.getBoundingClientRect().top - prehistoricContainer.getBoundingClientRect().bottom) / 2;
  const containerHalf = prehistoricContainer.getBoundingClientRect().top - containerMiddle;
  if (containerHalf <= window.innerHeight / 2 + yThreshold) {

    const mainCover = document.getElementById("banner");
    mainCover.style.position = "absolute";
    const fakeImg = document.querySelector('#Home > img');
    fakeImg.style.display = "block";

    for (const content of historyContent) {
      content.style.position = "fixed";
      content.style.top = "0";
      content.style.left = "0";
      content.style.right = "0";
      content.style.bottom = "0";
      if ((scrollY - containerHalf - 1000) <= window.innerHeight / 2) {
        content.style.position = "absolute";
        mainCover.style.position = "fixed";
        fakeImg.style.display = "none";
      }
    }
  }
  cuttingImages();
}
);

let cutcounter = 0;
function cuttingImages() {
  let section1 = historyContent[cutcounter];

  let parallax2 = parallaxContent[cutcounter + 1];
  let section2 = historyContent[cutcounter + 1];
  console.log(cutcounter);
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
  if (progress === 0 && cutcounter >= 0 && cutcounter < 2) {
    cutcounter++;
  }
  if (progress === 1 && (cutcounter === 1 || cutcounter === 2)) {
    cutcounter--;
  }
}

//#endregion

//#region simpler typing effect
const typerResolver = {
  resolve: function (options, callback) {
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

//region game
const clawXsize = 160;
const clawYsize = 150;
const screen = document.querySelector("#gameScreen");

let targetX = 0, targetY = 0;         // target position
let Xspeed = 3;
let Yspeed = 0.8;



class box {
  constructor(x, y, width, height, element = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = 0.0;
    this.isFalling = false;
    this.element = element;
  }

  updatePosition() {
    if (this.element) {
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
    }
  }
}
const test = new box(400, 0, 160, 150, document.querySelector('.testDrop'))
const testBox = new box(300, 350, 50, 150, document.querySelector('.testBox'))
const claw = new box(0, 0, 160, 150, document.querySelector("#claw"))
const floor = new box(0, 504, 845, 5, document.querySelector(".floor"))

const allObjs = [test, testBox, claw, floor];

let AABBoverlapX = 0;
let AABBoverlapY = 0;
let isGrabbed = false;
let yOffset = 0;
let xOffset = 0;

function AABB(objA, objB) {
  if (objA.x + objA.width < objB.x || objB.x + objB.width < objA.x) {
    return false;
  }
  if (objA.y + objA.height < objB.y || objB.y + objB.height < objA.y) {
    return false;
  }
  //AABBoverlapX = Math.min(objA.x + objA.width, objB.x + objB.width) - Math.max(objA.x, objB.x);
  //AABBoverlapY = Math.min(objA.y + objA.height, objB.y + objB.height) - Math.max(objA.y, objB.y);
  //console.log(AABBoverlapX);
  return true;
}
function resolveAABB(objA, objB) {
  const overlapX = Math.min(objA.x + objA.width, objB.x + objB.width) - Math.max(objA.x, objB.x);
  const overlapY = Math.min(objA.y + objA.height, objB.y + objB.height) - Math.max(objA.y, objB.y);

  if (overlapX < overlapY) {
    if (objA.x < objB.x) {
      objA.x -= overlapX;
    }
    else {
      objA.x += overlapX;
    }
  }
  else {
    if (objA.y < objB.y) {
      objA.y -= overlapY;
      objA.velocityY = -objA.velocityY * 0.9;
    }
    else {
      objA.y += overlapY;
      objA.velocityY = -objA.velocityY * 0.9;
    }
  }
}

// Update loop using requestAnimationFrame
function animate() {
  // Lerp: move current position toward target
  const xresult = moveToward(claw.x, targetX, Xspeed);
  const yresult = moveToward(claw.y, targetY, Yspeed);
  claw.x = xresult;
  claw.y = yresult;
  test.velocityY += test.gravity;
  test.y += test.velocityY;
  if (isGrabbed) {
    testBox.x = claw.x + xOffset;
    testBox.y = claw.y + yOffset;
  }
  testBox.velocityY += testBox.gravity;
  testBox.y += testBox.velocityY;


  allObjs.forEach(obj => {
    if (typeof obj.updatePosition === 'function') {
      obj.updatePosition();
      if (obj != floor) {
        if (AABB(obj, floor)) {
          resolveAABB(obj, floor);
        }
      }
    }
  });
  Constraint();
  //AABB(claw,testBox);
  if (AABB(test, testBox)) {
    resolveAABB(test, testBox);
  }
  AABB(claw, testBox);

  //#region startscreen
  if (startScreen.classList.contains('started')) {
    console.log("works");
    setTimeout(() => {
      currentOpacity = moveToward(currentOpacity, 0, 0.005); // Adjust speed if needed
      startScreen.style.opacity = currentOpacity;
      if (startScreen.style.opacity <= 0.05) {
        startScreen.classList.remove('started');
        gameStarted = true;
      }
    },
      250)
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
  targetY = 250;

  claw.element.classList.remove('clawUnactive');
  void claw.element.offsetWidth; // force reflow to restart animation
  claw.element.classList.add('clawActivate');

  setTimeout(() => {
    claw.element.classList.remove('clawActivate');
    void claw.element.offsetWidth; // force restart again
    claw.element.classList.add('clawGrip');
    setTimeout(() => {
      targetY = 0;
      if (AABB(testBox, claw)) {
        if (Math.abs((testBox.x + testBox.width / 2) - (claw.x + claw.width / 2)) < 30) {
          isGrabbed = true;
          yOffset = testBox.y - claw.y;
          xOffset = testBox.x - claw.x;
          testBox.gravity = 0.05;
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
            testBox.velocityY = 0;
            testBox.gravity = 0.05;
          }
          setTimeout(() => {
            claw.element.classList.remove('clawOpen');
            void claw.element.offsetWidth;
            claw.element.classList.add('clawUnactive');
          }, 1000)
        },
          1000)
      },
        2500)
    },
      1500)
  }, 2000);
}

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case "ArrowRight":
      MovePos(10, 0);
      break;
    case "ArrowLeft":
      MovePos(-10, 0);
      test.gravity = 0.05;
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
      ActivateClaw();
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
  let maxX = screen.getBoundingClientRect().width - clawXsize;
  let minY = 0;
  let maxY = screen.getBoundingClientRect().height - clawYsize;

  targetX = Math.min(Math.max(targetX, minX), maxX);
  targetY = Math.min(Math.max(targetY, minY), maxY);
}

// Start animation loop

animate();

//#endregion
