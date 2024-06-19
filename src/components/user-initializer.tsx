"use client";

import useUserStore from "~/store/useUserStore";
import type { User } from "~/types/user";

interface UserInitializerProps {
  user: User | null;
  children: React.ReactNode;
}

const UserInitializer: React.FC<UserInitializerProps> = ({
  user,
  children,
}) => {
  useUserStore.setState({ user });

  return children;
};

export default UserInitializer;
