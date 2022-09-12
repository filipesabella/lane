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

let allNotes: Note[] = null as any;
let allTags: Tag[] = null as any;

export const api = {
  sync: async (): Promise<void> => {
    const localNotes: Note[] = JSON.parse(localStorage
      .getItem('lane_notes') || '[]');
    const mostRecentLocalNote = localNotes.reduce((mostRecent, note) => {
      const date = new Date(note.created_at);
      return date > mostRecent ? date : mostRecent;
    }, new Date(1900, 0, 1));

    // TODO deal with supabase pagination
    const result = await supabase
      .from('lane_notes')
      .select()
      .gt('created_at', mostRecentLocalNote.toISOString())
      .order('created_at', { ascending: true });

    const newNotes = await Promise.all((result.data as Note[])
      .map<Promise<Note>>(async dbNote => ({
        ...dbNote,
        text: await decrypt(dbNote.text),
      })));

    allNotes = localNotes.concat(newNotes);

    allTags = [...new Set(allNotes
      .reduce((tags, n) => tags.concat(n.tags), [] as Tag[]))];

    localStorage.setItem('lane_notes',
      JSON.stringify(localNotes.concat(newNotes)));
  },
  loadTags: async (): Promise<Tag[]> => {
    return allTags;
  },
  loadNotes: async (): Promise<Note[]> => {
    return allNotes;
  },
  save: async (text: string, tags: Tag[]): Promise<void> => {
    // surely syncing by hand will lead to no bugs

    const id = uuid();

    await supabase.from('lane_notes').insert({
      id,
      text: await encrypt(text),
      tags,
    });

    allTags = [...new Set(allTags.concat(tags))];
    allNotes.concat({
      id,
      created_at: new Date().toISOString(),
      text,
      tags,
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
