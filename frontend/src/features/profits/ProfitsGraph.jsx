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

  if (loading)
    return <div className="card p-md text-center">Loading profits...</div>;

  // Destructure totals safely with defaults
  const { profit = 0, revenue = 0, expenses = 0 } = totals || {};

  return (
    <div className="card flex flex-col gap-md p-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Profit Trend</h3>
        <div className="text-sm text-gray-500">
          Latest Month Profit: <strong>KES {profit.toLocaleString()}</strong>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#4b5563" }}
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -5,
                fill: "#374151",
                fontSize: 12,
              }}
            />
            <YAxis
              tickFormatter={(val) => val.toLocaleString()}
              tick={{ fontSize: 12, fill: "#4b5563" }}
              label={{
                value: "Profit (KES)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#374151", fontSize: 12 },
              }}
            />
            <Tooltip
              formatter={(value) => `KES ${value.toLocaleString()}`}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Totals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded mt-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Metric</th>
              <th className="p-2 text-right">Value (KES)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-2">Profit</td>
              <td className="p-2 text-right font-medium text-green-600">
                {profit.toLocaleString()}
              </td>
            </tr>
            <tr className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-2">Revenue</td>
              <td className="p-2 text-right">{revenue.toLocaleString()}</td>
            </tr>
            <tr className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-2">Expenses</td>
              <td className="p-2 text-right text-red-600">{expenses.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}