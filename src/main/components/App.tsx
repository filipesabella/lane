import * as React from 'react';
import { useEffect, useState } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import '../../style/App.less';
import { api } from '../api';
import { Main } from './Main';
import { Menu } from './Menu';
import { Notes } from './Notes';
import { Settings } from './Settings';

const loadingToastProps: ToastOptions = {
  id: 'sync-loading',
  position: 'top-center',
  duration: Infinity,
};

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState(false);

  if (window.location.search.includes('reset')) {
    api.clearLocalData();
  }

  useEffect(() => {
    toast.promise(api.sync((done, total) => {
      toast.loading(`Decrypting ${done}/${total}`, loadingToastProps);
    }), {
      loading: 'Loading',
      success: 'Ready',
      error: 'Error when fetching',
    }, {
      loading: loadingToastProps,
      success: {
        position: 'top-center',
        duration: 1000,
        icon: null,
      },
      error: {
        duration: 1000,
      },
    }).catch(e => {
      console.error(e);
      setInitialLoadError(true);
    }).finally(() => setLoading(false));
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
        {!initialLoadError && <Route path={'/'} element={<Main />} />}
        {!initialLoadError && <Route path={'/index.html'} element={<Main />} />}
        {!initialLoadError && <Route path="/notes" element={<Notes />} />}
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Menu />
    </>}
  </div>;
};
