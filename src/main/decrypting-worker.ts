import { Note } from './api';
import { decrypt } from './lib/encryption';

export type WorkerResponseMessage = {
  data: {
    note: Note;
  }
};

addEventListener('message', async message => {
  const { dbNote, password, } = message.data;
  const note = await dbNoteToNote(dbNote, password);
  postMessage({ note });
});

async function dbNoteToNote(dbNote: any, password: string): Promise<any> {
  return {
    ...dbNote,
    text: await decrypt(password)(dbNote.text),
    tags: await Promise.all(dbNote.tags.map(decrypt(password))),
  };
}
