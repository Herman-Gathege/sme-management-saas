// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import styles from "./Customers.module.css"; // create or reuse styles
// import { useNavigate } from "react-router-dom";

// export default function AllCustomers() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   const API_BASE = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const res = await fetch(`${API_BASE}/api/customers`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Failed to fetch customers");

//         setCustomers(Array.isArray(data) ? data : []);
//       } catch (err) {
//         setMessage(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, [API_BASE]);

//   return (
//     <section className={styles.customersPage}>
//       <h2>All Customers</h2>

//       {loading && <p>Loading customers…</p>}
//       {message && <p className={styles.error}>{message}</p>}

//       {!loading && customers.length === 0 && <p>No customers found.</p>}

//       {!loading && customers.length > 0 && (
//         <table className={styles.customersTable}>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Business</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((c, idx) => (
//               <tr key={c.id}>
//                 <td>{idx + 1}</td>
//                 <td>{c.name}</td>
//                 <td>{c.business_name || "—"}</td>
//                 <td>{c.email || "—"}</td>
//                 <td>{c.phone || "—"}</td>
//                 <td>{c.role}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </section>
//   );
// }


import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Customers.module.css"; // optional for messages
import dashboardStyles from "../../features/dashboard/layout/DashboardLayout.module.css"; // reuse table/card styles
import { useNavigate } from "react-router-dom";

export default function AllCustomers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch customers");

        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [API_BASE]);

  return (
    <section className={dashboardStyles.content}>
      <div className={dashboardStyles["stock-history-card"]}>
        <h3>All Customers</h3>

        {loading && <p>Loading customers…</p>}
        {message && <p className={styles.error}>{message}</p>}

        {!loading && customers.length === 0 && <p>No customers found.</p>}

        {!loading && customers.length > 0 && (
          <div className={dashboardStyles["table-wrapper"]}>
            <table className={dashboardStyles["stock-history-table"]}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Business</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, idx) => (
                  <tr key={c.id}>
                    <td>{idx + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.business_name || "—"}</td>
                    <td>{c.email || "—"}</td>
                    <td>{c.phone || "—"}</td>
                    <td>{c.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
