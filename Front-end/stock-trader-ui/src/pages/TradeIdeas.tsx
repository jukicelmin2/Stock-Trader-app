import TradeIdeasTable from "../features/tradeIdea/TradeIdeasTable";
import { useTradeIdeas } from "../features/tradeIdea/useTradeIdeas";

const TradeIdeas = () => {
  const { ideas, loading, removeIdea } = useTradeIdeas();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Trade Ideas</h1>
      <TradeIdeasTable ideas={ideas} onDelete={removeIdea} />
    </div>
  );
};

export default TradeIdeas;
