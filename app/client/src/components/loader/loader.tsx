import React from "react";
import "./loader.css";
const AppLoader = () => {
  return (
    <div className="loader">
      {/* Gradient defs */}
      <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
        <defs className="s-xJBuHA073rTt" xmlns="http://www.w3.org/2000/svg">
          <linearGradient
            className="s-xJBuHA073rTt"
            gradientUnits="userSpaceOnUse"
            y2="2"
            x2="0"
            y1="62"
            x1="0"
            id="b"
          >
            <stop className="s-xJBuHA073rTt" stopColor="#973BED" />
            <stop className="s-xJBuHA073rTt" stopColor="#007CFF" offset="1" />
          </linearGradient>
          <linearGradient
            className="s-xJBuHA073rTt"
            gradientUnits="userSpaceOnUse"
            y2="0"
            x2="0"
            y1="64"
            x1="0"
            id="c"
          >
            <stop className="s-xJBuHA073rTt" stopColor="#FFC800" />
            <stop className="s-xJBuHA073rTt" stopColor="#F0F" offset="1" />
            <animateTransform
              repeatCount="indefinite"
              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
              dur="8s"
              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
              type="rotate"
              attributeName="gradientTransform"
            />
          </linearGradient>
          <linearGradient
            className="s-xJBuHA073rTt"
            gradientUnits="userSpaceOnUse"
            y2="2"
            x2="0"
            y1="62"
            x1="0"
            id="d"
          >
            <stop className="s-xJBuHA073rTt" stopColor="#00E0ED" />
            <stop className="s-xJBuHA073rTt" stopColor="#00DA72" offset="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Letters */}
      {/* P */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        height="64"
        width="64"
        className="inline-block"
      >
        <path
          stroke="url(#b)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 8v48M16 8h18a10 10 0 0 1 0 20H16"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* E */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        height="64"
        width="64"
        className="inline-block"
      >
        <path
          stroke="url(#c)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M48 8 h-32 v48 h32 m-32 -24 h24"
          className="spin"
          pathLength="360"
        />
      </svg>

      <div className="w-2" />

      {/* R */}
      {/* R */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        height="64"
        width="64"
        className="inline-block"
      >
        <path
          stroke="url(#d)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 8v48M20 8h18a10 10 0 0 1 0 20H20m18 0l14 28"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* S */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        height="74"
        width="74"
        className="inline-block"
      >
        <path
          stroke="url(#b)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M44 16c-8-8-24-8-24 4 0 12 24 8 24 20 0 12-20 12-28 4"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* O */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        height="64"
        width="64"
        className="inline-block"
      >
        <path
          stroke="url(#c)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M32 8 a24 24 0 1 1 0 48 a24 24 0 1 1 0 -48"
          className="spin"
          pathLength="360"
        />
      </svg>

      {/* N */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        height="64"
        width="64"
        className="inline-block"
      >
        <path
          stroke="url(#d)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 56 V8 L48 56 V8"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* A */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 64 64"
        height="64"
        width="64"
        className="inline-block"
      >
        <path
          stroke="url(#b)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M32 8 L16 56 H48 L32 8 M24 32 H40"
          className="dash"
          pathLength="360"
        />
      </svg>
    </div>
  );
};

export default AppLoader;
