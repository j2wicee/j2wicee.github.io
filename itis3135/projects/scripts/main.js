/**
 * ITIS 3135 client site behaviors (vanilla JS, external script only).
 * - Header/nav utility interactions
 * - Hero carousel with auto-rotate + controls + dots
 * - Rotating testimonials with smooth fade transition
 * - Contact form real-time validation + no-reload success feedback
 */
(function () {
  "use strict";

  var body = document.body;
  var nav = document.getElementById("site-nav");

  function setFooterYear() {
    var year = new Date().getFullYear();
    document.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = String(year);
    });
  }

  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    if (!toggle || !nav) return;

    function setNavOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      body.classList.toggle("nav-open", open);
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setNavOpen(open);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNavOpen(false);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  function markCurrentPageLink() {
    var page = body.getAttribute("data-page");
    if (!page || !nav) return;
    var link = nav.querySelector('a[href="' + page + '"]');
    if (link) link.setAttribute("aria-current", "page");
  }

  function initScrollReveal() {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
      );
      document.querySelectorAll(".reveal").forEach(function (el) {
        io.observe(el);
      });
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  function initHeroCarousel() {
    var carousel = document.getElementById("hero-carousel");
    if (!carousel) return;

    var slides = Array.prototype.slice.call(
      carousel.querySelectorAll("[data-slide]")
    );
    var dotsWrap = document.getElementById("hero-dots");
    var prevBtn = document.getElementById("hero-prev");
    var nextBtn = document.getElementById("hero-next");
    var currentIndex = 0;
    var intervalId = null;
    var intervalMs = 5000;

    if (!slides.length || !dotsWrap || !prevBtn || !nextBtn) return;

    slides.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-dot";
      dot.setAttribute("aria-label", "Go to slide " + String(index + 1));
      dot.addEventListener("click", function () {
        setSlide(index);
        restartAutoRotate();
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".hero-dot"));

    function setSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === currentIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === currentIndex);
      });
    }

    function nextSlide() {
      setSlide(currentIndex + 1);
    }

    function startAutoRotate() {
      if (intervalId) return;
      intervalId = window.setInterval(nextSlide, intervalMs);
    }

    function stopAutoRotate() {
      if (!intervalId) return;
      window.clearInterval(intervalId);
      intervalId = null;
    }

    function restartAutoRotate() {
      stopAutoRotate();
      startAutoRotate();
    }

    prevBtn.addEventListener("click", function () {
      setSlide(currentIndex - 1);
      restartAutoRotate();
    });

    nextBtn.addEventListener("click", function () {
      setSlide(currentIndex + 1);
      restartAutoRotate();
    });

    carousel.addEventListener("mouseenter", stopAutoRotate);
    carousel.addEventListener("mouseleave", startAutoRotate);

    setSlide(0);
    startAutoRotate();
  }

  function initTestimonials() {
    var shell = document.getElementById("testimonial-shell");
    var quoteEl = document.getElementById("testimonial-quote");
    var metaEl = document.getElementById("testimonial-meta");
    if (!shell || !quoteEl || !metaEl) return;

    var testimonials = [
      {
        quote:
          "I came in with a random suspension noise and got an honest diagnosis the same day. No upsell, just exactly what needed fixing.",
        meta: "— Local client, Aberdeen NC",
      },
      {
        quote:
          "Communication was great from start to finish. They explained the issue in plain English and gave me options at different price points.",
        meta: "— Returning customer, Moore County",
      },
      {
        quote:
          "My check-engine light kept coming back at two other shops. One visit here and it was finally fixed the right way.",
        meta: "— Daily driver owner, Southern Pines",
      },
    ];
    var index = 0;

    function render(nextIndex) {
      shell.classList.add("is-changing");
      window.setTimeout(function () {
        quoteEl.textContent = '"' + testimonials[nextIndex].quote + '"';
        metaEl.textContent = testimonials[nextIndex].meta;
        shell.classList.remove("is-changing");
      }, 220);
    }

    window.setInterval(function () {
      index = (index + 1) % testimonials.length;
      render(index);
    }, 4500);
  }

  function initContactFormEnhancements() {
    var form = document.getElementById("booking-form");
    if (!form) return;

    var statusEl = document.getElementById("form-status");
    var submitBtn = form.querySelector('[type="submit"]');
    var rules = {
      from_name: {
        required: true,
        message: "Please enter your name.",
        validator: function (value) {
          return value.length >= 2;
        },
      },
      phone: {
        required: true,
        message: "Please enter a valid phone number.",
        validator: function (value) {
          return /^[0-9()\-\s+]{10,}$/.test(value);
        },
      },
      email: {
        required: false,
        message: "Please enter a valid email address.",
        validator: function (value) {
          if (!value) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
      },
      service: {
        required: true,
        message: "Please choose a service type.",
        validator: function (value) {
          return value.length > 0;
        },
      },
      message: {
        required: false,
        message: "Please enter at least 10 characters or leave blank.",
        validator: function (value) {
          return !value || value.length >= 10;
        },
      },
    };

    function getErrorEl(name) {
      return document.getElementById("error-" + name);
    }

    function setFieldState(input, valid, message) {
      if (!input) return;
      input.classList.toggle("is-invalid", !valid);
      input.classList.toggle("is-valid", valid && input.value.trim().length > 0);
      input.setAttribute("aria-invalid", valid ? "false" : "true");
      var errorEl = getErrorEl(input.name);
      if (errorEl) errorEl.textContent = valid ? "" : message;
    }

    function validateInput(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var value = input.value.trim();

      if (rule.required && !value) {
        setFieldState(input, false, rule.message);
        return false;
      }

      var isValid = rule.validator(value);
      setFieldState(input, isValid, rule.message);
      return isValid;
    }

    var watchedInputs = Array.prototype.slice.call(
      form.querySelectorAll("input, select, textarea")
    );

    watchedInputs.forEach(function (input) {
      if (!rules[input.name]) return;
      input.addEventListener("input", function () {
        validateInput(input);
      });
      input.addEventListener("blur", function () {
        validateInput(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var isFormValid = true;

      watchedInputs.forEach(function (input) {
        if (!rules[input.name]) return;
        var valid = validateInput(input);
        if (!valid) isFormValid = false;
      });

      if (!isFormValid) {
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.classList.add("error");
          statusEl.innerHTML = "<p>Please correct the highlighted fields and try again.</p>";
        }
        return;
      }

      if (statusEl) {
        statusEl.hidden = false;
        statusEl.classList.remove("error");
        statusEl.innerHTML = "<p>Sending your request...</p>";
      }
      if (submitBtn) submitBtn.disabled = true;

      window.setTimeout(function () {
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.classList.remove("error");
          statusEl.innerHTML =
            "<p>Thanks! Your request was submitted successfully. We will contact you within 24 hours.</p>";
        }
        form.reset();
        watchedInputs.forEach(function (input) {
          input.classList.remove("is-valid", "is-invalid");
          input.setAttribute("aria-invalid", "false");
          var errorEl = getErrorEl(input.name);
          if (errorEl) errorEl.textContent = "";
        });
        if (submitBtn) submitBtn.disabled = false;
      }, 1200);
    });
  }

  setFooterYear();
  initMobileNav();
  markCurrentPageLink();
  initScrollReveal();
  initHeroCarousel();
  initTestimonials();
  initContactFormEnhancements();
})();
