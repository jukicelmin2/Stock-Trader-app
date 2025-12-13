import type { FC } from "react";

const Hero: FC = () => {
  return (
    <div className="px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900">Stock Trader</h1>
      <p className="mt-3 text-gray-600">
        Options trading analysis and portfolio management
      </p>
    </div>
  );
};

export default Hero;
