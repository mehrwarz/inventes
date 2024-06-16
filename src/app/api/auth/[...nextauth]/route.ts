// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/Auth';

export const { GET, POST } = handlers;
