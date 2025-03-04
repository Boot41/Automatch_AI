import { User } from "@prisma/client"; // Import the User type from Prisma

declare module "express" {
  interface Request {
    user?: User; // Now the whole User object will be accessible
  }
}
