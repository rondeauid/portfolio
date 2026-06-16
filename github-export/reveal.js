/* Reveal-on-scroll: adds .is-in to any element with .reveal or .reveal-stagger
   when it enters the viewport. Runs once per element. */
(function () {
  if (!("IntersectionObserver" in window)) {
    // Fallback: just show everything.
    document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: "0px 0px -4% 0px"
  });

  document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) {
    io.observe(el);
  });
})();

/* Sticky header — add `.is-scrolled` to the .page element once the user
   has scrolled past the top of the document. */
(function () {
  var header = document.querySelector(".page");
  if (!header) return;
  var update = function () {
    if (window.scrollY > 4) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
})();

/* Mobile navigation — the hamburger toggles the nav panel. Closes on link
   click, outside click, or Escape. No-op on pages without a toggle. */
(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;
  var toggle = nav.querySelector(".nav__toggle");
  if (!toggle) return;
  var setOpen = function (open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };
  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });
  nav.querySelectorAll(".nav__links a").forEach(function (a) {
    a.addEventListener("click", function () { setOpen(false); });
  });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
