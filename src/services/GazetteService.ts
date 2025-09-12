import { supabase } from '@/integrations/supabase/client';
import { DocumentExtractor } from './DocumentExtractor';

export interface Gazette {
  id: string;
  title: string;
  content?: string;
  category?: string;
  description?: string;
  status: string;
  published_date: string;
  created_at: string;
  uploaded_by?: string;
  storage_path?: string;
  file_name?: string;
  file_size?: number;
}

export class GazetteService {
  static async createGazette(gazetteData: {
    title: string;
    description?: string;
    category?: string;
    content?: string;
    file?: File;
    status?: string;
  }): Promise<Gazette> {
    try {
      let storagePath = null;
      let fileName = null;
      let fileSize = null;
      let finalContent = gazetteData.content || '';

      // Handle file upload if provided
      if (gazetteData.file) {
        const fileExt = gazetteData.file.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gazettes')
          .upload(filePath, gazetteData.file);

        if (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        storagePath = uploadData.path;
        fileName = gazetteData.file.name;
        fileSize = gazetteData.file.size;

        // Extract text if no content provided
        if (!finalContent) {
          try {
            const extractResult = await DocumentExtractor.extractText(gazetteData.file);
            finalContent = extractResult.text;
          } catch (error) {
            console.warn('Text extraction failed:', error);
            // Continue without extracted content
          }
        }
      }

      // Insert gazette record
      const { data, error } = await supabase
        .from('gazettes')
        .insert({
          title: gazetteData.title,
          description: gazetteData.description,
          category: gazetteData.category,
          content: finalContent,
          status: gazetteData.status || 'draft',
          published_date: new Date().toISOString().split('T')[0],
          storage_path: storagePath,
          file_name: fileName,
          file_size: fileSize,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Database insert failed: ${error.message}`);
      }

      return data as Gazette;
    } catch (error) {
      console.error('Create gazette error:', error);
      throw error;
    }
  }

  static async getGazettes(options?: {
    status?: string;
    category?: string;
    search?: string;
    limit?: number;
  }): Promise<Gazette[]> {
    try {
      let query = supabase
        .from('gazettes')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.category) {
        query = query.eq('category', options.category);
      }

      if (options?.search) {
        query = query.or(
          `title.ilike.%${options.search}%,description.ilike.%${options.search}%,content.ilike.%${options.search}%`
        );
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch gazettes: ${error.message}`);
      }

      return data as Gazette[];
    } catch (error) {
      console.error('Get gazettes error:', error);
      throw error;
    }
  }

  static async getGazette(id: string): Promise<Gazette | null> {
    try {
      const { data, error } = await supabase
        .from('gazettes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to fetch gazette: ${error.message}`);
      }

      return data as Gazette | null;
    } catch (error) {
      console.error('Get gazette error:', error);
      throw error;
    }
  }

  static async updateGazette(id: string, updates: Partial<Gazette>): Promise<Gazette> {
    try {
      const { data, error } = await supabase
        .from('gazettes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update gazette: ${error.message}`);
      }

      return data as Gazette;
    } catch (error) {
      console.error('Update gazette error:', error);
      throw error;
    }
  }

  static async deleteGazette(id: string): Promise<void> {
    try {
      // First get the gazette to find storage path
      const gazette = await this.getGazette(id);
      
      // Delete file from storage if exists
      if (gazette?.storage_path) {
        await supabase.storage
          .from('gazettes')
          .remove([gazette.storage_path]);
      }

      // Delete database record
      const { error } = await supabase
        .from('gazettes')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete gazette: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete gazette error:', error);
      throw error;
    }
  }

  static async getFileUrl(storagePath: string): Promise<string> {
    try {
      const { data } = await supabase.storage
        .from('gazettes')
        .getPublicUrl(storagePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Get file URL error:', error);
      throw error;
    }
  }
}