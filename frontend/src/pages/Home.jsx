import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* ================= HERO ================= */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>
            Run your business with <span className="company-blue">clarity</span> and confidence
          </h1>

          <p className="text-muted">
            SmartShop helps small and medium businesses track stock, sales, and
            staff activity, without complexity or guesswork.
          </p>

          <div className="flex gap-md flex-wrap mt-md">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/register")}
            >
              Get Started Free
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="home-hero-image">
          <img
            src="/assets/hero.jpeg"
            alt="SmartShop dashboard overview"
          />
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="home-trust text-center">
        <p>
          <strong>Built for real SMEs:</strong> shops, marts, hardware stores,
          and sales-driven businesses that need visibility, not complexity.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="home-features">
        <h2 className="text-center">Everything you need to stay in control</h2>
        <p className="text-center text-muted mb-lg">
          SmartShop gives you a clear picture of your business in seconds.
        </p>

        <div className="home-feature-grid">
          <div className="card">
            <h3>Stock Management</h3>
            <p className="text-muted">
              Track inventory levels, spot low stock early, and reduce losses.
            </p>
          </div>

          <div className="card">
            <h3>Sales Tracking</h3>
            <p className="text-muted">
              See daily sales and performance at a glance.
            </p>
          </div>

          <div className="card">
            <h3>Staff Accountability</h3>
            <p className="text-muted">
              Assign roles and ensure every sale is recorded accurately.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="home-steps">
        <h2 className="text-center mb-md">Simple to start. Easy to use.</h2>

        <div className="home-step-grid">
          <div className="card text-center">
            <strong>1</strong>
            <p>Create your business account</p>
          </div>
          <div className="card text-center">
            <strong>2</strong>
            <p>Add stock and staff</p>
          </div>
          <div className="card text-center">
            <strong>3</strong>
            <p>Track sales and stay in control</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="home-cta text-center">
        <h2>Start managing your business with confidence</h2>
        <p className="text-muted mb-md">
          Join business owners replacing guesswork with clarity.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/register")}
        >
          Create Your Account
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} SmartShop. Built for growing businesses.
        </p>
        <p className="text-sm">
          A product by{" "}
          <a
            href="https://webloom-tech.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="company-blue"
          >
            Webloom Tech
          </a>
        </p>
      </footer>
    </div>
  );
}
