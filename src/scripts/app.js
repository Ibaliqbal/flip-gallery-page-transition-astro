import gsap from "gsap";
import Scroll from "./lib/scroll";
import barba from "@barba/core";
import { Flip } from "gsap/Flip";
import { loadImages, select, selectAll } from "./utils";
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
      transitions: [
        {
          name: "default-transition",
          before: () => {
            console.log("🔥 default transition 🔥");
            this.scroll.stop();
            const barbaPageTransition = select(".barba__page__transition");
            const barbaPageTransitionBar = selectAll(
              ".barba__page__transition__bar",
            );
            const barbaPageTransitionProgress = select(
              ".barba__page__transition__progress",
            );

            gsap.set(barbaPageTransitionBar, {
              transformOrigin: "bottom",
            });

            gsap.set(barbaPageTransitionProgress, {
              transformOrigin: "left",
            });

            const timeline = gsap.timeline();

            gsap.set(barbaPageTransition, {
              visibility: "visible",
              opacity: 1,
              pointerEvents: "all",
            });

            timeline.to(barbaPageTransitionBar, {
              scaleY: 1,
              stagger: { from: "center", amount: 0.35 },
              ease: "power2.inOut",
            });

            timeline.to(
              barbaPageTransitionProgress,
              {
                scaleX: 1,
                duration: 0.5,
                ease: "power2.inOut",
              },
              "-=0.2",
            );

            return new Promise((resolve) => {
              timeline.call(() => {
                resolve();
              });
            });
          },
          leave: () => {
            this.scroll.destroy();
          },
          after: () => {
            this.scroll.init();
            this.scroll.scrollTop(true);
            const template = this.getCurrentTemplate();
            this.setTemplate(template);

            const barbaPageTransition = select(".barba__page__transition");
            const barbaPageTransitionBar = selectAll(
              ".barba__page__transition__bar",
            );
            const barbaPageTransitionProgress = select(
              ".barba__page__transition__progress",
            );

            const timeline = gsap.timeline({
              onComplete: () => {
                gsap.set(barbaPageTransition, {
                  visibility: "hidden",
                  opacity: 0,
                  pointerEvents: "none",
                });
              },
            });

            gsap.set(barbaPageTransitionBar, {
              transformOrigin: "top",
            });

            gsap.set(barbaPageTransitionProgress, {
              transformOrigin: "right",
            });

            timeline.to(barbaPageTransitionProgress, {
              scaleX: 0,
              ease: "power2.inOut",
              duration: 0.4,
            });

            timeline.to(
              barbaPageTransitionBar,
              {
                scaleY: 0,
                stagger: {
                  from: "center",
                  amount: 0.35,
                },
                ease: "power2.inOut",
              },
              "-=0.2",
            );
            return new Promise((resolve) => {
              timeline.call(() => {
                resolve();
              });
            });
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
            console.log("🔥 detail to detail transition 🔥");
            this.scroll.stop();
            const timeline = gsap.timeline();

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

            return new Promise((resolve) => {
              timeline.call(() => {
                resolve();
              });
            });
          },
          leave: (data) => {
            this.scroll.destroy();
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
          after: (data) => {
            this.scroll.init();
            this.scroll.scrollTop(true);
            const allItems = [...selectAll(".item__image__outer")];
            const template = this.getCurrentTemplate();
            this.setTemplate(template);

            const timeline = gsap.timeline();

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
                "+=0.75",
              );
              timeline.fromTo(
                ".next__item",
                { opacity: 0.001 },
                { opacity: 1, duration: 0.75, ease: "power4.inOut" },
                "<",
              );
            }
            return new Promise((resolve) => {
              timeline.call(() => {
                resolve();
              });
            });
          },
        },
      ],
    });
  }

  getCurrentTemplate() {
    return select("[data-page-template]")?.getAttribute("data-page-template");
  }

  setTemplate(template) {
    this.template = template;
  }

  intro() {
    if (this.template === "home") this.homeInit();
    if (this.template === "detail") this.detailInit();
  }

  homeInit() {
    console.log("🔥 home init 🔥");
    const gridItems = [...selectAll(".grid__item")];
    gridItems.forEach((item) => item.classList.add("load"));

    gsap.set(gridItems, {
      scale: 0,
      pointerEvents: "none",
    });

    const timeline = gsap.timeline();

    timeline.to(gridItems, {
      scale: 1,
      ease: "power4.inOut",
      duration: 1.75,
      stagger: {
        each: 0.25,
      },
      onComplete: () => {
        gsap.set(gridItems, {
          clearProps: "transform",
        });
      },
    });

    timeline.add(() => {
      const gridState = Flip.getState(gridItems);

      gridItems.forEach((item) => {
        item.classList.remove("load");
      });

      Flip.from(
        gridState,
        {
          scale: true,
          ease: "power1",
          duration: 0.75,
          onComplete: () => {
            gsap.set(gridItems, {
              pointerEvents: "all",
            });
            timeline.kill();
          },
          stagger: 0.1345,
        },
        "+=0.5",
      );
    });
  }

  detailInit() {
    console.log("🔥 detail init 🔥");
    const allItems = [...selectAll(".item__image__outer")];

    gsap.fromTo(
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
  }
}

const app = new App();

loadImages(() => {
  // app.intro();
});
