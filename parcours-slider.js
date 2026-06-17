/* Parcours slider — interactive 5-step user-journey carousel.
   Progressive enhancement: the markup is a plain scrollable track that
   already works without JS (native overflow-x). This script layers on
   arrow / dot navigation, an active-slide highlight and a synced counter.
   No auto-play and no entrance animation — navigation is user-driven only. */
(function () {
  var slider = document.querySelector(".parcours-slider");
  if (!slider) return;

  var track   = slider.querySelector(".parcours-track");
  var slides  = Array.prototype.slice.call(slider.querySelectorAll(".parcours-slide"));
  var dots    = Array.prototype.slice.call(slider.querySelectorAll(".parcours-dot"));
  var prevBtn = slider.querySelector('[data-dir="prev"]');
  var nextBtn = slider.querySelector('[data-dir="next"]');
  var curEl   = slider.querySelector('[data-counter="current"]');
  var liveEl  = slider.querySelector('.parcours-live');
  if (!track || !slides.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;

  // --- Position helpers ------------------------------------------------
  function targetScrollFor(i) {
    var s = slides[i];
    return s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2;
  }

  function goTo(i, smooth) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({
      left: targetScrollFor(index),
      behavior: smooth === false || reduce ? "auto" : "smooth"
    });
    render();
  }

  // Which slide is currently closest to the viewport centre?
  function nearestIndex() {
    var center = track.scrollLeft + track.clientWidth / 2;
    var best = 0, bestDist = Infinity;
    slides.forEach(function (s, i) {
      var sc = s.offsetLeft + s.offsetWidth / 2;
      var d = Math.abs(sc - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function render() {
    slides.forEach(function (s, i) {
      if (i === index) s.setAttribute("data-active", "");
      else s.removeAttribute("data-active");
    });
    dots.forEach(function (d, i) {
      d.setAttribute("aria-current", i === index ? "true" : "false");
    });
    if (curEl) curEl.textContent = String(index + 1).padStart(2, "0");
    if (liveEl) {
      var cap = slides[index].querySelector("figcaption");
      liveEl.textContent = "Écran " + (index + 1) + " sur " + slides.length +
        (cap ? " : " + cap.textContent.trim() : "");
    }
  }

  // --- Wiring ----------------------------------------------------------
  if (prevBtn) prevBtn.addEventListener("click", function () {
    goTo(index <= 0 ? slides.length - 1 : index - 1, true);
  });
  if (nextBtn) nextBtn.addEventListener("click", function () {
    goTo(index >= slides.length - 1 ? 0 : index + 1, true);
  });
  dots.forEach(function (d, i) {
    d.addEventListener("click", function () { goTo(i, true); });
  });

  // Keyboard: arrow keys navigate when focus is inside the slider.
  slider.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(index <= 0 ? slides.length - 1 : index - 1, true); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(index >= slides.length - 1 ? 0 : index + 1, true); }
  });

  // Keep state in sync when the user scrolls / swipes the track directly.
  var scrollRaf = null;
  track.addEventListener("scroll", function () {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = null;
      var n = nearestIndex();
      if (n !== index) { index = n; render(); }
    });
  }, { passive: true });

  // Re-centre the active slide on resize (layout / flex-basis changes).
  var resizeRaf = null;
  window.addEventListener("resize", function () {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(function () { goTo(index, false); });
  });

  // --- Init ------------------------------------------------------------
  render();
  goTo(0, false);
})();
