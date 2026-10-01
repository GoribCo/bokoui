import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

/** Up to two initials of a name, for the avatar fallback. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export interface UserAvatarProps {
  user: Pick<User, "name" | "avatarUrl">;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "default", md: "default", lg: "lg" } as const;

/** The user's photo; initials show when there is no photo or it fails to load (FR-5.1). */
export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  return (
    <Avatar size={sizes[size]} className={cn(size === "lg" && "size-14", className)}>
      {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
      <AvatarFallback className="text-foreground">{initials(user.name)}</AvatarFallback>
    </Avatar>
  );
}
