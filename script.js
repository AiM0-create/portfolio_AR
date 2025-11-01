const mobileMenu = document.getElementById("mobile-menu");
const hamburgerIcon = document.querySelector(".hamburger-icon");

function toggleMenu(forceState) {
  if (!mobileMenu || !hamburgerIcon) {
    return;
  }
  const shouldOpen = typeof forceState === "boolean" ? forceState : !mobileMenu.classList.contains("open");
  mobileMenu.classList.toggle("open", shouldOpen);
  hamburgerIcon.classList.toggle("open", shouldOpen);
  hamburgerIcon.setAttribute("aria-expanded", String(shouldOpen));
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add a small delay for stagger effect
        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 50);
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll(".hidden").forEach((el) => el.classList.add("show"));
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 80; // Account for sticky header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

if (mobileMenu && hamburgerIcon) {
  document.addEventListener("click", (event) => {
    if (!mobileMenu.classList.contains("open")) {
      return;
    }
    if (!mobileMenu.contains(event.target) && !hamburgerIcon.contains(event.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("open")) {
      toggleMenu(false);
    }
  });
}

const themeToggleButtons = document.querySelectorAll(".theme-toggle");

function updateThemeToggleButtons(theme) {
  themeToggleButtons.forEach((button) => {
    const isDark = theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Activate light theme" : "Activate dark theme");
    const iconSpan = button.querySelector(".theme-toggle__icon");
    if (iconSpan) {
      iconSpan.textContent = isDark ? "🌙" : "☀️";
    }
  });
}

function applyTheme(theme, { persist = true } = {}) {
  document.body.dataset.theme = theme;
  if (persist) {
    localStorage.setItem("preferred-theme", theme);
  }
  updateThemeToggleButtons(theme);
}

const storedTheme = localStorage.getItem("preferred-theme");
const systemPreferenceQuery = window.matchMedia("(prefers-color-scheme: dark)");
const systemPrefersDark = systemPreferenceQuery.matches;
const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
let systemPreferenceListener;

applyTheme(initialTheme, { persist: Boolean(storedTheme) });

if (!storedTheme) {
  systemPreferenceListener = (event) => {
    applyTheme(event.matches ? "dark" : "light", { persist: false });
  };

  if (typeof systemPreferenceQuery.addEventListener === "function") {
    systemPreferenceQuery.addEventListener("change", systemPreferenceListener);
  } else if (typeof systemPreferenceQuery.addListener === "function") {
    systemPreferenceQuery.addListener(systemPreferenceListener);
  }
}

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    if (systemPreferenceListener) {
      if (typeof systemPreferenceQuery.removeEventListener === "function") {
        systemPreferenceQuery.removeEventListener("change", systemPreferenceListener);
      } else if (typeof systemPreferenceQuery.removeListener === "function") {
        systemPreferenceQuery.removeListener(systemPreferenceListener);
      }
      systemPreferenceListener = undefined;
    }
    applyTheme(nextTheme);
  });
});

// Cursor gradient effect for hero section
const cursorGradient = document.querySelector('.cursor-gradient');
const profileSection = document.getElementById('profile');

if (cursorGradient && profileSection) {
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  profileSection.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Only show on larger screens
    if (window.innerWidth > 768) {
      cursorGradient.style.opacity = '1';
    }
  });

  profileSection.addEventListener('mouseleave', () => {
    cursorGradient.style.opacity = '0';
  });

  function animateGradient() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    
    cursorGradient.style.left = currentX + 'px';
    cursorGradient.style.top = currentY + 'px';
    
    requestAnimationFrame(animateGradient);
  }
  
  animateGradient();
}

// Typing animation for role tagline
const roles = [
  "Urban planner",
  "GIS enthusiast",
  "Storyteller with maps",
  "Data analyst",
  "Spatial designer"
];

let currentRoleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typedTextElement = document.querySelector('.typed-text');

function typeRole() {
  if (!typedTextElement) return;
  
  const currentRole = roles[currentRoleIndex];
  
  if (isDeleting) {
    typedTextElement.textContent = currentRole.substring(0, currentCharIndex - 1);
    currentCharIndex--;
    
    if (currentCharIndex === 0) {
      isDeleting = false;
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
    }
  } else {
    typedTextElement.textContent = currentRole.substring(0, currentCharIndex + 1);
    currentCharIndex++;
    
    if (currentCharIndex === currentRole.length) {
      setTimeout(() => {
        isDeleting = true;
      }, 2000);
    }
  }
  
  const typingSpeed = isDeleting ? 50 : 100;
  setTimeout(typeRole, typingSpeed);
}

if (typedTextElement) {
  typeRole();
}

// Navigation for highlights flash cards
let currentHighlightIndex = 0;
const totalHighlights = 3;

function navigateHighlights(direction) {
  const stack = document.querySelector('.flashcards-stack');
  const cards = Array.from(stack.querySelectorAll('.flashcard'));
  
  if (!cards.length) return;
  
  currentHighlightIndex += direction;
  
  if (currentHighlightIndex < 0) {
    currentHighlightIndex = totalHighlights - 1;
  } else if (currentHighlightIndex >= totalHighlights) {
    currentHighlightIndex = 0;
  }
  
  // Update card positions - simpler approach: just rotate positions
  cards.forEach((card, index) => {
    // Calculate which position this card should be in
    let targetIndex = (index - currentHighlightIndex + totalHighlights) % totalHighlights;
    
    card.setAttribute('data-index', targetIndex);
    
    const zIndex = totalHighlights - targetIndex;
    const offset = targetIndex * 10;
    const scale = 1 - (targetIndex * 0.05);
    
    // Only top card is fully visible
    if (targetIndex === 0) {
      card.style.opacity = '1';
      card.style.visibility = 'visible';
    } else {
      card.style.opacity = targetIndex === 1 ? '0.3' : '0.2';
      card.style.visibility = 'hidden';
    }
    
    card.style.zIndex = zIndex;
    card.style.transform = `translateY(${offset}px) scale(${scale})`;
  });
}

// Navigation for projects flash cards
let currentProjectIndex = 0;
let totalProjects = 0;

function updateProjectCount() {
  const stack = document.querySelector('.projects-flashcards-stack');
  if (stack) {
    totalProjects = stack.querySelectorAll('.project-flashcard').length;
  }
}

function navigateProjects(direction) {
  const stack = document.querySelector('.projects-flashcards-stack');
  const cards = Array.from(stack.querySelectorAll('.project-flashcard'));
  
  if (!cards.length) return;
  
  if (totalProjects === 0) {
    updateProjectCount();
  }
  
  currentProjectIndex += direction;
  
  if (currentProjectIndex < 0) {
    currentProjectIndex = totalProjects - 1;
  } else if (currentProjectIndex >= totalProjects) {
    currentProjectIndex = 0;
  }
  
  // Update card positions - simpler approach: just rotate positions
  cards.forEach((card, index) => {
    // Calculate which position this card should be in
    let targetIndex = (index - currentProjectIndex + totalProjects) % totalProjects;
    
    card.setAttribute('data-index', targetIndex);
    
    const zIndex = totalProjects - targetIndex;
    const offset = targetIndex * 10;
    const scale = 1 - (targetIndex * 0.03);
    
    // Only top card is fully visible
    if (targetIndex === 0) {
      card.style.opacity = '1';
      card.style.visibility = 'visible';
    } else if (targetIndex === 1) {
      card.style.opacity = '0.3';
      card.style.visibility = 'hidden';
    } else if (targetIndex === 2) {
      card.style.opacity = '0.2';
      card.style.visibility = 'hidden';
    } else {
      card.style.opacity = '0.1';
      card.style.visibility = 'hidden';
    }
    
    card.style.zIndex = zIndex;
    card.style.transform = `translateY(${offset}px) scale(${scale})`;
  });
}

// Initialize project count on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateProjectCount);
} else {
  updateProjectCount();
}
