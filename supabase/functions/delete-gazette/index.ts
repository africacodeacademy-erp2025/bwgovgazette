import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const GCS_BUCKET_NAME = "gov-gazette-pdfs";

serve(async (req) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response("Gazette ID is required.", { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // First, retrieve the file_name to delete from GCS
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .select("file_name")
      .eq("id", id)
      .single();

    if (docError || !docData) {
      console.error("Error fetching document:", docError);
      return new Response(
        JSON.stringify({ error: "Document not found or could not be fetched." }),
        { status: 404 }
      );
    }

    const { file_name } = docData;

    // Delete related records from document_texts
    const { error: textError } = await supabase
      .from("document_texts")
      .delete()
      .eq("doc_id", id);

    if (textError) {
      console.error("Error deleting document texts:", textError);
      return new Response(
        JSON.stringify({ error: "Failed to delete associated document texts." }),
        { status: 500 }
      );
    }

    // Delete the document record itself
    const { error: docDeleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (docDeleteError) {
      console.error("Error deleting document:", docDeleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete the document." }),
        { status: 500 }
      );
    }

    // Delete the file from Google Cloud Storage
    if (file_name) {
      const gcsUrl = `https://storage.googleapis.com/upload/storage/v1/b/${GCS_BUCKET_NAME}/o/${encodeURIComponent(file_name)}?key=${Deno.env.get("GCS_API_KEY")}`;
      const gcsResponse = await fetch(gcsUrl, { method: 'DELETE' });

      if (!gcsResponse.ok) {
        console.warn(`Could not delete file from GCS: ${file_name}. Status: ${gcsResponse.statusText}`);
      }
    }

    return new Response(
      JSON.stringify({ message: "Gazette and associated data deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response(
      JSON.stringify({ error: "An internal server error occurred." }),
      { status: 500 }
    );
  }
});