import * as React from 'react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import '../../style/App.less';
import { api } from '../api';
import { Main } from './Main';
import { Menu } from './Menu';
import { Notes } from './Notes';
import { Settings } from './Settings';

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState(false);
  useEffect(() => {
    toast.promise(api.sync(), {
      loading: 'Loading',
      success: 'Ready',
      error: 'Error when fetching',
    }, {
      loading: {
        position: 'top-center',
      },
      success: {
        position: 'top-center',
        duration: 1000,
        icon: null,
      },
    }).catch(() => setInitialLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  return <div id="app">
    <Toaster position="top-right"
      containerStyle={{
        position: 'absolute',
      }}
      toastOptions={{
        className: 'toaster',
        duration: 2000,
      }} />
    {!loading && <>
      <Routes>
        {!initialLoadError && <Route path="/" element={<Main />} />}
        {!initialLoadError && <Route path="/notes" element={<Notes />} />}
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Menu />
    </>}
  </div>;
};
