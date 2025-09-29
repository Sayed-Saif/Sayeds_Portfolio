
document.addEventListener("DOMContentLoaded", () => {
    // ------------------- Loader JS -------------------

// Wait until the whole page (images, scripts, etc.) is fully loaded
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none"; // hide loader
  }
});


// ------------------ NAVBAR ------------------
 const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');
        const navItems = document.querySelectorAll('#nav-links li a');

        // Toggle menu
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent immediate close
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when link is clicked
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (
                navLinks.classList.contains('open') &&
                !navLinks.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            }
        });
 // ------------------ HERO SECTION ------------------
         const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero img');

    const heroObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroText.classList.add('animate-left');
                heroImage.classList.add('animate-right');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (heroText && heroImage) {
        heroObserver.observe(heroText);
        heroObserver.observe(heroImage);
    }


  // ------------------ ABOUT SECTION ------------------
  const aboutLeft = document.querySelector(".about-left");
  const aboutRight = document.querySelector(".about-right");

  const aboutObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutLeft.classList.add("animate-left");
        aboutRight.classList.add("animate-right");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (aboutLeft && aboutRight) {
    aboutObserver.observe(aboutLeft);
    aboutObserver.observe(aboutRight);
  }

  // ------------------ SKILLS SECTION------------------
  const progressBars = document.querySelectorAll(".progress");

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target;
        const percent = progress.style.getPropertyValue("--percent");
        progress.style.width = percent + "%";
        observer.unobserve(progress);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => {
    bar.style.width = "0%";
    skillsObserver.observe(bar);
  });

  // ------------------ EXPERIENCE TIMELINE ------------------
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timeline = document.querySelector(".timeline");

  const timelineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        item.classList.add("animate");

        const iconFill = item.querySelector(".timeline-icon-fill");
        if (iconFill) iconFill.classList.add("fill");

        observer.unobserve(item);
      }
    });
  }, { threshold: 0.5 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  // Dynamic timeline line
  if (timeline) {
    let line = document.createElement("div");
    line.classList.add("timeline-line");
    timeline.prepend(line);

    const updateLineHeight = () => {
      const firstItem = timeline.querySelector(".timeline-item:first-child");
      const lastItem = timeline.querySelector(".timeline-item:last-child");

      if (firstItem && lastItem) {
        const height = lastItem.offsetTop + lastItem.offsetHeight / 2 - firstItem.offsetTop;
        line.style.height = height + "px";
      }
    };

    window.addEventListener("load", updateLineHeight);
    window.addEventListener("resize", updateLineHeight);
  }

// ------------------- UNIVERSAL MODAL -------------------
const universalModal = document.getElementById('universal-modal');
const universalTitle = document.getElementById('universal-modal-title');
const universalDesc = document.getElementById('universal-modal-desc');
const universalClose = universalModal.querySelector('.universal-close');

// Function to open modal
function openUniversalModal(title, desc) {
    universalTitle.textContent = title;
    universalDesc.textContent = desc;
    universalModal.classList.add('show');
}

// Close modal by X, outside click, or Escape key
universalClose.addEventListener('click', () => universalModal.classList.remove('show'));
window.addEventListener('click', e => { if (e.target === universalModal) universalModal.classList.remove('show'); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') universalModal.classList.remove('show'); });

// ------------------- SERVICES SECTION -------------------
const track = document.querySelector('.services-track');
const carouselWrapper = document.querySelector('.services-carousel');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let serviceCards = [];
let serviceIndex = 0;
let serviceCardsPerView = 3; 
const gap = 20;

// Determine cards per view based on window width
function getCardsPerView() {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3; 
}

// Set card widths dynamically
function setCardWidths() {
    const wrapperWidth = carouselWrapper.offsetWidth;
    const cardWidth = (wrapperWidth - gap * (serviceCardsPerView - 1)) / serviceCardsPerView;
    serviceCards.forEach(card => card.style.width = `${cardWidth}px`);
}

// Update carousel position
function updateCarousel() {
    const cardWidth = serviceCards[0].offsetWidth + gap;
    const visibleWidth = serviceCardsPerView * serviceCards[0].offsetWidth + (serviceCardsPerView - 1) * gap;
    const offset = (carouselWrapper.offsetWidth - visibleWidth) / 2;
    const moveX = serviceIndex * cardWidth - offset;
    track.style.transform = `translateX(-${moveX}px)`;
}

// Next / Prev buttons
nextBtn?.addEventListener('click', () => {
    if (serviceIndex < serviceCards.length - serviceCardsPerView) serviceIndex++;
    else serviceIndex = 0;
    updateCarousel();
});

prevBtn?.addEventListener('click', () => {
    if (serviceIndex > 0) serviceIndex--;
    else serviceIndex = serviceCards.length - serviceCardsPerView;
    updateCarousel();
});

// Swipe for mobile
let startX = 0, endX = 0;
carouselWrapper?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
carouselWrapper?.addEventListener('touchmove', e => { endX = e.touches[0].clientX; });
carouselWrapper?.addEventListener('touchend', () => {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) diff > 0 ? nextBtn.click() : prevBtn.click();
});

// Animate images on scroll
function animateServiceImages() {
    const images = document.querySelectorAll('.service-card img');
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${i * 0.2}s`;
                entry.target.classList.add('animate-img');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    images.forEach(img => observer.observe(img));
}

// Load Services JSON and render cards
async function loadServices() {
    try {
        const res = await fetch('services.json');
        const data = await res.json();
        track.innerHTML = '';
        data.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.dataset.desc = service.desc; // store description
            card.innerHTML = `
                <img src="${service.image}" alt="${service.title}">
                <h3>${service.title}</h3>
                <button class="know-more">Know More</button>
            `;
            track.appendChild(card);
            card.querySelector('.know-more').addEventListener('click', () => {
                openUniversalModal(service.title, service.desc);
            });
        });
        serviceCards = document.querySelectorAll('.service-card');
        serviceCardsPerView = getCardsPerView();
        setCardWidths();
        updateCarousel();
        animateServiceImages();
    } catch (err) {
        console.error('Failed to load services.json:', err);
    }
}

// Resize handling
window.addEventListener('resize', () => {
    serviceCardsPerView = getCardsPerView();
    if (serviceIndex > serviceCards.length - serviceCardsPerView) serviceIndex = serviceCards.length - serviceCardsPerView;
    setCardWidths();
    updateCarousel();
});

// ------------------- WORK HISTORY SECTION -------------------
const workContainer = document.getElementById('work-history-container');
const workShowMoreBtn = document.getElementById('work-show-more');
const workHideMoreBtn = document.getElementById('work-hide-more');

let workItems = [];
let workVisibleCount = 3; 

// Load Work History JSON
async function loadWorkHistory() {
    try {
        const res = await fetch('work-history.json');
        workItems = await res.json();
        renderWorkHistory();
        updateWorkButtons();
        animateWorkImages();
    } catch (err) {
        console.error('Failed to load work-history.json:', err);
        workContainer.innerHTML = '<p class="error">Unable to load work history.</p>';
    }
}

// Render Work History Cards
function renderWorkHistory() {
    workContainer.innerHTML = '';
    workItems.slice(0, workVisibleCount).forEach(work => {
        const card = document.createElement('div');
        card.className = 'work-history-card';
        card.dataset.desc = work.desc; // store description
        card.innerHTML = `
            <img src="${work.image}" alt="${work.title}" loading="lazy">
            <h3>${work.title}</h3>
            <button class="work-know-more-btn">Know More</button>
        `;
        workContainer.appendChild(card);

        // Modal event
        card.querySelector('.work-know-more-btn').addEventListener('click', () => {
            openUniversalModal(work.title, work.desc);
        });
    });
}

// Show/Hide buttons update
function updateWorkButtons() {
    workShowMoreBtn.style.display = workVisibleCount >= workItems.length ? 'none' : 'inline-flex';
    workHideMoreBtn.style.display = workVisibleCount > 3 ? 'inline-flex' : 'none';
}

// Show More
workShowMoreBtn.addEventListener('click', () => {
    workVisibleCount = Math.min(workVisibleCount + 3, workItems.length);
    renderWorkHistory();
    animateWorkImages();
    updateWorkButtons();
});

// Hide More
workHideMoreBtn.addEventListener('click', () => {
    workVisibleCount = Math.max(workVisibleCount - 3, 3);
    renderWorkHistory();
    animateWorkImages();
    updateWorkButtons();
});

// Animate Work images
function animateWorkImages() {
    const imgs = document.querySelectorAll('.work-history-card img');
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${i * 0.1}s`;
                entry.target.classList.add('work-animate-img');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    imgs.forEach(img => observer.observe(img));
}

// ------------------- INIT -------------------
window.addEventListener('load', () => {
    loadServices();
    loadWorkHistory();
});

// ------------------ Voices Of Trust ------------------
const reviewText = document.querySelector(".review-text");
const clientName = document.querySelector(".client-name");
const platformLogo = document.querySelector(".platform-logo"); // div
const reviewRating = document.querySelector(".review-rating");
const pagination = document.querySelector(".pagination");
const reviewPrevBtn = document.querySelector(".feedback .prev-btn");
const reviewNextBtn = document.querySelector(".feedback .next-btn");
const feedbackContainer = document.querySelector(".feedback-container");
const reviewBox = document.querySelector(".review-box"); // <-- main swipe target

let reviews = [];
let currentIndex = 0;
let animTimeout = null;

// ------------------ Load Reviews ------------------
async function loadReviews() {
  try {
    const res = await fetch("reviews.json");
    reviews = await res.json();
    if (!reviews || reviews.length === 0) return;

    createPagination();
    renderReview(0); // first review
  } catch (err) {
    console.error("Error loading reviews:", err);
    if (reviewText) reviewText.textContent = "Unable to load reviews at this time.";
  }
}

// ------------------ Render Review ------------------
function renderReview(index) {
  if (!reviews || reviews.length === 0) return;
  currentIndex = ((index % reviews.length) + reviews.length) % reviews.length;

  updatePagination(currentIndex);

  const r = reviews[currentIndex];

  // Clear pending animation
  if (animTimeout) {
    clearTimeout(animTimeout);
    animTimeout = null;
  }

  // Update text
  reviewText.textContent = r.review;
  clientName.textContent = r.name;

  // Update platform logo
  platformLogo.innerHTML = "";
  const platformNameNode = document.createTextNode(r.platformName || "Fiverr");
  const pDot = document.createElement("div");
  pDot.className = "platform-dot";
  platformLogo.appendChild(platformNameNode);
  platformLogo.appendChild(pDot);

  // Update stars
  reviewRating.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i");
    star.classList.add(i < r.rating ? "fas" : "far", "fa-star");
    reviewRating.appendChild(star);
  }

  // Animate fade-in
  const elements = [reviewText, clientName, platformLogo, reviewRating].filter(Boolean);
  elements.forEach(el => {
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.getBoundingClientRect(); // force reflow
  });

  requestAnimationFrame(() => {
    elements.forEach(el => {
      el.style.transition = "opacity 360ms ease, transform 360ms ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  });

  animTimeout = setTimeout(() => {
    elements.forEach(el => {
      el.style.transition = "";
    });
    animTimeout = null;
  }, 420);
}

// ------------------ Pagination ------------------
function createPagination() {
  pagination.innerHTML = "";
  reviews.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      if (currentIndex === i) return;
      renderReview(i);
    });

    pagination.appendChild(dot);
  });
}

function updatePagination(index) {
  const dots = pagination.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// ------------------ Buttons ------------------
reviewPrevBtn?.addEventListener("click", () => {
  if (!reviews.length) return;
  renderReview(currentIndex - 1);
});

reviewNextBtn?.addEventListener("click", () => {
  if (!reviews.length) return;
  renderReview(currentIndex + 1);
});

// ------------------ Swipe Functionality ------------------
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

if (reviewBox) {
  reviewBox.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  reviewBox.addEventListener("touchmove", e => {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
  });

  reviewBox.addEventListener("touchend", () => {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Only trigger if horizontal swipe is stronger than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // swipe left → next
        renderReview(currentIndex + 1);
      } else {
        // swipe right → prev
        renderReview(currentIndex - 1);
      }
    }

    // reset
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
  });
}

// ------------------ Animate Container ------------------
if (feedbackContainer) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        feedbackContainer.classList.add("animate");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(feedbackContainer);
}

// ------------------ Init ------------------
loadReviews();

// ------------------- Contact Section Animation -------------------
const contactContainer = document.querySelector('.contact-container');
const contactImage = document.querySelector('.contact-image img');
const contactForm = document.querySelector('.contact-form form');
const contactElements = contactForm.querySelectorAll('label, input, textarea');

if (contactContainer) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate image (bottom to top)
                contactImage.classList.add('animate-img');

                // Animate form elements one by one
                contactElements.forEach((el, index) => {
                    el.classList.add('animate-form');
                    el.style.transitionDelay = `${0.15 * (index + 1)}s`;
                });

                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(contactContainer);
}
});
