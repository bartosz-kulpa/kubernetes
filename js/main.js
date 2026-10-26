/* Kulpa Budownictwo — interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Sticky header
     ------------------------------------------------------------------------ */

  var header = document.getElementById('site-header');

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */

  var nav = document.getElementById('primary-nav');
  var navToggle = document.querySelector('.nav-toggle');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Otwórz menu');
    document.body.classList.remove('nav-open');
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Zamknij menu');
    document.body.classList.add('nav-open');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------------ */

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  revealItems.forEach(function (item) {
    var parent = item.parentElement;
    if (!parent) return;
    var siblings = Array.prototype.filter.call(parent.children, function (child) {
      return child.classList.contains('reveal');
    });
    var index = siblings.indexOf(item);

    if (index > 0) {
      item.style.setProperty('--reveal-delay', Math.min(index * 0.08, 0.32) + 's');
    }
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  /* ------------------------------------------------------------------------
     Animated numbers
     ------------------------------------------------------------------------ */

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-count'), 10);
    var suffix = element.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      element.textContent = target + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ------------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------------ */

  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  var resetButton = document.getElementById('form-reset');

  function setError(field, message) {
    var wrapper = field.closest('.field');
    var error = wrapper ? wrapper.querySelector('.field-error') : null;

    if (wrapper) wrapper.classList.add('has-error');
    field.setAttribute('aria-invalid', 'true');
    if (error) error.textContent = message;
  }

  function clearError(field) {
    var wrapper = field.closest('.field');
    var error = wrapper ? wrapper.querySelector('.field-error') : null;

    if (wrapper) wrapper.classList.remove('has-error');
    field.removeAttribute('aria-invalid');
    if (error) error.textContent = '';
  }

  function validateField(field) {
    var value = field.type === 'checkbox' ? field.checked : field.value.trim();

    if (field.id === 'name') {
      if (!value) {
        setError(field, 'Podaj swoje imię i nazwisko.');
        return false;
      }
      if (value.length < 3) {
        setError(field, 'Imię i nazwisko jest zbyt krótkie.');
        return false;
      }
    }

    if (field.id === 'phone') {
      var digits = String(value).replace(/[^\d]/g, '');
      if (!value) {
        setError(field, 'Podaj numer telefonu.');
        return false;
      }
      if (digits.length < 9) {
        setError(field, 'Podaj poprawny numer telefonu.');
        return false;
      }
    }

    if (field.id === 'email') {
      if (!value) {
        setError(field, 'Podaj adres e-mail.');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(field, 'Podaj poprawny adres e-mail.');
        return false;
      }
    }

    if (field.id === 'message') {
      if (!value) {
        setError(field, 'Napisz kilka słów o swojej inwestycji.');
        return false;
      }
      if (value.length < 10) {
        setError(field, 'Wiadomość powinna mieć co najmniej 10 znaków.');
        return false;
      }
    }

    if (field.id === 'consent' && !field.checked) {
      setError(field, 'Zgoda jest niezbędna, aby odpowiedzieć na zapytanie.');
      return false;
    }

    clearError(field);
    return true;
  }

  if (form) {
    var fields = ['name', 'phone', 'email', 'message', 'consent']
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    fields.forEach(function (field) {
      var eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, function () {
        if (field.closest('.field').classList.contains('has-error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var isValid = true;
      var firstInvalid = null;

      fields.forEach(function (field) {
        var fieldValid = validateField(field);
        if (!fieldValid && !firstInvalid) firstInvalid = field;
        if (!fieldValid) isValid = false;
      });

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      if (form) {
        form.reset();
        form.hidden = false;
        fields.forEach(clearError);
      }
      if (success) success.hidden = true;

      var firstField = document.getElementById('name');
      if (firstField) firstField.focus();
    });
  }
})();
