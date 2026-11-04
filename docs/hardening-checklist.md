# Hardening Checklist

- [ ] Replace env secrets with cloud KMS/Vault-backed `SecretsProvider`
- [ ] Enable mTLS for internal service calls
- [ ] Move tenant containers to rootless runtime with seccomp/AppArmor profiles
- [ ] Enforce JWT auth on all operator endpoints
- [ ] Add WAF and Telegram signature verification
- [ ] Rotate per-tenant signing keys every 90 days
- [ ] Back up PostgreSQL with encryption + tested restores
- [ ] Configure SIEM export from audit event stream
- [ ] Enable image signing + admission verification
