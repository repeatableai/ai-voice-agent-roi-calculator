import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client WITHOUT authentication for DEMO MODE
export const base44 = createClient({
  appId: "687ea8fd6120762e78dfa513",
  requiresAuth: false // DEMO MODE - Authentication disabled to allow testing without Base44 account
});
