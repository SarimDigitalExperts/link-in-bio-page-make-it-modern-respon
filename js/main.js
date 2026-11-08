/* ==========================================================================
   ALEX VANCE - Professional Cricketer Link-in-Bio Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initial Click Stats
  let clickCounts = loadStorage('cricket_link_clicks', {
    'link-1': 3240,
    'link-2': 1890,
    'link-3': 2100,
    'link-4': 1450,
    'link-5': 980
  });

  let totalViews = loadStorage('cricket_total_views', 28450);
  totalViews += 1;
  saveStorage('cricket_total_views', totalViews);

  // Initialize Modules
  initThemeManager();
  initTabNavigation();
  initClickTracker();
  initAnalyticsToggle();
  initNewsletter();
  initModals();
  updateAnalyticsDisplay();
});

// Storage Helper
function loadStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // Fallback
  }
}

// Toast System
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Theme Switcher Logic
function initThemeManager() {
  const savedTheme = loadStorage('cricket_theme', 'dark');
  applyTheme(savedTheme);

  const themeCards = document.querySelectorAll('.theme-card');
  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.dataset.themeVal;
      applyTheme(theme);
      saveStorage('cricket_theme', theme);
      showToast(`Applied ${theme.toUpperCase()} Theme 🏏`);
      closeModal('theme-modal');
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  document.querySelectorAll('.theme-card').forEach(card => {
    if (card.dataset.themeVal === theme) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

// Tab Switching System
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(`tab-${target}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  });
}

// Click Tracker
function initClickTracker() {
  const linkCards = document.querySelectorAll('[data-link-id]');
  linkCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.linkId;
      const counts = loadStorage('cricket_link_clicks', {});
      counts[id] = (counts[id] || 0) + 1;
      saveStorage('cricket_link_clicks', counts);

      updateAnalyticsDisplay();
    });
  });
}

// Creator Analytics Overlay Toggle
function initAnalyticsToggle() {
  const toggleBtn = document.getElementById('analytics-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('show-analytics');
    const isShowing = document.body.classList.contains('show-analytics');
    showToast(isShowing ? 'Live Player Analytics Enabled 📊' : 'Analytics Hidden');
  });
}

function updateAnalyticsDisplay() {
  const counts = loadStorage('cricket_link_clicks', {});
  const totalClicks = Object.values(counts).reduce((a, b) => a + b, 0);
  const totalViews = loadStorage('cricket_total_views', 28450);

  const viewsEl = document.getElementById('stat-views');
  const clicksEl = document.getElementById('stat-clicks');
  const ctrEl = document.getElementById('stat-ctr');

  if (viewsEl) viewsEl.textContent = totalViews.toLocaleString();
  if (clicksEl) clicksEl.textContent = totalClicks.toLocaleString();

  if (ctrEl && totalViews > 0) {
    const ctr = ((totalClicks / totalViews) * 100).toFixed(1);
    ctrEl.textContent = `${ctr}%`;
  }

  document.querySelectorAll('[data-link-id]').forEach(card => {
    const id = card.dataset.linkId;
    const count = counts[id] || 0;
    const badge = card.querySelector('.click-counter-badge');
    if (badge) {
      badge.textContent = `${count} clicks`;
    }
  });
}

// Newsletter Subscription
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value : '';

    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address!');
      return;
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    }

    showToast('Welcome to the Weekly Cricket Dispatch! 🏏');
    form.reset();
  });
}

// Modal System
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalCloses = document.querySelectorAll('[data-close-modal]');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.dataset.openModal;
      openModal(modalId);
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Clipboard Helper
function copyToClipboard(text, message = 'Link copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message);
  }).catch(() => {
    showToast('Failed to copy');
  });
}
