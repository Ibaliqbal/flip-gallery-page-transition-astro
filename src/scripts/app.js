import gsap from "gsap";
import Scroll from "./lib/scroll";
import barba from "@barba/core";
import { Flip } from "gsap/Flip";
import { getDetailSlugNamespace, select, selectAll } from "./utils";
import { data as dataImage } from "./data";

gsap.registerPlugin(Flip);

class App {
  constructor() {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    this.flipNextEl = {
      outer: null,
      inner: null,
    };

    this.template = this.getCurrentTemplate();

    this.scroll = new Scroll();
    this.scroll.init();

    this.setPageTranition();
  }

  setPageTranition() {
    barba.init({
      prefetchIgnore: true,
      transitions: [
        {
          name: "default-transition",
          before: (data) => {
            console.log("🔥 default transition");
            this.scroll.stop();
          },
          leave: () => {
            console.log("leave");
          },
          beforeEnter: () => {
            this.scroll.destroy();
          },
          after: () => {
            this.scroll.init();
            this.scroll.scrollTop(true);
          },
        },
        {
          name: "detail-to-detail",

          from: {
            namespace: dataImage.map((item) => `detail__${item.slug}`),
          },
          to: {
            namespace: dataImage.map((item) => `detail__${item.slug}`),
          },
          before: (data) => {
            console.log("🔥 detail to detail transition");
            this.scroll.stop();

            return new Promise((resolve) => {
              const timeline = gsap.timeline({
                onComplete: resolve,
              });

              const allItems = [...selectAll(".item__image__outer")];
              const nextEl = select(".next__item");

              timeline.to(allItems, {
                opacity: 0.001,
                duration: 0.5,
                ease: "power4.inOut",
              });

              if (typeof data.trigger === "string")
                timeline.to(
                  nextEl,
                  {
                    opacity: 0.001,
                    duration: 0.5,
                    ease: "power4.inOut",
                  },
                  0,
                );
            });
          },
          leave: (data) => {
            if (typeof data.trigger !== "string") {
              const triggerImage = data.trigger.querySelector("img");

              const nextElOuter = document.createElement("div");
              nextElOuter.classList.add("wrapper__next__item__flip");

              const nextElInner = document.createElement("div");
              nextElInner.classList.add("item__flip");

              const nextEl = document.createElement("img");
              nextEl.src = triggerImage.src;

              nextElInner.appendChild(nextEl);
              nextElOuter.appendChild(nextElInner);

              document.body.appendChild(nextElOuter);

              gsap.set(nextElInner, {
                top: triggerImage.getBoundingClientRect().y,
                left: triggerImage.getBoundingClientRect().x,
                width: triggerImage.getBoundingClientRect().width,
                height: triggerImage.getBoundingClientRect().height,
              });

              gsap.set(nextElOuter, {
                visibility: "visible",
              });

              this.flipNextEl = {
                outer: nextElOuter,
                inner: nextElInner,
              };
            }
          },
          beforeEnter: () => {
            this.scroll.destroy();
          },
          after: (data) => {
            this.scroll.init();
            this.scroll.scrollTop(true);
            const allItems = [...selectAll(".item__image__outer")];

            return new Promise((resolve) => {
              const timeline = gsap.timeline({
                onComplete: resolve,
              });

              if (typeof data.trigger === "string") {
                timeline.fromTo(
                  allItems,
                  {
                    opacity: 0.001,
                  },
                  {
                    opacity: 1,
                    duration: 0.75,
                    ease: "power4.inOut",
                  },
                );

                timeline.fromTo(
                  ".next__item",
                  { opacity: 0.001 },
                  { opacity: 1, duration: 0.75, ease: "power4.inOut" },
                  "<",
                );
              } else {
                const restItem = [];
                allItems.forEach((item, idx) => {
                  const innerEl = item.querySelector(".item__image__inner");

                  if (!innerEl) return;

                  if (
                    idx === 0 &&
                    this.flipNextEl.outer &&
                    this.flipNextEl.inner
                  ) {
                    gsap.set(item, {
                      visibility: "hidden",
                    });

                    Flip.fit(innerEl, this.flipNextEl.inner, {
                      scale: true,
                    });

                    gsap.set(item, {
                      visibility: "visible",
                    });

                    gsap.set(this.flipNextEl.inner, {
                      visibility: "hidden",
                    });

                    timeline.call(() => {
                      Flip.fit(innerEl, item, {
                        scale: true,
                        duration: 1.45,
                        ease: "power4.inOut",
                        onComplete: () => {
                          this.flipNextEl.outer.remove();
                          this.flipNextEl = {
                            outer: null,
                            inner: null,
                          };
                        },
                      });
                    });
                  } else {
                    restItem.push(item);
                  }
                });
                timeline.fromTo(
                  restItem,
                  {
                    opacity: 0.001,
                  },
                  {
                    opacity: 1,
                    duration: 0.75,
                    ease: "power4.inOut",
                  },
                  "+=0.55",
                );
                timeline.fromTo(
                  ".next__item",
                  { opacity: 0.001 },
                  { opacity: 1, duration: 0.75, ease: "power4.inOut" },
                  "<",
                );
              }
            });
          },
        },
      ],
      debug: true,
    });
  }

  getCurrentTemplate() {
    return select("[data-page-template]")?.getAttribute("data-page-template");
  }

  setTemplate(template) {
    this.template = template;
  }

  intro() {}
}

new App();
