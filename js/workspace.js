import { EditorState, Text } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine,
         highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';

import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { classHighlighter } from '@lezer/highlight';
import { syntaxHighlighting, codeFolding, foldGutter } from '@codemirror/language';

import * as $ from 'jquery';

import { Foundation, Slider, OffCanvas, Sticky, Drilldown,
         Tabs } from 'fdn/js/foundation';
import { initDarkModeToggle, initFontSizeSlider } from './utils';

// global list of open documents
var openDocs = Array();

function getCodemirrorTheme() {

  // simple theme settings for a full-height editor with a caret that matches
  // the current foreground color
  return EditorView.theme({
    '&': {
      'height': '100%',
    },
    '.cm-scroller': {
      'overflow': 'scroll',
    },
    '.cm-content': {
      'caret-color': 'var(--foreground-color)',
    },
  });
}

async function loadFile(file) {

  const newTabId = `user-tab-${openDocs.length}`;

  const anchor = $( document.createElement('a') )
    .attr('href', `#${newTabId}`)
    .attr('id', `${newTabId}-anchor`)
    .html(file.name);

  const button = $( document.createElement('button') )
    .addClass('md-close')
    .attr('title', `Close ${file.name}`);

  const tabTitle = $( document.createElement('li') )
    .addClass('tabs-title')
    .append(anchor)
    .append(button)
    .appendTo($( '#left-panel-tabs' ));

  const tabContent = $( document.createElement('div') )
    .addClass(['tabs-panel', 'user-input'])
    .attr('id', newTabId)
    .appendTo($( '#left-panel-tabs-content' ));

  // refresh foundation and make the new tab active
  Foundation.reInit('tabs');
  $( '#left-panel-tabs' ).foundation('selectTab', tabContent, false);

  const text = await file.text();
  let state = EditorState.create({
    doc: Text.of(text.split('\n')),
    extensions: [
      syntaxHighlighting(classHighlighter),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      EditorView.editable.of(true),
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      codeFolding(),
      foldGutter(),
      getCodemirrorTheme(),
    ]
  });

  let view = new EditorView({
    state: state,
    parent: tabContent.get(0),
  });

  // add this doc to the growing list
  const newDoc = {
    id: newTabId,
    title: tabTitle,
    content: tabContent,
    view,
  };
  openDocs.push(newDoc);

  // close button handler
  button.on('click', newDoc, (e) => {

    const idx = openDocs.findIndex((elem) => elem.id === e.data.id);
    openDocs.splice(idx, 1);  // remove from the document list

    // remove the tab, tab title, and all children
    e.data.title.remove();
    e.data.content.remove();

    Foundation.reInit('tabs');  // re-initialize tabs

    // if any tabs are still open, display one
    if (openDocs.length > 0) {
      const prevIdx = (idx + 1 <= openDocs.length) ? idx : (idx - 1);
      const prevContent = openDocs[prevIdx].content;
      $( '#left-panel-tabs' ).foundation('selectTab', prevContent, false);
    }
  });
}

function initDragAndDrop() {
  // XXX: have to use event capturing to prevent codemirror from doing
  // exactly what this code is also trying to do

  document.getElementById('left-panel-input')
    .addEventListener('drop', (ev) => {
      // prevent default drop behavior
      ev.preventDefault();
      ev.stopPropagation();

      if (ev.dataTransfer.items) {
        // use DataTransferItemList
        [...ev.dataTransfer.items].forEach(async (item, idx) => {
          if (item.kind === 'file') {
            // only accept files
            const file = item.getAsFile();
            await loadFile(file);
          }
        });
      } else {
        // use DataTransfer
        [...ev.dataTransfer.files].forEach(async (file, idx) => {
          await loadFile(file);
        });
      }
    }, { capture: true });

  document.getElementById('left-panel-input')
    .addEventListener('dragover', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    }, { capture: true });
}

function initMetadataInput() {

  // example input for the metadata editor
  const metaExample =
`{
  "title": "My Awesome Paper",
  "authors": [
    {
      "name": "Julie P. Foo",
      "affiliation": "Institute of Bar",
      "orcid": "0000-0000-0000-0000"
    }
  ]
}`;

  const metaInputElement = document.getElementById('meta-input');

  let metaInputState = EditorState.create({
    doc: metaExample,
    extensions: [
      json(),
      syntaxHighlighting(classHighlighter),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      EditorView.editable.of(true),
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      codeFolding(),
      foldGutter(),
      getCodemirrorTheme(),
    ]
  });

  let metaInputView = new EditorView({
    state: metaInputState,
    parent: metaInputElement,
  });

  return metaInputView;
}

function initDocumentInput() {

  // example input for the document editor
  const docExample =
`<section>
  <h2>Introduction</h2>
  <p>This is the first intro paragraph.</p>
  <p>This is the second intro paragraph.</p>
</section>
<section>
  <h2>Methods</h2>
  <p>Starting up another section.</p>
</section>`;

  const docInputElement = document.getElementById('doc-input');

  let docInputState = EditorState.create({
    doc: docExample,
    extensions: [
      html(),
      syntaxHighlighting(classHighlighter),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      EditorView.editable.of(true),
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      codeFolding(),
      foldGutter(),
      getCodemirrorTheme(),
    ]
  });

  let docInputView = new EditorView({
    state: docInputState,
    parent: docInputElement,
  });

  return docInputView;
}

function initRhsPanels() {
  return {
    meta: initMetadataInput(),
    doc: initDocumentInput(),
  };
}

export default (function() {

  $( document ).ready(() => {

    initFontSizeSlider();
    initDarkModeToggle();

    initDragAndDrop();
    initRhsPanels();

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
