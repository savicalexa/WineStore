import { useEffect } from "react";
import { useTransactions } from "../store/transactions";

export default function AdminTransactions() {
  const { transactions, fetchTransactions, loading, error } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Admin Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Wine</th>
              <th>Buyer</th>
              <th>Qty</th>
              <th>Amount (RSD)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.wineName} (#{t.wineId})</td>
                <td>{t.buyerEmail}</td>
                <td>{t.quantity}</td>
                <td>{t.amount}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
