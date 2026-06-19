(function () {
  const DEFAULT_TIMEOUT = 3500;
  const iconMap = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
  };

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function normalizeType(type) {
    const value = String(type || "").toLowerCase();
    if (
      value === "success" ||
      value === "error" ||
      value === "warning" ||
      value === "info"
    ) {
      return value;
    }
    if (value === "warn") return "warning";
    if (value === "danger" || value === "fail" || value === "failed")
      return "error";
    return "info";
  }

  function ensureStack() {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("role", "region");
      stack.setAttribute("aria-live", "polite");
      stack.setAttribute("aria-atomic", "true");
      document.body.appendChild(stack);
    }
    return stack;
  }

  function getTitleMap(stack) {
    if (window.PetAI_i18n && typeof window.PetAI_i18n.t === "function") {
      return {
        success: window.PetAI_i18n.t("success"),
        error: window.PetAI_i18n.t("error"),
        warning: window.PetAI_i18n.t("warning") || "Warning",
        info: window.PetAI_i18n.t("info") || "Info",
      };
    }
    return {
      success: stack?.dataset.titleSuccess || "Success",
      error: stack?.dataset.titleError || "Error",
      warning: stack?.dataset.titleWarning || "Warning",
      info: stack?.dataset.titleInfo || "Info",
    };
  }

  function closeToast(toast) {
    if (!toast || toast.dataset.closing === "1") return;
    toast.dataset.closing = "1";
    if (prefersReducedMotion()) {
      toast.remove();
      return;
    }
    toast.classList.add("toast--closing");
    const onEnd = function (event) {
      if (event.animationName === "toast-out") {
        toast.remove();
      }
    };
    toast.addEventListener("animationend", onEnd, { once: true });
    setTimeout(function () {
      if (toast.isConnected) toast.remove();
    }, 400);
  }

  function bindToast(toast) {
    if (!toast) return;
    const closeBtn = toast.querySelector("[data-toast-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeToast(toast);
      });
    }
    const timeoutValue = parseInt(toast.dataset.timeout || "", 10);
    const timeout = Number.isFinite(timeoutValue)
      ? timeoutValue
      : DEFAULT_TIMEOUT;
    if (timeout > 0) {
      setTimeout(function () {
        closeToast(toast);
      }, timeout);
    }
  }

  function buildToast(stack, type, title, message, options) {
    const toast = document.createElement("div");
    toast.className = "toast toast--" + type;
    toast.setAttribute("role", "alert");
    const timeout = options?.timeout;
    if (Number.isFinite(timeout)) {
      toast.dataset.timeout = String(timeout);
    }

    const iconWrap = document.createElement("div");
    iconWrap.className = "toast__icon";
    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.textContent = options?.icon || iconMap[type];
    iconWrap.appendChild(icon);

    const body = document.createElement("div");
    body.className = "toast__body";
    const titleEl = document.createElement("div");
    titleEl.className = "toast__title";
    titleEl.textContent = title;
    const messageEl = document.createElement("div");
    messageEl.className = "toast__message";
    messageEl.textContent = message;
    body.appendChild(titleEl);
    body.appendChild(messageEl);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "toast__close";
    closeBtn.setAttribute("data-toast-close", "true");
    
    const getCloseLabel = () => {
      if (window.PetAI_i18n && typeof window.PetAI_i18n.t === "function") {
        return window.PetAI_i18n.t("close");
      }
      return stack?.dataset.closeLabel || "Close";
    };
    closeBtn.setAttribute("aria-label", getCloseLabel());
    
    const closeIcon = document.createElement("span");
    closeIcon.className = "material-symbols-outlined";
    closeIcon.textContent = "close";
    closeBtn.appendChild(closeIcon);

    toast.appendChild(iconWrap);
    toast.appendChild(body);
    toast.appendChild(closeBtn);

    return toast;
  }

  const stack = ensureStack();
  if (!stack) return;
  const titles = getTitleMap(stack);

  const existingToasts = stack.querySelectorAll(".toast");
  existingToasts.forEach(function (toast) {
    bindToast(toast);
  });

  window.showToast = function (type, message, options) {
    const normalized = normalizeType(type);
    let text = String(message || "").trim();
    if (!text) return;

    // Get titles dynamically to respect current language
    const currentTitles = getTitleMap(stack);

    // Translate dynamic toast messages from Vietnamese to English if in English mode
    if (window.PetAI_i18n && typeof window.PetAI_i18n.getTranslations === "function") {
      const currentLang = window.PetAI_i18n.getCurrentLang();
      const translations = window.PetAI_i18n.getTranslations();
      if (currentLang && currentLang !== "vi" && translations) {
        const viDict = translations.vi;
        const targetDict = translations[currentLang];
        if (viDict && targetDict) {
          let foundKey = null;
          for (const key in viDict) {
            if (viDict[key] === text) {
              foundKey = key;
              break;
            }
          }
          if (foundKey && targetDict[foundKey] !== undefined) {
            text = targetDict[foundKey];
          }
        }
      }
    }

    const toast = buildToast(
      stack,
      normalized,
      options?.title || currentTitles[normalized],
      text,
      options || {},
    );
    stack.appendChild(toast);
    bindToast(toast);
  };
})();
