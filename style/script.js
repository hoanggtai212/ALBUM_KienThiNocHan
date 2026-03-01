// 🔒 Chặn double tap zoom (mobile)
let lastTouchEnd = 0;

function preventDoubleTapZoom(container) {
  container.addEventListener('touchend', function (event) {

    // 🚨 Nếu đang bấm vào keypad thì KHÔNG chặn
    if (event.target.closest('.keypad')) return;

    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    
    lastTouchEnd = now;

  }, { passive: false });
}

// 📖 Chặn zoom ở book
const bookEl = document.getElementById("book");
preventDoubleTapZoom(bookEl);

// 🔐 Chặn zoom ở các lock screen
document.querySelectorAll('#lock-screen-1, #lock-screen-2, #lock-screen-3')
  .forEach(screen => preventDoubleTapZoom(screen));

const book = document.getElementById('book');
const pages = [];
const sound = document.getElementById("sound");

document.body.addEventListener("pointerdown", () => {
  if (sound.paused) {
    sound.currentTime = 0;
   // sound.addEventListener("pause", () => {
   // setTimeout(() => {
   // sound.play().catch(() => {});
   //  }, 500); 
   //  });
    sound.play().catch(err => console.log("Không phát được nhạc:", err));
  }
}, { once: true });

const introPage = document.createElement('div');
introPage.className = 'page';
introPage.dataset.originalZ = 100;
introPage.style.zIndex = 100;

const introFront = document.createElement('div');
introFront.className = 'front';
introFront.innerHTML = `
  <div class="intro-content">
    <h1>Memory Album</h1>
    <div class="author"><em>Kiên Thị Nọc Hân 😍</em></div>
    <div>🎁❤️🎁</div>
  </div>
`;

const introBack = document.createElement('div');
introBack.className = 'back';

introPage.appendChild(introFront);
introPage.appendChild(introBack);
book.appendChild(introPage);
pages.push(introPage);

const images = [];
for (let i = 1; i <= 22; i++) { //Chỉnh số lượng ảnh ở đây
  images.push(`./style/image/Anh (${i}).jpg`);
  
}

const dates = [
  "01-06-2025",
  "01-06-2025",
  "06-06-2025",
  "06-06-2025",
  "19-06-2025",
  "19-06-2025",
  "19-06-2025",
  "30-06-2025",
  "03-07-2025",
  "10-07-2025",
  "18-07-2025",
  "18-07-2025",
  "29-07-2025",
  "30-07-2025",
  "30-07-2025",
  "04-08-2025",
  "04-08-2025",
  "10-08-2025",
  "10-08-2025",
  "10-08-2025",
  "16-08-2025",
  "24-09-2025",
];

for (let i = 0; i < images.length; i++) {

  const page = document.createElement('div');
  page.className = 'page';
  const z = 99 - i;
  page.style.zIndex = z;

  const front = document.createElement('div');
  front.className = 'front';

  const back = document.createElement('div');
  back.className = 'back';

  // FRONT = TRANG BÊN PHẢI (có ảnh)
  const img = document.createElement('img');
  img.src = images[i];
  img.loading = "lazy";
  
  const caption = document.createElement('div');
  caption.className = 'caption';
  caption.innerText = dates[i] || "";

  front.appendChild(img);
  front.appendChild(caption);

  // BACK = TRANG BÊN TRÁI (trống)
  // không thêm gì vào back

  page.appendChild(front);
  page.appendChild(back);
  book.appendChild(page);
  pages.push(page);
}

const endPage = document.createElement('div');
endPage.className = 'page';
endPage.dataset.originalZ = 0;
endPage.style.zIndex = 0;

const endFront = document.createElement('div');
endFront.className = 'front';
endFront.innerHTML = `
  <div class="end-content">
    <h2>💖 I Love You 💖</h2>
    <span id="ending-text"></span>
  </div>
`;

const endBack = document.createElement('div');
endBack.className = 'back';
endBack.style.background = '#fff';

endPage.appendChild(endFront);
endPage.appendChild(endBack);
book.appendChild(endPage);
pages.push(endPage);

function createHeart(x, y) {

  // ✨ FLASH NHẸ Ở TÂM
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.left = x + "px";
  flash.style.top = y + "px";
  flash.style.width = "10px";
  flash.style.height = "10px";
  flash.style.borderRadius = "50%";
  flash.style.background = "white";
  flash.style.boxShadow = "0 0 30px 15px rgba(255,255,255,0.9)";
  flash.style.transform = "translate(-50%, -50%)";
  flash.style.pointerEvents = "none";
  flash.style.zIndex = 30000;

  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 120);

  // 💥 NỔ TIM NGAY LẬP TỨC
  const particleCount = 14;

  for (let i = 0; i < particleCount; i++) {

    const particle = document.createElement("div");
    particle.className = "heart-particle";
    
    const hearts = ["💗","💓","💞","💕","💖"];
    particle.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];

    particle.style.left = x + "px";
    particle.style.top = y + "px";

    const t = (Math.PI * 2 * i) / particleCount;

    const heartX = 16 * Math.pow(Math.sin(t), 3);
    const heartY =
      13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t);

    const scale = 3; // chỉnh độ to trái tim

    particle.style.setProperty("--x", heartX * scale + "px");
    particle.style.setProperty("--y", -heartY * scale + "px");

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 700);
  }
}

function typewriterEffect(text, element) {
  let i = 0;
  let slowRemaining = 0; // số ký tự còn lại cần chạy chậm

  function type() {
    if (i >= text.length) return;

    let speed = 80; // tốc độ bình thường

    // Nếu bắt đầu cụm "còn em"
    if (text.substring(i, i + 6) === "còn em") {
      slowRemaining = 6; // 6 ký tự: c ò n _ e m
    }

    // Nếu đang trong cụm cần chạy chậm
    if (slowRemaining > 0) {
      speed = 160; // tốc độ chậm cho toàn bộ "còn em"
      slowRemaining--;
    }

    // Nếu là dấu ...
    if (text.substring(i, i + 3) === "...") {
      speed = 350;
    }

    element.innerHTML += text[i] === '\n' ? '<br>' : text[i];
    i++;

    setTimeout(type, speed);
  }

  type();
}

let currentTopZ = 200;
let typed = false;
let isFlipping = false;
let isSpamming = false;
let spamTimeout = null;
const SPAM_GAP = 200; // 200ms không click nữa thì coi như ngừng spam


pages.forEach((page) => {
  let startX = 0;
  const front = page.querySelector('.front');
  const back = page.querySelector('.back');

const flipForward = () => {

  if (isFlipping) return;

  if (!page.classList.contains('flipped')) {

    isFlipping = true;

    if (page === pages[pages.length - 2] && !typed) {
      const endText = document.getElementById('ending-text');
      const content = `A iu 3 thứ trên thế giới này : 
        Mặt trời (the Sun) ☀️, 
        Mặt trăg (the Moon)🌕,
        Và em (the Exception) ❤️. 
        Mặt trời là ...
        Ánh ság của ban mai 🌅,
        Mặt trăg là ...
        Vẻ đẹp của màn đêm 🌌,
        Còn e là 🤔 ... 
        Là đệ cụa toi 😎
        Ý nhầm, còn e là 🤔 ... 
        Là đìu ngọt ngào nhứt của a 😘
        { Hết }`;

      endText.innerHTML = "";
      typewriterEffect(content, endText);
      typed = true;
    }

    page.classList.remove('fast');
    page.classList.add('flipped');

    currentTopZ++;
    page.style.zIndex = currentTopZ;

    setTimeout(() => {

      isFlipping = false;

      // 🔥 KHÔNG queue
      // 🔥 KHÔNG pending
      // Chỉ kiểm tra còn spam hay không

      if (isSpamming) {
        flipForward();
      }

    }, 1000);
  }
};

const flipBackward = () => {

  if (isFlipping) return;

  if (page.classList.contains('flipped')) {

    isFlipping = true;

    page.classList.add('fast');
    page.classList.remove('flipped');

    currentTopZ++;
    page.style.zIndex = currentTopZ;

    setTimeout(() => {
      isFlipping = false;
    }, 1000);
  }
};

  front.addEventListener('click', () => {

  isSpamming = true;

  clearTimeout(spamTimeout);
  spamTimeout = setTimeout(() => {
    isSpamming = false;
  }, SPAM_GAP);

  flipForward();
});
  
  back.addEventListener('click', flipBackward);


  
  page.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  page.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -30) flipForward();
    else if (diff > 30) flipBackward();
  });

});

// Khi rời khỏi tab -> pause
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    sound.pause();
  } else {
    sound.play().catch(() => {});
  }
});

// Hiệu ứng nhấn nút keypad
document.querySelectorAll('.keypad button').forEach(btn => {

  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // 🔥 cực quan trọng cho Zalo/Mess
    btn.classList.add('pressed');
    const x = e.pageX;
    const y = e.pageY;

    createHeart(x, y);
    
    const num = btn.dataset.num;

    if (num !== undefined) {
      enterNumber(num);
    }

    if (btn.classList.contains('delete')) {
      deleteNumber();
    }
  });

  btn.addEventListener('pointerup', () => {
    btn.classList.remove('pressed');
  });

  btn.addEventListener('pointercancel', () => {
    btn.classList.remove('pressed');
  });

});

// Submit
document.querySelectorAll('.submit-btn').forEach(btn => {
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    checkPass();
  });
});






