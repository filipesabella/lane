import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../style/TagSelector.less';

type Tag = {
  id: string;
  text: string;
  visible: boolean;
};

export const TagSelector = () => {
  const [tags, setTags] = useState<Tag[]>(testTags
    .map((t: any) => ({ ...t, visible: true, })));

  const [selected, setSelected] = useState<Tag[]>([]);

  const [criteria, setCriteria] = useState('');
  const [showingDropdown, setShowingDropdown] = useState(false);

  const changeSearch = (criteria: string) => {
    setTags(tags => tags.map(tag => ({
      ...tag,
      visible: tag.text.toLowerCase().includes(criteria.toLowerCase()),
    })));
    setCriteria(criteria);
  };

  const tagToggle = (tag: Tag, selected: boolean) => {
    setSelected(s => selected
      ? s.concat(tag)
      : s.filter(({ id }) => id !== tag.id));

    changeSearch('');
  };

  const addNew = () => {
    const possibleExistingTag = tags.find(({ text }) =>
      text.toLowerCase() === criteria.toLowerCase());

    if (possibleExistingTag) {
      const alreadySelected = !!selected
        .find(({ id }) => id === possibleExistingTag.id);
      !alreadySelected && setSelected(selected.concat(possibleExistingTag));
    } else {
      const newTag = {
        id: uuid(),
        text: criteria,
        visible: true,
      };
      setTags([newTag, ...tags]);
      setSelected([newTag, ...selected]);
    }
    changeSearch('');
  };

  const removeTag = (t: Tag) => setSelected(selected
    .filter(({ id }) => id !== t.id));

  const keyPressed = (key: string) => {
    if (key === 'Enter') {
      addNew();
    }
  };

  // actually upset I need this to keep the dropdown open when switching
  // focus from the criteria input field to clicking on the listed tags
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const target = e.target as any;
      setShowingDropdown(
        target.closest('.available-tags')
        || target.closest('.input-container'));
    };

    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, []);

  return <div className="tag-selector"
    onFocus={() => setShowingDropdown(true)}>
    <div className="input-container">
      <div className="selected-tags">
        {selected.map(t => <span
          key={t.id}
          onClick={() => removeTag(t)}>{t.text}</span>)}
      </div>
      <input
        className="criteria"
        placeholder="search tags"
        onKeyUp={e => keyPressed(e.key)}
        value={criteria}
        onChange={e => changeSearch(e.target.value)} />
    </div>
    {<ul
      className="available-tags"
      style={{
        opacity: showingDropdown ? '1' : '0',
        visibility: showingDropdown ? 'visible' : 'hidden',
      }}>
      {criteria && <li className="add-new"
        onClick={addNew}>→ Add {criteria}</li>}
      {tags.filter(t => t.visible).map(t => <Tag key={t.id}
        tag={t}
        onChange={tagToggle}
        selected={!!selected.find(({ id }) => id === t.id)} />)}
    </ul>}
  </div>;
};

type TagProps = {
  tag: Tag;
  selected: boolean;
  onChange: (tag: Tag, selected: boolean) => void;
};

const Tag = ({ tag, selected, onChange }: TagProps) => {
  return <li
    key={tag.id}
    onClick={() => onChange(tag, !selected)}>
    <input type="checkbox" checked={selected} readOnly />
    <label>{tag.text}</label>
  </li>;
};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


const testTags: any = [{
  id: '1',
  text: 'one',
}, {
  id: '2',
  text: 'two',
}, {
  id: '3',
  text: 'three',
}, {
  id: '4',
  text: 'four',
}, {
  id: '5',
  text: 'five',
}, {
  id: '6',
  text: 'six',
}, {
  id: '7',
  text: 'seven',
}, {
  id: '8',
  text: 'eight',
}, {
  id: '9',
  text: 'nine',
}, {
  id: '10',
  text: 'ten',
},];

for (let index = 20; index < 30; index++) {
  testTags.push({
    id: String(index),
    text: String(Math.random()),
  });
}
