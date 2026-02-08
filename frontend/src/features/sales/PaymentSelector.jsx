//frontend/src/features/sales/PaymentSelector.jsx

export default function PaymentSelector({
  value,
  onChange,
  clearError,
  methods,
  styles,
}) {
  return (
    <div className={styles.paymentButtons}>
      {methods.map((m) => (
        <button
          key={m}
          type="button"
          className={value === m ? styles.activePayment : undefined}
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
