export class FileValidator {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = ['application/pdf'];

  static validate(file: File): { valid: boolean; error?: string } {
    if (!file || file.size === 0) {
      return { valid: false, error: "No file uploaded" };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: "Only PDF files are allowed" };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: "File size exceeds 10MB limit" };
    }

    return { valid: true };
  }
}