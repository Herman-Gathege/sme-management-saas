import { useEffect, useState } from "react";
import { getProfitSummary } from "../../api/profits";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProfitsGraph() {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await getProfitSummary({ filter: "month" });

      const chartData = res.labels.map((date, i) => ({
        date,
        profit: res.profit[i],
      }));

      setData(chartData);
      setTotals(res.totals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="card">Loading profits...</div>;

  return (
    <div className="card flex flex-col gap-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-bold">Profit Trend</h3>
        {totals && (
          <div className="text-sm text-muted">
            Month Profit: <strong>KES {totals.profit.toFixed(2)}</strong>
          </div>
        )}
      </div>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}