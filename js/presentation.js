import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import latex from 'highlight.js/lib/languages/latex';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('html', xml);
hljs.registerLanguage('latex', latex);
hljs.registerLanguage('plaintext', plaintext);

export default (function() {

  // do syntax highlighting
  hljs.highlightAll();

  // create the slide deck...
  let deck = new Reveal({
    plugins: [
      RevealNotes,
    ],
    width: 1600,
    height: 800,
  });

  // ...and initialize
  deck.initialize();
})();

// vim: set ft=javascript:
