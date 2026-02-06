import Lenis from "lenis";

class Scroll {
  constructor() {
    window.scrollTo(0, 0);

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      lerp: 0.1,
    });

    this.loop();
  }

  loop() {
    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }

  getInstance() {
    return this.lenis;
  }
}

export default Scroll;
