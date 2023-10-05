import * as $ from 'jquery';

import { Slider, OffCanvas, Drilldown } from 'fdn/js/foundation';
import { initDarkModeToggle, initFontSizeSlider } from './utils';

function renderSingleMml(math, visitor, doc) {

  math.typesetRoot = doc.createElement('mjx-container');
  math.typesetRoot.innerHTML = visitor.visitTree(math.root, doc);
  math.display && math.typesetRoot.setAttribute('display', 'block');
}

function initControls() {

  initFontSizeSlider();
  initDarkModeToggle();
}

async function initCodemirror() {

  const { EditorState } =
    await import(/* webpackChunkName: "codemirror" */ '@codemirror/state');
  const { EditorView, keymap } =
    await import(/* webpackChunkName: "codemirror" */ '@codemirror/view');
  const { defaultKeymap, historyKeymap, history } =
    await import(/* webpackChunkName: "codemirror" */ '@codemirror/commands');
  const { html } =
    await import(/* webpackChunkName: "codemirror" */ '@codemirror/lang-html');
  const { classHighlighter } =
    await import(/* webpackChunkName: "codemirror" */ '@lezer/highlight');
  const { syntaxHighlighting } =
    await import(/* webpackChunkName: "codemirror" */ '@codemirror/language');

  const inputElement  = document.getElementById("editor");
  const outputElement = document.getElementById("output");
  const renderElement = document.getElementById("render");

  // simple theme settings for a full-height editor
  const fixedSizeTheme = EditorView.theme({
    '&': {
      'height': '100%',
    },
    '.cm-scroller': {
      'overflow': 'scroll',
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

async function initMathJax() {

  const { SerializedMmlVisitor } =
    await import(/* webpackChunkName: "mathjax" */ 'mjx/core/MmlTree/SerializedMmlVisitor');
  const { HTMLAdaptor } =
    await import(/* webpackChunkName: "mathjax" */ 'mjx/adaptors/HTMLAdaptor');
  const { RegisterHTMLHandler } =
    await import(/* webpackChunkName: "mathjax" */ 'mjx/handlers/html');
  const { TeX } =
    await import(/* webpackChunkName: "mathjax" */ 'mjx/input/tex');

  // any mathjax extensions get loaded here; also see "packages" option in
  // the input jax constructor
  await import(/* webpackChunkName: "mathjax" */ 'mjx/input/tex/ams/AmsConfiguration');
  await import(/* webpackChunkName: "mathjax" */ 'mjx/input/tex/boldsymbol/BoldsymbolConfiguration');

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

async function addRenderListener(cm, mjx) {

  const { mathjax } =
    await import(/* webpackChunkName: "mathjax" */ 'mjx/mathjax');

  $( '#render-button' ).on('click', (e) => {

    const mathRegex = /(\$\$).+\1|(\$)[^\$]+?\2|\\\[.+\\\]|\\\(.+\\\)/;

    // create a dummy element with just the input content combined into
    // a single string; codemirror input is split across several html
    // elements for display, but mathjax works on the concatenated version
    var buffer = cm.views.input.state.sliceDoc();
    if (buffer.length == 0) {
      // no contents in buffer -- early exit
      $( e.target ).trigger('blur');
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

    // update the output window with the new content
    cm.views.output.dispatch({
      changes: [
        {
          from: 0,
          to: cm.views.output.state.doc.length,
        },
        {
          from: 0,
          insert: allmath,
        },
      ],
    });

    // make sure the button goes back to its unfocused state,
    // indicating the render is complete
    $( e.target ).trigger('blur');
  });
}

function addCopyListener(cm) {

  $( '#copy-button' ).on('click', (e) => {

    // put all the output text onto the user's clipboard
    const buffer = cm.views.output.state.sliceDoc();
    navigator.clipboard.writeText(buffer).then(() => {
      $( e.target ).trigger('blur');
    });
  });
}

export default (function() {

  $( document ).ready(async () => {

    // run only when document is fully loaded
    initControls();
    const cm = await initCodemirror();
    const mjx = await initMathJax();
    await addRenderListener(cm, mjx);
    addCopyListener(cm);

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
