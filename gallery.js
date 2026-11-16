"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var gallery = document.querySelector(".gallery");

  if (!gallery) {
    return;
  }

  var viewport = gallery.querySelector(".gallery-viewport");
  var track = gallery.querySelector(".gallery-track");
  var slides = Array.prototype.slice.call(
    gallery.querySelectorAll(".gallery-slide")
  );
  var previousButton = gallery.querySelector(".gallery-prev");
  var nextButton = gallery.querySelector(".gallery-next");
  var currentPageElement = gallery.querySelector(".gallery-current-page");
  var totalPagesElement = gallery.querySelector(".gallery-total-pages");

  var currentPage = 0;
  var slidesPerPage = 3;
  var totalPages = 1;

function updateGallery() {
    var isMobile = window.matchMedia("(max-width: 767.98px)").matches;

    slidesPerPage = isMobile ? 1 : 3;
    totalPages = Math.ceil(slides.length / slidesPerPage);

    if (currentPage >= totalPages) {
        currentPage = totalPages - 1;
    }

    var viewportWidth = viewport.clientWidth;
    var gap = 16;

    var slideWidth = isMobile
        ? viewportWidth
        : (viewportWidth - gap * (slidesPerPage - 1)) / slidesPerPage;

    slides.forEach(function(slide) {
        slide.style.flex = "0 0 " + slideWidth + "px";
        slide.style.width = slideWidth + "px";
    });

    // Находим первую фотографию текущей страницы.
    var firstSlideIndex = currentPage * slidesPerPage;

    if (slides[firstSlideIndex]) {
        var offset = slides[firstSlideIndex].offsetLeft;

        track.style.transform =
            "translate3d(-" + offset + "px, 0, 0)";
    }

    currentPageElement.textContent = currentPage + 1;
    totalPagesElement.textContent = totalPages;

    previousButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;
}
  previousButton.addEventListener("click", function () {
    if (currentPage > 0) {
      currentPage -= 1;
      updateGallery();
    }
  });

  nextButton.addEventListener("click", function () {
    if (currentPage < totalPages - 1) {
      currentPage += 1;
      updateGallery();
    }
  });

  window.addEventListener("resize", updateGallery);

  updateGallery();
});
