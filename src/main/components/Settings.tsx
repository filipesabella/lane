import * as React from 'react';
import { useEffect, useState } from 'react';
import '../../style/Settings.less';
import { storage } from '../storage';

export const Settings = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [encryptionPassword, setEncryptionPassword] = useState('');

  useEffect(() => {
    const {
      supabaseUrl,
      supabaseKey,
      encryptionPassword, } = storage.loadSettings();
    setSupabaseUrl(supabaseUrl);
    setSupabaseKey(supabaseKey);
    setEncryptionPassword(encryptionPassword);
  }, []);

  const save = () => {
    storage.storeSettings({ supabaseUrl, supabaseKey, encryptionPassword, });
  };

  return <div className="settings">
    <h1>Settings</h1>
    <div className="fields">
      <label>Supabase URL</label>
      <input
        value={supabaseUrl}
        onChange={e => setSupabaseUrl(e.currentTarget.value)} />
      <label>Supabase Key</label>
      <input
        value={supabaseKey}
        onChange={e => setSupabaseKey(e.currentTarget.value)} />
      <label>Encryption Password</label>
      <input
        value={encryptionPassword}
        type="password"
        placeholder="If you lose or change this all the data will be lost"
        onChange={e => setEncryptionPassword(e.currentTarget.value)} />
    </div>
    <button onClick={_ => save()}>save</button>
  </div>;
};

