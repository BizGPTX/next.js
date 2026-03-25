import Link from 'next/link';

async function getTenants() {
  const res = await fetch(`${process.env.API_BASE_URL ?? 'http://api:4000'}/api/tenants`, { cache: 'no-store' });
  return (await res.json()) as Array<{ id: string; name: string; status: string }>;
}

export default async function HomePage() {
  const tenants = await getTenants().catch(() => []);
  return (
    <main>
      <h1>BizGPTX Operator Dashboard</h1>
      <p>Secure Agent Hosting (AU)</p>
      <ul>
        {tenants.map((tenant) => (
          <li key={tenant.id}>
            <Link href={`/tenants/${tenant.id}`}>{tenant.name}</Link> — {tenant.status}
          </li>
        ))}
      </ul>
      <nav>
        <Link href="/approvals">Approvals</Link> | <Link href="/sessions">Sessions</Link>
      </nav>
    </main>
  );
}
