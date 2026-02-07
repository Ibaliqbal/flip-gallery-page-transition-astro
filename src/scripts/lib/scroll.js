import Lenis from "lenis";

class Scroll {
  constructor() {
    this.lenis = null;
    this.rafId = null;
  }

  init() {
    window.scrollTo(0, 0);

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      lerp: 0.1,
    });

    const raf = (time) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };

    this.rafId = requestAnimationFrame(raf);
  }

  stop() {
    this.lenis?.stop();
  }

  start() {
    this.lenis?.start();
  }

  scrollTop(immediate = true) {
    this.lenis?.scrollTo(0, { immediate });
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.lenis?.destroy();
    this.lenis = null;
  }

  getInstance() {
    return this.lenis;
  }
}

export default Scroll;
