// src/types/express/index.d.ts
import { Role } from "@prisma/client"; // Importuj enum Role z Prisma

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: Role;
      };
    }
  }
}

export {}; // Zapobiega konfliktom z innymi deklaracjami
