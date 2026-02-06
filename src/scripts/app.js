import Scroll from "./lib/scroll";

class App {
  constructor() {
    this.init();
    this.lenis = new Scroll();
    this.lenis.init();
  }

  init() {
    console.log("App initialized");
  }
}
