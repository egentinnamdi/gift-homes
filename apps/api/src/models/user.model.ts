import bcrypt from "bcryptjs";
import { User, RegisterDTO } from "@gift-homes/shared";
import { loadCollection, saveCollection } from "../utils/store.js";
import { ENV } from "../config/env.js";

export interface StoredUser extends User {
  passwordHash: string;
}

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

function seed(): StoredUser[] {
  const now = new Date().toISOString();
  return [
    {
      id: "usr_admin_00",
      name: "GiftHomes Admin",
      email: ENV.ADMIN_EMAIL,
      role: "admin",
      location: "Enugu, Nigeria",
      avatar: AVATAR,
      createdAt: now,
      passwordHash: bcrypt.hashSync(ENV.ADMIN_PASSWORD, 10),
    },
  ];
}

const users = loadCollection<StoredUser>("users", seed);

export const toPublicUser = ({ passwordHash: _p, ...user }: StoredUser): User => user;

export class UserModel {
  static findAll(): User[] {
    return users.map(toPublicUser);
  }

  static findById(id: string): User | undefined {
    const u = users.find((x) => x.id === id);
    return u && toPublicUser(u);
  }

  static findStoredByEmail(email: string): StoredUser | undefined {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static create(data: RegisterDTO & { password: string }): User {
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
    users.push(user);
    saveCollection();
    return toPublicUser(user);
  }

  static setPassword(id: string, password: string): boolean {
    const u = users.find((x) => x.id === id);
    if (!u) return false;
    u.passwordHash = bcrypt.hashSync(password, 10);
    saveCollection();
    return true;
  }

  static setRole(id: string, role: User["role"]): User | undefined {
    const u = users.find((x) => x.id === id);
    if (!u) return undefined;
    u.role = role;
    saveCollection();
    return toPublicUser(u);
  }

  static remove(id: string): boolean {
    const i = users.findIndex((x) => x.id === id);
    if (i === -1) return false;
    users.splice(i, 1);
    saveCollection();
    return true;
  }
}
