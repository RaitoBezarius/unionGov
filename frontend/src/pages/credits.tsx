import { FunctionComponent } from 'react';
import Markdown from 'markdown-to-jsx';
import path from 'path';
import { readFile } from 'fs/promises';
import { EmptyRecord } from '../types';

export async function getStaticProps () {
  const text = await readFile(path.resolve('public/credits.md'), 'utf8');

  return { props: { text } };
}

const Credits: FunctionComponent<EmptyRecord> = ({ text }) => {
  return (<Markdown style={ { paddingTop: '15px', paddingLeft: '10px' } }>{text}</Markdown>);
};

export default Credits;
