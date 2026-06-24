import fs from "fs";

fs.mkdirSync("src/hooks", { recursive: true });

const hookCode = `import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const wrapTextNode = (node) => {
  if (!node || !node.textContent?.trim()) return;

  const frag = document.createDocumentFragment();
  const parts = node.textContent.split(/(\\s+)/);

  parts.forEach((part) => {
    if (/^\\s+$/.test(part)) {
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
  if (Number.isNaN(numeric)) return;

  const prefix = raw.startsWith("$") ? "$" : raw.startsWith("₹") ? "₹" : "";
  const suffix = raw.includes("+") ? "+" : raw.includes("%") ? "%" : raw.includes("s") ? "s" : "";
  const hasDecimal = raw.includes(".");

  el.dataset.countAnimated = "true";

  gsap.fromTo(
    { value: 0 },
    {
      value: numeric,
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
      onUpdate() {
        const value = this.targets()[0].value;
        const formatted = hasDecimal
          ? value.toLocaleString("en-IN", { maximumFractionDigits: 2 })
          : Math.round(value).toLocaleString("en-IN");

        el.textContent = \`\${prefix}\${formatted}\${suffix}\`;
      },
    }
  );
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
`;

fs.writeFileSync("src/hooks/useAdvancedLandingGSAP.js", hookCode, "utf8");

const file = "src/pages/LandingPage.jsx";

if (!fs.existsSync(file)) {
  console.error("❌ src/pages/LandingPage.jsx not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

if (!code.includes("useAdvancedLandingGSAP")) {
  code = code.replace(
    `import { Link } from "react-router-dom";`,
    `import { Link } from "react-router-dom";\nimport { useAdvancedLandingGSAP } from "../hooks/useAdvancedLandingGSAP";`
  );
}

code = code.replace(
  `import { useLayoutEffect, useRef, useState } from "react";`,
  `import { useRef, useState } from "react";`
);

code = code.replace(/import gsap from "gsap";\nimport \{ ScrollTrigger \} from "gsap\/ScrollTrigger";\n/g, "");
code = code.replace(/gsap\.registerPlugin\(ScrollTrigger\);\n/g, "");

code = code.replace(
  /\n\s*useLayoutEffect\(\(\) => \{[\s\S]*?\n\s*\}, \[\]\);\n/,
  `\n  useAdvancedLandingGSAP(rootRef);\n`
);

if (!code.includes("useAdvancedLandingGSAP(rootRef);")) {
  code = code.replace(
    `const [openFaq, setOpenFaq] = useState(0);`,
    `const [openFaq, setOpenFaq] = useState(0);\n\n  useAdvancedLandingGSAP(rootRef);`
  );
}

fs.writeFileSync(file, code, "utf8");

let css = fs.existsSync("src/index.css") ? fs.readFileSync("src/index.css", "utf8") : "";

if (!css.includes("/* Advanced GSAP Landing Motion START */")) {
  css += `

/* Advanced GSAP Landing Motion START */
.gsap-split {
  overflow: hidden;
}

.gsap-word {
  display: inline-block;
  transform-origin: 50% 100%;
  will-change: transform, opacity, filter;
}

.dashboard-preview,
.feature-card,
.workflow-card,
.analytics-panel,
.stat-card {
  will-change: transform, opacity, filter;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

header nav {
  transition: height 220ms ease, box-shadow 220ms ease, background 220ms ease, border-color 220ms ease;
}

header nav.nav-scrolled {
  height: 62px;
  background: rgba(255, 255, 255, 0.94) !important;
  border-color: rgba(148, 163, 184, 0.45) !important;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.12) !important;
}

.analytics-panel {
  transform-origin: center center;
}

@media (min-width: 1024px) {
  #analytics,
  #workflow {
    min-height: 100vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gsap-word,
  .dashboard-preview,
  .feature-card,
  .workflow-card,
  .analytics-panel,
  .stat-card {
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
  }
}
/* Advanced GSAP Landing Motion END */
`;
}

fs.writeFileSync("src/index.css", css, "utf8");

console.log("✅ Advanced GSAP animation system added to landing page.");
