import { createClient } from '@supabase/supabase-js';
import { WorkerResponseMessage } from './decrypting-worker';
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

const supabase = createClient(supabaseUrl || 'error', supabaseKey || 'error');

let allNotes: Note[] = null as any;
let allTags: Tag[] = null as any;

// generated using the sequentialUUID forcing the date to 1970
const oldUUID = '00002a30-7177-4240-9e2d-c7437ea12e1a';

// configured all the all in supabase
const maxResultsPerCall = 100;

const localStorateNotesKey = 'lane_notes';
const supabaseNotesTable = 'lane_notes';

type ProgressCallback = (done: number, total: number) => void;


export const api = {
  sync: async (progress: ProgressCallback): Promise<void> => {
    const localNotes: Note[] = JSON.parse(localStorage
      .getItem(localStorateNotesKey) || '[]');

    const mostRecentLocalNoteId = localNotes.reduce((mostRecent, note) => {
      return note.id > mostRecent ? note.id : mostRecent;
    }, oldUUID);

    const result = await fetchAll(mostRecentLocalNoteId);

    const worker = new Worker('decrypting-worker.ts');
    const total = result.data.length;
    const newNotes = await new Promise<Note[]>((resolve) => {
      const notes: Note[] = [];
      worker.addEventListener('message', (message: WorkerResponseMessage) => {
        progress(notes.length, total);
        notes.push(message.data.note);

        if (notes.length === total) {
          worker.terminate();
          resolve(notes);
        }
      });

      result.data.forEach((dbNote: any) => {
        worker.postMessage({ dbNote, password: encryptionPassword });
      });
    });

    allNotes = localNotes.concat(newNotes);

    allTags = [...new Set(allNotes
      .reduce((tags, n) => tags.concat(n.tags), [] as Tag[]))];

    localStorage.setItem(localStorateNotesKey,
      JSON.stringify(localNotes.concat(newNotes)));
  },
  resync: async (): Promise<void> => {
    localStorage.setItem(localStorateNotesKey, '[]');
    await api.sync(() => { });
  },
  loadTags: (): Tag[] => {
    return allTags;
  },
  loadNotes: (): Note[] => {
    return allNotes;
  },
  save: async (text: string, tags: Tag[]): Promise<void> => {
    const id = sequentialUUID();

    await supabase.from(supabaseNotesTable).insert({
      id,
      text: await encrypt(text),
      tags: await Promise.all(tags.map(encrypt)),
    });

    updateLocalCache({
      id,
      created_at: new Date().toISOString(),
      text,
      tags,
    });
  },
  update: async (note: Note): Promise<void> => {
    // inserting and deleting instead of simply updating to simplify syncing
    // between devices. by updating we need to manually "resync" each client,
    // by doing it like this the automatic syncing process works.
    // ps: supabase doesn't have transactions yet.

    const oldId = note.id;
    const newId = sequentialUUID();

    await supabase.from(supabaseNotesTable).insert({
      id: newId,
      text: await encrypt(note.text),
      tags: await Promise.all(note.tags.map(encrypt)),
    });

    try {
      await supabase.from(supabaseNotesTable)
        .delete()
        .match({ id: oldId });
    } catch (e) {
      alert(`Faield to delete after inserting ${e}`);
    }

    updateLocalCache({
      ...note,
      id: newId,
    });
  }
};

// surely syncing by hand will surely lead to no bugs at all, ever
function updateLocalCache(note: Note): void {
  allTags = [...new Set(allTags.concat(note.tags))];
  allNotes = allNotes.find(n => n.id === note.id)
    ? allNotes.map(n => n.id === note.id ? note : n)
    : allNotes.concat(note);

  localStorage.setItem(localStorateNotesKey, JSON.stringify(allNotes));
}

async function fetchAll(id: string): Promise<any> {
  const result = await supabase
    .from(supabaseNotesTable)
    .select()
    .gt('id', id)
    .order('id', { ascending: true });

  if (result.data && result.data.length >= maxResultsPerCall) {
    const next = await fetchAll(result.data[result.data.length - 1].id);
    result.data = result.data.concat(next ? next.data : []);
    debugger;
    return result;
  } else {
    return result;
  }
}

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
