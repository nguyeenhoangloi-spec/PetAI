// script.js - Responsive collapsible sidebar toggle logic & PJAX Router
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const isMobile = () => window.innerWidth < 768;

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

    if (isPjaxRoute) {
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

  function loadPagePjax(url, isPopState = false) {
    // Show a subtle loading state while fetching (CSS-driven, no flicker)
    document.documentElement.classList.add("pjax-loading");

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        if (!isPopState) {
          history.pushState(null, "", url);
        }

        const newMainDiv = doc.querySelector("main > div.col-span-1");
        const newSidebar = doc.querySelector(".sidebar");
        const newNav = doc.querySelector("body > nav");
        const newModal = doc.querySelector("#confirmModal");
        const newDetailModal = doc.querySelector("#detailModal");
        const newToastStack = doc.querySelector(".toast-stack");
        const newMetaCsrf = doc.querySelector('meta[name="csrf-token"]');

        const updateDOM = () => {
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
          const currentMainDiv = document.querySelector("main > div.col-span-1");
          if (currentMainDiv && newMainDiv) {
            currentMainDiv.parentNode.replaceChild(newMainDiv, currentMainDiv);
          }

          // 3. Update Sidebar (active state highlight)
          const currentSidebar = document.getElementById("sidebar");
          if (currentSidebar && newSidebar) {
            currentSidebar.parentNode.replaceChild(newSidebar, currentSidebar);
          }

          // 4. Update Header Navbar (for account status indicators)
          const currentNav = document.querySelector("body > nav");
          if (currentNav && newNav) {
            currentNav.parentNode.replaceChild(newNav, currentNav);
          }

          // 4.5 Update Page-Specific Style Blocks in Head
          document.querySelectorAll("head style.pjax-style").forEach(el => el.remove());
          doc.querySelectorAll("head style").forEach(styleEl => {
            const copy = styleEl.cloneNode(true);
            copy.classList.add("pjax-style");
            document.head.appendChild(copy);
          });

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

          // Run all inline scripts from the fetched document sequentially
          const inlineScripts = Array.from(doc.querySelectorAll("script:not([src])"));
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
          document.documentElement.classList.remove("preload");
          if (!document.documentElement.classList.contains("ready")) {
            document.documentElement.classList.add("ready");
          }

          // 9. Force Tailwind to recompile the DOM to apply styles to new elements
          if (window.tailwind) {
            try {
              tailwind.config = { ...tailwind.config };
            } catch (e) {
              console.error("Tailwind play CDN config update failed:", e);
            }
          }
        };

        // Load any external scripts from the incoming <head> that are not yet present,
        // using normalized URL comparison to avoid loading the same library twice
        // (e.g. chart.js vs chart.js@4.4.3 are treated as same library).
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

        // CRITICAL FIX: Run DOM swap and resource loading/script execution inside startViewTransition
        // to ensure that Tailwind compiles and updates style sheets before the browser snapshots the new state.
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            updateDOM();
            loadMissingHeadResources(doc, postUpdate);
          });
        } else {
          updateDOM();
          loadMissingHeadResources(doc, postUpdate);
        }
      })
      .catch(error => {
        console.error("PJAX navigation failed, falling back to standard redirect:", error);
        window.location.href = url;
      });
  }
});
