import React from "react";
import FeatureSection from "../components/sections/FeatureSection";
import HeroSection from "../components/sections/Herosection";

import UpdatedBook from "../components/sections/UpdatedBook";
const LibraryHome = () => {
  return (
    <div>
      <HeroSection />
      <UpdatedBook />
      <FeatureSection />
    </div>
  );
};

export default LibraryHome;
