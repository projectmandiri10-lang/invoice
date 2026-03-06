import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          document_type: 'invoice' | 'surat_jalan' | 'kwitansi';
          content: any;
          settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          document_type: 'invoice' | 'surat_jalan' | 'kwitansi';
          content: any;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          document_type?: 'invoice' | 'surat_jalan' | 'kwitansi';
          content?: any;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          document_type: 'invoice' | 'surat_jalan' | 'kwitansi';
          template_data: any;
          is_default: boolean;
          created_at: string;
        };
      };
    };
  };
};
