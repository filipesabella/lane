import * as React from 'react';
import '../../style/Notes.less';
import { api } from '../api';

export const Notes = () => {
  const notes = api.loadNotes();
  return <div className="notes">
    <table>
      <thead>

      </thead>
      <tbody>
        {notes.map(n => {
          return <tr key={n.id}>
            <td>{n.text}</td>
            <td>{n.tags.join(',')}</td>
            <td>{n.created_at}</td>
          </tr>;
        })}
      </tbody>
    </table>
  </div>;
};
