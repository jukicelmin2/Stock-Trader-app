import Navbar from "./components/layout/Navbar";
import Hero from "./components/Hero";
import SearchStocks from "./components/SearchStocks";
import type { JSX } from "react";

const App = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <Hero />
      <SearchStocks />
    </div>
  );
};

export default App;
