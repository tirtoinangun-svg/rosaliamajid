/* =========================================================
   ROSALIA MAJID — MC LANDING PAGE
   Parallax + Carousel + Booking Calendar
   ========================================================= */

/* ============================================================
   ⚙️ OWNER CONFIG — Edit values below, you don't need to know code
   ============================================================ */

// 📅 GANTI LINK GOOGLE SHEET DI SINI (publish as CSV)
// Cara: Google Sheet → File → Share → Publish to web → pilih CSV → copy link
// FORMAT DATA: kolom pertama "Tanggal" (YYYY-MM-DD), kolom kedua "Sesi" (pagi atau sore)
// Contoh isi Google Sheet:
//   Tanggal     | Sesi
//   2026-05-01  | pagi
//   2026-05-01  | sore
//   2026-05-03  | pagi
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmUZ4a-UJed2Z2ObZO5QHpUWNYTnv-BEynIkKypg-hYC7gaJXlGz51Z1pqh5f6r7tI-vKOxsWcNnnd/pub?gid=0&single=true&output=csv";

// 📱 Nomor WhatsApp (format internasional tanpa "+" atau "0")
const WHATSAPP_NUMBER = "6281188070929";

// 💬 Konsultasi Gratis — pesan default untuk WhatsApp
const CONSULT_MESSAGE = `Halo Kak Rosalia 👋

Saya ingin konsultasi gratis soal rencana acara saya.
Bisa bantu diskusi?

Terima kasih!`;

// 📝 TESTIMONIAL FORM — Google Apps Script Web App URL
// Cara setup (lihat PANDUAN_OWNER.md bagian "Form Testimoni"):
//   1. Buat Google Sheet untuk testimoni (header: Tanggal, Nama, Jenis Acara, Rating, Pesan)
//   2. Extensions → Apps Script → paste script dari panduan → deploy as Web App
//   3. Copy URL yang dimulai "https://script.google.com/macros/s/..../exec"
//   4. Paste di bawah ini
const TESTIMONIAL_ENDPOINT = "https://script.google.com/macros/s/AKfycbxVb8ZlB-2g5jO15XFsV9VEbnPW-V5-ubUOf5miG3gbpJw_u4npzCIbYjIUqNYCM-9l/exec";

// 🎯 Sesi yang tersedia (owner bisa tambah misal "malam" dsb.)
const SESSIONS = [
  { key: "pagi", label: "Sesi Pagi", time: "08:00 – 14:00" },
  { key: "sore", label: "Sesi Sore", time: "15:00 – 21:00" }
];

// ⚡ Parallax speed multipliers (0 = no parallax, 1 = full)
const PARALLAX = {
  heroBg: 0.35,
  heroText: -0.12,
  heroVisual: -0.08,
  aboutImg: 0.15,
  aboutText: -0.08,
  contact: 0.12
};

/* ============================================================
   🚫 Do not edit below unless you know what you're doing
   ============================================================ */

/* -------------------- UTILS -------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const lerp = (a, b, t) => a + (b - a) * t;

const pad = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS_ID = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

/* -------------------- NAVBAR -------------------- */
const navbar = $("#navbar");
const navToggle = $("#navToggle");
if (navToggle) {
  navToggle.addEventListener("click", () => navbar.classList.toggle("menu-open"));
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => navbar.classList.remove("menu-open")));
}
const onNavScroll = () => {
  if (window.scrollY > 40) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
};
window.addEventListener("scroll", onNavScroll, { passive: true });
onNavScroll();

/* -------------------- REVEAL ON SCROLL -------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

$$(".reveal-up, .reveal-slide-left").forEach(el => revealObserver.observe(el));

/* -------------------- PARALLAX SYSTEM (60fps) -------------------- */
const parallaxTargets = {
  heroBg: $("[data-parallax-bg]"),
  heroText: $("[data-parallax-text]"),
  heroVisual: $("[data-parallax-visual]"),
  heroStats: $("[data-parallax-stats]"),
  aboutImg: $("[data-parallax-about-img]"),
  aboutText: $("[data-parallax-about-text]"),
  services: $("[data-parallax-services]"),
  why: $("[data-parallax-why]"),
  testimonials: $("[data-parallax-testimonials]"),
  booking: $("[data-parallax-booking]"),
  contact: $("[data-parallax-contact]"),
};
const statCards = $$(".hero-stat");
const serviceCards = $$(".service-card");
const whyCards = $$(".why-card");
const testimonialCards = $$(".testimonial-card");
const carouselSlides = $$(".carousel-slide");

let scrollY = window.scrollY;
let targetScrollY = scrollY;
let ticking = false;

const getOffset = (el) => {
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  return rect.top + window.scrollY;
};

function onScroll() {
  targetScrollY = window.scrollY;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateParallax);
  }
}
window.addEventListener("scroll", onScroll, { passive: true });

function updateParallax() {
  scrollY = lerp(scrollY, targetScrollY, 0.2);
  const vh = window.innerHeight;

  /* ==== HERO ==== */
  // Hero bg slow drift + text drift up
  if (parallaxTargets.heroBg) {
    parallaxTargets.heroBg.style.transform = `translate3d(0, ${scrollY * PARALLAX.heroBg}px, 0)`;
  }
  if (parallaxTargets.heroText) {
    parallaxTargets.heroText.style.transform = `translate3d(0, ${scrollY * PARALLAX.heroText}px, 0)`;
  }
  if (parallaxTargets.heroVisual) {
    parallaxTargets.heroVisual.style.transform = `translate3d(0, ${scrollY * PARALLAX.heroVisual}px, 0)`;
  }

  /* ==== HERO STATS — floating opposite directions ==== */
  if (parallaxTargets.heroStats) {
    const statsRect = parallaxTargets.heroStats.getBoundingClientRect();
    const visible = statsRect.top < vh && statsRect.bottom > 0;
    if (visible) {
      const progress = (vh - statsRect.top) / (vh + statsRect.height);
      statCards.forEach((card) => {
        const speed = parseFloat(card.dataset.statSpeed || 0);
        const offset = progress * 80 * speed;
        card.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }
  }

  /* ==== ABOUT — image & text at different speeds ==== */
  if (parallaxTargets.aboutImg) {
    const rect = parallaxTargets.aboutImg.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = (vh - rect.top) / (vh + rect.height);
      parallaxTargets.aboutImg.style.transform = `translate3d(0, ${(progress - 0.5) * -60}px, 0)`;
    }
  }
  if (parallaxTargets.aboutText) {
    const rect = parallaxTargets.aboutText.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = (vh - rect.top) / (vh + rect.height);
      parallaxTargets.aboutText.style.transform = `translate3d(0, ${(progress - 0.5) * 40}px, 0)`;
    }
  }

  /* ==== SERVICES — wave motion ==== */
  if (parallaxTargets.services) {
    const rect = parallaxTargets.services.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      serviceCards.forEach((card, i) => {
        // wave: sine function per index
        const phase = (progress * Math.PI * 2) + (i * 0.55);
        const wave = Math.sin(phase) * 18;
        card.style.transform = `translate3d(0, ${wave}px, 0)`;
      });
    }
  }

  /* ==== WHY CARDS — different depths per column ==== */
  if (parallaxTargets.why) {
    const rect = parallaxTargets.why.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      whyCards.forEach((card) => {
        const col = parseInt(card.dataset.whyCol || 0, 10);
        // col 0 -> slow, col 1 -> medium, col 2 -> faster (opposite)
        const depths = [-30, 0, 30];
        const depth = depths[col % 3];
        const offset = (progress - 0.5) * depth;
        card.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }
  }

  /* ==== GALLERY — drift left/right alternating ==== */
  carouselSlides.forEach((slide, i) => {
    const rect = slide.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const dir = i % 2 === 0 ? 1 : -1;
      const drift = (progress - 0.5) * 24 * dir;
      slide.style.setProperty('--drift', `${drift}px`);
    }
  });

  /* ==== TESTIMONIALS — floating up & down wave ==== */
  if (parallaxTargets.testimonials) {
    const rect = parallaxTargets.testimonials.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      testimonialCards.forEach((card, i) => {
        const phase = (progress * Math.PI * 1.8) + (i * 0.75);
        const wave = Math.sin(phase) * 14;
        card.style.transform = `translate3d(0, ${wave}px, 0)`;
      });
    }
  }

  /* ==== BOOKING — calendar floating softly ==== */
  if (parallaxTargets.booking) {
    const rect = parallaxTargets.booking.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = (vh - rect.top) / (vh + rect.height);
      parallaxTargets.booking.style.transform = `translate3d(0, ${(progress - 0.5) * -26}px, 0)`;
    }
  }

  /* ==== CONTACT — CTA floats opposite ==== */
  if (parallaxTargets.contact) {
    const rect = parallaxTargets.contact.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = (vh - rect.top) / (vh + rect.height);
      parallaxTargets.contact.style.transform = `translate3d(0, ${(progress - 0.5) * 34}px, 0)`;
    }
  }

  // Continue loop while user is scrolling for smooth lerp
  if (Math.abs(scrollY - targetScrollY) > 0.5) {
    requestAnimationFrame(updateParallax);
  } else {
    ticking = false;
  }
}
updateParallax();

// Apply drift for slides via CSS custom property
const styleInject = document.createElement("style");
styleInject.textContent = `.carousel-slide{ transform: translate3d(var(--drift,0), 0, 0); transition: transform .6s cubic-bezier(.4,0,.2,1);}`;
document.head.appendChild(styleInject);

/* -------------------- GALLERY CAROUSEL -------------------- */
const track = $("#carouselTrack");
const prevBtn = $("#carouselPrev");
const nextBtn = $("#carouselNext");
const dotsContainer = $("#carouselDots");

if (track) {
  let currentIdx = 0;
  const slides = $$(".carousel-slide", track);
  const total = slides.length;

  // Create dots based on "pages" (visible slides)
  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 720) return 1;
    if (w <= 1100) return 2;
    return 3;
  }
  function buildDots() {
    dotsContainer.innerHTML = "";
    const visible = getVisibleCount();
    const pages = Math.max(1, total - visible + 1);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Slide ${i+1}`);
      dot.addEventListener("click", () => scrollToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function scrollToSlide(i) {
    const slide = slides[i];
    if (!slide) return;
    const slideRect = slide.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    track.scrollTo({
      left: track.scrollLeft + slideRect.left - trackRect.left - 32,
      behavior: "smooth"
    });
  }

  function updateDots() {
    const slideWidth = slides[0].getBoundingClientRect().width + 22.4; // gap ~1.4rem
    const idx = Math.round(track.scrollLeft / slideWidth);
    currentIdx = idx;
    $$(".carousel-dot", dotsContainer).forEach((d, i) => {
      d.classList.toggle("active", i === idx);
    });
  }

  prevBtn?.addEventListener("click", () => scrollToSlide(Math.max(0, currentIdx - 1)));
  nextBtn?.addEventListener("click", () => {
    const visible = getVisibleCount();
    scrollToSlide(Math.min(total - visible, currentIdx + 1));
  });

  track.addEventListener("scroll", () => {
    clearTimeout(track._t);
    track._t = setTimeout(updateDots, 80);
  }, { passive: true });

  buildDots();
  window.addEventListener("resize", buildDots);

  // Auto-advance every 5s (pause on hover)
  let autoplayTimer = setInterval(autoAdvance, 5500);
  function autoAdvance() {
    const visible = getVisibleCount();
    const maxIdx = total - visible;
    const next = currentIdx >= maxIdx ? 0 : currentIdx + 1;
    scrollToSlide(next);
  }
  track.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  track.addEventListener("mouseleave", () => { autoplayTimer = setInterval(autoAdvance, 5500); });
}

/* -------------------- BOOKING CALENDAR -------------------- */
const calGrid = $("#calGrid");
const calTitle = $("#calTitle");
const calPrev = $("#calPrev");
const calNext = $("#calNext");
const calStatus = $("#calStatus");
const panelEmpty = $("#panelEmpty");
const panelFilled = $("#panelFilled");
const panelDate = $("#panelDate");
const panelDayName = $("#panelDayName");
const slotPagi = $("#slotPagi");
const slotSore = $("#slotSore");

// Booking data: { "2026-05-01": ["pagi","sore"], ... }
let bookingData = {};
let viewDate = new Date();
viewDate.setDate(1);
let selectedDate = null;

// Auto-scroll to first month with availability? start at today's month
const today = new Date();
today.setHours(0,0,0,0);

/* Fetch booking data from Google Sheet CSV */
async function fetchBookings() {
  if (!SHEET_URL || SHEET_URL.includes("PASTE_YOUR_PUBLISHED_CSV_URL_HERE")) {
    console.info("[Booking] Google Sheet URL belum di-set. Semua slot tersedia.");
    return {};
  }
  try {
    calStatus.textContent = "Memuat ketersediaan…";
    const res = await fetch(SHEET_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("Fetch failed");
    const csv = await res.text();
    return parseCsv(csv);
  } catch (e) {
    console.warn("[Booking] Gagal fetch:", e);
    calStatus.textContent = "Kalender sedang tidak tersedia — semua slot ditampilkan tersedia.";
    return {};
  }
}

function parseCsv(csv) {
  const out = {};
  const lines = csv.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  // skip header if present
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip header row
    if (i === 0 && /tanggal/i.test(line)) continue;
    const parts = line.split(",").map(p => p.trim().replace(/^"|"$/g, ""));
    if (parts.length < 2) continue;
    const date = parts[0];
    const session = parts[1].toLowerCase();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (!SESSIONS.find(s => s.key === session)) continue;
    if (!out[date]) out[date] = [];
    if (!out[date].includes(session)) out[date].push(session);
  }
  return out;
}

/* Render calendar */
function renderCalendar() {
  if (!calGrid) return;

  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  calTitle.textContent = `${MONTHS_ID[m]} ${y}`;

  // First day of month, day of week (0=Sun)
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  calGrid.innerHTML = "";

  // Empty cells before 1st
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    cell.className = "cal-cell empty";
    calGrid.appendChild(cell);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const key = ymd(date);
    const dayOfWeek = date.getDay();
    const isPast = date < today;
    const isToday = ymd(today) === key;
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const bookedSessions = bookingData[key] || [];
    const isFullyBooked = bookedSessions.length >= SESSIONS.length;
    const isPartiallyBooked = bookedSessions.length > 0 && !isFullyBooked;

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cal-cell";
    cell.textContent = d;
    cell.dataset.date = key;

    if (isPast) {
      cell.classList.add("past");
      cell.setAttribute("aria-label", `${d} ${MONTHS_ID[m]} — sudah lewat`);
      cell.disabled = true;
    } else if (isFullyBooked) {
      cell.classList.add("fully-booked");
      cell.setAttribute("aria-label", `${d} ${MONTHS_ID[m]} — sudah penuh`);
      cell.title = "Sudah penuh";
    } else {
      cell.classList.add("selectable");
      if (isWeekend) cell.classList.add("weekend");
      if (isPartiallyBooked) cell.classList.add("partial");
      cell.addEventListener("click", () => selectDate(date));
      cell.title = isWeekend ? "Klik untuk lihat sesi" : "Klik untuk lihat sesi (weekday)";
    }

    if (isToday) cell.classList.add("today");
    if (selectedDate && ymd(selectedDate) === key) cell.classList.add("selected");

    calGrid.appendChild(cell);
  }

  calStatus.textContent = Object.keys(bookingData).length === 0
    ? "Tips: Pilih hari Sabtu atau Minggu untuk ketersediaan terbaik."
    : "";
}

/* Select date */
function selectDate(date) {
  selectedDate = date;
  const key = ymd(date);
  const booked = bookingData[key] || [];

  // Update panel
  panelEmpty.hidden = true;
  panelFilled.hidden = false;

  panelDate.textContent = `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
  panelDayName.textContent = DAYS_ID[date.getDay()];

  // Update slot buttons
  [slotPagi, slotSore].forEach(btn => {
    const sess = btn.dataset.session;
    const isBooked = booked.includes(sess);

    btn.classList.toggle("booked", isBooked);
    btn.disabled = isBooked;

    const status = btn.querySelector(".slot-status");
    if (isBooked) {
      status.textContent = "Sudah Dibooking";
      btn.title = "Sudah dibooking";
      btn.onclick = null;
    } else {
      status.textContent = "Tersedia — Klik untuk booking";
      btn.title = "Klik untuk booking";
      btn.onclick = () => openWhatsApp(date, sess);
    }
  });

  // Re-render to show selected state
  renderCalendar();

  // Smooth scroll to panel on mobile (with offset for fixed navbar)
  if (window.innerWidth <= 1100) {
    setTimeout(() => {
      const panelTop = panelFilled.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: panelTop, behavior: "smooth" });
    }, 60);
  }
}

/* Open WhatsApp with pre-filled message */
function openWhatsApp(date, session) {
  const sessObj = SESSIONS.find(s => s.key === session);
  const dateStr = `${DAYS_ID[date.getDay()]}, ${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
  const message =
`Halo Kak Rosalia, saya ingin booking MC:

Tanggal: ${dateStr}
Sesi: ${sessObj.label} (${sessObj.time})

Mohon info ketersediaannya 🙏`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

/* Navigation */
calPrev?.addEventListener("click", () => {
  viewDate.setMonth(viewDate.getMonth() - 1);
  // Don't go before current month
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  if (viewDate < currentMonthStart) viewDate = currentMonthStart;
  renderCalendar();
});
calNext?.addEventListener("click", () => {
  viewDate.setMonth(viewDate.getMonth() + 1);
  renderCalendar();
});

/* Init */
(async function initCalendar() {
  // Start at today's month
  viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  bookingData = await fetchBookings();
  renderCalendar();
})();

/* -------------------- FOOTER YEAR -------------------- */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* -------------------- SMOOTH SCROLL FOR NAV LINKS -------------------- */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#" || href.length < 2) return;
    // Skip consult buttons (handled separately)
    if (link.hasAttribute("data-consult")) return;
    const target = $(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth"
      });
    }
  });
});

/* -------------------- KONSULTASI GRATIS (WhatsApp auto) -------------------- */
$$('[data-consult]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(CONSULT_MESSAGE)}`;
    window.open(url, "_blank", "noopener");
  });
});

/* -------------------- MOUSE TRAIL (LUXURY) -------------------- */
(function initMouseTrail(){
  const trail = $("#cursorTrail");
  const dot = $("#cursorDot");
  if (!trail || !dot) return;

  // Skip on touch devices
  const isTouch = matchMedia("(hover:none), (pointer:coarse)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch || reduced) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX, trailY = mouseY;    // delayed blur orb
  let dotX = mouseX, dotY = mouseY;        // smaller dot with less delay
  let visible = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      trail.style.setProperty("--trail-opacity", "1");
      dot.style.setProperty("--trail-opacity", ".65");
    }
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    visible = false;
    trail.style.setProperty("--trail-opacity", "0");
    dot.style.setProperty("--trail-opacity", "0");
  });

  // Scale up trail when hovering interactive elements
  const interactive = 'a, button, .service-card, .why-card, .slot-btn, .cal-cell.selectable, input, textarea, .carousel-slide';
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactive)) {
      trail.style.setProperty("--trail-size", "64px");
    }
  }, { passive: true });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactive)) {
      trail.style.setProperty("--trail-size", "32px");
    }
  }, { passive: true });

  // Set initial size
  trail.style.setProperty("--trail-size", "32px");

  function loop() {
    // Different lag per layer for luxury parallax feel
    trailX = lerp(trailX, mouseX, 0.12);
    trailY = lerp(trailY, mouseY, 0.12);
    dotX = lerp(dotX, mouseX, 0.32);
    dotY = lerp(dotY, mouseY, 0.32);

    trail.style.setProperty("--trail-x", `${trailX}px`);
    trail.style.setProperty("--trail-y", `${trailY}px`);
    dot.style.setProperty("--trail-x", `${dotX}px`);
    dot.style.setProperty("--trail-y", `${dotY}px`);

    requestAnimationFrame(loop);
  }
  loop();
})();

/* -------------------- TESTIMONIAL FORM -------------------- */
(function initTestimonialForm(){
  const form = $("#tstForm");
  if (!form) return;

  const stars = $$(".tst-star", $("#tstRating"));
  const ratingInput = $("#tstRatingValue");
  const submitBtn = $("#tstSubmit");
  const statusEl = $("#tstFormStatus");

  // Star rating interaction
  function setRating(val) {
    ratingInput.value = val;
    stars.forEach(s => {
      const v = parseInt(s.dataset.v, 10);
      s.classList.toggle("active", v <= val);
    });
  }
  function previewRating(val) {
    stars.forEach(s => {
      const v = parseInt(s.dataset.v, 10);
      s.classList.toggle("hovering", v <= val);
    });
  }
  function clearPreview() {
    stars.forEach(s => s.classList.remove("hovering"));
  }
  stars.forEach((s) => {
    const v = parseInt(s.dataset.v, 10);
    s.addEventListener("click", () => setRating(v));
    s.addEventListener("mouseenter", () => previewRating(v));
    s.addEventListener("focus", () => previewRating(v));
    s.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setRating(v);
      }
    });
  });
  $("#tstRating").addEventListener("mouseleave", clearPreview);
  setRating(5);

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `tst-form-status show ${type}`;
    if (type === "success") {
      setTimeout(() => statusEl.classList.remove("show"), 10000);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = $("#tstName").value.trim();
    const event = $("#tstEvent").value.trim();
    const message = $("#tstMessage").value.trim();
    const rating = ratingInput.value;
    const honeypot = $("#tstHp").value;

    // Honeypot: silently "succeed" for bots but don't send anything
    if (honeypot) {
      showStatus("Terima kasih! Testimoni Anda telah diterima.", "success");
      form.reset();
      setRating(5);
      return;
    }

    // Basic validation
    if (!name || !event || !message) {
      showStatus("Mohon lengkapi semua kolom yang wajib diisi.", "error");
      return;
    }
    if (message.length < 10) {
      showStatus("Pesan testimoni terlalu singkat. Minimal 10 karakter.", "error");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    const payload = {
      tanggal: new Date().toISOString(),
      nama: name,
      jenis_acara: event,
      rating: rating,
      pesan: message
    };

    try {
      // Check if endpoint is configured
      if (!TESTIMONIAL_ENDPOINT || TESTIMONIAL_ENDPOINT.includes("PASTE_YOUR_APPS_SCRIPT_URL_HERE")) {
        // Endpoint belum di-set — simpan ke localStorage sebagai fallback & tunjukkan sukses ke user
        console.warn("[Testimoni] Google Apps Script endpoint belum di-set. Data disimpan sementara di browser.");
        try {
          const saved = JSON.parse(localStorage.getItem("tst_pending") || "[]");
          saved.push(payload);
          localStorage.setItem("tst_pending", JSON.stringify(saved));
        } catch(_) {}
        // Simulate delay for better UX
        await new Promise(r => setTimeout(r, 700));
        showStatus("✨ Terima kasih! Testimoni Anda telah diterima dan akan ditinjau segera.", "success");
        form.reset();
        setRating(5);
        return;
      }

      // Send to Google Apps Script
      // Note: using 'no-cors' is one option, but we use text/plain POST
      // which Apps Script accepts without CORS issues.
      const res = await fetch(TESTIMONIAL_ENDPOINT, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      let ok = res.ok;
      // Apps Script may return JSON {status:"ok"} or plain text
      try {
        const data = await res.json();
        if (data && data.status && data.status !== "ok") ok = false;
      } catch(_) { /* ignore, fallback to res.ok */ }

      if (ok) {
        showStatus("✨ Terima kasih! Testimoni Anda telah diterima dan akan ditinjau segera.", "success");
        form.reset();
        setRating(5);
      } else {
        throw new Error("Server responded with error");
      }
    } catch (err) {
      console.error("[Testimoni]", err);
      showStatus("Maaf, terjadi kendala saat mengirim. Silakan coba lagi atau kirim via WhatsApp.", "error");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
})();
/* === Tambahkan di paling bawah script.js === */

async function loadApprovedTestimonials() {
  // Saya ganti jadi '.tst-grid' agar sesuai dengan struktur umum landing page kita
  const container = document.querySelector('.tst-grid'); 
  
  if (!container || !TESTIMONIAL_ENDPOINT || TESTIMONIAL_ENDPOINT === "") return;

  try {
    const response = await fetch(TESTIMONIAL_ENDPOINT);
    const testimonials = await response.json();

    if (Array.isArray(testimonials) && testimonials.length > 0) {
      // Menghapus testimoni placeholder/statis agar diganti data dari Sheets
      container.innerHTML = ''; 

      testimonials.forEach(item => {
        const rating = parseInt(item.rating) || 5;
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        
        const card = `
          <div class="tst-card reveal-up">
            <div class="tst-stars">${stars}</div>
            <p class="tst-text">"${item.pesan}"</p>
            <div class="tst-author">
              <div class="tst-name">${item.nama}</div>
              <div class="tst-event">${item.jenis_acara}</div>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', card);
      });
      
      // Memicu ulang animasi muncul (ScrollReveal) jika diperlukan
      if (typeof ScrollReveal !== 'undefined') {
          ScrollReveal().reveal('.tst-card', { 
              distance: '30px', 
              origin: 'bottom', 
              interval: 100 
          });
      }
    }
  } catch (err) {
    console.error("Gagal memuat testimoni:", err);
  }
}

// Panggil saat halaman siap
document.addEventListener('DOMContentLoaded', loadApprovedTestimonials);
/* === Tambahkan di baris paling bawah script.js === */

async function loadApprovedTestimonials() {
  const container = document.getElementById('testimonialContainer');
  // Cek jika container ada dan endpoint sudah diisi
  if (!container || !TESTIMONIAL_ENDPOINT || TESTIMONIAL_ENDPOINT === "") return;

  try {
    const response = await fetch(TESTIMONIAL_ENDPOINT);
    const testimonials = await response.json();

    // Jika ada data testimoni yang berstatus approved
    if (Array.isArray(testimonials) && testimonials.length > 0) {
      container.innerHTML = ''; // Hapus tulisan "Sedang memuat..."

      testimonials.forEach((item, index) => {
        // Membuat inisial avatar dari nama (Contoh: "Budi Santoso" jadi "BS")
        const initials = item.nama
          ? item.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          : "??";
        
        const cardHTML = `
          <article class="testimonial-card" data-tst-index="${index}">
            <svg class="tst-quote" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-3.3 2.7-6 6-6V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-3.3 2.7-6 6-6V8z"/>
            </svg>
            <p class="tst-body">${item.pesan}</p>
            <footer class="tst-foot">
              <div class="tst-avatar">${initials}</div>
              <div>
                <strong>${item.nama}</strong>
                <span>${item.jenis_acara}</span>
              </div>
            </footer>
          </article>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
      });

      // Memicu ulang animasi jika menggunakan ScrollReveal
      if (window.revealUp) window.revealUp(); 
    } else {
      container.innerHTML = '<p class="tst-body" style="grid-column: 1/-1; text-align: center; opacity: 0.5;">Belum ada testimoni yang ditampilkan.</p>';
    }
  } catch (err) {
    console.error("[Testimoni] Gagal memuat:", err);
    container.innerHTML = '<p class="tst-body" style="grid-column: 1/-1; text-align: center; opacity: 0.5;">Gagal memuat testimoni.</p>';
  }
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadApprovedTestimonials);