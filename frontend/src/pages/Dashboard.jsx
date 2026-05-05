import { BarChart3, Leaf, PackageCheck } from 'lucide-react';

export default function Dashboard({ metrics }) {
  const maxScore = Math.max(...(metrics?.categories || []).map((item) => item.averageScore), 100);

  return (
    <section className="dashboard-grid">
      <div className="metric">
        <PackageCheck size={20} />
        <span>{metrics?.totalProducts || 0}</span>
        <p>Products tracked</p>
      </div>
      <div className="metric">
        <BarChart3 size={20} />
        <span>{metrics?.averageEthicalScore || 0}</span>
        <p>Average score</p>
      </div>
      <div className="metric">
        <Leaf size={20} />
        <span>{metrics?.sustainableProducts || 0}</span>
        <p>Sustainable products</p>
      </div>
      <div className="chart-panel">
        <h3>Category impact</h3>
        {(metrics?.categories || []).length ? (
          metrics.categories.map((item) => (
            <div className="chart-row" key={item.category}>
              <span>{item.category}</span>
              <div className="chart-track">
                <div style={{ width: `${(item.averageScore / maxScore) * 100}%` }} />
              </div>
              <strong>{item.averageScore}</strong>
            </div>
          ))
        ) : (
          <p>No category data yet.</p>
        )}
      </div>
    </section>
  );
}
