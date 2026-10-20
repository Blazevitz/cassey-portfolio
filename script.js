// Personalize these settings when you're ready to publish.
const CONTACT_EMAIL = ''; // Example: 'casseywynnd@gmail.com'
const GITHUB_URL = 'https://github.com/Blazevitz';     // Example: 'https://github.com/Blazevitz'

const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const toast = document.getElementById('toast');
let toastTimer;
let themeAnimationTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// Theme toggle animates a ripple from the switch without relying on view transitions.
themeToggle.addEventListener('click', () => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const bounds = themeToggle.getBoundingClientRect();
    body.style.setProperty('--theme-x', `${bounds.left + bounds.width / 2}px`);
    body.style.setProperty('--theme-y', `${bounds.top + bounds.height / 2}px`);
    body.classList.remove('theme-animating');
    void body.offsetWidth;
    body.classList.add('theme-animating');
    clearTimeout(themeAnimationTimer);
    themeAnimationTimer = setTimeout(() => body.classList.remove('theme-animating'), 850);
  }

  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  themeToggle.querySelector('.theme-icon').textContent = isLight ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', isLight ? '#f6f7fc' : '#090a10');
});

// Mobile navigation.
menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

// Reveal sections on scroll, with a safe fallback for reduced-motion users or older browsers.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Contact button uses a real email address only after the owner configures it.
document.getElementById('contactButton').addEventListener('click', () => {
  if (CONTACT_EMAIL.trim()) {
    window.location.href = `mailto:${CONTACT_EMAIL.trim()}?subject=${encodeURIComponent('Hello, Cassey!')}`;
  } else if (GITHUB_URL.trim()) {
    window.open(GITHUB_URL.trim(), '_blank', 'noopener,noreferrer');
    showToast('Opened your configured profile link.');
  } else {
    showToast('Add your email or GitHub URL near the top of script.js first.');
    document.getElementById('contactHint').textContent = 'To connect directly, add CONTACT_EMAIL or GITHUB_URL near the top of script.js.';
  }
});

document.getElementById('copyNameButton').addEventListener('click', async () => {
  const fullName = 'Cassey Wynn Daniel Sabaulan Robles';
  try {
    await navigator.clipboard.writeText(fullName);
    showToast('Full name copied to clipboard.');
  } catch {
    const field = document.createElement('textarea');
    field.value = fullName;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    showToast(copied ? 'Full name copied to clipboard.' : fullName);
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

const chatWidget = document.getElementById('chatWidget');
const chatLauncher = document.getElementById('chatLauncher');
const chatClose = document.getElementById('chatClose');
const CHAT_STORAGE_KEY = 'casseyPortfolioChatOpen';

function applyChatState(isOpen) {
  if (!chatWidget || !chatLauncher) return;

  chatWidget.classList.toggle('is-closed', !isOpen);
  chatLauncher.classList.toggle('is-visible', !isOpen);
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, String(isOpen));
  } catch (error) {
    // Ignore localStorage access issues in restricted contexts.
  }
}

if (chatWidget && chatLauncher && chatClose) {
  const savedState = (() => {
    try {
      return localStorage.getItem(CHAT_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  })();

  applyChatState(savedState);

  chatClose.addEventListener('click', () => {
    applyChatState(false);
  });

  chatLauncher.addEventListener('click', () => {
    applyChatState(true);
  });
}
