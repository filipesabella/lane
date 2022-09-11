import * as React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import '../../style/Main.less';
import { api, Tag } from '../api';
import { TagSelector } from './TagSelector';

export const Main = () => {
  const [text, setText] = useState(localStorage.getItem('lane_text') || '');
  const onChangeText = (text: string) => {
    setText(text);
    localStorage.setItem('lane_text', text);
  };

  const [tags, setTags] = useState<Tag[]>(JSON.parse(
    localStorage.getItem('lane_tags') || '[]'));
  const onChangeTags = (tags: Tag[]) => {
    setTags(tags);
    localStorage.setItem('lane_tags', JSON.stringify(tags));
  };

  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);

    await api.save(text, tags);

    setSaving(false);
    onChangeText('');

    toast('Saved');
  };

  return <div className="main">
    <div className="textarea-container">
      <textarea autoFocus
        placeholder="type away"
        onChange={e => onChangeText(e.target.value)}
        value={text} />
    </div>
    <TagSelector
      selectedTags={tags}
      onChange={onChangeTags} />
    <button
      disabled={text === '' || saving}
      className="save"
      onClick={save}>{saving ? 'saving ...' : 'save'}</button>
  </div>;
};
