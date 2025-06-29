import React from "react";
import FeatureSection from "../components/sections/FeatureSection";
import HeroSection from "../components/sections/Herosection";
import LiveShow from "../components/sections/LiveShow";
import CategoryLiveShow from "../components/sections/CategoryLiveShow";
import UpdatedBook from "../components/sections/UpdatedBook";

const LibraryHome = () => {
  return (
    <div className="bg-library-background min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Content Sections với proper spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category showcase */}
        <CategoryLiveShow />

        {/* Live book display */}
        <LiveShow />

        {/* Updated books section */}
        <UpdatedBook />

        {/* Features section */}
        <FeatureSection />
      </div>
    </div>
  );
};

export default LibraryHome;
