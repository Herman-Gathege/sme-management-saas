import { useEffect, useState } from "react";
import { getProfitSummary } from "../../api/profits";

export default function ProfitsTab() {
  const [filter, setFilter] = useState("month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData(filter);
  }, [filter]);

  async function loadData(f) {
    try {
      setLoading(true);
      const res = await getProfitSummary({ filter: f });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading profits...</p>;
  if (!data) return null;

  return (
    <div className="card flex flex-col gap-md">
      <h3 className="text-lg text-bold">Profit Analytics</h3>

      {/* Filters */}
      <div className="flex gap-sm flex-wrap">
        {["today", "week", "month", "year"].map((f) => (
          <button
            key={f}
            className={`btn ${
              filter === f ? "btn-filter-active" : "btn-secondary"
            }`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Totals */}
      <div className="grid-summary">
        <div className="stat-card-r card-w">
          <span className="text-sm text-muted">Revenue</span>
          <span className="text-lg text-bold company-blue">
            KES {data.totals.revenue.toFixed(2)}
          </span>
        </div>

        <div className="stat-card-r card-w">
          <span className="text-sm text-muted">Items Cost</span>
          <span className="text-lg text-bold company-blue">
            KES {data.totals.cost.toFixed(2)}
          </span>
        </div>

        <div className="stat-card-r card-w">
          <span className="text-sm text-muted">Your Profit</span>
          <span className="text-lg text-bold company-blue">
            KES {data.totals.profit.toFixed(2)}
          </span>
        </div>

        <div className="stat-card-r card-w">
          <span className="text-sm text-muted">Profit Margins</span>
          <span className="text-lg text-bold company-blue">
            {data.totals.margin.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}