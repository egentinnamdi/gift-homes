import bcrypt from "bcryptjs";
import { User, RegisterDTO } from "@gift-homes/shared";
import { collection } from "../utils/store.js";
import { ENV } from "../config/env.js";

export interface StoredUser extends User {
  id: string;
  passwordHash: string;
}

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
const ADMIN_ID = "usr_admin_00";

const users = collection<StoredUser>("users", {
  order: "asc",
  seed: () => [
    {
      id: ADMIN_ID,
      name: "GiftHomes Admin",
      email: ENV.ADMIN_EMAIL,
      role: "admin",
      location: "Enugu, Nigeria",
      avatar: AVATAR,
      createdAt: new Date().toISOString(),
      passwordHash: bcrypt.hashSync(ENV.ADMIN_PASSWORD, 10),
    },
  ],
});

export const toPublicUser = ({ passwordHash: _p, ...user }: StoredUser): User => user;

// Keep the seeded admin account's email in step with ADMIN_EMAIL (the password is untouched).
let adminSynced: Promise<void> | null = null;
const syncAdmin = () =>
  (adminSynced ??= (async () => {
    const admin = await users.get(ADMIN_ID);
    if (admin && admin.email.toLowerCase() !== ENV.ADMIN_EMAIL.toLowerCase()) {
      if (!(await users.findBy("email", ENV.ADMIN_EMAIL))) {
        await users.replace({ ...admin, email: ENV.ADMIN_EMAIL });
        console.log(`[auth] Admin email updated to ${ENV.ADMIN_EMAIL}`);
      }
    }
  })().catch((e) => {
    adminSynced = null;
    throw e;
  }));

export class UserModel {
  static async findAll(): Promise<User[]> {
    await syncAdmin();
    return (await users.list()).map(toPublicUser);
  }

  static async findById(id: string): Promise<User | undefined> {
    await syncAdmin();
    const u = await users.get(id);
    return u && toPublicUser(u);
  }

  static async findStoredByEmail(email: string): Promise<StoredUser | undefined> {
    await syncAdmin();
    return users.findBy("email", email);
  }

  static async create(data: RegisterDTO & { password: string }): Promise<User> {
    const user: StoredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: data.name,
      email: data.email.toLowerCase(),
      // Public registration can never mint admins.
      role: data.role === "admin" ? "buyer" : data.role,
      phone: data.phone,
      location: data.role === "diaspora" ? "Diaspora Investor" : "Enugu, Nigeria",
      avatar: AVATAR,
      createdAt: new Date().toISOString(),
      passwordHash: bcrypt.hashSync(data.password, 10),
    };
    await users.insert(user);
    return toPublicUser(user);
  }

  static async setPassword(id: string, password: string): Promise<boolean> {
    const u = await users.get(id);
    if (!u) return false;
    await users.replace({ ...u, passwordHash: bcrypt.hashSync(password, 10) });
    return true;
  }

  static async setRole(id: string, role: User["role"]): Promise<User | undefined> {
    const u = await users.get(id);
    if (!u) return undefined;
    const next = { ...u, role };
    await users.replace(next);
    return toPublicUser(next);
  }

  static remove(id: string): Promise<boolean> {
    return users.remove(id);
  }
}
