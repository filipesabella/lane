import * as React from 'react';
import { useState } from 'react';
import '../../style/ActivityContext.less';
import { FormFieldConfig } from '../api';

interface Props {
  label: string;
  form: FormFieldConfig[];
  save: (formValues: any) => void;
  show: boolean;
}

export const ActivityFormContext = ({ label, form, save, show }: Props) => {
  const initialFormState = form.reduce((acc, f) =>
    ({ ...acc, [f.label]: null }), {}) as any;

  const [formState, setFormState] = useState(initialFormState);

  const onChange = (name: string, value: any) => {
    if (name.includes('.')) {
      // just taking care of 1 level for now
      const [outer, inner] = name.split('.');
      setFormState((prev: any) => ({
        ...prev, [outer]: {
          ...prev[outer],
          [inner]: value,
        }
      }));
    } else {
      setFormState((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  return <div className={`context full-screen ${show ? 'shown' : 'hidden'}`}>
    <p>{label}</p>
    <div className="form">
      {form.map(f => formField(f, formState[f.label], onChange))}
    </div>
    <button onClick={_ => save(formState)}>Save</button>
  </div>;
};

// yes exactly what the world needs, more code to render forms
function formField(
  field: FormFieldConfig,
  value: any,
  onChange: (name: string, value: any) => void): React.ReactElement {
  let input;
  if (field.type === 'string') {
    input = <input
      onChange={e => onChange(field.label, e.currentTarget.value)}
      type="text"></input>;
  } else if (field.type === 'boolean') {
    input = <input
      onChange={e => onChange(field.label, e.currentTarget.checked)}
      type="checkbox"></input>;
  } else if (field.type === 'range') {
    input = <div className="multiField">
      <input
        onChange={e => onChange(field.label, e.currentTarget.value)}
        type="range"
        value={value ?? 0}
        min={(field.options as any).min}
        max={(field.options as any).max}></input>
      <label>{value ?? 0}</label>
    </div>;
  } else if (field.type === 'range+string') {
    input = <div className="multiField">
      <input
        onChange={e => onChange(field.label + '.option', e.currentTarget.value)}
        type="range"
        value={value ? value.option : 0}
        min={(field.options as any).min}
        max={(field.options as any).max}></input>
      <span>{value ? value.option : 0}</span>
      <input onChange={
        e => onChange(field.label + '.text', e.currentTarget.value)}
        type="text"></input>
    </div>;
  } else if (field.type === 'select') {
    input = <select
      onChange={e => onChange(field.label, e.currentTarget.value)}>
      <option>-</option>
      {(field.options as []).map(o => <option key={o} value={o}>{o}</option>)}
    </select>;
  } else if (field.type === 'select+string') {
    input = <div className="multiField">
      <select onChange={
        e => onChange(field.label + '.option', e.currentTarget.value)}>
        <option>-</option>
        {(field.options as []).map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <input onChange={
        e => onChange(field.label + '.text', e.currentTarget.value)}
        type="text"></input>
    </div>;
  }
  return <React.Fragment key={`${field.label}`}>
    <label>{field.label}</label>
    {input}
  </React.Fragment>;
}
