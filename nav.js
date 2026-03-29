/**
 * Shared Navigation Bar — مستكشف القرآن العظيم
 * Inject once after .header on every page. Auto-highlights active link.
 */
(function () {
  const pages = [
    { href: 'index.html',           label: '🔍 البحث'        },
    { href: 'browse.html',          label: '📖 المتصفح'       },
    { href: 'roots.html',           label: '🌿 الجذور'        },
    { href: 'fields.html',          label: '🏷️ الحقول'        },
    {
      label: '📊 الإحصائيات',
      dropdown: [
        { href: 'stats.html',       label: '📊 نظرة عامة'     },
        { href: 'stats-roots.html', label: '🌱 إحصائيات الجذور' },
        { href: 'stats-words.html', label: '📝 إحصائيات الكلمات' },
      ]
    },
    { href: 'ai-guide.html',        label: '🤖 التحليل بالذكاء الاصطناعي' },
    { href: 'why.html',             label: '💡 لماذا هذا الموقع؟' },
    { href: 'about.html',           label: 'ℹ️ عن الموقع'     },
  ];

  // Detect current page
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(item) {
    if (item.href) return item.href === currentFile;
    if (item.dropdown) return item.dropdown.some(d => d.href === currentFile);
    return false;
  }

  // --- CSS ---
  const style = document.createElement('style');
  style.textContent = `
    #qnav {
      background: #fff8f0;
      border-bottom: 2px solid #c9a84c44;
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 2px;
      font-family: 'Amiri', 'Traditional Arabic', serif;
      direction: rtl;
      flex-wrap: wrap;
      position: relative;
      z-index: 100;
    }
    body.dark #qnav {
      background: #1e1408;
      border-color: #7a5c3a44;
    }
    .qnav-item {
      position: relative;
    }
    .qnav-link, .qnav-trigger {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 10px 16px;
      color: #7a4a10;
      font-size: 0.92rem;
      text-decoration: none;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-family: inherit;
      transition: color .15s, border-color .15s, background .15s;
      white-space: nowrap;
    }
    body.dark .qnav-link,
    body.dark .qnav-trigger {
      color: #c9a84c;
    }
    .qnav-link:hover,
    .qnav-trigger:hover {
      color: #5a2a00;
      background: #fff0d8;
    }
    body.dark .qnav-link:hover,
    body.dark .qnav-trigger:hover {
      color: #f5d080;
      background: #2a1c08;
    }
    .qnav-link.active,
    .qnav-trigger.active {
      color: #6b3a1f;
      border-bottom-color: #c9a84c;
      font-weight: bold;
    }
    body.dark .qnav-link.active,
    body.dark .qnav-trigger.active {
      color: #f5d080;
      border-bottom-color: #c9a84c;
    }
    .qnav-trigger::after {
      content: ' ▾';
      font-size: 0.7rem;
      opacity: 0.6;
    }
    /* Dropdown */
    .qnav-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      min-width: 180px;
      background: #fff8f0;
      border: 1px solid #c9a84c66;
      border-top: none;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 6px 16px #0002;
      z-index: 200;
      flex-direction: column;
    }
    body.dark .qnav-dropdown {
      background: #2a1c0a;
      border-color: #7a5c3a88;
    }
    .qnav-item:hover .qnav-dropdown,
    .qnav-item:focus-within .qnav-dropdown {
      display: flex;
    }
    .qnav-dropdown a {
      display: block;
      padding: 10px 18px;
      color: #7a4a10;
      text-decoration: none;
      font-size: 0.9rem;
      font-family: 'Amiri', 'Traditional Arabic', serif;
      transition: background .15s;
      white-space: nowrap;
    }
    body.dark .qnav-dropdown a {
      color: #c9a84c;
    }
    .qnav-dropdown a:hover {
      background: #fff0d8;
    }
    body.dark .qnav-dropdown a:hover {
      background: #3a2a10;
    }
    .qnav-dropdown a.active {
      color: #6b3a1f;
      font-weight: bold;
      background: #fdf0dc;
    }
    body.dark .qnav-dropdown a.active {
      background: #3a2a10;
      color: #f5d080;
    }
    .qnav-contact {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 7px 14px;
      margin: 6px 0;
      color: #6b3a1f;
      font-size: 0.85rem;
      text-decoration: none;
      background: #fff0d8;
      border: 1px solid #c9a84c88;
      border-radius: 20px;
      white-space: nowrap;
      font-family: 'Amiri', 'Traditional Arabic', serif;
      transition: background .2s, box-shadow .2s;
    }
    .qnav-contact:hover {
      background: #c9a84c;
      color: #fff;
      box-shadow: 0 2px 8px #c9a84c44;
    }
    body.dark .qnav-contact {
      background: #2a1c0a;
      color: #c9a84c;
      border-color: #7a5c3a88;
    }
    body.dark .qnav-contact:hover {
      background: #c9a84c;
      color: #1a1208;
    }
    @media (max-width: 600px) {
      #qnav { gap: 0; padding: 0 8px; }
      .qnav-link, .qnav-trigger { padding: 9px 10px; font-size: 0.82rem; }
      .qnav-contact { font-size: 0.78rem; padding: 6px 10px; }
    }
  `;
  document.head.appendChild(style);

  // --- Build nav HTML ---
  const nav = document.createElement('nav');
  nav.id = 'qnav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'التنقل الرئيسي');

  pages.forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.className = 'qnav-item';

    if (item.dropdown) {
      const trigger = document.createElement('button');
      trigger.className = 'qnav-trigger' + (isActive(item) ? ' active' : '');
      trigger.textContent = item.label;
      trigger.setAttribute('aria-haspopup', 'true');
      wrapper.appendChild(trigger);

      const drop = document.createElement('div');
      drop.className = 'qnav-dropdown';
      item.dropdown.forEach(d => {
        const a = document.createElement('a');
        a.href = d.href;
        a.textContent = d.label;
        if (d.href === currentFile) a.classList.add('active');
        drop.appendChild(a);
      });
      wrapper.appendChild(drop);
    } else {
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'qnav-link' + (isActive(item) ? ' active' : '');
      a.textContent = item.label;
      wrapper.appendChild(a);
    }

    nav.appendChild(wrapper);
  });

  // --- Contact button (far left in RTL) ---
  const contactSpacer = document.createElement('div');
  contactSpacer.style.cssText = 'flex:1;';
  nav.appendChild(contactSpacer);

  const contactLink = document.createElement('a');
  contactLink.href = 'https://forms.gle/Uub3PD5d8bxh4ZtM9';
  contactLink.target = '_blank';
  contactLink.rel = 'noopener noreferrer';
  contactLink.className = 'qnav-contact';
  contactLink.title = 'تواصل معنا';
  contactLink.textContent = '✉️ تواصل معنا';
  nav.appendChild(contactLink);

  // --- Inject after .header ---
  function inject() {
    const header = document.querySelector('.header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(nav, header.nextSibling);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

// ===== Service Worker Registration + Auto-Reload (مشترك بين كل الصفحات) =====
(function () {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
      // تحقّق من وجود تحديث فوراً عند كل تحميل
      reg.update();

      reg.addEventListener('updatefound', function () {
        var newWorker = reg.installing;
        newWorker.addEventListener('statechange', function () {
          // لمّا يكون الـ SW الجديد جاهزاً — أعطه إشارة يتولى الآن
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage('skipWaiting');
          }
        });
      });
    }).catch(function () {});

    // لمّا يتغير الـ controller (يعني SW جديد استلم) — أعد تحميل الصفحة مرة واحدة
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
})();

// ===== Dark Mode (shared across all pages) =====
(function () {
  // Apply class immediately — prevents flash of light mode
  if (localStorage.getItem('qeDark') === '1') {
    document.body.classList.add('dark');
  }

  window.toggleDark = function () {
    document.body.classList.toggle('dark');
    var isDark = document.body.classList.contains('dark');
    var btn = document.getElementById('darkBtn');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('qeDark', isDark ? '1' : '0');
  };

  function updateDarkBtn() {
    var btn = document.getElementById('darkBtn');
    if (btn && localStorage.getItem('qeDark') === '1') btn.textContent = '☀️';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDarkBtn);
  } else {
    updateDarkBtn();
  }
})();
