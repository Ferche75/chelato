import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

const MOCK_USER: User = {
  id: 1,
  unionId: "local_admin",
  name: "Admin Local",
  email: "admin@chelato.com.uy",
  avatar: null,
  role: "admin",
  password: null,
  phone: null,
  addresses: null,
  defaultBranchId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignInAt: new Date(),
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    user: MOCK_USER,
  };
}