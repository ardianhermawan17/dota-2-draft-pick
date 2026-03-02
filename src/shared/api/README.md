## If an API represents a business domain → put it in features.

## If it represents low-level transport config → put it in shared.

```
shared/utils/fetch-base-query.ts  ✅ (transport layer)
features/auth/api/authApi.ts      ✅ (domain layer)
```