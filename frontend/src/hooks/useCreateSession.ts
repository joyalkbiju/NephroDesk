import { useState } from "react";
import { createSession, type CreateSessionPayload } from "../api/sessions.api";
import type { Session } from "../types/session.types";

interface UseCreateSessionResult {
  submit: (payload: CreateSessionPayload) => Promise<Session | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateSession(): UseCreateSessionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: CreateSessionPayload): Promise<Session | null> {
    setLoading(true);
    setError(null);
    try {
      const session = await createSession(payload);
      return session;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create session");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}