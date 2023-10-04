import loadingIndicator from '../../svg/loading.svg';

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import latex from 'highlight.js/lib/languages/latex';

import 'highlight.js/styles/nord.css';

hljs.registerLanguage('html', xml);
hljs.registerLanguage('latex', latex);

import { sanitize } from 'dompurify';

import * as $ from 'jquery';

import { Foundation, Tabs, Tooltip } from 'fdn/js/foundation';
import { getCodemirrorTheme } from './utils';

export class RhsPanel {

  #meta;
  #doc;

  constructor() {

    // async constructor hack
    return (async () => {
      this.#meta = await this.#createMetadataTab();
      this.#doc = await this.#createDocumentTab();

      this.#setupPreviewTab();
      this.#setupReferenceTab();

      return this;
    })();
  }

  async getAllBuffers() {

    const { Buffer } =
      await import(/* webpackChunkName: "buffer" */ 'buffer');

    return [
      {
        name: 'metadata.json',
        contents: Buffer.from(this.#meta.state.sliceDoc(), 'utf8'),
      },
      {
        name: 'document.html',
        contents: Buffer.from(this.#doc.state.sliceDoc(), 'utf8'),
      },
    ];
  }

  setMetadataContent(str) {
    this.#meta.dispatch({
      changes: [
        {
          from: 0,
          to: this.#meta.state.doc.length,
        },
        {
          from: 0,
          insert: str,
        },
      ],
    });
  }

  setDocumentContent(str) {
    this.#doc.dispatch({
      changes: [
        {
          from: 0,
          to: this.#doc.state.doc.length,
        },
        {
          from: 0,
          insert: str,
        },
      ],
    });
  }

  async #createMetadataTab() {

    // example input for the metadata editor
    const metaExample =
`{
  "title": "My Awesome Paper",
  "author": [
    {
      "name": "Julie P. Foo",
      "affiliation": "Institute of Bar",
      "orcid": "0000-0000-0000-0000"
    }
  ],
  "references": {
    "Einstein1914": {
      "author": [
        "Einstein, A."
      ],
      "title": "The Formal Foundation of the General Theory of Relativity",
      "year": "1914"
    }
  }
}`;

    const metaInputElement = document.getElementById('meta-input');
    $( metaInputElement ).html(loadingIndicator);

    const { json } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/lang-json');
    const { EditorState, StateField, Text } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/state');
    const { EditorView, keymap, lineNumbers, highlightActiveLine,
             highlightActiveLineGutter, showPanel } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/view');
    const { defaultKeymap, historyKeymap, history } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/commands');
    const { searchKeymap, search } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/search');
    const { classHighlighter } =
      await import(/* webpackChunkName: "codemirror" */ '@lezer/highlight');
    const { syntaxHighlighting, codeFolding, foldGutter } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/language');

    $( metaInputElement ).empty();

    let metaInputState = EditorState.create({
      doc: metaExample,
      extensions: [
        json(),
        syntaxHighlighting(classHighlighter),
        history(),            // support for undo
        keymap.of([
          ...defaultKeymap,   // basic default keymap
          ...historyKeymap,   // keymap for undo
          ...searchKeymap,    // keymap for searching
        ]),
        EditorView.lineWrapping,      // soft-wrap long lines
        EditorView.editable.of(true), // allow editing
        lineNumbers(),                // number lines
        highlightActiveLine(),        // highlight active line + its gutter
        highlightActiveLineGutter(),
        codeFolding(),                // add fold controls to gutter
        foldGutter(),
        search({
          top: true
        }),
        getCodemirrorTheme(),
      ]
    });

    let metaInputView = new EditorView({
      state: metaInputState,
      parent: metaInputElement,
    });

    $( metaInputElement ).on('elucidate.bibtex.magic', (e) => {

      // get the current content and replace references
      var buffer = metaInputView.state.sliceDoc();
      var jsonmeta = JSON.parse(buffer);
      jsonmeta.references = e.content;

      // pretty-print json with 2-space tab length
      const jsonmetastr = JSON.stringify(jsonmeta, null, 2);

      // insert the new html on the document page
      metaInputView.dispatch({
        changes: [
          {
            from: 0,
            to: metaInputView.state.doc.length,
          },
          {
            from: 0,
            insert: jsonmetastr,
          },
        ],
      });

      // make visible to the user
      $( '#meta-input-tab-title a' ).trigger('click');
    });

    return metaInputView;
  }

  async #createDocumentTab() {

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
    $( docInputElement ).html(loadingIndicator);

    const { html } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/lang-html');
    const { EditorState, StateField, Text } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/state');
    const { EditorView, keymap, lineNumbers, highlightActiveLine,
             highlightActiveLineGutter, showPanel } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/view');
    const { defaultKeymap, historyKeymap, history } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/commands');
    const { searchKeymap, search } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/search');
    const { classHighlighter } =
      await import(/* webpackChunkName: "codemirror" */ '@lezer/highlight');
    const { syntaxHighlighting, codeFolding, foldGutter } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/language');

    $( docInputElement ).empty();

    let docInputState = EditorState.create({
      doc: docExample,
      extensions: [
        html(),
        syntaxHighlighting(classHighlighter),
        history(),            // support for undo
        keymap.of([
          ...defaultKeymap,   // basic default keymap
          ...historyKeymap,   // keymap for undo
          ...searchKeymap,    // keymap for searching
        ]),
        EditorView.lineWrapping,      // soft-wrap long lines
        EditorView.editable.of(true), // allow editing
        lineNumbers(),                // number lines
        highlightActiveLine(),        // highlight active line + its gutter
        highlightActiveLineGutter(),
        codeFolding(),                // add fold controls to gutter
        foldGutter(),
        search({
          top: true
        }),
        getCodemirrorTheme(),
      ]
    });

    let docInputView = new EditorView({
      state: docInputState,
      parent: docInputElement,
    });

    $( docInputElement ).on('elucidate.latex.magic', (e) => {

      // insert the new html on the document page
      docInputView.dispatch({
        changes: [
          {
            from: 0,
            to: docInputView.state.doc.length,
          },
          {
            from: 0,
            insert: e.content,
          },
        ],
      });

      // make visible to the user
      $( '#doc-input-tab-title a' ).trigger('click');
    });

    return docInputView;
  }

  #setupPreviewTab() {

    $( '#doc-preview-tab-title a' ).on('focus', () => {
      // TODO: could check if the document has changed before
      // re-computing the citations

      const buffer = this.#doc.state.sliceDoc();
      const cleanBuffer = sanitize(buffer);

      const wrapper = $( document.createElement('article') )
        .html(cleanBuffer);

      const meta = JSON.parse(this.#meta.state.sliceDoc());

      // handle parenthetical citations
      $( wrapper ).find( 'span.citep' ).each((i, elem) => {
        var refs = $( elem ).attr('data-refs');
        if (refs) {
          refs = refs.split(',');
          const inner = refs.map((ref) => {
            const reffix = ref.trim();  // remove any spaces
            if (meta.references && (reffix in meta.references)) {
              const year = meta.references[reffix].year;
              const authors = meta.references[reffix].author;
              const lasts = authors.map((a) => a.split(', ')[0]);

              const stem = (lasts.length < 3) ?
                lasts.join(' and ') : (lasts[0] + ' <i>et al.</i>');
              return '(' + stem + (year ? ` ${year}` : '') + ')';
            } else {
              return `<span class="error">${reffix}</span>`;
            }
          });

          const citation = inner.join('; ');
          $( elem ).html(sanitize(citation));
        }
      });

      // handle inline citations
      $( wrapper ).find( 'span.citet' ).each((i, elem) => {
        var refs = $( elem ).attr('data-refs')
        if (refs) {
          refs = refs.split(',');
          const inner = refs.map((ref) => {
            const reffix = ref.trim();  // remove any spaces
            if (meta.references && (reffix in meta.references)) {
              const year = meta.references[reffix].year;
              const authors = meta.references[reffix].author;
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
          $( elem ).html(sanitize(citation));
        }
      });

      $( '#doc-preview' ).html(wrapper);
    });
  }

  #setupReferenceTab() {

    // do syntax highlighting on the reference panel
    $( '#html-ref code' ).each((i, e) => {
      hljs.highlightElement(e);
    });
  }
}

// vim: set ft=javascript:
