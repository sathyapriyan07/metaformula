type Metadata = Record<string, unknown> | null | undefined;

type RoleUser =
  | {
      user_metadata?: Metadata;
      app_metadata?: Metadata;
    }
  | null
  | undefined;

function normalizeRole(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function getRoleFromMetadata(metadata: Metadata): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  return normalizeRole((metadata as Record<string, unknown>).role);
}

export function getUserRole(user: RoleUser): string | null {
  if (!user) {
    return null;
  }

  // Prefer raw_user_meta_data.role for this project's role model.
  const userMetadataRole = getRoleFromMetadata(user.user_metadata);
  if (userMetadataRole) {
    return userMetadataRole;
  }

  // Fallback keeps existing app_metadata-based admins working.
  return getRoleFromMetadata(user.app_metadata);
}

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin";
}

export function isAdminUser(user: RoleUser): boolean {
  return isAdminRole(getUserRole(user));
}
