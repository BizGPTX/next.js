interface Props {
  params: Promise<{ id: string }>;
}

export default async function TenantDetailPage({ params }: Props) {
  const { id } = await params;
  const [sessionsRes, approvalsRes] = await Promise.all([
    fetch(`${process.env.API_BASE_URL ?? 'http://api:4000'}/api/sessions/${id}`, { cache: 'no-store' }),
    fetch(`${process.env.API_BASE_URL ?? 'http://api:4000'}/api/approvals`, { cache: 'no-store' }),
  ]);
  const sessions = await sessionsRes.json();
  const approvals = await approvalsRes.json();

  return (
    <main>
      <h2>Tenant {id}</h2>
      <button type="button">Restart Tenant</button>
      <h3>Sessions</h3>
      <pre>{JSON.stringify(sessions, null, 2)}</pre>
      <h3>Approvals</h3>
      <pre>{JSON.stringify(approvals, null, 2)}</pre>
    </main>
  );
}
