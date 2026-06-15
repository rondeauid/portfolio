/* Lightbox — click any content image to view it enlarged in an overlay.
   Close by clicking the backdrop, the × button, or pressing Escape.
   Minimal, no shadows, no complex animation — consistent with the site. */
(function () {
  // Images worth enlarging: every figure image in the case study.
  // (Header hero screenshots are intentionally excluded.)
  var imgs = document.querySelectorAll("figure img");
  if (!imgs.length) return;

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

  figure.appendChild(bigImg);
  figure.appendChild(caption);
  overlay.appendChild(closeBtn);
  overlay.appendChild(figure);
  document.body.appendChild(overlay);

  var lastFocused = null;

  function open(src, alt, captionText) {
    lastFocused = document.activeElement;
    bigImg.src = src;
    bigImg.alt = alt || "";
    if (captionText) {
      caption.textContent = captionText;
      caption.hidden = false;
    } else {
      caption.hidden = true;
    }
    overlay.hidden = false;
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.classList.remove("lightbox-open");
    bigImg.removeAttribute("src");
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

    function trigger() {
      var fig = img.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      open(img.currentSrc || img.src, img.alt, cap ? cap.textContent.trim() : "");
    }

    img.addEventListener("click", trigger);
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        trigger();
      }
    });
  });

  // --- Close interactions ---------------------------------------------
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) {
    // Click outside the image (on the backdrop) closes.
    if (e.target === overlay || e.target === figure) close();
  });
  document.addEventListener("keydown", function (e) {
    if (!overlay.hidden && e.key === "Escape") close();
  });
})();
