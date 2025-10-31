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
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll(".hidden").forEach((el) => el.classList.add("show"));
}

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
