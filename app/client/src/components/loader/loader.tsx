import React from "react";
import "./loader.css";
const AppLoader = () => {
  return (
    <div className="loader">
      <svg
        className="logo"
        width="400"
        height="400"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M65 70V135H95C116.539 130 134 112.539 134 91C134 69.4609 116.539 52 95 52H75C69.4772 52 65 56.4772 65 62V70Z"
          fill="white"
        />
        <path
          d="M142 108L95 150H140C145.523 150 150 145.523 150 140V110C150 108.895 149.105 108 148 108H140"
          fill="white"
        />
        <path d="M80 80L125 150H95L55 90L80 80Z" fill="white" />
        <circle cx="80" cy="80" r="10" fill="white" />
      </svg>
    </div>
  );
};

export default AppLoader;
