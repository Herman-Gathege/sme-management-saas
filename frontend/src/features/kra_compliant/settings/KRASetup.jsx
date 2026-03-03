import { useState } from "react";
import { apiFetch } from "../../../api/client"; // adjust path if needed

export default function KRASetup() {
  const [form, setForm] = useState({
    kra_pin: "",
    etims_username: "",
    password: "",
    environment: "sandbox",
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/api/admin/kra-profile", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error saving profile");
      }

      const data = await res.json();
      setStatus(data.is_verified ? "Verified" : "Not Verified");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="mb-sm ">KRA eTIMS Setup</h3>
        {status && <p className="mt-md mb-md text-bold company-blue">Status: {status}</p>}


      <form onSubmit={handleSubmit} className="form-stack">
        <input
          className="input"
          placeholder="KRA PIN"
          value={form.kra_pin}
          onChange={(e) => setForm({ ...form, kra_pin: e.target.value })}
        />

        <input
          className="input"
          placeholder="eTIMS Username"
          value={form.etims_username}
          onChange={(e) => setForm({ ...form, etims_username: e.target.value })}
        />

        <input
          className="input"
          type="password"
          placeholder="eTIMS Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="input p-md"
          value={form.environment}
          onChange={(e) => setForm({ ...form, environment: e.target.value })}
        >
          <option value="sandbox">Sandbox</option>
          <option value="live">Live</option>
        </select>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Saving..." : "Save Credentials"}
        </button>
      </form>

    </div>
  );
}