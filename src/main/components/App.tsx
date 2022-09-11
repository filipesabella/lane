import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import '../../style/App.less';
import { Main } from './Main';
import { Menu } from './Menu';
import { Settings } from './Settings';
import { Stats } from './Stats';

export const App = () => {
  return <div id="app">
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
    <Menu />
  </div>;
};
