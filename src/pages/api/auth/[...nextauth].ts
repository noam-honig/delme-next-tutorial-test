import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserInfo } from "remult";
import { Roles } from "../../../shared/Roles";

const secret = process.env["NEXTAUTH_SECRET"] || "my secret";

const validUsers: UserInfo[] = [
  { id: "1", name: "Jane", roles: [Roles.admin] },
  { id: "2", name: "Steve" },
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Username",
      credentials: {
        name: {
          label: "Username",
          type: "text",
          placeholder: "Try Steve or Jane",
        },
      },
      authorize: (credentials) =>
        validUsers.find((user) => user.name === credentials?.name) || null,
    }),
  ],
  secret,
});

export async function getUserFromNextAuth(req: NextApiRequest) {
  const token = await getToken({ req, secret });
  console.log({ token });
  return validUsers.find(u => u.id === token?.sub);
}
