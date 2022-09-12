import { createClient } from '@supabase/supabase-js';
import * as encryption from './lib/encryption';
import { storage } from './storage';

export interface Note {
  id: string;
  created_at: string;
  text: string;
  tags: string[];
}

export type Tag = string;

const {
  supabaseUrl,
  supabaseKey,
  encryptionPassword, } = storage.loadSettings();

const encrypt = encryption.encrypt(encryptionPassword);
const decrypt = encryption.decrypt(encryptionPassword);

const supabase = createClient(supabaseUrl || 'error', supabaseKey || 'error');

// early optimisation to save my free tier quota
let tagsCache: Tag[] = null as any;

export const api = {
  loadTags: async (): Promise<Tag[]> => {
    if (tagsCache === null) {
      const result = await supabase
        .from('lane_tags')
        .select() as any;

      const encryptedTags = result.data.map((row: any) => row.text);

      tagsCache = await Promise.all(
        encryptedTags.map(decrypt));
    }

    return tagsCache;
  },

  loadNotes: async (): Promise<Note[]> => {
    const result = await supabase
      .from('lane_notes')
      .select()
      .order('created_at', { ascending: true });

    return await Promise.all((result.data || []).map(async (row: any) => {
      const text = await decrypt(row.text) as string;
      const tags = await Promise.all(row.tags.map(decrypt)) as Tag[];

      const e: Note = {
        id: row.id,
        created_at: row.created_at,
        text,
        tags,
      };
      return e;
    }));
  },

  save: async (text: string, tags: Tag[]): Promise<void> => {
    tagsCache = null as any;

    const encryptedTags = await Promise.all(tags.map(encrypt));

    await supabase.from('lane_notes').insert({
      id: uuid(),
      text: await encrypt(text),
      tags: encryptedTags,
    });
  }
};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
