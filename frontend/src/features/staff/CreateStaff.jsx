// // frontend/src/features/staff/CreateStaff.jsx
// import { useState, useEffect } from "react";
// import StaffForm from "./StaffForm";
// import { createStaff as apiCreateStaff } from "../../api/staff";
// // import styles from "./StaffForm.module.css";

// export default function CreateStaff({ onCreated }) {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [formKey, setFormKey] = useState(0); // key to reset form
//   const token = localStorage.getItem("token");

//   const handleSubmit = async (formData) => {
//     setMessage("");
//     try {
//       const res = await apiCreateStaff(formData, token);
//       setMessage(`Staff created! Temporary password: ${res.temporary_password}`);
//       setModalOpen(false);
//       if (onCreated) onCreated();
//     } catch (err) {
//       setMessage(err.message || "Server error or invalid input");
//     }
//   };

//   // Reset form each time modal opens
//   useEffect(() => {
//     if (modalOpen) setFormKey(prev => prev + 1);
//   }, [modalOpen]);

//   return (
//     <div>
//       <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
//         Create New Staff
//       </button>

//       {message && <p className="message">{message}</p>}

//       {modalOpen && (
//         <div className="mmodal-overlay">
//           <div className="modal card">
//             <h3 className="mb-md">Create New Staff</h3>
//             <StaffForm
//               key={formKey}               // important: force re-mount to reset inputs
//               initialData={{}}             // important: controlled inputs need an object
//               onSubmit={handleSubmit}
//               onClose={() => setModalOpen(false)}
//               submitLabel="Create Staff"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// frontend/src/features/staff/CreateStaff.jsx
import { useState, useEffect } from "react";
import StaffForm from "./StaffForm";
import { createStaff as apiCreateStaff } from "../../api/staff";
import Modal from "../../components/Modal";

export default function CreateStaff({ onCreated }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formKey, setFormKey] = useState(0); // force remount
  const token = localStorage.getItem("token");

  const handleSubmit = async (formData) => {
    setMessage("");
    try {
      const res = await apiCreateStaff(formData, token);
      setMessage(`Staff created! Temporary password: ${res.temporary_password}`);
      setModalOpen(false);
      if (onCreated) onCreated();
    } catch (err) {
      setMessage(err.message || "Server error or invalid input");
    }
  };

  // Reset form & message every time modal opens
  useEffect(() => {
    if (modalOpen) {
      setFormKey(prev => prev + 1);
      setMessage("");
    }
  }, [modalOpen]);

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
        Create New Staff
      </button>

      {modalOpen && (
        <Modal
          title="Create New Staff"
          onClose={() => setModalOpen(false)}
        >
          <StaffForm
            key={formKey}             // force remount to clear inputs
            initialData={{}}          // empty form for new staff
            onSubmit={handleSubmit}
            onClose={() => setModalOpen(false)}
            submitLabel="Create Staff"
          />
        </Modal>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}
