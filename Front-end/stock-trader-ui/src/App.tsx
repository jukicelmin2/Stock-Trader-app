import { Routes, Route } from "react-router-dom";
import type { JSX } from "react";
import TradeIdeasPage from "./pages/TradeIdeasPage";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/Hero";
import SearchStocks from "./components/SearchStocks";
import WatchlistPage from "./features/watchList/WatchListPage";

const App = (): JSX.Element => {
  return (
    <div className="min-h-screen flex justify-center bg-neutral-100 text-slate-900">
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
          <Route path="/trade-ideas" element={<TradeIdeasPage />} />

          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
