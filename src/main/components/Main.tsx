import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../style/Main.less';
import { api, Config } from '../api';
import { icons } from './icons';
import { TagSelector } from './TagSelector';

export const Main = () => {
  const [config, setConfig] = useState(null as Config | null);

  useEffect(() => {
    api.loadConfig().then(setConfig);
  }, []);

  const [value, setValue] = useState('');

  return <div className="main">
    {!config &&
      <div className="loadingAnimation">{icons.loadingAnimation}</div>}
    {config && <>
      <div className="textarea-container">
        <textarea autoFocus
          placeholder="type away"
          onChange={e => setValue(e.target.value)} />
      </div>
      <TagSelector />
      <button
        disabled={value === ''}
        className="save">save</button>
    </>}
  </div>;
};
