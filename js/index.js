import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';

import { html } from '@codemirror/lang-html';
import { classHighlighter } from '@lezer/highlight';
import { syntaxHighlighting } from '@codemirror/language';

import * as $ from 'jquery';

import { Slider, OffCanvas } from 'fdn/js/foundation';

import { mathjax } from 'mjx/mathjax';
import { SerializedMmlVisitor } from 'mjx/core/MmlTree/SerializedMmlVisitor';
import { HTMLAdaptor } from 'mjx/adaptors/HTMLAdaptor';
import { RegisterHTMLHandler } from 'mjx/handlers/html';
import { Safe } from 'mjx/ui/safe/safe';
import { TeX } from 'mjx/input/tex';

import 'mjx/input/tex/ams/AmsConfiguration';
import 'mjx/input/tex/boldsymbol/BoldsymbolConfiguration';

function renderSingleMml(math, visitor, doc) {

  math.typesetRoot = doc.createElement('mjx-container');
  math.typesetRoot.innerHTML = visitor.visitTree(math.root, doc);
  math.display && math.typesetRoot.setAttribute('display', 'block');
}

function initControls() {

  $( document ).foundation();

  $( '#fontSizeControl' ).on('moved.zf.slider', function(e) {
    const elem = $( e.currentTarget ).find('input').first();
    const newsize = elem.val().toString() + 'rem';
    $( ':root' ).css('--base-font-size', newsize);
  });

  $( '#darkModeSwitch' ).prop('checked', false);
  $( '#darkModeSwitch' ).on('change', function() {
    const isDark = $( this ).prop('checked');
    $( 'html' ).attr('data-theme', (isDark) ? 'dark' : 'light');
  });

  // https://stackoverflow.com/a/57795495/1552418
  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      $( '#darkModeSwitch' ).prop('checked', true);
      $( 'html' ).attr('data-theme', 'dark');
    } else {
      $( '#darkModeSwitch' ).prop('checked', false);
      $( 'html' ).attr('data-theme', 'light');
    }

    $( '#darkModeSwitch' ).trigger('change');
  }
}

export function launch(inputElement, outputElement, renderElement) {

  initControls();

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

  let inputState = EditorState.create({
    doc: '$$ a^2 + b^2 = c^2 $$',
    extensions: [
      keymap.of(defaultKeymap),
      EditorView.lineWrapping,
      EditorView.editable.of(true),
      fixedSizeTheme,
    ]
  });

  let outputState = EditorState.create({
    doc: '',
    extensions: [
      html(),
      syntaxHighlighting(classHighlighter),
      keymap.of(defaultKeymap),
      EditorView.lineWrapping,
      EditorView.editable.of(false),
      fixedSizeTheme,
    ]
  });

  let inputView = new EditorView({
    state: inputState,
    parent: inputElement,
  });

  let outputView = new EditorView({
    state: outputState,
    parent: outputElement,
  });

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

  $( '#renderButton' ).on('click', (e) => {

    const buffer = inputView.state.sliceDoc();
    const pseudo = document.createElement('p');
    pseudo.innerHTML = buffer;

    const mjxdoc = mathjax.document(pseudo, {
      InputJax: inputJax,
      renderActions: {
        assistiveMml: [],
        typeset: [
          150,
          (doc) => {
            for (let math of doc.math) {
              renderSingleMml(math, visitor, document);
            }
          },
          (math, doc) => {
            renderSingleMml(math, visitor, document);
          }
        ],
      },
    });

    mjxdoc.render();
    renderElement.replaceChildren();

    for (let math of mjxdoc.math) {
      const len = outputView.state.doc.length;
      const transaction = outputView.state.update({
        changes: [
          {
            from: 0,
            to: len,
          },
          {
            from: 0,
            insert: math.typesetRoot.innerHTML,
          },
        ],
      });

      outputView.dispatch(transaction);
      renderElement.appendChild(math.typesetRoot);
    }

    e.target.blur();
  });

  $( '#copyButton' ).on('click', (e) => {

    const buffer = outputView.state.sliceDoc();
    navigator.clipboard.writeText(buffer).then(() => {;
      e.target.blur();
    });
  });
}

// vim: set ft=javascript:
