import TradeIdeasTable from "../features/tradeIdea/TradeIdeasTable";
import { useTradeIdeas } from "../features/tradeIdea/useTradeIdeas";

const TradeIdeas = () => {
  const { ideas, loading, error, deleteIdea } = useTradeIdeas();

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Trade Ideas</h1>
      <TradeIdeasTable ideas={ideas} onDelete={deleteIdea} />
    </div>
  );
};

export default TradeIdeas;
