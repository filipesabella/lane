import * as React from 'react';
import '../../style/ActivityContext.less';

interface Props {
  label: string;
  options: string[] | null;
  save: (option?: string) => void;
  show: boolean;
}

export const ActivityContext = ({ label, options, save, show }: Props) => {
  return <div className={`context full-screen ${show ? 'shown' : 'hidden'}`}>
    <p>{label}</p>
    <div className="actions">
      {!options && <button onClick={_ => save()}>Confirm</button>}
      {options && options.map(o =>
        <button key={o}
          onClick={_ => save(o)}>{o}</button>)}
    </div>
  </div>;
};
