import * as React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import '../../style/Notes.less';
import { api, Note } from '../api';

export const Notes = () => {
  const notes = api.loadNotes();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [editedNote, setEditedNote] = useState('');
  const save = async () => {
    try {
      const n = JSON.parse(editedNote);
      toast.promise(api.update(n), {
        loading: 'Saving',
        success: 'Saved',
        error: 'Error when saving',
      }).then(() => {
        setSelectedNote(null);
      }).catch(e => alert(e));
    } catch (e) {
      alert(e);
    }
  };

  return <div className="notes">
    <table>
      <tbody>
        {notes.map(n => {
          return <tr key={n.id}>
            <td>{n.text}</td>
            <td>{n.tags.join(',')}</td>
            <td><button onClick={() => setSelectedNote(n)}>edit</button></td>
          </tr>;
        })}
      </tbody>
    </table>
    {selectedNote && <div className="edit-dialog">
      <div className="container">
        <textarea
          defaultValue={JSON.stringify(selectedNote, null, 2)}
          onChange={e => setEditedNote(e.target.value)} />
        <div className="actions">
          <button className="close"
            onClick={() => setSelectedNote(null)}>close</button>
          <button className="save"
            onClick={save}>save</button>
        </div>
      </div>
    </div>}
  </div>;
};
