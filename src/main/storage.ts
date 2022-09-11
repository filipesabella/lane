export interface Settings {
  supabaseUrl: string;
  supabaseKey: string;
}

const localStorageKey = 'lane_settings';

export const storage = {
  load: (): Settings => {
    const settings = JSON.parse(
      localStorage.getItem(localStorageKey) || '{}');
    return {
      supabaseUrl: '',
      supabaseKey: '',
      ...settings,
    };
  },

  store: (settings: Settings): void => {
    localStorage.setItem(localStorageKey, JSON.stringify(settings));
  }
};
