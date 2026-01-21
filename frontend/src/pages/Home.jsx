import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Run your business with <span>clarity</span> and confidence
          </h1>
          <p>
            SmartShop helps small and medium businesses track stock, sales, and
            staff activity, without complexity or guesswork.
          </p>

          <div className={styles.heroButtons}>
            <button
              onClick={() => navigate("/register")}
              className={styles.primaryBtn}
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className={styles.secondaryBtn}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* IMAGE PLACEHOLDER */}
        <div className={styles.heroImage}>
          <img
            src="/assets/hero.jpeg"
            alt="SmartShop dashboard overview"
            className={styles.heroImg}
          />
        </div>
      </section>

      {/* ================= TRUST / VALUE ================= */}
      <section className={styles.trust}>
        <p>
          <span className={styles.trustSpan}>Built for real SMEs:</span> shops,
          marts, hardware stores, and sales-driven businesses that need
          visibility, not complexity.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className={styles.features}>
        <h2>Everything you need to stay in control</h2>
        <p className={styles.sectionSubtitle}>
          SmartShop gives you a clear picture of your business in seconds.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            {/* ICON / IMAGE PLACEHOLDER */}
            <h3>Stock Management</h3>
            <p>
              Track inventory levels, spot low stock early, and reduce losses
              from missing or expired items.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Sales Tracking</h3>
            <p>
              See daily sales, sales history, and performance at a glance even
              when you’re not on-site.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Staff Accountability</h3>
            <p>
              Assign roles, monitor activity, and ensure every sale is recorded
              accurately.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className={styles.howItWorks}>
        <h2>Simple to start. Easy to use.</h2>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span>1</span>
            <p>Create your business account</p>
          </div>
          <div className={styles.step}>
            <span>2</span>
            <p>Add stock and staff</p>
          </div>
          <div className={styles.step}>
            <span>3</span>
            <p>Track sales and stay in control</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Start managing your business with confidence
        </h2>
        <p className={styles.ctaSubtitle}>
          Join business owners who are replacing guesswork with clarity.
        </p>
        <button
          onClick={() => navigate("/register")}
          className={styles.primaryBtn}
        >
          Create Your Account
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} SmartShop. Built for growing businesses.
        </p>
        <p className={styles.productNote}>
          A product by{" "}
          <a
            href="https://webloom-tech.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Webloom Tech
          </a>
        </p>
      </footer>
    </div>
  );
}
