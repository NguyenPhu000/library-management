import React from "react";

import FeatureSection from "../components/sections/FeatureSection";
import HeroSection from "../components/sections/Herosection";
import LiveShow from "../components/sections/LiveShow";
import CategoryLiveShow from "../components/sections/CategoryLiveShow";
import UpdatedBook from "../components/sections/UpdatedBook";
const LibraryHome = () => {
  return (
    <div>
      <HeroSection />
      <CategoryLiveShow />
      <LiveShow />
      <UpdatedBook />
      <FeatureSection />
    </div>
  );
};

export default LibraryHome;
