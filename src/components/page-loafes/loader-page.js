import React from "react";
import nestleLogo from "../../img/page-loder/Nestle-food-Logo-1.gif"; // adjust the path as necessary
import './loader-page.css';


const LoaderPage = () => {
  return (
    <div className="loader-page">
      <div className="gif">
      <img src={nestleLogo} alt="Nestle Logo" />{" "}
      </div>
    </div>
  );
};

export default LoaderPage;
