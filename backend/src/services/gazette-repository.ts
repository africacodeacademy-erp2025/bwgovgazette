import { supabase } from "../utils/supabase/supabase-client";
import type { GazetteRecord } from "../model/types";

export class DatabaseError extends Error {
  constructor(public cause: unknown, message?: string) {
    super(message || "Database operation failed");
    this.name = "DatabaseError";
  }
}

export class GazetteRepository {
  async createRecord(data: Omit<GazetteRecord, "id">): Promise<GazetteRecord> {
    // Ask Supabase to return the inserted row. Using `.select()` after
    // `.insert()` ensures the server will include the row data in the
    // response even when default behavior is to return nothing.
    const { data: inserted, error } = await supabase
      .from("gazettes")
      .insert(data)
      .select()
      .single();

    // If supabase returned an error, surface it
    if (error) {
      throw new DatabaseError(error, `Insert failed: ${error.message}`);
    }

    // Defensive check: sometimes the SDK may return `{ data: null, error: null }`
    // when RLS, permissions or other issues prevent returning the row. Fail
    // fast with a clear message instead of letting callers access `inserted.id`.
    if (!inserted) {
      throw new DatabaseError(
        inserted,
        "Insert succeeded but no row data was returned. Check RLS/permissions and that the table returns rows on insert."
      );
    }

    return inserted;
  }

  async updateProcessingStatus(
    id: string,
    status: GazetteRecord["processing_status"],
    extractedText?: string
  ): Promise<void> {
    const updateData: Partial<GazetteRecord> = { processing_status: status };
    if (extractedText !== undefined) updateData.extracted_text = extractedText;

    const { error } = await supabase
      .from("gazettes")
      .update(updateData)
      .eq("id", id);

    if (error)
      throw new DatabaseError(error, `Update failed: ${error.message}`);
  }

  async findAll(limit = 50, offset = 0): Promise<GazetteRecord[]> {
    const { data, error } = await supabase
      .from("gazettes")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new DatabaseError(error, `Query failed: ${error.message}`);
    return data ?? [];
  }

  async findById(id: string): Promise<GazetteRecord | null> {
    const { data, error } = await supabase
      .from("gazettes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if ("code" in error && error.code === "PGRST116") return null;
      if ("status" in error && error.status === 406) return null;

      if (/No rows/i.test(error.message)) return null;

      throw new DatabaseError(error, `FindById failed: ${error.message}`);
    }

    return data ?? null;
  }
}
