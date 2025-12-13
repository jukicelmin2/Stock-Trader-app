import { Routes, Route } from "react-router-dom";
import type { JSX } from "react";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/Hero";
import SearchStocks from "./components/SearchStocks";
import WatchlistPage from "./features/watchList/WatchListPage";

const App = (): JSX.Element => {
  return (
    // ⬇️ samo flex centriranje, NEMA promjene boja
    <div className="min-h-screen flex justify-center bg-neutral-100">
      {/* ⬇️ centralni wrapper */}
      <div className="w-full max-w-5xl">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <SearchStocks />
              </>
            }
          />

          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
