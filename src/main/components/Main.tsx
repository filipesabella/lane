import * as React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import '../../style/Main.less';
import { api, Tag } from '../api';
import { TagSelector } from './TagSelector';

let previousText = '';
let previousTags: Tag[] = [];
let previousAgeMin: string = '';
let previousAgeMax: string = '';

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

  const [ageMin, setAgeMin] = useState(previousAgeMin);
  const onChangeAgeMin = (age: string) => {
    setAgeMin(age);
    previousAgeMin = age;
  };

  const [ageMax, setAgeMax] = useState(previousAgeMax);
  const onChangeAgeMax = (age: string) => {
    setAgeMax(age);
    previousAgeMax = age;
  };

  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const ageTag = ageMin ? 'age:' + ageMin + (ageMax ? '-' + ageMax : '') : '';
    const allTags = selectedTags
      .concat(city ? city : [])
      .concat(place ? place : [])
      .concat(ageTag ? ageTag : []);

    toast.promise(api.save(text, [...new Set(allTags)]), {
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
      <div className="age">
        <label>Age</label>
        <input value={ageMin} onChange={e => onChangeAgeMin(e.target.value)} />
        -
        <input value={ageMax} onChange={e => onChangeAgeMax(e.target.value)} />
      </div>
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
