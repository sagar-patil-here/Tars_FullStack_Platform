import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export function useUserSync() {
  const { user } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (!user) return;

    syncUser({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress || "",
      name: user.fullName || user.firstName || "Anonymous",
      image: user.imageUrl,
    }).catch((error) => {
      console.error("Failed to sync user:", error);
    });
  }, [user, syncUser]);
}
