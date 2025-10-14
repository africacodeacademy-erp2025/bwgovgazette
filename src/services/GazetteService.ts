import { supabase } from '@/integrations/supabase/client';
import { DocumentExtractor } from './DocumentExtractor';

export interface Gazette {
  id: string;
  file_name: string;
  file_url: string;
  extracted_text?: string;
  processing_status: string;
  created_at: string;
  pricing_tier?: 'free' | 'premium';
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
          file_name: fileName || gazetteData.title,
          file_url: storagePath || '',
          extracted_text: finalContent,
          processing_status: 'completed'
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
    search?: string;
    limit?: number;
  }): Promise<Gazette[]> {
    try {
      let query = supabase
        .from('gazettes')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.search) {
        query = query.ilike('extracted_text', `%${options.search}%`);
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
      if (gazette?.file_url) {
        await supabase.storage
          .from('gazettes')
          .remove([gazette.file_url]);
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

  static async saveGazetteToFavorites(userId: string, gazetteId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('saved_gazettes')
        .insert({ user_id: userId, gazette_id: gazetteId })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save gazette: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error('Save gazette to favorites error:', error);
      throw error;
    }
  }

  static async removeGazetteFromFavorites(userId: string, gazetteId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_gazettes')
        .delete()
        .eq('user_id', userId)
        .eq('gazette_id', gazetteId);

      if (error) {
        throw new Error(`Failed to remove gazette from favorites: ${error.message}`);
      }
    } catch (error) {
      console.error('Remove gazette from favorites error:', error);
      throw error;
    }
  }

  static async isGazetteInFavorites(userId: string, gazetteId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('saved_gazettes')
        .select('id')
        .eq('user_id', userId)
        .eq('gazette_id', gazetteId)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to check favorite status: ${error.message}`);
      }
      return !!data;
    } catch (error) {
      console.error('Check favorite status error:', error);
      throw error;
    }
  }

  static async getSavedGazettes(userId: string): Promise<Gazette[]> {
    try {
      const { data: savedData, error: savedError } = await supabase
        .from('saved_gazettes')
        .select('gazette_id')
        .eq('user_id', userId);

      if (savedError) {
        throw new Error(`Failed to fetch saved gazette IDs: ${savedError.message}`);
      }

      if (!savedData || savedData.length === 0) {
        return [];
      }

      const documentIds = savedData.map(item => item.gazette_id);

      const { data: gazettesData, error: gazettesError } = await supabase
        .from('documents') // Assuming 'documents' is the correct table name
        .select(`
          id,
          file_name,
          created_at,
          processing_status,
          document_texts (
            content
          )
        `)
        .in('id', documentIds)
        .order('created_at', { ascending: false });

      if (gazettesError) {
        throw new Error(`Failed to fetch gazette details: ${gazettesError.message}`);
      }

      return gazettesData as Gazette[];
    } catch (error) {
      console.error('Get saved gazettes error:', error);
      throw error;
    }
  }
}