import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const wrapTextNode = (node) => {
  if (!node || !node.textContent?.trim()) return;

  const frag = document.createDocumentFragment();
  const parts = node.textContent.split(/(\s+)/);

  parts.forEach((part) => {
    if (/^\s+$/.test(part)) {
      frag.appendChild(document.createTextNode(part));
      return;
    }

    const span = document.createElement("span");
    span.className = "gsap-word";
    span.textContent = part;
    frag.appendChild(span);
  });

  node.parentNode.replaceChild(frag, node);
};

const splitWordsDeep = (el) => {
  if (!el || el.dataset.gsapSplit === "true") return;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest("button,a,input,textarea,select")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(wrapTextNode);

  el.dataset.gsapSplit = "true";
};

const animateCounter = (el) => {
  if (!el || el.dataset.countAnimated === "true") return;

  const raw = el.textContent.trim();
  const numeric = Number(raw.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(numeric)) return;

  const prefix = raw.startsWith("$") ? "$" : raw.startsWith("₹") ? "₹" : "";
  const suffix = raw.includes("+")
    ? "+"
    : raw.includes("%")
      ? "%"
      : raw.endsWith("s")
        ? "s"
        : "";

  const hasDecimal = raw.includes(".");
  const counter = { value: 0 };

  el.dataset.countAnimated = "true";

  gsap.to(counter, {
    value: numeric,
    duration: 1.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 88%",
      once: true,
    },
    onUpdate() {
      const formatted = hasDecimal
        ? counter.value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : Math.round(counter.value).toLocaleString("en-IN");

      el.textContent = `${prefix}${formatted}${suffix}`;
    },
  });
};

export const useAdvancedLandingGSAP = (rootRef) => {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(q("*"), { clearProps: "all" });
        return;
      }

      q(".hero-title, #features h2, #analytics h2, #workflow h2, #faq h2, section h2").forEach((el) => {
        el.classList.add("gsap-split");
        splitWordsDeep(el);
      });

      const nav = q("header nav")[0];

      ScrollTrigger.create({
        start: 20,
        end: 99999,
        onUpdate(self) {
          nav?.classList.toggle("nav-scrolled", self.scroll() > 24);
        },
      });

      gsap.set(".gsap-word", { yPercent: 115, opacity: 0, rotateX: -45 });
      gsap.set(".hero-chip, .hero-copy, .hero-actions, .hero-security", {
        y: 26,
        opacity: 0,
        filter: "blur(8px)",
      });
      gsap.set(".dashboard-preview", {
        y: 80,
        opacity: 0,
        scale: 0.92,
        rotateX: 10,
        transformPerspective: 1200,
        transformOrigin: "center top",
      });

      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl
        .to(".hero-chip", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75 })
        .to(
          ".hero-title .gsap-word",
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.05,
            stagger: { each: 0.035, from: "start" },
          },
          "-=0.25"
        )
        .to(".hero-copy", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75 }, "-=0.45")
        .to(".hero-actions", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75 }, "-=0.5")
        .to(".hero-security", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7 }, "-=0.55")
        .to(
          ".dashboard-preview",
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 1.1,
          },
          "-=0.35"
        )
        .from(
          ".dashboard-preview .rounded-2xl",
          {
            y: 24,
            opacity: 0,
            scale: 0.96,
            stagger: 0.045,
            duration: 0.7,
          },
          "-=0.65"
        );

      gsap.to(".dashboard-preview", {
        y: -18,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const dashboard = q(".dashboard-preview")[0];
      let xTo;
      let yTo;

      if (dashboard) {
        xTo = gsap.quickTo(dashboard, "x", { duration: 0.7, ease: "power3.out" });
        yTo = gsap.quickTo(dashboard, "y", { duration: 0.7, ease: "power3.out" });

        const onMove = (event) => {
          const rect = root.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          xTo(x * 18);
          yTo(-18 + y * 14);
        };

        root.addEventListener("mousemove", onMove);
      }

      q(".stat-card p:first-child").forEach(animateCounter);

      ScrollTrigger.batch(".feature-card", {
        start: "top 86%",
        once: true,
        onEnter(batch) {
          gsap.fromTo(
            batch,
            {
              y: 60,
              opacity: 0,
              scale: 0.94,
              rotateX: -10,
              filter: "blur(8px)",
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)",
              duration: 0.95,
              stagger: 0.08,
              ease: "power4.out",
            }
          );
        },
      });

      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 55, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 84%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray(".gsap-split:not(.hero-title)").forEach((el) => {
        gsap.to(el.querySelectorAll(".gsap-word"), {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.035,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true,
          },
        });
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: ".dashboard-preview",
            start: "top 72%",
            end: "+=900",
            scrub: 1.2,
          },
        })
          .to(".dashboard-preview", {
            scale: 1.045,
            rotateX: 0,
            boxShadow: "0 55px 140px rgba(37,99,235,0.28)",
            ease: "none",
          })
          .to(
            ".dashboard-preview",
            {
              y: -65,
              ease: "none",
            },
            0
          );

        gsap.timeline({
          scrollTrigger: {
            trigger: "#analytics",
            start: "top top",
            end: "+=1100",
            scrub: 1.1,
            pin: true,
            anticipatePin: 1,
          },
        })
          .fromTo(
            "#analytics .reveal-up",
            { x: -80, opacity: 0, filter: "blur(10px)" },
            { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.35 },
            0
          )
          .fromTo(
            ".analytics-panel",
            {
              x: 120,
              scale: 0.82,
              rotateY: -14,
              opacity: 0,
              filter: "blur(14px)",
              transformPerspective: 1200,
            },
            {
              x: 0,
              scale: 1,
              rotateY: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.45,
            },
            0.05
          )
          .to(".analytics-panel", {
            y: -45,
            scale: 1.06,
            duration: 0.45,
          })
          .to(
            ".analytics-panel .relative.h-72",
            {
              rotate: 240,
              duration: 0.65,
              ease: "none",
            },
            0.2
          );

        const workflowCards = q(".workflow-card");

        gsap.timeline({
          scrollTrigger: {
            trigger: "#workflow",
            start: "top top",
            end: "+=950",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        })
          .fromTo(
            workflowCards,
            { y: 110, opacity: 0, scale: 0.9, rotateX: -18 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotateX: 0,
              stagger: 0.18,
              ease: "power2.out",
            }
          )
          .to(
            workflowCards,
            {
              y: -22,
              stagger: 0.06,
              ease: "none",
            },
            0.55
          );
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          ".workflow-card",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#workflow",
              start: "top 82%",
            },
          }
        );
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef }
  );
};
