import { mediaData } from "./mediaData.js";

function createMediaElements() {
  const mediaContainer = document.getElementById("media-container");

  mediaData.forEach((item, i) => {
    let element;
    if (item.type === "image") {
      element = document.createElement("img");
      element.src = `assets/images/${item.fileName}`;
      element.alt = item.alt ?? "";
    } else if (item.type === "video") {
      element = document.createElement("video");
      element.src = `assets/videos/${item.fileName}`;
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
      element.preload = "metadata";
    } else {
      throw new Error(
        item.type ? `Invalid media type: ${item.type}` : "Media type not set",
      );
    }
    element.classList.add("media");
    element.dataset.index = i;

    mediaContainer.appendChild(element);
  });
}

function createDescriptionCards() {
  const container = document.getElementById("descriptions");

  mediaData.forEach((item, i) => {
    const element = document.createElement("div");
    element.id = `item-${i}`;
    element.classList.add("description");
    element.dataset.index = i;

    const textElement = document.createElement("p");
    textElement.innerText = item.description;
    element.appendChild(textElement);

    container.appendChild(element);
  });
}

function createThumbnails() {
  const container = document.getElementById("thumbnails");

  mediaData.forEach((item, i) => {
    const link = document.createElement("a");
    link.href = `#item-${i}`;

    const image = document.createElement("img");
    if (item.type === "video") {
      const dotIndex = item.fileName.lastIndexOf(".");
      const baseName =
        dotIndex > 0 ? item.fileName.slice(0, dotIndex) : item.fileName;
      image.src = `assets/thumbnails/${baseName}.webp`;
    } else {
      image.src = `assets/images/${item.fileName}`;
    }
    image.classList.add("thumbnail");

    link.appendChild(image);
    container.appendChild(link);
  });
}

function displayMedia(index) {
  document.querySelectorAll(".media").forEach((element) => {
    const isVisible = element.dataset.index === index;
    element.classList.toggle("visible", isVisible);

    if (element.tagName === "VIDEO")
      isVisible ? element.play().catch(() => {}) : element.pause();
  });
}

function observeDescriptions() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) displayMedia(entry.target.dataset.index);
    }
  });
  document
    .querySelectorAll(".description")
    .forEach((description) => observer.observe(description));
}

function setupZoomToggle() {
  const zoomButton = document.getElementById("zoom-toggle");
  let isZoomed = false;
  zoomButton.addEventListener("click", () => {
    isZoomed = !isZoomed;
    for (const item of document.querySelectorAll(".media")) {
      item.classList.toggle("cover", isZoomed);
    }
    zoomButton.textContent = isZoomed ? "🔍−" : "🔍+";
  });
}

addEventListener("DOMContentLoaded", () => {
  createMediaElements();
  createDescriptionCards();
  createThumbnails();
  observeDescriptions();
  setupZoomToggle();
  displayMedia("0");
});
