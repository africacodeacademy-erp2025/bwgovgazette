import { prisma } from "../prisma";
import { hashPassword, comparePassword, validatePassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  role: string;
  token: string;
}

/**
 * Register a new user
 */
export async function registerUser(
  input: RegisterInput,
): Promise<AuthResponse> {
  const { email, password } = input;

  // Validate password strength
  const validation = validatePassword(password);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Get or create USER role
  let userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  if (!userRole) {
    userRole = await prisma.role.create({
      data: {
        name: "USER",
        description: "Default user role",
        permissions: ["read", "search", "download"],
      },
    });
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      roleId: userRole.id,
    },
    include: {
      role: true,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role.name,
    token,
  };
}

/**
 * Login a user
 */
export async function authenticateUser(
  input: LoginInput,
): Promise<AuthResponse> {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Update lastLogin
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role.name,
    token,
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
    select: {
      id: true,
      email: true,
      role: {
        select: {
          id: true,
          name: true,
          permissions: true,
        },
      },
      emailVerified: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  return user;
}
