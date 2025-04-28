// src/components/Header.jsx
import React from "react";
import CosylabLogo from "../Images/1_CosylabLogo.png"; // Import images
import Logo2 from "../Images/2_Logo2.png";

export default function Header() {
  return (
    <div className="sticky top-0 z-10 mx-auto py-1 lg:py-1.5 [background:radial-gradient(circle,rgba(253,253,148,0.99)_0%,rgba(255,220,116,0.99)_100%)]">
      <div className="container max-w-7xl mx-auto px-1.5 lg:px-4 flex justify-between gap-2 items-center">
        <div className="flex justify-center items-center text-center gap-2">
          <a
            href="https://cosylab.iiitd.edu.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-auto flex justify-center items-center"
          >
            <img
              src={CosylabLogo}
              className="w-8 2xl:w-14"
              alt="Cosylab Logo"
              width="130px"
            />
            <img
              src={Logo2}
              className="w-9 2xl:w-14"
              alt="Logo 2"
              width="130px"
            />
          </a>
          <h1 className="text-base xl:text-xl 2xl:text-3xl tracking-widest text-red-600 italic">
            Ratatouillegen
          </h1>
        </div>

        <div className=" md:flex justify-center items-center gap-2">
          <a
            href="https://www.facebook.com/@IIITDelhi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fab fa-facebook-f bg-blue-500 hover:bg-blue-700 hover:delay-150 text-sm 2xl:text-xl 
            text-white px-2 lg:px-3 py-1 lg:py-1.5 border-1 border-white rounded-full"
            ></i>
          </a>
          <a
            href="https://www.instagram.com/iiit.delhi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fa-brands fa-instagram bg-blue-500 hover:bg-blue-700 hover:delay-150 text-sm 2xl:text-xl 
            text-white px-2 lg:px-3 py-1 lg:py-1.5 border-1 border-white rounded-full"
            ></i>
          </a>
          <a
            href="https://www.linkedin.com/company/cosylab-iiitd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fa-brands fa-x bg-blue-500 hover:bg-blue-700 hover:delay-150 text-sm 2xl:text-xl 
            text-white px-2 lg:px-3 py-1 border-1 border-white rounded-full"
            ></i>
          </a>
          <a
            href="https://www.linkedin.com/company/cosylab-iiitd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fa-brands fa-linkedin bg-blue-500 hover:bg-blue-700 hover:delay-150 text-sm 2xl:text-xl 
            text-white px-2 lg:px-3 py-1 lg:py-1.5 border-1 border-white rounded-full"
            ></i>
          </a>
        </div>
      </div>
    </div>
  );
}
