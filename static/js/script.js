// script.js - Responsive collapsible sidebar toggle logic & PJAX Router
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const isMobile = () => window.innerWidth < 768;

  // Notify Flutter native app about theme changes
  function notifyFlutterTheme() {
    if (window.FlutterBridge) {
      const isDark = root.classList.contains("dark") || root.getAttribute("data-theme") === "dark";
      window.FlutterBridge.postMessage("THEME:" + (isDark ? "dark" : "light"));
    }
  }

  // Initial notification (with a small timeout to let WebView initialize the bridge)
  setTimeout(notifyFlutterTheme, 400);

  // Watch for dynamic theme toggle updates
  const themeObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "class" || mutation.attributeName === "data-theme") {
        notifyFlutterTheme();
      }
    });
  });
  themeObserver.observe(root, { attributes: true });

  // Dynamic Theme Switcher Injection
  function injectThemeToggle() {
    const buttons = document.querySelectorAll(".theme-switch-btn");
    buttons.forEach(btn => {
      if (btn.hasAttribute("data-has-listener")) return;
      btn.setAttribute("data-has-listener", "true");

      // Event listener for click
      btn.addEventListener("click", function () {
        const currentlyDark = root.classList.contains("dark") || root.getAttribute("data-theme") === "dark";
        const newTheme = currentlyDark ? "light" : "dark";

        // Apply theme visually with transitions disabled for instant switch
        root.classList.add("no-transitions");

        root.classList.toggle("dark", newTheme === "dark");
        root.classList.toggle("light", newTheme !== "dark");
        root.setAttribute("data-theme", newTheme);

        // Update all button classes on the page
        document.querySelectorAll(".theme-switch-btn").forEach(b => {
          b.classList.toggle("is-dark", newTheme === "dark");
          b.classList.toggle("is-light", newTheme !== "dark");
        });

        // Force reflow to apply style changes instantly without animation
        window.getComputedStyle(root).opacity;

        requestAnimationFrame(() => {
          root.classList.remove("no-transitions");
        });

        // Save to localStorage
        try {
          localStorage.setItem("theme", newTheme);
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("theme:")) {
              localStorage.setItem(key, newTheme);
            }
          }
        } catch (e) {
          console.error("localStorage error:", e);
        }

        // Sync settings page radio buttons if user is on settings page
        syncSettingsPageUI(newTheme);

        // Send AJAX request to save to server
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";
        fetch("/settings/update-theme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken
          },
          body: JSON.stringify({ theme: newTheme })
        })
          .then(r => r.json())
          .then(data => {
            if (!data.success) {
              console.error("Failed to save theme setting on server:", data.message);
            }
          })
          .catch(err => console.error("Error saving theme:", err));
      });
    });
  }

  function syncSettingsPageUI(theme) {
    const lightRadio = document.getElementById("theme-light");
    const darkRadio = document.getElementById("theme-dark");
    const autoRadio = document.getElementById("theme-auto");

    if (lightRadio && darkRadio) {
      if (theme === "light") {
        lightRadio.checked = true;
      } else if (theme === "dark") {
        darkRadio.checked = true;
      } else if (theme === "auto" && autoRadio) {
        autoRadio.checked = true;
      }
    }
  }

  // Event delegation to watch theme settings radios changes on Settings page
  document.addEventListener("change", function (e) {
    const target = e.target;
    if (target.name === "theme" && (target.id === "theme-light" || target.id === "theme-dark" || target.id === "theme-auto")) {
      const themeVal = target.value; // 'light', 'dark', or 'auto'

      // Determine resolved theme (for 'auto' theme)
      let resolvedTheme = themeVal;
      if (themeVal === "auto") {
        try {
          resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } catch (err) {
          resolvedTheme = "light";
        }
      }

      // Update header button class if it exists
      const headerBtn = document.querySelector("#headerThemeToggle .theme-switch-btn");
      if (headerBtn) {
        headerBtn.classList.toggle("is-dark", resolvedTheme === "dark");
        headerBtn.classList.toggle("is-light", resolvedTheme !== "dark");
      }

      // Apply theme visually with transitions disabled for instant switch
      root.classList.add("no-transitions");

      root.classList.toggle("dark", resolvedTheme === "dark");
      root.classList.toggle("light", resolvedTheme !== "dark");
      root.setAttribute("data-theme", resolvedTheme);

      // Force reflow
      window.getComputedStyle(root).opacity;

      requestAnimationFrame(() => {
        root.classList.remove("no-transitions");
      });

      // Save to localStorage
      try {
        localStorage.setItem("theme", themeVal);
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("theme:")) {
            localStorage.setItem(key, themeVal);
          }
        }
      } catch (err) { }
    }
  });

  // Initial call to inject theme toggle on load
  injectThemeToggle();

  let lastLoadedPathname = window.location.pathname;
  let lastLoadedSearch = window.location.search;

  let currentMainDiv = document.querySelector("#contentArea") || document.querySelector("#content-area") || document.querySelector("main > div.col-span-1");
  let currentPjaxContainer = currentMainDiv;

  // Initialize desktop sidebar state from localStorage
  if (!isMobile()) {
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
    const menuToggle = document.getElementById("menuToggle");
    if (isCollapsed) {
      root.classList.add("sidebar-collapsed");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    }
  }

  // Auto-inject hamburger toggle button into navbar if sidebar exists but no #menuToggle
  (function injectMenuToggle() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return; // No sidebar on this page

    if (document.getElementById("menuToggle")) return; // Already exists

    // Find the left side of the navbar (div containing the logo)
    const nav = document.querySelector("nav");
    if (!nav) return;

    // Find first div inside the flex-row div of nav (the logo container)
    const navInner = nav.querySelector("div.flex.items-center.justify-between, div.flex.justify-between");
    const logoContainer = navInner
      ? navInner.querySelector("div:first-child")
      : nav.querySelector("div > div:first-child");

    if (!logoContainer) return;

    const btn = document.createElement("button");
    btn.id = "menuToggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle sidebar");
    btn.setAttribute("aria-expanded", "false");
    btn.className = [
      "inline-flex items-center justify-center",
      "w-9 h-9 rounded-lg",
      "text-on-surface-variant dark:text-slate-400",
      "hover:bg-slate-100 dark:hover:bg-slate-800",
      "hover:text-primary dark:hover:text-blue-400",
      "transition-colors focus:outline-none",
      "mr-1"
    ].join(" ");
    btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:22px">menu</span>';

    // Insert before the logo link (as first child of logo container)
    logoContainer.insertBefore(btn, logoContainer.firstChild);
  })();

  // Helper functions for sidebar open/close
  function openSidebarMobile() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const menuToggle = document.getElementById("menuToggle");
    if (sidebar) sidebar.classList.add("active");
    if (overlay) overlay.classList.add("active");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebarMobile() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const menuToggle = document.getElementById("menuToggle");
    if (sidebar) sidebar.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const overlay = document.getElementById("sidebarOverlay");

    if (isMobile()) {
      if (sidebar && sidebar.classList.contains("active")) {
        closeSidebarMobile();
      } else {
        openSidebarMobile();
      }
    } else {
      // Desktop collapse toggle
      const collapsed = root.classList.toggle("sidebar-collapsed");
      localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", collapsed ? "true" : "false");
    }
  }

  // --- Event Delegation for Dynamic Elements (Click Listener) ---
  document.addEventListener("click", function (e) {
    // 1. Menu Toggle Button
    const menuToggle = e.target.closest("#menuToggle");
    if (menuToggle) {
      e.stopPropagation();
      toggleSidebar();
      return;
    }

    // 2. Sidebar Overlay (Mobile Close)
    const overlay = e.target.closest("#sidebarOverlay");
    if (overlay) {
      if (isMobile()) {
        closeSidebarMobile();
      }
      return;
    }

    // 3. Avatar Dropdown Click Wrapper
    const avatarWrapper = e.target.closest(".avatar-wrapper");
    if (avatarWrapper) {
      if (e.target.closest(".avatar-dropdown-menu")) return;
      e.preventDefault();
      e.stopPropagation();
      const dropdownMenu = avatarWrapper.querySelector(".avatar-dropdown-menu");
      if (dropdownMenu) {
        document.querySelectorAll(".avatar-dropdown-menu").forEach(function (m) {
          if (m !== dropdownMenu) m.classList.add("hidden");
        });
        dropdownMenu.classList.toggle("hidden");
      }
      return;
    }

    // Close avatar dropdown when clicking outside
    document.querySelectorAll(".avatar-dropdown-menu").forEach(function (menu) {
      const wrapper = menu.closest(".avatar-wrapper");
      if (wrapper && !wrapper.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });

    // Close sidebar when clicking outside on mobile
    const sidebar = document.getElementById("sidebar");
    if (sidebar && isMobile() && sidebar.classList.contains("active")) {
      const isClickInsideSidebar = sidebar.contains(e.target);
      const isClickOnToggle = menuToggle && menuToggle.contains(e.target);
      if (!isClickInsideSidebar && !isClickOnToggle) {
        closeSidebarMobile();
      }
    }

    // 3.8. Click to View Avatar Lightbox
    const avatarImg = e.target.closest("#profileAvatar, .user-avatar-img");
    if (avatarImg && !e.target.closest("#changeAvatarBtn") && !e.target.closest(".avatar-dropdown-menu")) {
      e.preventDefault();
      e.stopPropagation();
      showAvatarLightbox(avatarImg.src);
      return;
    }
  });

  // Global Keydown Listeners (Escape key handler)
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (isMobile()) {
        closeSidebarMobile();
      }
      document.querySelectorAll(".avatar-dropdown-menu").forEach(function (m) {
        m.classList.add("hidden");
      });
    }
  });

  // Handle window resize gracefully
  window.addEventListener("resize", function () {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const overlay = document.getElementById("sidebarOverlay");
    if (!sidebar || !menuToggle) return;

    if (!isMobile()) {
      // Clear mobile active classes if resized to desktop
      sidebar.classList.remove("active");
      if (overlay) overlay.classList.remove("active");

      // Re-apply desktop preference
      const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
      if (isCollapsed) {
        root.classList.add("sidebar-collapsed");
        menuToggle.setAttribute("aria-expanded", "true");
      } else {
        root.classList.remove("sidebar-collapsed");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    } else {
      root.classList.remove("sidebar-collapsed");
      menuToggle.setAttribute("aria-expanded", sidebar.classList.contains("active") ? "true" : "false");
    }
  });

  // --- PJAX (PushState + AJAX) Router for Smooth Page Navigation ---
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // Skip special navigation elements
    if (href.startsWith("#") || href.startsWith("javascript:") || href.includes("logout") || link.target === "_blank") {
      return;
    }

    const absoluteUrl = link.href;
    const isInternal = absoluteUrl.startsWith(window.location.origin);
    if (!isInternal) return;

    // Check if path uses the sidebar dashboard template layout
    const relativePath = absoluteUrl.replace(window.location.origin, "");
    const isPjaxRoute = relativePath === "/" ||
      relativePath.startsWith("/dashboard") ||
      relativePath.startsWith("/history") ||
      relativePath.startsWith("/statistics") ||
      relativePath.startsWith("/settings") ||
      relativePath.startsWith("/users") ||
      relativePath.startsWith("/confirmations") ||
      relativePath.startsWith("/predict") ||
      relativePath.startsWith("/checkout") ||
      relativePath.startsWith("/upgrade") ||
      relativePath.startsWith("/payments");

    if (isPjaxRoute && currentPjaxContainer) {
      e.preventDefault();
      loadPagePjax(absoluteUrl);
    }
  });

  // Intercept GET form submissions (like search queries)
  document.addEventListener("submit", function (e) {
    const form = e.target;
    if (form.method.toLowerCase() !== "get") return;

    const action = form.getAttribute("action");
    if (!action) return;

    const absoluteUrl = new URL(action, window.location.origin).href;
    const isInternal = absoluteUrl.startsWith(window.location.origin);
    if (!isInternal) return;

    // Build the query string
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        params.append(key, value);
      }
    }

    const urlWithParams = absoluteUrl + (absoluteUrl.includes("?") ? "&" : "?") + params.toString();
    e.preventDefault();
    loadPagePjax(urlWithParams);
  });

  // Handle browser back and forward navigation
  window.addEventListener("popstate", function () {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.pathname === lastLoadedPathname && currentUrl.search === lastLoadedSearch) {
      // Just a hash change (or no change), do not run PJAX page load
      return;
    }
    loadPagePjax(window.location.href, true);
  });

  // Normalize a script src URL for comparison (strips version/path differences for same lib)
  function normalizeScriptUrl(src) {
    try {
      const url = new URL(src);
      if (url.origin === window.location.origin) {
        return url.pathname;
      }
      // For CDN scripts, compare only hostname + first path segment (library name)
      const parts = url.pathname.split("/").filter(Boolean);
      return url.hostname + "/" + (parts[0] || "");
    } catch {
      return src;
    }
  }

  function loadPagePjax(url, isPopState = false, htmlContent = null) {
    const handleHtml = (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Capture inline scripts before updateDOM removes them from doc.body
      const inlineScripts = doc.body ? Array.from(doc.body.querySelectorAll("script:not([src])")) : [];

      if (!isPopState) {
        history.pushState(null, "", url);
      }

      try {
        const parsedUrl = new URL(url, window.location.origin);
        lastLoadedPathname = parsedUrl.pathname;
        lastLoadedSearch = parsedUrl.search;
      } catch (e) {
        console.error("[PJAX] Error updating lastLoadedPathname/Search:", e);
      }

      const newMainDiv = doc.querySelector("#contentArea") || doc.querySelector("#content-area") || doc.querySelector("main > div.col-span-1");
      if (!newMainDiv) {
        window.location.href = url;
        return;
      }
      const newSidebar = doc.querySelector(".sidebar");
      const newNav = doc.querySelector("body > nav");
      const newModal = doc.querySelector("#confirmModal");
      const newDetailModal = doc.querySelector("#detailModal");
      const newGradcamModal = doc.querySelector("#gradcamDetailModal");
      const newWatchAdModal = doc.querySelector("#watchAdModal");
      const newToastStack = doc.querySelector(".toast-stack");
      const newMetaCsrf = doc.querySelector('meta[name="csrf-token"]');

      const updateDOM = () => {

        // Clean up settings page event listeners to prevent leaks and scroll spy overlap on other pages
        if (window._settingsCleanupListeners) {
          try {
            window._settingsCleanupListeners();
            window._settingsCleanupListeners = null;
          } catch (e) {
            console.error("Error during settings cleanup:", e);
          }
        }

        // 0. Pre-translate new elements BEFORE inserting into live DOM
        //    This prevents Vietnamese→English flash when user is in English mode
        if (window.PetAI_i18n && window.PetAI_i18n.applyToElement) {
          const lang = window.PetAI_i18n.getCurrentLang();
          if (lang && lang !== "vi") {
            if (newMainDiv) window.PetAI_i18n.applyToElement(newMainDiv, lang);
            if (newSidebar) window.PetAI_i18n.applyToElement(newSidebar, lang);
            if (newNav) window.PetAI_i18n.applyToElement(newNav, lang);
          }
        }

        // 1. Update Title
        document.title = doc.title;

        // 2. Update Main Content Container
        if (currentMainDiv && newMainDiv) {
          currentMainDiv.parentNode.replaceChild(newMainDiv, currentMainDiv);
          currentMainDiv = newMainDiv;
          currentPjaxContainer = newMainDiv;
        }

        // 3. Update Sidebar (active state highlight & selective replacement to prevent flicker)
        const currentSidebar = document.getElementById("sidebar");
        if (currentSidebar && newSidebar) {
          const isCurrentSettings = !!currentSidebar.querySelector('.sidebar-menu a[href^="#"]');
          const isNewSettings = !!newSidebar.querySelector('.sidebar-menu a[href^="#"]');

          if (isCurrentSettings !== isNewSettings) {
            // Structural layout changed (Settings vs Normal pages) -> Replace entire sidebar
            currentSidebar.parentNode.replaceChild(newSidebar, currentSidebar);
          } else {
            // Layout is identical -> Just sync active classes directly from newly fetched HTML to prevent any path matching collisions/flicker
            currentSidebar.querySelectorAll('.sidebar-menu a').forEach(link => {
              const href = link.getAttribute('href');
              if (href) {
                const newLink = newSidebar.querySelector(`.sidebar-menu a[href="${href}"]`);
                if (newLink) {
                  link.classList.toggle('active', newLink.classList.contains('active'));
                }
              }
            });

            // Dynamically sync user card inside sidebar
            const newAvatar = newSidebar.querySelector('.user-avatar-img');
            const currentAvatar = currentSidebar.querySelector('.user-avatar-img');
            if (newAvatar && currentAvatar && currentAvatar.src !== newAvatar.src) {
              currentAvatar.src = newAvatar.src;
            }

            const newName = newSidebar.querySelector('.user-name');
            const currentName = currentSidebar.querySelector('.user-name');
            if (newName && currentName && currentName.textContent !== newName.textContent) {
              currentName.textContent = newName.textContent;
            }

            const newRole = newSidebar.querySelector('.user-role');
            const currentRole = currentSidebar.querySelector('.user-role');
            if (newRole && currentRole && currentRole.textContent !== newRole.textContent) {
              currentRole.textContent = newRole.textContent;
            }
          }
        }

        // 4. Update Header Navbar (Sync theme switcher state dynamically, DO NOT replace DOM to prevent layout shifts)
        const currentNav = document.querySelector("body > nav");
        if (currentNav && newNav) {
          // Sync user avatar in header if it changed
          const newHeaderAvatar = newNav.querySelector('.user-avatar-img, #profileAvatar');
          const currentHeaderAvatar = currentNav.querySelector('.user-avatar-img, #profileAvatar');
          if (newHeaderAvatar && currentHeaderAvatar && currentHeaderAvatar.src !== newHeaderAvatar.src) {
            currentHeaderAvatar.src = newHeaderAvatar.src;
          }

          // Sync theme switcher buttons class to keep switches accurate without rebuilding element
          const newThemeBtn = newNav.querySelector('.theme-switch-btn');
          const currentThemeBtn = currentNav.querySelector('.theme-switch-btn');
          if (newThemeBtn && currentThemeBtn) {
            currentThemeBtn.className = newThemeBtn.className;
          }
        }
        injectThemeToggle();

        // 4.5 Update Page-Specific Style Blocks in Head (preventing layout flash)
        const oldPjaxStyles = Array.from(document.querySelectorAll("head style.pjax-style"));
        doc.querySelectorAll("head style").forEach(styleEl => {
          const copy = styleEl.cloneNode(true);
          copy.classList.add("pjax-style");
          document.head.appendChild(copy);
        });
        oldPjaxStyles.forEach(el => el.remove());

        // 4.55 Update CSRF token meta tag if present
        const currentMetaCsrf = document.querySelector('meta[name="csrf-token"]');
        if (newMetaCsrf) {
          if (currentMetaCsrf) {
            currentMetaCsrf.setAttribute("content", newMetaCsrf.getAttribute("content"));
          } else {
            const meta = document.createElement("meta");
            meta.name = "csrf-token";
            meta.content = newMetaCsrf.getAttribute("content");
            document.head.appendChild(meta);
          }
        }

        // 4.6 Update confirmModal if present
        const currentModal = document.getElementById("confirmModal");
        if (currentModal && newModal) {
          currentModal.parentNode.replaceChild(newModal, currentModal);
        } else if (newModal) {
          document.body.appendChild(newModal);
        } else if (currentModal) {
          currentModal.remove();
        }

        // 4.65 Update detailModal if present
        const currentDetailModal = document.getElementById("detailModal");
        if (currentDetailModal && newDetailModal) {
          currentDetailModal.parentNode.replaceChild(newDetailModal, currentDetailModal);
        } else if (newDetailModal) {
          document.body.appendChild(newDetailModal);
        } else if (currentDetailModal) {
          currentDetailModal.remove();
        }

        // 4.66 Update watchAdModal if present
        const currentWatchAdModal = document.getElementById("watchAdModal");
        if (currentWatchAdModal && newWatchAdModal) {
          currentWatchAdModal.parentNode.replaceChild(newWatchAdModal, currentWatchAdModal);
        } else if (newWatchAdModal) {
          document.body.appendChild(newWatchAdModal);
        } else if (currentWatchAdModal) {
          currentWatchAdModal.remove();
        }

        // 4.68 Update gradcamDetailModal if present
        const currentGradcamModal = document.getElementById("gradcamDetailModal");
        if (currentGradcamModal && newGradcamModal) {
          currentGradcamModal.parentNode.replaceChild(newGradcamModal, currentGradcamModal);
        } else if (newGradcamModal) {
          document.body.appendChild(newGradcamModal);
        } else if (currentGradcamModal) {
          currentGradcamModal.remove();
        }

        // 4.67 Sync body dataset attributes
        if (doc.body) {
          for (const key in document.body.dataset) {
            delete document.body.dataset[key];
          }
          for (const key in doc.body.dataset) {
            document.body.dataset[key] = doc.body.dataset[key];
          }
        }

        // 4.7 Handle any new toasts from the parsed document
        if (newToastStack && typeof window.showToast === "function") {
          const newToasts = newToastStack.querySelectorAll(".toast");
          newToasts.forEach(toast => {
            const typeClass = Array.from(toast.classList).find(c => c.startsWith("toast--"));
            const type = typeClass ? typeClass.replace("toast--", "") : "info";
            const messageEl = toast.querySelector(".toast__message");
            const message = messageEl ? messageEl.textContent.trim() : "";
            if (message) {
              window.showToast(type, message);
            }
          });
        }
      };

      const postUpdate = () => {
        // Destroy any existing Chart.js instances to prevent "Canvas is already in use" errors
        if (typeof Chart !== "undefined" && Chart.instances) {
          // Chart.js v3/v4: Chart.instances is an object keyed by chart id
          Object.values(Chart.instances).forEach(chart => {
            try { chart.destroy(); } catch (e) { /* ignore */ }
          });
        }

        // 5. Dynamic Script Execution with DOMContentLoaded listener override
        const originalAddEventListener = document.addEventListener;
        const originalWindowAddEventListener = window.addEventListener;

        document.addEventListener = function (type, listener, options) {
          if (type === "DOMContentLoaded") {
            try { listener(); } catch (err) {
              console.error("Error in DOMContentLoaded listener:", err);
            }
          } else {
            originalAddEventListener.call(document, type, listener, options);
          }
        };

        window.addEventListener = function (type, listener, options) {
          if (type === "load") {
            try { listener(); } catch (err) {
              console.error("Error in load listener:", err);
            }
          } else {
            originalWindowAddEventListener.call(window, type, listener, options);
          }
        };

        // Run all captured inline scripts sequentially
        inlineScripts.forEach(oldScript => {
          // Skip preload scripts that would re-hide the body or re-init sidebar
          if (oldScript.textContent.includes("sidebar-collapsed") && oldScript.textContent.includes("preload")) {
            return;
          }
          if (oldScript.textContent.includes("i18n-loading")) {
            return;
          }
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
          newScript.remove(); // Clean up dynamic script elements immediately after execution to prevent DOM cluttering
        });

        // Restore global event listeners
        document.addEventListener = originalAddEventListener;
        window.addEventListener = originalWindowAddEventListener;

        // 6. Update Language translations if i18n switcher is present
        if (window.PetAI_i18n) {
          window.PetAI_i18n.setLanguage(window.PetAI_i18n.getCurrentLang());
        }

        // 7. Reset aria-expanded correctly
        const menuToggle = document.getElementById("menuToggle");
        if (menuToggle) {
          const isCollapsed = root.classList.contains("sidebar-collapsed");
          menuToggle.setAttribute("aria-expanded", isCollapsed ? "true" : "false");
        } else if (document.getElementById("sidebar")) {
          // Re-inject hamburger toggle if missing after PJAX navigation
          const nav = document.querySelector("nav");
          if (nav) {
            const navInner = nav.querySelector("div.flex.items-center.justify-between, div.flex.justify-between");
            const logoContainer = navInner ? navInner.querySelector("div:first-child") : nav.querySelector("div > div:first-child");
            if (logoContainer && !logoContainer.querySelector("#menuToggle")) {
              const btn = document.createElement("button");
              btn.id = "menuToggle";
              btn.type = "button";
              btn.setAttribute("aria-label", "Toggle sidebar");
              const isCollapsed = root.classList.contains("sidebar-collapsed");
              btn.setAttribute("aria-expanded", isCollapsed ? "true" : "false");
              btn.className = "inline-flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-blue-400 transition-colors focus:outline-none mr-1";
              btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:22px">menu</span>';
              logoContainer.insertBefore(btn, logoContainer.firstChild);
            }
          }
        }

        // 8. Clear loading state
        document.documentElement.classList.remove("pjax-loading");
        document.documentElement.classList.remove("i18n-loading");

        setTimeout(function () {
          if (!document.documentElement.classList.contains("ready")) {
            document.documentElement.classList.add("ready");
          }
        }, 150);

        // 9. Force Tailwind to scan the DOM for new classes asynchronously
        if (window.tailwind && typeof window.tailwind.process === "function") {
          setTimeout(function () {
            try {
              window.tailwind.process();
            } catch (e) {
              console.error("Tailwind process failed:", e);
            }
          }, 0);
        }
      };

      // Load any external scripts from the incoming <head> that are not yet present,
      // using normalized URL comparison to avoid loading the same library twice
      function loadMissingHeadResources(newDoc, callback) {
        const existingNormalized = Array.from(document.head.querySelectorAll("script[src]"))
          .map(s => normalizeScriptUrl(s.src));

        const missingHeadScripts = [];
        newDoc.head.querySelectorAll("script[src]").forEach(script => {
          const norm = normalizeScriptUrl(script.src);
          if (!existingNormalized.includes(norm)) {
            missingHeadScripts.push(script);
            existingNormalized.push(norm); // prevent duplicates within this batch
          }
        });

        // Merge missing <link> stylesheets
        const currentHeadLinks = Array.from(document.head.querySelectorAll("link")).map(l => l.href);
        newDoc.head.querySelectorAll("link").forEach(link => {
          if (!currentHeadLinks.includes(link.href)) {
            const newLink = document.createElement("link");
            Array.from(link.attributes).forEach(attr => {
              newLink.setAttribute(attr.name, attr.value);
            });
            document.head.appendChild(newLink);
          }
        });

        if (missingHeadScripts.length === 0) {
          callback();
          return;
        }

        // Load missing scripts sequentially to preserve dependency order
        let idx = 0;
        function loadNext() {
          if (idx >= missingHeadScripts.length) {
            callback();
            return;
          }
          const script = missingHeadScripts[idx++];
          const newScript = document.createElement("script");
          Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.onload = loadNext;
          newScript.onerror = loadNext; // continue even on error
          document.head.appendChild(newScript);
        }
        loadNext();
      }

      updateDOM();
      loadMissingHeadResources(doc, postUpdate);
    };

    if (htmlContent) {
      handleHtml(htmlContent);
      return;
    }

    fetch(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      },
      cache: "no-cache"
    })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })
      .then(html => {
        handleHtml(html);
      })
      .catch(error => {
        console.error("[PJAX Load Debug] fetch error caught:", error);
        console.error("PJAX navigation failed, falling back to standard redirect:", error);
        window.location.href = url;
      });
  }

  function showAvatarLightbox(src, downloadName = "avatar.png") {
    let lightbox = document.getElementById("avatarLightbox");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.id = "avatarLightbox";
      lightbox.className = "fixed inset-0 z-[2000] hidden items-center justify-center bg-slate-955/85 backdrop-blur-sm p-4 transition-all duration-300 opacity-0";
      lightbox.style.backgroundColor = "rgba(2, 6, 23, 0.85)"; // slate-950 with 85% opacity
      lightbox.innerHTML = `
        <!-- Close Button (Screen-level top-right) -->
        <button type="button" id="closeLightboxBtn" class="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md z-[2010]">
          <span class="material-symbols-outlined text-[24px]">close</span>
        </button>
        
        <div class="relative max-w-full max-h-full flex flex-col items-center gap-4 animate-scale-up">
          <!-- Lightbox Image Wrapper -->
          <div class="w-[85vw] h-[85vw] sm:w-[75vw] sm:h-[75vw] md:w-[600px] md:h-[600px] relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 p-0 flex items-center justify-center">
            <img id="lightboxImage" class="w-full h-full object-cover transition-transform duration-300" src="" alt="Image">
          </div>
          <!-- Actions (Download) -->
          <div class="flex items-center gap-3 mt-2">
            <a id="downloadAvatarBtn" href="" download="avatar.png" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">download</span>
              <span data-i18n="downloadAvatar">Tải xuống</span>
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(lightbox);

      // Event listeners
      const closeBtn = lightbox.querySelector("#closeLightboxBtn");
      closeBtn.addEventListener("click", hideLightbox);
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) hideLightbox();
      });
    }

    const img = lightbox.querySelector("#lightboxImage");
    const downloadBtn = lightbox.querySelector("#downloadAvatarBtn");

    img.src = src;
    downloadBtn.href = src;
    downloadBtn.download = downloadName;

    // Translate "Download" text if i18n is available
    if (window.PetAI_i18n) {
      window.PetAI_i18n.applyToElement(lightbox, window.PetAI_i18n.getCurrentLang());
    }

    // Show with animation
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    // Trigger reflow
    lightbox.offsetHeight;
    lightbox.classList.remove("opacity-0");
    lightbox.classList.add("opacity-100");

    function hideLightbox() {
      lightbox.classList.remove("opacity-100");
      lightbox.classList.add("opacity-0");
      setTimeout(() => {
        lightbox.classList.remove("flex");
        lightbox.classList.add("hidden");
      }, 200);
    }

    // Close on Escape key
    const escHandler = function (e) {
      if (e.key === "Escape") {
        hideLightbox();
        window.removeEventListener("keydown", escHandler);
      }
    };
    window.addEventListener("keydown", escHandler);
  }

  window.showAvatarLightbox = showAvatarLightbox;
  window.loadPagePjax = loadPagePjax;
});
