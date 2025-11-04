import React from "react";
import Hero from "./components/Hero";
import Popular from "./components/Popular";
import Explore from "./components/Explore";

import Discover from "./components/Discover";
import Product from "./components/Product";
import Reviews from "./components/Reviews";
import Services from "./components/Services";
import Elevate from "./components/Elevate";
import OfficeAttire from "./components/OfficeAttire";

const Home = () => {
  return (
    <div>
      <Hero />
      <Popular />
      <Explore />
      <OfficeAttire />

      <Discover />
      <Product />
      <Reviews />
      <Services />
      <Elevate />
    </div>
  );
};

export default Home;
