import { Avatar } from "bokoui/react";
import type { User } from "@/types";

export interface UserAvatarProps {
  user: Pick<User, "name" | "avatarUrl">;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** The user's photo; initials show when there is no photo or it fails to load (FR-5.1). */
export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  return <Avatar size={size} src={user.avatarUrl} name={user.name} className={className} />;
}
