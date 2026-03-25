export default async function ApprovalsPage() {
  const res = await fetch(`${process.env.API_BASE_URL ?? 'http://api:4000'}/api/approvals`, { cache: 'no-store' });
  const approvals = (await res.json()) as Array<{ id: string; status: string; tool_name: string }>;
  return (
    <main>
      <h2>Approval Queue</h2>
      <ul>
        {approvals.map((item) => (
          <li key={item.id}>{item.tool_name} - {item.status}</li>
        ))}
      </ul>
    </main>
  );
}
