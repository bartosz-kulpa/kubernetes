/* BudMax — interakcje strony */
(function () {
  "use strict";

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nagłówek przy przewijaniu ---------- */
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobilne ---------- */
  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Otwórz menu");
  };

  const toggleNav = () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  };

  if (navToggle) {
    navToggle.addEventListener("click", toggleNav);

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) {
        closeNav();
      }
    });
  }

  /* ---------- Animacje wejścia przy przewijaniu ---------- */
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- Liczniki ---------- */
  const counters = document.querySelectorAll(".count");

  const animateCounter = (el) => {
    const target = Number(el.dataset.target || 0);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toString();
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ---------- Formularz kontaktowy ---------- */
  if (form) {
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phonePattern = /^[+\d][\d\s-]{7,}$/;

    const setStatus = (message, type) => {
      formStatus.textContent = message;
      formStatus.classList.remove("is-success", "is-error");
      if (type) {
        formStatus.classList.add(type);
      }
    };

    const validateField = (field) => {
      let valid = true;

      if (field.type === "checkbox") {
        valid = field.checked;
      } else if (field.required) {
        valid = field.value.trim().length > 0;
      }

      if (valid && field.type === "email") {
        valid = emailPattern.test(field.value.trim());
      }

      if (valid && field.type === "tel") {
        valid = phonePattern.test(field.value.trim());
      }

      field.classList.toggle("invalid", !valid);
      field.setAttribute("aria-invalid", String(!valid));
      return valid;
    };

    fields.forEach((field) => {
      const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
      field.addEventListener(eventName, () => {
        if (field.classList.contains("invalid")) {
          validateField(field);
        }
        if (formStatus.classList.contains("is-success")) {
          setStatus("", null);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const invalidFields = fields.filter((field) => !validateField(field));

      if (invalidFields.length > 0) {
        setStatus("Uzupełnij poprawnie zaznaczone pola.", "is-error");
        invalidFields[0].focus();
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      setStatus("Wysyłanie zapytania…");

      // Brak backendu — demonstracyjne potwierdzenie wysyłki.
      window.setTimeout(() => {
        setStatus(
          "Dziękujemy! Zapytanie zostało przyjęte — odezwiemy się w ciągu 24 godzin.",
          "is-success"
        );
        form.reset();
        fields.forEach((field) => {
          field.classList.remove("invalid");
          field.removeAttribute("aria-invalid");
        });
        button.disabled = false;
      }, 900);
    });
  }

  /* ---------- Rok w stopce ---------- */
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
