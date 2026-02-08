//frontend/src/features/sales/PaymentSelector.jsx

export default function PaymentSelector({
  value,
  onChange,
  clearError,
  methods,
}) {
  return (
    <div className="payment-buttons">
      {methods.map((m) => (
        <button
          key={m}
          type="button"
          className={value === m ? "active" : ""}
          onClick={() => {
            onChange(m);
            clearError?.();
          }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

