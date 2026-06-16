// script.js - Responsive collapsible sidebar toggle logic
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const root = document.documentElement;

  if (menuToggle && sidebar) {
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
  }

  // --- Language Switcher Logic ---
  const languageSwitcher = document.getElementById("languageSwitcher");
  const languageButton = document.getElementById("languageButton");
  const languageMenu = document.getElementById("languageMenu");
  const languageCurrent = document.querySelector(".language-current");
  const languageOptions = document.querySelectorAll(".language-option");

  if (languageSwitcher && languageButton && languageMenu && languageCurrent) {
    const translations = {
      vi: {
        languageLabel: "Tiếng Việt",
        languageFlag: "🇻🇳",
        shortLabel: "VN",
        home: "Trang chủ",
        privacy: "Chính sách quyền riêng tư",
        terms: "Điều khoản sử dụng",
        dataDeletion: "Chính sách xóa dữ liệu",
        support: "Hỗ trợ",
        contact: "Liên hệ",
        dashboard: "Bảng điều khiển",
        history: "Lịch sử",
        statistics: "Thống kê",
        upgrade: "Nâng cấp",
        payments: "Lịch sử thanh toán",
        manageUsers: "Quản lý người dùng",
        approveOrders: "Duyệt đơn",
        predict: "Nhận diện",
        logout: "Đăng xuất",
        login: "Đăng nhập",
        register: "Đăng ký",
        quickAccess: "Truy cập nhanh",
        uploadAnalyze: "Tải ảnh & Phân tích",
        predictionHistory: "Lịch sử dự đoán",
        personalStats: "Thống kê cá nhân",
        upgradePlan: "Nâng cấp gói",
        accountSettings: "Cài đặt tài khoản",
        aboutPetAI: "Về PetAI",
        connect: "Kết nối",
        identifyNow: "Nhận diện ngay",
        collection: "Bộ sưu tập",
        copyright: "Bản quyền © 2026 PetAI. Mọi quyền được bảo lưu",
        footerTerms: "ĐIỀU KHOẢN",
        footerPrivacy: "BẢO MẬT",
        product: "Sản phẩm",
        features: "Tính năng",
        pricing: "Bảng giá",
        about: "Giới thiệu"
      },
      en: {
        languageLabel: "English",
        languageFlag: "🇺🇸",
        shortLabel: "US",
        home: "Home",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        dataDeletion: "Data Deletion Policy",
        support: "Support",
        contact: "Contact",
        dashboard: "Dashboard",
        history: "History",
        statistics: "Statistics",
        upgrade: "Upgrade",
        payments: "Payment History",
        manageUsers: "Manage Users",
        approveOrders: "Approve Orders",
        predict: "Predict",
        logout: "Logout",
        login: "Login",
        register: "Register",
        quickAccess: "Quick Access",
        uploadAnalyze: "Upload & Analyze",
        predictionHistory: "Prediction History",
        personalStats: "Personal Statistics",
        upgradePlan: "Upgrade Plan",
        accountSettings: "Account Settings",
        aboutPetAI: "About PetAI",
        connect: "Connect",
        identifyNow: "Identify Now",
        collection: "Collection",
        copyright: "Copyright © 2026 PetAI. All rights reserved",
        footerTerms: "TERMS",
        footerPrivacy: "PRIVACY",
        product: "Product",
        features: "Features",
        pricing: "Pricing",
        about: "About"
      }
    };

    function openLanguageMenu() {
      languageSwitcher.classList.add("open");
      languageButton.setAttribute("aria-expanded", "true");
    }

    function closeLanguageMenu() {
      languageSwitcher.classList.remove("open");
      languageButton.setAttribute("aria-expanded", "false");
    }

    function toggleLanguageMenu() {
      if (languageSwitcher.classList.contains("open")) {
        closeLanguageMenu();
      } else {
        openLanguageMenu();
      }
    }

    function setLanguage(lang) {
      localStorage.setItem("siteLanguage", lang);

      languageCurrent.textContent = translations[lang].shortLabel;
      const flagEl = languageButton.querySelector(".language-flag");
      if (flagEl) {
        flagEl.textContent = translations[lang].languageFlag;
      }

      languageOptions.forEach((option) => {
        const isActive = option.dataset.lang === lang;
        option.classList.toggle("active", isActive);
        const checkEl = option.querySelector(".language-check");
        if (checkEl) {
          checkEl.textContent = isActive ? "✓" : "";
        }
      });

      document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang][key]) {
          element.textContent = translations[lang][key];
        }
      });

      closeLanguageMenu();
    }

    languageButton.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleLanguageMenu();
    });

    languageOptions.forEach((option) => {
      option.addEventListener("click", function () {
        setLanguage(option.dataset.lang);
      });
    });

    document.addEventListener("click", function (event) {
      if (!languageSwitcher.contains(event.target)) {
        closeLanguageMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLanguageMenu();
      }
    });

    const savedLanguage = localStorage.getItem("siteLanguage") || "vi";
    setLanguage(savedLanguage);
  }
});
