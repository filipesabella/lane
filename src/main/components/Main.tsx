import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../style/Main.less';
import { api, Config } from '../api';
import { ActivityButton } from './ActivityButton';
import { icons } from './icons';

export const Main = () => {
  const [config, setConfig] = useState(null as Config | null);

  useEffect(() => {
    api.loadConfig().then(setConfig);
  }, []);

  return <div className="main">
    {!config &&
      <div className="loadingAnimation">{icons.loadingAnimation}</div>}
    {config && <div className="buttons">
      {config.buttons.map(b => <ActivityButton
        key={b.label}
        config={b} />)}
    </div>}
  </div>;
};
