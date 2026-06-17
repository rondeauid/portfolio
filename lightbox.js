/* Lightbox — click any content image to view it enlarged in an overlay.
   When the image belongs to a gallery (e.g. the parcours slider), the
   overlay shows previous / next arrows so you can step through the set
   without closing. Close by clicking the backdrop, the × button, or Esc;
   navigate with the arrows or the ← / → keys. */
(function () {
  // Images worth enlarging: every figure image in the case study —
  // EXCEPT images inside a slider (.parcours-slider), which are not zoomable.
  var imgs = Array.prototype.slice
    .call(document.querySelectorAll("figure img"))
    .filter(function (img) { return !img.closest(".parcours-slider"); });
  if (!imgs.length) return;

  // Selectors whose descendant figure-images form a navigable group.
  var GROUP_SELECTOR = ".gallery, .ateliers-repo-lines, .ateliers-repo-line";

  // --- Build the overlay once -----------------------------------------
  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Image agrandie");

  var figure = document.createElement("figure");
  figure.className = "lightbox__figure";

  var bigImg = document.createElement("img");
  bigImg.className = "lightbox__img";
  bigImg.alt = "";

  var caption = document.createElement("figcaption");
  caption.className = "lightbox__caption";

  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "lightbox__close";
  closeBtn.setAttribute("aria-label", "Fermer");
  closeBtn.innerHTML = "&times;";

  function navBtn(dir, label, points) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "lightbox__nav lightbox__nav--" + dir;
    b.setAttribute("aria-label", label);
    b.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="' +
      points + '"></polyline></svg>';
    return b;
  }
  var prevBtn = navBtn("prev", "Image précédente", "15 18 9 12 15 6");
  var nextBtn = navBtn("next", "Image suivante", "9 18 15 12 9 6");

  figure.appendChild(bigImg);
  figure.appendChild(caption);
  overlay.appendChild(closeBtn);
  overlay.appendChild(prevBtn);
  overlay.appendChild(nextBtn);
  overlay.appendChild(figure);
  document.body.appendChild(overlay);

  var lastFocused = null;
  var group = [];   // array of <img> in the current group
  var pos = 0;      // index within group

  function captionFor(img) {
    var fig = img.closest("figure");
    var cap = fig ? fig.querySelector("figcaption") : null;
    return cap ? cap.textContent.trim() : "";
  }

  function showAt(i) {
    pos = (i + group.length) % group.length;
    var img = group[pos];
    bigImg.src = img.currentSrc || img.src;
    bigImg.alt = img.alt || "";
    var c = captionFor(img);
    if (c) { caption.textContent = c; caption.hidden = false; }
    else { caption.hidden = true; }
    var multi = group.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
  }

  function open(img) {
    lastFocused = document.activeElement;
    var container = img.closest(GROUP_SELECTOR);
    group = container
      ? Array.prototype.slice.call(container.querySelectorAll("figure img"))
      : [img];
    var start = group.indexOf(img);
    overlay.hidden = false;
    document.body.classList.add("lightbox-open");
    showAt(start < 0 ? 0 : start);
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.classList.remove("lightbox-open");
    bigImg.removeAttribute("src");
    group = [];
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // --- Wire each image as a trigger -----------------------------------
  imgs.forEach(function (img) {
    img.classList.add("is-zoomable");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Agrandir l'image" + (img.alt ? " : " + img.alt : ""));

    img.addEventListener("click", function () { open(img); });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        open(img);
      }
    });
  });

  // --- Navigation -----------------------------------------------------
  prevBtn.addEventListener("click", function (e) { e.stopPropagation(); showAt(pos - 1); });
  nextBtn.addEventListener("click", function (e) { e.stopPropagation(); showAt(pos + 1); });

  // --- Close interactions ---------------------------------------------
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) {
    // Click outside the image / arrows (on the backdrop) closes.
    if (e.target === overlay || e.target === figure) close();
  });
  document.addEventListener("keydown", function (e) {
    if (overlay.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft" && group.length > 1) { e.preventDefault(); showAt(pos - 1); }
    else if (e.key === "ArrowRight" && group.length > 1) { e.preventDefault(); showAt(pos + 1); }
  });
})();
