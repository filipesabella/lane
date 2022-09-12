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

// generated using the sequentialUUID forcing the date to 1970
const oldUUID = '00002a30-7177-4240-9e2d-c7437ea12e1a';

export const api = {
  sync: async (): Promise<void> => {
    const localNotes: Note[] = JSON.parse(localStorage
      .getItem('lane_notes') || '[]');
    const mostRecentLocalNote = localNotes.reduce((mostRecent, note) => {
      return note.id > mostRecent ? note.id : mostRecent;
    }, oldUUID);

    // TODO deal with supabase pagination
    const result = await supabase
      .from('lane_notes')
      .select()
      .gt('id', mostRecentLocalNote)
      .order('created_at', { ascending: true });

    const newNotes = await Promise.all(((result.data || []) as Note[])
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
  loadTags: (): Tag[] => {
    return allTags;
  },
  loadNotes: (): Note[] => {
    return allNotes;
  },
  save: async (text: string, tags: Tag[]): Promise<void> => {
    // surely syncing by hand will lead to no bugs

    const id = sequentialUUID();

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

// https://github.com/maxtomczyk/sequential-uuid
function sequentialUUID() {
  const crypto = require('crypto');
  const timeBytes = Buffer.alloc(4);
  timeBytes.writeUInt32BE(Math.round(+new Date() / 1000));
  let uuid = Buffer
    .concat([timeBytes, crypto.randomBytes(12)], 16)
    .toString('hex');
  const parts = [
    uuid.slice(0, 8),
    uuid.slice(8, 12),
    uuid.slice(12, 16),
    uuid.slice(16, 20),
    uuid.slice(20, 32)
  ];
  parts[2] = '4' + parts[2].slice(1);
  // tslint:disable-next-line: restrict-plus-operands
  parts[3] = [8, 9, 'a', 'b'][Math.floor(Math.random() * 4)] +
    parts[3].slice(1);
  return `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}-${parts[4]}`;
}
