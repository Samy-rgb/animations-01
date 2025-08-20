import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Navbar() {
  const burgerRef = useRef(null);
  const overlayRef = useRef(null);
  const menuItemRefs = useRef([]);
  const subNavRef = useRef(null);

  useEffect(() => {
    const burger = burgerRef.current;
    const overlay = overlayRef.current;
    const subNav = subNavRef.current;
    const menuItems = menuItemRefs.current;

    if (!burger || !overlay || !menuItems.length) return;

    let isOpen = false;

    const timeline = gsap.timeline({ paused: true });

    timeline.to(overlay, {
      duration: 1.5,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power2.inOut",
      zIndex: 100,
    });

    timeline.to(
      menuItems,
      {
        duration: 1.5,
        y: 0,
        ease: "power4.out",
        stagger: 0.2,
      },
      "-=1"
    );

    timeline.to(
      subNav,
      {
        bottom: "10%",
        opacity: 1,
        duration: 0.5,
        delay: 0.5,
      },
      "<"
    );

    const handleClick = () => {
      if (isOpen) timeline.reverse();
      else timeline.play();
      isOpen = !isOpen;
    };

    burger.addEventListener("click", handleClick);

    return () => {
      if (burger) burger.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, zIndex: 999 }}>
        <div className="info">
          <p>Folio Vol.1</p>
        </div>
        <div className="logo">
          <p>
            <a href="#">The Elite Portfolio</a>
          </p>
        </div>
        <div className="toggle-btn">
          {/* ✅ Added aria-label for accessibility */}
          <button
            ref={burgerRef}
            className="burger"
            aria-label="Toggle navigation menu"
          >
            {/* Optional: visually hidden text for screen readers */}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </nav>

      <div ref={overlayRef} className="overlay" style={{ zIndex: 998 }}>
        <div className="overlay-menu">
          {["Home", "Work", "About"].map((item, i) => (
            <div className="menu-item" key={i}>
              <p
                ref={(el) => (menuItemRefs.current[i] = el)}
                id={i === 0 ? "active" : ""}
              >
                <a href="#">{item}</a>
              </p>
            </div>
          ))}
        </div>

        <div ref={subNavRef} className="sub-nav">
          {["Twitter", "Instagram", "Dribble", "Behance"].map((item, i) => (
            <React.Fragment key={i}>
              <p>
                <a href="#" aria-label={`Visit our ${item}`}>{item}</a>
              </p>
              {i !== 3 && <p aria-hidden="true">.</p>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
