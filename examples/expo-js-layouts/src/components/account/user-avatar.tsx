import { Avatar, type AvatarProps } from "bokoui/expo";
import type { User } from "@/lib/types";

export interface UserAvatarProps {
  user: Pick<User, "name" | "avatarUrl">;
  size?: AvatarProps["size"];
}

/** The user's photo, with their initials behind it until it loads (and when there is none). */
export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  return <Avatar size={size} src={user.avatarUrl} name={user.name} color="primary" />;
}
