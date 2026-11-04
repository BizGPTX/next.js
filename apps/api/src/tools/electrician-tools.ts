export function generateQuote(input: {
  workType: string;
  urgency: 'standard' | 'urgent';
  budget?: number;
}): { total: number; lineItems: Array<{ label: string; amount: number }>; exclusions: string[]; upsells: string[] } {
  const base = input.workType.includes('switchboard') ? 420 : 240;
  const urgency = input.urgency === 'urgent' ? 120 : 0;
  const total = base + urgency;

  return {
    total,
    lineItems: [
      { label: `Labour and materials for ${input.workType}`, amount: base },
      { label: 'Urgency callout', amount: urgency },
    ],
    exclusions: ['Permit fees', 'Asbestos handling', 'Major rewiring beyond scope'],
    upsells: ['Safety check package', 'Switchboard inspection', 'Surge protection upgrade'],
  };
}

export function proposeSlots(): string[] {
  return ['2026-01-12T09:00:00+10:00', '2026-01-12T13:00:00+10:00', '2026-01-13T10:30:00+10:00'];
}

export function createInvoiceDraft(input: { customerName: string; quoteTotal: number; description: string }) {
  return {
    invoiceNumber: `INV-${Date.now()}`,
    customerName: input.customerName,
    currency: 'AUD',
    items: [{ description: input.description, quantity: 1, unitPrice: input.quoteTotal }],
    subtotal: input.quoteTotal,
    gst: Number((input.quoteTotal * 0.1).toFixed(2)),
    total: Number((input.quoteTotal * 1.1).toFixed(2)),
    status: 'draft',
  };
}
