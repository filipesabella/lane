import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../style/TagSelector.less';
import { api, Tag } from '../api';

type Props = {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
};

export const TagSelector = ({ selectedTags, onChange }: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    api.loadTags().then(tags =>
      setTags((tags.length === 0 ? ['create a tag'] : tags)));
  }, []);

  const [criteria, setCriteria] = useState('');
  const [showingDropdown, setShowingDropdown] = useState(false);

  const tagToggle = (tag: Tag, selected: boolean) => {
    const tags = selected
      ? selectedTags.concat(tag)
      : selectedTags.filter(t => t !== tag);

    onChange(tags);

    setCriteria('');
  };

  const addNew = () => {
    const possibleExistingTag = tags.find(tag =>
      tag.toLowerCase() === criteria.toLowerCase());

    if (possibleExistingTag) {
      const alreadySelected = !!selectedTags
        .find(tag => tag === possibleExistingTag);
      !alreadySelected && onChange(selectedTags.concat(possibleExistingTag));
    } else {
      const newTag = criteria;
      setTags([newTag, ...tags]);
      onChange([newTag, ...selectedTags]);
    }
    setCriteria('');
  };

  const removeTag = (tag: Tag) => onChange(selectedTags
    .filter(tagg => tagg !== tag));

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
        {selectedTags.map(tag => <span
          key={tag}
          onClick={() => removeTag(tag)}>{tag}</span>)}
      </div>
      <input
        className="criteria"
        placeholder={tags.length === 0 ? 'loading tags' : 'search tags'}
        onKeyUp={e => keyPressed(e.key)}
        value={criteria}
        onChange={e => setCriteria(e.target.value)} />
    </div>
    {<ul
      className="available-tags"
      style={{
        opacity: showingDropdown ? '1' : '0',
        visibility: showingDropdown ? 'visible' : 'hidden',
      }}>
      {criteria && <li className="add-new"
        onClick={addNew}>→ Add {criteria}</li>}
      {tags
        .filter(t => filterTag(t, criteria))
        .map(tag => <Tag key={tag}
          tag={tag}
          onChange={tagToggle}
          selected={!!selectedTags.find(tagg => tagg === tag)} />)}
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
    key={tag}
    onClick={() => onChange(tag, !selected)}>
    <input type="checkbox" checked={selected} readOnly />
    <label>{tag}</label>
  </li>;
};

function filterTag(t: Tag, criteria: string): boolean {
  return criteria.length === 0
    || t.toLowerCase().includes(criteria.toLowerCase());
}
