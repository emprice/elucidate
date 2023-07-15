import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import latex from 'highlight.js/lib/languages/latex';
import plaintext from 'highlight.js/lib/languages/plaintext';

import 'highlight.js/styles/nord.css';

hljs.registerLanguage('html', xml);
hljs.registerLanguage('latex', latex);
hljs.registerLanguage('plaintext', plaintext);

import * as $ from 'jquery';

import { Slider, OffCanvas, Sticky } from 'fdn/js/foundation';
import { initDarkModeToggle } from './utils';

export default (function() {

  $( document ).ready(() => {

    initDarkModeToggle();

    // do syntax highlighting
    $( 'code' ).each((i, e) => {
      hljs.highlightElement(e);
    });

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript: