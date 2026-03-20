import { useState } from "react";
import { updateNotes } from "../api/sessions.api";

interface UseUpdateNotesResult {
  save: (sessionId: string, notes: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useUpdateNotes(): UseUpdateNotesResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(sessionId: string, notes: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      await updateNotes(sessionId, notes);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update notes");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { save, loading, error };
}