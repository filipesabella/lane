import * as React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import '../../style/Main.less';
import { api, Tag } from '../api';
import { TagSelector } from './TagSelector';

let previousText = '';
let previousTags: Tag[] = [];

export const Main = () => {
  const [text, setText] = useState(previousText);
  const onChangeText = (text: string) => {
    setText(text);
    previousText = text;
  };

  const allTags = api.loadTags();
  const cityTags = allTags.filter(t => t.startsWith('city:'));
  const placeTags = allTags.filter(t => t.startsWith('place:'));

  const [selectedTags, setSelectedTags] = useState<Tag[]>(previousTags);

  const onChangeTags = (tags: Tag[]) => {
    setSelectedTags(tags);
    previousTags = tags;
  };

  const [city, setCity] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const allTags = [...new Set([...selectedTags, city, place])]
      .filter(t => !!t) as Tag[];

    toast.promise(api.save(text, allTags), {
      loading: 'Saving',
      success: 'Saved',
      error: 'Error when saving',
    }, {
      success: {
        duration: 1000,
        icon: null,
      },
    }).then(() => {
      setSaving(false);
      onChangeText('');
    });
  };

  return <div className="main">
    <div className="textarea-container">
      <textarea autoFocus
        placeholder="type away"
        onChange={e => onChangeText(e.target.value)}
        value={text} />
    </div>
    <div className="tags-container">
      <TagSelector
        selectedTags={selectedTags}
        onChange={onChangeTags} />
      <select className="city" defaultValue={''}
        onChange={e => setCity(e.target.value)}>
        <option value="" disabled hidden>Choose city ...</option>
        {cityTags.map(t => <option key={t}>{t}</option>)}
      </select>
      <select className="place" defaultValue={''}
        onChange={e => setPlace(e.target.value)}>
        <option value="" disabled hidden>Choose place ...</option>
        {placeTags.map(t => <option key={t}>{t}</option>)}
      </select>
    </div>
    <button
      disabled={text === '' || saving}
      className="save"
      onClick={save}>{saving ? 'saving ...' : 'save'}</button>
  </div>;
};
