import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';

export interface Event {
  id: string;
  creation_date: string;
  event_date: string;
  label: string;
  metadata: string | null;
}

export interface Config {
  buttons: ButtonConfig[];
}

export interface ButtonConfig {
  label: string;
  options?: string[];
  form?: FormFieldConfig[];
}

export interface FormFieldConfig {
  label: string;
  type: 'string' | 'boolean' | 'range' | 'range+string' | 'select' | 'select+string';
  options?: string[] | number[] | {};
}

const { supabaseUrl, supabaseKey } = storage.load();

const supabase = createClient(supabaseUrl || 'error', supabaseKey || 'error');

export const api = {
  loadConfig: async (): Promise<Config> => {
    // const result = await supabase
    //   .from('timeline_config')
    //   .select('config')
    //   .eq('id', 1)
    //   .single();

    return {} as any; //result.data.config;
  },

  loadEvents: async (): Promise<Event[]> => {
    // const result = await supabase
    //   .from('timeline_events')
    //   .select()
    //   .gte('event_date', lastWeek())
    //   .order('event_date', { ascending: true });

    // return (result.data || []).map((row: any) => {
    //   const e: Event = {
    //     id: row.id,
    //     creation_date: row.creation_date,
    //     event_date: row.event_date,
    //     label: row.label,
    //     metadata: row.metadata,
    //   };
    //   return e;
    // });
    return [];
  },

  record: async (label: string, metadata?: string): Promise<void> => {
    // await supabase.from('lane_events').insert({
    //   id: uuid(),
    //   creation_date: toIsoString(new Date()),
    //   event_date: toIsoString(new Date()),
    //   label,
    //   metadata: metadata || null,
    // });
  }
};

function lastWeek() {
  const now = new Date();
  now.setDate(now.getDate() - 7);
  return toIsoString(now);
}

function toIsoString(date: Date) {
  const tzo = -date.getTimezoneOffset();
  const tzoDifference = tzo >= 0 ? '+' : '-';
  const pad = (n: number) => {
    const normalised = Math.floor(Math.abs(n));
    return String(normalised).padStart(2, '0');
  };

  return `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}:` +
    `${pad(date.getSeconds())}` +
    `${tzoDifference}${pad(tzo / 60)}:` +
    `${pad(tzo % 60)}`;
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
