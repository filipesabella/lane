import { Note } from './api';
import { decrypt } from './lib/encryption';

export type WorkerResponseMessage = {
  data: {
    type: 'progress' | 'done';
    notes: Note[];
    doneCount: number;
  }
};

addEventListener('message', message => {
  const { notes, password, } = message.data;

  let doneCount = 0;
  Promise.all(notes.map(async (dbNote: any) => {
    const note = await dbNoteToNote(dbNote, password);
    postMessage({ type: 'progress', 'doneCount': ++doneCount });
    return note;
  })).then((notes: any) => postMessage({ type: 'done', 'notes': notes }));
});

async function dbNoteToNote(dbNote: any, password: string): Promise<any> {
  return {
    ...dbNote,
    text: await decrypt(password)(dbNote.text),
    tags: await Promise.all(dbNote.tags.map(decrypt(password))),
  };
}
