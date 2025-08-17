import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@sloty/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findFirst({
          where: { email: credentials.email },
          include: { tenant: true },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenant.name,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.tenantId = (user as any).tenantId
        token.tenantName = (user as any).tenantName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
        session.user.tenantName = token.tenantName as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getAuth() {
  // This would be implemented based on the specific Next.js context
  return null
}

export function requireRole(role: string) {
  return async function (req: any) {
    const session = await getAuth()
    if (!session || session.user.role !== role) {
      throw new Error("Unauthorized")
    }
    return session
  }
}

export function requireTenantRole(roles: string[]) {
  return async function (req: any) {
    const session = await getAuth()
    if (!session || !roles.includes(session.user.role)) {
      throw new Error("Unauthorized")
    }
    return session
  }
}
