import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';

export interface DBNote {
  id: string;
  creation_date: string;
  text: string;
  tags: string[];
}

export interface Tag {
  text: string;
}

const { supabaseUrl, supabaseKey } = storage.loadSettings();

const supabase = createClient(supabaseUrl || 'error', supabaseKey || 'error');

// early optimisation to save my free tier quota
let tagsCache: Tag[] = null as any;

export const api = {
  loadTags: async (): Promise<Tag[]> => {
    if (tagsCache === null) {
      console.log('yeah');

      tagsCache = (await supabase
        .from('lane_tags')
        .select()).data as Tag[];
    }

    return tagsCache;
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

  save: async (text: string, tags: Tag[]): Promise<void> => {
    tagsCache = null as any;

    await supabase.from('lane_notes').insert({
      id: uuid(),
      text,
      tags: tags.map(t => t.text),
    });
  }
};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
