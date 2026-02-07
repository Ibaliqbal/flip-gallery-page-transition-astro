import gsap from "gsap";
import Scroll from "./lib/scroll";
import barba from "@barba/core";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

class App {
  constructor() {
    this.lenis = new Scroll().getInstance();

    this.setPageTransition();
  }

  setPageTransition() {
    barba.init({
      prefetchIgnore: true,
      transitions: [
        {
          name: "default-transition",
          before: (data) => {
            console.log(data);
          },
        },
      ],
    });
  }
}

new App();
