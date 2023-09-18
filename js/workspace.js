import { EditorState, StateField, Text } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine,
         highlightActiveLineGutter, showPanel } from '@codemirror/view';
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';

import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { classHighlighter } from '@lezer/highlight';
import { syntaxHighlighting, codeFolding, foldGutter } from '@codemirror/language';

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import latex from 'highlight.js/lib/languages/latex';

import 'highlight.js/styles/nord.css';

hljs.registerLanguage('html', xml);
hljs.registerLanguage('latex', latex);

import { sanitize } from 'dompurify';

import * as $ from 'jquery';

import { Foundation, Slider, OffCanvas, Sticky, Drilldown,
         Tabs, Tooltip } from 'fdn/js/foundation';
import { initDarkModeToggle, initFontSizeSlider } from './utils';

import { mathjax } from 'mjx/mathjax';
import { SerializedMmlVisitor } from 'mjx/core/MmlTree/SerializedMmlVisitor';
import { HTMLAdaptor } from 'mjx/adaptors/HTMLAdaptor';
import { RegisterHTMLHandler } from 'mjx/handlers/html';
import { TeX } from 'mjx/input/tex';

import 'mjx/input/tex/ams/AmsConfiguration';
import 'mjx/input/tex/boldsymbol/BoldsymbolConfiguration';

import { BibtexParser } from 'bibtex-js-parser';

function renderSingleMml(math, visitor, doc) {

  math.typesetRoot = doc.createElement('mjx-container');
  math.typesetRoot.innerHTML = visitor.visitTree(math.root, doc);
  math.display && math.typesetRoot.setAttribute('display', 'block');
}

// global list of open documents
var openDocs = Array();

function getCodemirrorTheme() {

  // simple theme settings for a full-height editor that scrolls
  return EditorView.theme({
    '&': {
      'height': '100%',
    },
    '.cm-scroller': {
      'overflow': 'scroll',
    },
  });
}

function initMathJax() {

  // mathjax one-time setup for tex input to mathml output
  const adaptor = new HTMLAdaptor(window);
  RegisterHTMLHandler(adaptor);

  const visitor = new SerializedMmlVisitor();
  const inputJax = new TeX({
    packages: {
      '[+]': ['ams', 'boldsymbol'],
    },
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
    processEscapes: false,
    processEnvironments: true,
    processRefs: false,
  });

  return {
    visitor,
    inputJax
  };
}

function mathButtonClickHandler(e) {

  // create a dummy element with just the selected content combined into
  // a single string; codemirror input is split across several html
  // elements for display, but mathjax works on the concatenated version
  const sel = e.data.view.state.selection.main;
  var buffer = e.data.view.state.sliceDoc(sel.from, sel.to);

  if (buffer.length == 0) {
    // no contents in buffer -- early exit
    $( e.target ).foundation('show');
    return;
  }

  const pseudo = document.createElement('span');
  pseudo.innerHTML = buffer;

  // build the mathjax document
  const mjxdoc = mathjax.document(pseudo, {
    InputJax: e.data.mjx.inputJax,
    renderActions: {
      assistiveMml: [],
      typeset: [
        150,
        (doc) => {
          for (let math of doc.math) {
            renderSingleMml(math, e.data.mjx.visitor, document);
          }
        },
        (math, doc) => {
          renderSingleMml(math, e.data.mjx.visitor, document);
        }
      ],
    },
  });

  // render the document (this just converts the tex to mathml,
  // it doesn't appear on the page yet)
  mjxdoc.render();

  // loop through any math and add the mathml and new elements
  // to their respective panes; multiple equations are appended in
  // the order they were input
  var allmath = '';

  for (let math of mjxdoc.math) {
    allmath += math.typesetRoot.innerHTML + '\n';
  }

  if (allmath.length == 0) {
    // not recognized as math -- early exit
    $( e.target ).foundation('show');
    return;
  }

  allmath = allmath.replaceAll(/\n\s*/g, '');

  // put all the output mathml onto the user's clipboard
  navigator.clipboard.writeText(allmath).then(() => {
    // make sure the button goes back to its unfocused state
    e.target.blur();
  });
}

function bibButtonClickHandler(e) {

  // get the current selection, if there is one; otherwise, select
  // the entire file
  const sel = e.data.view.state.selection.main;
  var buffer = e.data.view.state.sliceDoc(sel.from, sel.to);
  if (buffer.length === 0) buffer = e.data.view.state.sliceDoc();

  try {
    const json = BibtexParser.parseToJSON(buffer);
    const parsed = json.reduce((acc, cur) => {
      const { id, raw, author, ...rest } = cur;
      const authors = author.split(' and ');
      return {
        ...acc,
        [id]: {
          ...rest,
          authors,
        },
      };
    }, {});
    const jsonstr = JSON.stringify(parsed, null, 2);

    // put all the output json onto the user's clipboard
    navigator.clipboard.writeText(jsonstr).then(() => {
      // make sure the button goes back to its unfocused state
      e.target.blur();
    });

  } catch (ex) {
    // problem converting to json -- early exit
    $( e.target ).foundation('show');
    return;
  }
}

function createControlsPanel(view, data) {

  const mathButton = $( document.createElement('button') )
    .addClass(['md-math', 'secondary', 'button', 'icon-button', 'group-latex'])
    .attr('type', 'button')
    .attr('data-tooltip', '')
    .attr('data-position', 'top')
    .attr('data-alignment', 'left')
    .attr('title', 'Copy MathML equivalent of highlighted LaTeX to the clipboard. Be sure to include math delimiters!')
    .css('display', (data.fileType === 'latex') ? 'inline-block' : 'none')
    .html('To MathML')
    .on('click', { ...data, view }, mathButtonClickHandler)
    .foundation();

  const bibButton = $( document.createElement('button') )
    .addClass(['md-code', 'secondary', 'button', 'icon-button', 'group-bibtex'])
    .attr('type', 'button')
    .attr('data-tooltip', '')
    .attr('data-position', 'top')
    .attr('data-alignment', 'left')
    .attr('title', 'Copy JSON equivalent of highlighted BibTeX (or entire file) to the clipboard.')
    .css('display', (data.fileType === 'bibtex') ? 'inline-block' : 'none')
    .html('To JSON')
    .on('click', { view }, bibButtonClickHandler)
    .foundation();

  const typeSelectControl = $( document.createElement('select') )
    .attr('id', 'doc-type-select')
    .append($( document.createElement('option') )
      .attr('value', 'latex')
      .prop('selected', data.fileType === 'latex')
      .html('LaTeX'))
    .append($( document.createElement('option') )
      .attr('value', 'bibtex')
      .prop('selected', data.fileType === 'bibtex')
      .html('BibTeX'))
    .append($( document.createElement('option') )
      .attr('value', 'plaintext')
      .prop('selected', data.fileType === 'plaintext')
      .html('Plain text'))
    .on('change', (e) => {
      const target = $( e.target );
      const cls = `group-${target.val()}`;
      $( `.controls-wrapper button:not(.${cls})` ).css('display', 'none');
      $( `.controls-wrapper button.${cls}` ).css('display', 'inline-block');
    });

  const typeSelectLabel = $( document.createElement('label') )
    .attr('for', $( typeSelectControl ).attr('id'))
    .html('Use as:');

  const node = document.createElement('div');
  $( node ).append($( document.createElement('div') )
      .addClass('controls-wrapper')
      .append([typeSelectLabel, typeSelectControl, mathButton, bibButton]));

  return { top: false, dom: node };
}

function controlsPanel(data) {

  return showPanel.of(v => createControlsPanel(v, data));
}

async function loadFile(file, data) {

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

  // try to guess file type
  var fileType = 'plaintext';
  const ext = file.name.split('.').pop();
  if (ext === 'tex') fileType = 'latex';
  else if (ext === 'bib') fileType = 'bibtex';

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
      controlsPanel({ ...data, fileType }),
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

function initInputHandlers(data) {
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
            await loadFile(file, data);
          }
        });
      } else {
        // use DataTransfer
        [...ev.dataTransfer.files].forEach(async (file, idx) => {
          await loadFile(file, data);
        });
      }
    }, { capture: true });

  document.getElementById('left-panel-input')
    .addEventListener('dragover', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    }, { capture: true });
}

function initLhsPanels(data) {

  initInputHandlers(data);
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
  ],
  "references": {
    "Einstein1914": {
      "authors": [
        "Einstein, A."
      ],
      "title": "The Formal Foundation of the General Theory of Relativity",
      "year": "1914"
    }
  }
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
  <p>Starting up another section. I can mention <span class="citet" data-refs="Einstein1914"></span> inline or in parentheses <span class="citep" data-refs="Einstein1914"></span>.</p>
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

  const views = {
    meta: initMetadataInput(),
    doc: initDocumentInput(),
  };

  // do syntax highlighting on the reference panel
  $( '#html-ref code' ).each((i, e) => {
    hljs.highlightElement(e);
  });

  $( '#doc-preview-tab-title a' ).on('focus', () => {
    const buffer = views.doc.state.sliceDoc();
    const cleanBuffer = sanitize(buffer);

    const wrapper = $( document.createElement('article') )
      .html(cleanBuffer);

    const meta = JSON.parse(views.meta.state.sliceDoc());

    // handle parenthetical citations
    $( wrapper ).find( 'span.citep' ).each((i, elem) => {
      const refs = $( elem ).attr('data-refs').split(',');
      const inner = refs.map((ref) => {
        const reffix = ref.trim();  // remove any spaces
        if (meta.references && (reffix in meta.references)) {
          const year = meta.references[reffix].year;
          const authors = meta.references[reffix].authors;
          const lasts = authors.map((a) => a.split(', ')[0]);

          const stem = (lasts.length < 3) ?
            lasts.join(' and ') : (lasts[0] + ' <i>et al.</i>');
          return stem + (year ? ` ${year}` : '');
        } else {
          return `<span class="error">${reffix}</span>`;
        }
      });

      const citation = inner.join('; ');
      $( elem ).html(citation);
    });

    // handle inline citations
    $( wrapper ).find( 'span.citet' ).each((i, elem) => {
      const refs = $( elem ).attr('data-refs').split(',');
      const inner = refs.map((ref) => {
        const reffix = ref.trim();  // remove any spaces
        if (meta.references && (reffix in meta.references)) {
          const year = meta.references[reffix].year;
          const authors = meta.references[reffix].authors;
          const lasts = authors.map((a) => a.split(', ')[0]);

          const stem = (lasts.length < 3) ?
            lasts.join(' and ') : (lasts[0] + ' <i>et al.</i>');
          return stem + (year ? ` (${year})` : '');
        } else {
          return `<span class="error">${reffix}</span>`;
        }
      });

      const citation = (inner.length < 3) ? inner.join(' and ') :
        (inner.slice(0, -1).join('; ') + '; and ' + inner.slice(-1));
      $( elem ).html(citation);
    });

    $( '#doc-preview' ).html(wrapper);
  });
}

export default (function() {

  $( document ).ready(() => {

    initFontSizeSlider();
    initDarkModeToggle();

    // application data
    const data = {
      mjx: initMathJax(),
    };

    initLhsPanels(data);
    initRhsPanels();

    $( '#open-file-button' ).on('click', (e) => {
      $( '#open-file' ).trigger('click');
      e.target.blur();
    });

    $( '#open-file' ).on('change', data, (e) => {
      [...e.target.files].forEach(async (file, idx) => {
        await loadFile(file, e.data);
      });
    });

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
