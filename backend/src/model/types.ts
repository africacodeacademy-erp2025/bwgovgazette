export interface GazetteUploadResult {
    success: boolean;
  data?: {
    fileName: string;
    fileUrl: string;
    textPreview?: string;
  };
     error?: string;
}

export interface GazetteRecord {
    id: string; // Add the id from the database schema
    file_name: string;
    file_url: string;
    extracted_text: string;
    processing_status: 'pending' | 'completed' | 'failed';
    created_at?: string;
    updated_at?: string;
}

export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

export interface GazetteChunk {
  id: string;
  gazette_id: string;
  content: string;
  similarity: number;
}
