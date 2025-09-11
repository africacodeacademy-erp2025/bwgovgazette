import { supabase } from "../../utils/supabase/supabase-client";
import { randomUUID } from "crypto";

export class FileStorageService {
  private bucketName = "gazettes";

  async uploadFile(file: File): Promise<{ fileName: string; fileUrl: string }> {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${randomUUID()}.${fileExtension}`;

    // Ensure we upload a Node Buffer (supabase storage in Node expects a Buffer/Readable)
    let uploadPayload: Buffer | File = file as File;
    try {
      // Try to get an ArrayBuffer from the provided File-like object
      const arrayBuffer = await (file as File).arrayBuffer();
      uploadPayload = Buffer.from(arrayBuffer);
    } catch (e) {
      // If arrayBuffer isn't available, fall back to sending the object as-is
      // (this keeps compatibility with other callers)
      uploadPayload = file as unknown as Buffer;
    }

    const { error } = await supabase.storage
      .from(this.bucketName)
      .upload(fileName, uploadPayload, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const { data: publicUrl } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(fileName);

    return {
      fileName,
      fileUrl: publicUrl.publicUrl,
    };
  }

  async deleteFile(fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([fileName]);

    if (error) {
      throw new Error(`Storage delete failed: ${error.message}`);
    }
  }
}
