(function () {
  "use strict";

  var y = new Date().getFullYear();
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = String(y);
  });

  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    body.classList.toggle("nav-open", open);
  }

  if (toggle && nav) {
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

  /* Mark current nav link from body[data-page] */
  var page = body.getAttribute("data-page");
  if (page && nav) {
    var link = nav.querySelector('a[href="' + page + '"]');
    if (link) link.setAttribute("aria-current", "page");
  }

  /* Light scroll-in for .reveal elements */
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

  /* Contact form — mirrors React placeholder submit (no EmailJS) */
  var form = document.getElementById("booking-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    var submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("from_name") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();
      var service = (data.get("service") || "").toString().trim();

      if (!name || !phone || !service) {
        window.alert(
          "Please fill in your name, phone number, and service needed."
        );
        return;
      }

      if (statusEl) {
        statusEl.hidden = true;
        statusEl.classList.remove("error");
        statusEl.innerHTML = "";
      }
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtn) submitBtn.textContent = "Sending...";

      window.setTimeout(function () {
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.classList.remove("error");
          statusEl.innerHTML =
            "<p>✓ Request received — we'll be in touch within 24 hours.</p>";
        }
        form.reset();
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtn) submitBtn.textContent = "Submit Request →";
      }, 1500);
    });
  }
})();
