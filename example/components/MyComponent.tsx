import React, { useState } from 'react';
import { ContentEditable, ContentEditable2 } from '../../src';
// import './styles.css';

export const MyComponent: React.VFC = () => {
  const [html, setHtml] = useState('Edit <b>me</b> !');

  return (
    <ContentEditable2
      html={html} // innerHTML of the editable div
      // disabled={false} // use true to disable edition
      onChange={(evt) => {
        // setHtml(evt.target.value);
      }} // handle innerHTML change
    />
  );
};
