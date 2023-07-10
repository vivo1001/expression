import React, { useEffect } from "react";
import "../styles/loading.css";
import { gsap } from "gsap";

const LoadingScreen = () => {
  useEffect(() => {
    const loader = gsap.timeline();
    const duration = 0.25;
    const delay = 1;

    loader
      .to(".loader-3", duration, { width: 35 })
      .set(".loader-2", {
        rotate: 90,
        transformOrigin: "45px 45px",
        marginLeft: 0,
      })
      .to(".loader-2", duration, { width: 90 })
      .set(".loader-2", { transformOrigin: "72px 17px", rotate: 270 })
      .to(".loader-2", duration, { width: 35 })
      .to(".loader-1", duration, { width: 90 })
      .set(".loader-1", { transformOrigin: "45px 17.5px", rotate: 180 })
      .to(".loader-1", duration, { width: 35 })
      .set(".loader-3", {
        transformOrigin: "45px 45px",
        rotate: 270,
        marginTop: 0,
      })
      .to(".loader-3", duration, { width: 90 })
      .set(".loader-3", { transformOrigin: "17.5px 17.5px", rotate: 90 })
      .to(".loader-3", duration, { width: 35 })
      .set(".loader-2", { transformOrigin: "45px 45px", rotate: 180 })
      .to(".loader-2", duration, { width: 90 })
      .set(".loader-2", { transformOrigin: "bottom center", marginTop: 20 })
      .to(".loader-2", duration, { width: 35 })
      .set(".loader-1", { transformOrigin: "45px 45px", rotate: 90 })
      .to(".loader-1", duration, { width: 90 })
      .set(".loader-1", { transformOrigin: "72px 17.5px", rotate: 270 })
      .to(".loader-1", duration, { width: 35 })
      .set(".loader-3", { rotate: 360 })
      .to(".loader-3", duration, { width: 90 })
      .set(".loader-3", { transformOrigin: "45px 17.5px", rotate: 180 })
      .to(".loader-3", duration, { width: 35 })
      .set(".loader-2", {
        transformOrigin: "45px 45px",
        rotate: 270,
        marginTop: 0,
      })
      .to(".loader-2", duration, { width: 90 })
      .set(".loader-2", { transformOrigin: "17.5px 17.5px", rotate: 90 })
      .to(".loader-2", duration, { width: 35 })
      .set(".loader-1", { transformOrigin: "45px 45px", rotate: 180 })
      .to(".loader-1", duration, { width: 90 })
      .set(".loader-1", { transformOrigin: "bottom center", marginTop: 20 })
      .to(".loader-1", duration, { width: 35 })
      .set(".loader-3", { transformOrigin: "45px 45px", rotate: 90 })
      .to(".loader-3", duration, { width: 90 })
      .set(".loader-3", { transformOrigin: "72px 17.5px", rotate: 270 })
      .to(".loader-3", duration, { width: 35 })
      .set(".loader-2", { transformOrigin: "45px 17.5px", rotate: 0 })
      .to(".loader-2", duration, { width: 90 })
      .set(".loader-2", { rotate: 180 })
      .to(".loader-2", duration, { width: 35 })
      .set(".loader-1", {
        transformOrigin: "45px 45px",
        rotate: 270,
        marginTop: 0,
      })
      .to(".loader-1", duration, { width: 90 })
      .set(".loader-1", { transformOrigin: "17.5px 17.5px", rotate: 90 })
      .to(".loader-1", duration, { width: 35 })
      .set(".loader-3", {
        transformOrigin: "45px 17.5px",
        rotate: 180,
        marginTop: 55,
      })
      .to(".loader-3", duration, { width: 90 })
      .set(".loader-2", { marginLeft: 55 })
      .delay(delay)
      .repeat(-1);

    return () => {
      loader.kill(); // Cleanup the animation on unmount
    };
  }, []);

  return (
    <div className="container">
      <div className="loader-wrapper">
        <div className="loader-1"></div>
        <div className="loader-2"></div>
        <div className="loader-3"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
