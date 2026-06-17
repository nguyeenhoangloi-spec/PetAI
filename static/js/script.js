// script.js - Responsive collapsible sidebar toggle logic
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const root = document.documentElement;

  if (!menuToggle || !sidebar) return;

  const isMobile = () => window.innerWidth < 768;

  // Initialize desktop sidebar state from localStorage
  if (!isMobile()) {
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
    if (isCollapsed) {
      root.classList.add("sidebar-collapsed");
      menuToggle.setAttribute("aria-expanded", "true");
    }
  }

  function openSidebarMobile() {
    sidebar.classList.add("active");
    if (overlay) overlay.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebarMobile() {
    sidebar.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function toggleSidebar() {
    if (isMobile()) {
      if (sidebar.classList.contains("active")) {
        closeSidebarMobile();
      } else {
        openSidebarMobile();
      }
    } else {
      // Desktop collapse toggle
      const collapsed = root.classList.toggle("sidebar-collapsed");
      localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false");
      menuToggle.setAttribute("aria-expanded", collapsed ? "true" : "false");
    }
  }

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSidebar();
  });

  if (overlay) {
    overlay.addEventListener("click", function () {
      if (isMobile()) {
        closeSidebarMobile();
      }
    });
  }

  // Close when clicking outside sidebar on mobile
  document.addEventListener("click", function (event) {
    if (isMobile() && sidebar.classList.contains("active")) {
      if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        closeSidebarMobile();
      }
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (isMobile()) {
        closeSidebarMobile();
      }
    }
  });

  // Handle window resize gracefully
  window.addEventListener("resize", function () {
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

  // --- Language Switcher Logic ---
  // Fully handled by i18n.js (PetAI_i18n) via event delegation.
  // No hardcoded translations here — see static/js/i18n.js.

  // --- Avatar Dropdown Click Toggle ---
  document.querySelectorAll(".avatar-wrapper").forEach(function (wrapper) {
    var dropdownMenu = wrapper.querySelector(".avatar-dropdown-menu");
    if (!dropdownMenu) return;

    wrapper.style.cursor = "pointer";

    wrapper.addEventListener("click", function (e) {
      if (e.target.closest(".avatar-dropdown-menu")) return;
      e.preventDefault();
      e.stopPropagation();
      // Close all other avatar dropdowns first
      document.querySelectorAll(".avatar-dropdown-menu").forEach(function (m) {
        if (m !== dropdownMenu) m.classList.add("hidden");
      });
      dropdownMenu.classList.toggle("hidden");
    });
  });

  // Close avatar dropdown when clicking outside
  document.addEventListener("click", function (event) {
    document.querySelectorAll(".avatar-wrapper").forEach(function (wrapper) {
      if (!wrapper.contains(event.target)) {
        var menu = wrapper.querySelector(".avatar-dropdown-menu");
        if (menu) menu.classList.add("hidden");
      }
    });
  });

  // Close avatar dropdown on Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      document.querySelectorAll(".avatar-dropdown-menu").forEach(function (m) {
        m.classList.add("hidden");
      });
    }
  });
});
