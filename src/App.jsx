// src/App.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "./components/Navbar";

// ✅ Import responsive images via vite-imagetools
import work01 from "/images/work_01.avif?w=480;768;1200;1600&format=avif;webp&as=picture";
import work02 from "/images/work_02.avif?w=480;768;1200;1600&format=avif;webp&as=picture";
import work03 from "/images/work_03.avif?w=480;768;1200;1600&format=avif;webp&as=picture";
import work04 from "/images/work_04.avif?w=480;768;1200;1600&format=avif;webp&as=picture";
import work05 from "/images/work_05.avif?w=480;768;1200;1600&format=avif;webp&as=picture";

gsap.registerPlugin(ScrollTrigger);

// ✅ Optimized <picture> loader
function OptimizedImage({ images, alt, priority = false }) {
  return (
    <picture>
      {images.sources.map((source) => (
        <source key={source.srcset} {...source} />
      ))}
      <img
        src={images.img.src}
        srcSet={images.img.srcset}
        sizes="(max-width: 768px) 100vw, 768px"
        alt={alt}
        width="1600"
        height="900"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={priority ? "high" : "auto"}
        style={{ maxWidth: "100%", height: "auto" }} // ✅ prevents CLS
      />
    </picture>
  );
}

export default function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    const initAnimations = async () => {
      if (!document.querySelector(".work-item")) return;

      // ✅ Lazy load SplitText (reduces unused JS)
      const { SplitText } = await import("gsap/SplitText");

      const items = gsap.utils.toArray(".work-item");

      items.forEach((item) => {
        const img = item.querySelector(".work-item-img");
        const nameH1 = item.querySelector(".work-item-name h1");
        if (!nameH1 || !img) return;

        const split = new SplitText(nameH1, { type: "chars", mask: "chars" });
        gsap.set(split.chars, { y: "125%" });

        split.chars.forEach((char, index) => {
          ScrollTrigger.create({
            trigger: item,
            start: `top+=${index * 25 - 250} top`,
            end: `top+=${index * 25 - 100} top`,
            scrub: 1,
            animation: gsap.fromTo(char, { y: "125%" }, { y: "0%", ease: "none" }),
          });
        });

        // ✅ GPU-accelerated clip-path animations
        ScrollTrigger.create({
          trigger: item,
          start: "top bottom",
          end: "top top",
          scrub: 0.5,
          animation: gsap.fromTo(
            img,
            { clipPath: "polygon(25% 25%, 75% 40%,100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none" }
          ),
        });

        ScrollTrigger.create({
          trigger: item,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.5,
          animation: gsap.fromTo(
            img,
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)", ease: "none" }
          ),
        });
      });

      ScrollTrigger.refresh();
    };

    initAnimations();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const works = [
    { img: work01, title: "Carbon Edge" },
    { img: work02, title: "Velocity Grid" },
    { img: work03, title: "Aeroforce" },
    { img: work04, title: "Mech Horizon" },
    { img: work05, title: "Titan Rail" },
  ];

  return (
    <div ref={containerRef}>
      <Navbar />
      <section className="hero">
        <h1>Beyond the limits</h1>
      </section>

      {works.map((work, i) => (
        <section className="work-item" key={i}>
          <div className="work-item-img">
            <OptimizedImage images={work.img} alt={work.title} priority={i === 0} />
          </div>
          <div className="work-item-name">
            <h1>{work.title}</h1>
          </div>
        </section>
      ))}

      <section className="outro">
        <h1>Back to base</h1>
      </section>
    </div>
  );
}
