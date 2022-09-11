import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../style/ActivityButton.less';
import { api, ButtonConfig } from '../api';
import { ActivityContext } from './ActionContext';
import { ActivityFormContext } from './ActionFormContext';

interface Props {
  config: ButtonConfig;
}

export const ActivityButton = ({ config }: Props) => {
  const { label, options, form } = config;

  const [showContext, setShowContext] = useState(false);

  const onClick = () => {
    setShowContext(true);
    history.pushState(null, '', `#${label}`);
  };

  const save = (metadata?: string) => {
    api.record(label, metadata);
    history.back();
  };

  useEffect(() => {
    const listener = () => setShowContext(window.location.hash !== '');
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);

  return <div className="activityButton">
    <button onClick={onClick}>{label}</button>
    {form && <ActivityFormContext
      label={label}
      form={form}
      save={save}
      show={showContext} />}
    {!form && <ActivityContext
      label={label}
      options={options || null}
      save={save}
      show={showContext} />}
  </div>;
};
