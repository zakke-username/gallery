import { mediaData } from "./mediaData.js";

const media = document.getElementById("media-container");
const descriptions = document.getElementById("descriptions");
const thumbnails = document.getElementById("thumbnails");

function createMediaElement(itemData, index) {
  let element;
  if (itemData.type === "image") {
    element = document.createElement("img");
    element.src = `assets/images/${itemData.fileName}`;
    element.alt = itemData.alt ?? "";
  } else if (itemData.type === "video") {
    element = document.createElement("video");
    element.src = `assets/videos/${itemData.fileName}`;
    element.muted = true;
    element.loop = true;
    element.playsInline = true;
    element.preload = "metadata";
  } else {
    throw new Error(`Unknown media type: ${itemData.type}`);
  }
  element.classList.add("media");
  element.dataset.index = index;
  return element;
}

function createDescriptionCard(itemData, index) {
  const element = document.createElement("div");
  element.id = `item-${index}`;
  element.classList.add("description");
  element.dataset.index = index;

  if (itemData.title) {
    const titleElement = document.createElement("h3");
    titleElement.innerText = itemData.title;
    element.appendChild(titleElement);
  }
  if (itemData.description) {
    const textElement = document.createElement("p");
    textElement.innerText = itemData.description;
    element.appendChild(textElement);
  }
  return element;
}

function createThumbnail(itemData, index) {
  const link = document.createElement("a");
  link.href = `#item-${index}`;

  const image = document.createElement("img");
  if (itemData.type === "video") {
    // Remove file extension
    const dotIndex = itemData.fileName.lastIndexOf(".");
    const baseName =
      dotIndex > 0 ? itemData.fileName.slice(0, dotIndex) : itemData.fileName;
    image.src = `assets/thumbnails/${baseName}.webp`;
  } else {
    image.src = `assets/images/${itemData.fileName}`;
  }
  image.classList.add("thumbnail");
  link.appendChild(image);

  return link;
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

function setupZoomToggle() {
  const zoomButton = document.getElementById("zoom-toggle");
  const mediaContainer = document.getElementById("media-container");
  zoomButton.addEventListener("click", () => {
    const isZoomed = mediaContainer.classList.toggle("zoomed");
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

mediaData.forEach((itemData, index) => {
  media.appendChild(createMediaElement(itemData, index));
  descriptions.appendChild(createDescriptionCard(itemData, index));
  thumbnails.appendChild(createThumbnail(itemData, index));
});

observeDescriptions();
setupThemeToggle();
setupZoomToggle();
displayMedia("0");
