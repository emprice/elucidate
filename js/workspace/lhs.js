import { LatexMathProcessor } from './mathml';
import { LatexStructureProcessor } from './structure';
import { BibtexEntryProcessor, BibtexCitationProcessor } from './bibtex';

import * as $ from 'jquery';

import { Foundation, Tabs, Tooltip } from 'fdn/js/foundation';
import { getCodemirrorTheme } from './utils';

export class LhsPanel {

  #docs;
  #counter;
  #processors;

  constructor() {

    // async constructor hack
    return (async () => {
      // set up drag-and-drop handlers
      this.#setupInputHandlers();

      this.#counter = 0;
      this.#docs = [];

      this.#processors = {
        mathml: await new LatexMathProcessor(),
        structure: new LatexStructureProcessor(),
        bibcite: new BibtexCitationProcessor(),
        bibentry: new BibtexEntryProcessor(),
      };

      return this;
    })();
  }

  #setupInputHandlers() {

    // XXX: have to use event capturing to prevent codemirror from doing
    // exactly what this code is also trying to do

    document.getElementById('left-panel-input')
      .addEventListener('drop', (e) => {
        // prevent default drop behavior
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.items) {
          // use DataTransferItemList
          [...e.dataTransfer.items].forEach(async (item, idx) => {
            if (item.kind === 'file') {
              // only accept files
              const file = item.getAsFile();
              await this.openDocument(file);
            }
          });
        } else {
          // use DataTransfer
          [...e.dataTransfer.files].forEach(async (file, idx) => {
            await this.openDocument(file);
          });
        }
      }, { capture: true });

    document.getElementById('left-panel-input')
      .addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, { capture: true });
  }

  async openDocument(file) {

    const { EditorState, Text } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/state');
    const { EditorView, keymap, lineNumbers, highlightActiveLine,
            highlightActiveLineGutter, showPanel } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/view');
    const { defaultKeymap, historyKeymap, history } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/commands');
    const { searchKeymap, search } =
      await import(/* webpackChunkName: "codemirror" */ '@codemirror/search');

    // unique id for the new tab
    const newTabId = `user-tab-${this.#counter++}`;

    // anchor to switch to this tab on click
    const anchor = $( document.createElement('a') )
      .attr({
        'href': `#${newTabId}`,
        'id': `${newTabId}-anchor`,
      })
      .html(file.name);

    // close button widget
    const button = $( document.createElement('button') )
      .html('×')
      .attr('title', `Close ${file.name}`);

    // entry in the tab title element
    const tabTitle = $( document.createElement('li') )
      .addClass('tabs-title')
      .append([anchor, button])
      .appendTo($( '#left-panel-tabs' ));

    // entry in the tab content element
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

    // load the file content into the editor
    const text = await file.text();
    let state = EditorState.create({
      doc: Text.of(text.split('\n')),
      extensions: [
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
        search({
          top: true
        }),
        showPanel.of(v => LhsPanel.#createControlsPanel(v, {
          inst: this,
          fileType,
        })),                          // custom context panel
        getCodemirrorTheme(),         // custon theme
      ]
    });

    // save persistent document data
    const newdoc = {
      id: newTabId,
      name: file.name,
      title: tabTitle,
      content: tabContent,
      view: new EditorView({
        state: state,
        parent: tabContent.get(0),
      }),
    };

    // add this doc to the growing list
    this.#docs.push(newdoc);

    // attach close button handler
    button.on('click', { inst: this, id: newTabId },
      LhsPanel.#closeButtonClickHandler);
  }

  closeAllDocuments() {

    this.#docs.forEach((doc) => {
      doc.title.remove();
      doc.content.remove();
    });
    this.#docs = [];

    Foundation.reInit('tabs');  // re-initialize tabs
  }

  async getAllBuffers() {

    const { Buffer } =
      await import(/* webpackChunkName: "buffer" */ 'buffer');

    return this.#docs.map((doc) => {
      return {
        name: doc.name,
        contents: Buffer.from(doc.view.state.sliceDoc(), 'utf8'),
      };
    });
  }

  static #closeButtonClickHandler(e) {

    const id = e.data.id;
    const inst = e.data.inst;

    const idx = inst.#docs.findIndex((elem) => elem.id === id);
    const doc = inst.#docs.splice(idx, 1)[0]; // remove from the list

    doc.title.remove();
    doc.content.remove();

    Foundation.reInit('tabs');  // re-initialize tabs

    // if any tabs are still open, display one
    if (inst.#docs.length > 0) {
      const prevIdx = (idx + 1 <= inst.#docs.length) ? idx : (idx - 1);
      const prevContent = inst.#docs[prevIdx].content;
      $( '#left-panel-tabs' ).foundation('selectTab', prevContent, false);
    }
  }

  static #structureButtonClickHandler(e) {

    const state = e.data.view.state;
    const proc = e.data.inst.#processors;

    // get the current selection, if there is one; otherwise, select
    // the entire active file
    const sel = state.selection.main;
    var buffer = state.sliceDoc(sel.from, sel.to);
    if (buffer.length === 0) buffer = state.sliceDoc();

    try {
      if (buffer.length == 0) {
        throw new Error('no contents in buffer');
      }

      // do the actual conversion operation; this will *always*
      // return a dom element
      const elem = proc.structure.run(buffer);
      const html = elem.html().replaceAll(/\n{3,}/g, '\n\n');

      if (html.length == 0) {
        throw new Error('no sections found in buffer');
      }

      // put all the output onto the user's clipboard
      navigator.clipboard.writeText(html).then(() => {
        // make sure the button goes back to its unfocused state
        $( e.target ).trigger('blur');
      });

    } catch (ex) {
      // problem converting to mathml -- early exit and show tooltip help
      $( e.target ).foundation('show');
      return;
    }
  }

  static #mathButtonClickHandler(e) {

    const state = e.data.view.state;
    const proc = e.data.inst.#processors;

    // create a dummy buffer with just the selected content combined into
    // a single string; codemirror input is split across several html
    // elements for display, but mathjax works on the concatenated version
    const sel = state.selection.main;
    var buffer = state.sliceDoc(sel.from, sel.to);

    try {
      if (buffer.length == 0) {
        throw new Error('no contents in buffer');
      }

      // do the actual conversion operation; this will *always*
      // return a dom element
      proc.mathml.run(buffer).then((elem) => {

        // make a nice string of all the math, compacted
        const html = $( elem ).find('math').map((i, e) => {
          return e.html().replaceAll(/\n\s*/g, '');
        }).get().join('\n');

        if (html.length == 0) {
          throw new Error('no math found in buffer');
        }

        // put all the output mathml onto the user's clipboard
        navigator.clipboard.writeText(html).then(() => {
          // make sure the button goes back to its unfocused state
          $( e.target ).trigger('blur');
        });
      });

    } catch (ex) {
      // problem converting to mathml -- early exit and show tooltip help
      $( e.target ).foundation('show');
      return;
    }
  }

  static #magicLatexButtonClickHandler(e) {

    const state = e.data.view.state;
    const proc = e.data.inst.#processors;

    // get the entire active file
    var buffer = state.sliceDoc();

    try {
      if (buffer.length == 0) {
        throw new Error('no contents in buffer');
      }

      // do the actual conversion operation:
      //  1) convert structural components, preserving math
      //  2) convert inline and display math
      // this will *always* return a dom element
      var elem = proc.structure.run(buffer);
      proc.mathml.run(elem).then((elem) => {

        const html = $( elem ).find('math')
          .unwrap('mjx-container').unwrap('span')
          .each((i, e) => {
            const prev = $( e ).html();
            $( e ).html(prev.replaceAll(/\n\s*/g, ''));
          }).end().html().replaceAll(/\n{3,}/g, '\n\n');

        if (html.length == 0) {
          throw new Error('no convertible elements found in buffer');
        }

        // send the data to listeners
        $( '#doc-input' ).trigger({
          type: 'elucidate.latex.magic',
          content: html,
        });

        // make sure the button goes back to its unfocused state
        $( e.target ).trigger('blur');
      });
    } catch (ex) {
      // problem converting -- early exit and show tooltip help
      $( e.target ).foundation('show');
      return;
    }
  }

  static #bibButtonClickHandler(e) {

    const state = e.data.view.state;
    const proc = e.data.inst.#processors;

    // get the current selection, if there is one; otherwise, select
    // the entire active file
    const sel = state.selection.main;
    var buffer = state.sliceDoc(sel.from, sel.to);
    if (buffer.length === 0) buffer = state.sliceDoc();

    try {
      // parse to json
      const jsonbib = proc.bibentry.run(buffer);

      // pretty-print json with 2-space tab length
      const jsonbibstr = JSON.stringify(jsonbib, null, 2);

      // put all the output json onto the user's clipboard
      navigator.clipboard.writeText(jsonbibstr).then(() => {
        // make sure the button goes back to its unfocused state
        $( e.target ).trigger('blur');
      });

    } catch (ex) {
      // problem converting to json -- early exit and show tooltip help
      $( e.target ).foundation('show');
      return;
    }
  }

  static #magicBibtexButtonClickHandler(e) {

    const state = e.data.view.state;
    const proc = e.data.inst.#processors;

    // get the entire active file contents
    var buffer = state.sliceDoc();

    try {
      // parse to json
      const jsonbib = proc.bibentry.run(buffer);

      // send the data to listeners
      $( '#meta-input' ).trigger({
        type: 'elucidate.bibtex.magic',
        content: jsonbib,
      });

      // make sure the button goes back to its unfocused state
      $( e.target ).trigger('blur');

    } catch (ex) {
      // problem converting to json -- early exit and show tooltip help
      $( e.target ).foundation('show');
      return;
    }
  }

  static #createControlsPanel(view, data) {

    const magicLatexButton = $( document.createElement('button') )
      .addClass(['md-magic', 'secondary', 'button', 'icon-button'])
      .attr({
        'type': 'button',
        'data-tooltip': '',
        'data-position': 'top',
        'data-alignment': 'left',
        'title': '(Experimental) Use heuristics to generate an initial ' +
          'HTML version of the entire file.',
      })
      .html('Auto-process')
      .on('click', { ...data, view }, LhsPanel.#magicLatexButtonClickHandler)
      .foundation();

    const structureButton = $( document.createElement('button') )
      .addClass(['md-tree', 'secondary', 'button', 'icon-button'])
      .attr({
        'type': 'button',
        'data-tooltip': '',
        'data-position': 'top',
        'data-alignment': 'left',
        'title': 'Run structure wizard on complete document to attempt ' +
          'to automatically extract sections.',
      })
      .html('Structure')
      .on('click', { ...data, view }, LhsPanel.#structureButtonClickHandler)
      .foundation();

    const mathButton = $( document.createElement('button') )
      .addClass(['md-math', 'secondary', 'button', 'icon-button'])
      .attr({
        'type': 'button',
        'data-tooltip': '',
        'data-position': 'top',
        'data-alignment': 'left',
        'title': 'Copy MathML equivalent of highlighted LaTeX to the ' +
          'clipboard. Be sure to include math delimiters!',
      })
      .html('To MathML')
      .on('click', { ...data, view }, LhsPanel.#mathButtonClickHandler)
      .foundation();

    const magicBibtexButton = $( document.createElement('button') )
      .addClass(['md-magic', 'secondary', 'button', 'icon-button'])
      .attr({
        'type': 'button',
        'data-tooltip': '',
        'data-position': 'top',
        'data-alignment': 'left',
        'title': '(Experimental) Convert entire bibliography to JSON and ' +
          'replace in the existing metadata.',
      })
      .html('Auto-process')
      .on('click', { ...data, view }, LhsPanel.#magicBibtexButtonClickHandler)
      .foundation();

    const bibButton = $( document.createElement('button') )
      .addClass(['md-code', 'secondary', 'button', 'icon-button'])
      .attr({
        'type': 'button',
        'data-tooltip': '',
        'data-position': 'top',
        'data-alignment': 'left',
        'title': 'Copy JSON equivalent of highlighted BibTeX (or entire file) ' +
          'to the clipboard.',
      })
      .html('To JSON')
      .on('click', { ...data, view }, LhsPanel.#bibButtonClickHandler)
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
        $( `.controls-wrapper .button-wrapper:not(.${cls})` ).css('display', 'none');
        $( `.controls-wrapper .button-wrapper.${cls}` ).css('display', '');
      });

    const typeSelectLabel = $( document.createElement('label') )
      .attr('for', $( typeSelectControl ).attr('id'))
      .html('Use as:');

    const node = document.createElement('div');
    $( node ).append($( document.createElement('div') )
        .addClass('controls-wrapper')
        .append([
          $( document.createElement('div') )
            .addClass('select-wrapper')
            .append([typeSelectLabel, typeSelectControl]),
          $( document.createElement('div') )
            .addClass(['button-wrapper', 'group-latex'])
            .css('display', (data.fileType === 'latex') ? '' : 'none')
            .append([magicLatexButton, structureButton, mathButton]),
          $( document.createElement('div') )
            .addClass(['button-wrapper', 'group-bibtex'])
            .css('display', (data.fileType === 'bibtex') ? '' : 'none')
            .append([magicBibtexButton, bibButton]),
        ]))
      .addClass('context-panel');

    return { top: false, dom: node };
  }
}

// vim: set ft=javascript:
