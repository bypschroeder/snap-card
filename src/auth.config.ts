import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "~/schemas";
import { getUserByEmail } from "~/data/user";

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user?.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            const {
              id,
              userName,
              firstName,
              lastName,
              email,
              emailVerified,
              image,
            } = user;
            return {
              id,
              userName: userName ?? null,
              firstName: firstName ?? null,
              lastName: lastName ?? null,
              email,
              emailVerified: emailVerified ?? null,
              image: image ? String(image) : null,
              password: user.password,
            };
          }
        }

        return null;
      },
    }),
  ],
};
