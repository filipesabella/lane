import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../style/Settings.less';
import { storage } from '../storage';

export const Settings = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  useEffect(() => {
    const { supabaseUrl, supabaseKey } = storage.loadSettings();
    setSupabaseUrl(supabaseUrl);
    setSupabaseKey(supabaseKey);
  }, []);

  const save = () => {
    storage.storeSettings({ supabaseUrl, supabaseKey });
  };

  return <div className="settings">
    <h1>Settings</h1>
    <div className="fields">
      <label>Supabase URL</label>
      <input
        type="text"
        value={supabaseUrl}
        onChange={e => setSupabaseUrl(e.currentTarget.value)}></input>
      <label>Supabase Key</label>
      <input
        type="text"
        value={supabaseKey}
        onChange={e => setSupabaseKey(e.currentTarget.value)}></input>
    </div>
    <button onClick={_ => save()}>save</button>
  </div>;
};

