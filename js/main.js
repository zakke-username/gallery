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
      throw new Error(`Unknown media type: ${item.type}`);
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

    if (item.title) {
      const titleElement = document.createElement("h3");
      titleElement.innerText = item.title;
      element.appendChild(titleElement);
    }
    if (item.description) {
      const textElement = document.createElement("p");
      textElement.innerText = item.description;
      element.appendChild(textElement);
    }

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
      // Remove file extension
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
    const wasVisible = element.classList.contains("visible");
    element.classList.toggle("visible", isVisible);

    // Restart and autoplay/pause videos
    if (element.tagName === "VIDEO") {
      if (isVisible) {
        if (!wasVisible) element.currentTime = 0;
        element.play().catch(() => {});
      } else {
        element.pause();
      }
    }
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

function setupThemeToggle() {
  const themeButton = document.getElementById("theme-toggle");
  themeButton.addEventListener("click", () => {
    const isLight = document.documentElement.classList.toggle("light");
    themeButton.textContent = isLight ? "🔅" : "🔆";
  });
}

createMediaElements();
createDescriptionCards();
createThumbnails();
observeDescriptions();
setupZoomToggle();
setupThemeToggle();
displayMedia("0");
