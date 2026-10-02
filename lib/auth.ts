import { betterAuth } from 'better-auth';

// Better Auth configuration
const authSecret = process.env.BETTER_AUTH_SECRET || 'nexus_id_secret_development_key_32_characters_minimum!';
const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const auth = betterAuth({
  secret: authSecret,
  baseURL: baseUrl,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'customer',
        input: false, // Don't let users set admin role arbitrarily via client
      },
      phone: {
        type: 'string',
        required: false,
        defaultValue: '',
      },
      avatar: {
        type: 'string',
        required: false,
        defaultValue: '',
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export default auth;
