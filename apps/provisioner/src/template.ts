export function generateTenantComposeTemplate(input: {
  tenantId: string;
  image: string;
  internalSigningKey: string;
  telegramEnabled: boolean;
  whatsappEnabled: boolean;
}): string {
  return `services:
  openclaw-${input.tenantId}:
    image: ${input.image}
    restart: unless-stopped
    environment:
      TENANT_ID: ${input.tenantId}
      INTERNAL_SIGNING_KEY: ${input.internalSigningKey}
      TELEGRAM_ENABLED: ${input.telegramEnabled}
      WHATSAPP_ENABLED: ${input.whatsappEnabled}
    networks:
      - tenant_${input.tenantId}
    volumes:
      - tenant_${input.tenantId}_data:/var/lib/openclaw
networks:
  tenant_${input.tenantId}:
    driver: bridge
    internal: true
volumes:
  tenant_${input.tenantId}_data:
`;
}
