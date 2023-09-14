import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';

import { html } from '@codemirror/lang-html';
import { classHighlighter } from '@lezer/highlight';
import { syntaxHighlighting } from '@codemirror/language';

import * as $ from 'jquery';

import { Slider, OffCanvas, Drilldown } from 'fdn/js/foundation';
import { initDarkModeToggle, initFontSizeSlider } from './utils';

import { mathjax } from 'mjx/mathjax';
import { SerializedMmlVisitor } from 'mjx/core/MmlTree/SerializedMmlVisitor';
import { HTMLAdaptor } from 'mjx/adaptors/HTMLAdaptor';
import { RegisterHTMLHandler } from 'mjx/handlers/html';
import { TeX } from 'mjx/input/tex';

import 'mjx/input/tex/ams/AmsConfiguration';
import 'mjx/input/tex/boldsymbol/BoldsymbolConfiguration';

function renderSingleMml(math, visitor, doc) {

  math.typesetRoot = doc.createElement('mjx-container');
  math.typesetRoot.innerHTML = visitor.visitTree(math.root, doc);
  math.display && math.typesetRoot.setAttribute('display', 'block');
}

function initControls() {

  initFontSizeSlider();
  initDarkModeToggle();
}

function initCodemirror() {

  const inputElement  = document.getElementById("editor");
  const outputElement = document.getElementById("output");
  const renderElement = document.getElementById("render");

  // simple theme settings for a full-height editor with a caret that matches
  // the current foreground color
  const fixedSizeTheme = EditorView.theme({
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

  // input state starts with a dummy example input
  let inputState = EditorState.create({
    doc: '$$ a^2 + b^2 = c^2 $$',
    extensions: [
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      EditorView.editable.of(true),
      fixedSizeTheme,
    ]
  });

  // attach a view of the input state to the document
  let inputView = new EditorView({
    state: inputState,
    parent: inputElement,
  });

  // output state is not editable and has html syntax highlighting
  const htmlExtensions = [
    html(),
    syntaxHighlighting(classHighlighter),
    EditorView.lineWrapping,
    EditorView.editable.of(false),
    fixedSizeTheme,
  ];
  let outputState = EditorState.create({
    doc: '',
    extensions: htmlExtensions,
  });

  // attach a view of the output state to the document
  let outputView = new EditorView({
    state: outputState,
    parent: outputElement,
  });

  return {
    elements: {
      input: inputElement,
      output: outputElement,
      render: renderElement,
    },
    views: {
      input: inputView,
      output: outputView,
    },
    htmlExtensions,
  };
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

function addRenderListener(cm, mjx) {

  $( '#render-button' ).on('click', (e) => {

    const mathRegex = /(\$\$).+\1|(\$)[^\$]+?\2|\\\[.+\\\]|\\\(.+\\\)/;

    // create a dummy element with just the input content combined into
    // a single string; codemirror input is split across several html
    // elements for display, but mathjax works on the concatenated version
    var buffer = cm.views.input.state.sliceDoc();
    if (buffer.length == 0) {
      // no contents in buffer -- early exit
      e.target.blur();
      return;
    } else if (buffer.search(mathRegex) == -1) {
      // no math found -- add delimiters around the content
      buffer = `$$ ${buffer} $$`;
    }
    const pseudo = document.createElement('span');
    pseudo.innerHTML = buffer;

    // build the mathjax document
    const mjxdoc = mathjax.document(pseudo, {
      InputJax: mjx.inputJax,
      renderActions: {
        assistiveMml: [],
        typeset: [
          150,
          (doc) => {
            for (let math of doc.math) {
              renderSingleMml(math, mjx.visitor, document);
            }
          },
          (math, doc) => {
            renderSingleMml(math, mjx.visitor, document);
          }
        ],
      },
    });

    // render the document (this just converts the tex to mathml,
    // it doesn't appear on the page yet)
    mjxdoc.render();

    // clear the render pane of any previous content
    cm.elements.render.replaceChildren();

    // loop through any math and add the mathml and new elements
    // to their respective panes; multiple equations are appended in
    // the order they were input
    var allmath = '';

    for (let math of mjxdoc.math) {
      allmath += math.typesetRoot.innerHTML + '\n';
      cm.elements.render.appendChild(math.typesetRoot);
    }

    let outputState = EditorState.create({
      doc: allmath,
      extensions: cm.htmlExtensions,
    });

    // update the output window with the new content
    cm.views.output.setState(outputState);

    // make sure the button goes back to its unfocused state,
    // indicating the render is complete
    e.target.blur();
  });
}

function addCopyListener(cm) {

  $( '#copy-button' ).on('click', (e) => {

    // put all the output text onto the user's clipboard
    const buffer = cm.views.output.state.sliceDoc();
    navigator.clipboard.writeText(buffer).then(() => {
      e.target.blur();
    });
  });
}

export default (function() {

  $( document ).ready(() => {

    // run only when document is fully loaded
    initControls();
    const cm = initCodemirror();
    const mjx = initMathJax();
    addRenderListener(cm, mjx);
    addCopyListener(cm);

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript: