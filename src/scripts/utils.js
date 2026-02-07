export const select = (selector) => document.querySelector(selector);
export const selectAll = (selector) => document.querySelectorAll(selector);

export function loadImages(callback) {
  const images = selectAll("img");

  if (!images.length) {
    callback();
    return;
  }

  let loaded = 0;

  const onLoad = () => {
    loaded++;
    if (loaded === images.length) {
      callback();
    }
  };

  images.forEach((img) => {
    if (img.complete && img.naturalWidth !== 0) {
      onLoad(); // image sudah ready
    } else {
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    }
  });
}
