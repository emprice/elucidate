import { mathjax } from 'mjx/mathjax';
import { SerializedMmlVisitor } from 'mjx/core/MmlTree/SerializedMmlVisitor';
import { HTMLAdaptor } from 'mjx/adaptors/HTMLAdaptor';
import { RegisterHTMLHandler } from 'mjx/handlers/html';
import { TeX } from 'mjx/input/tex';

// any mathjax extensions get loaded here; also see "packages" option in
// the input jax constructor
import 'mjx/input/tex/ams/AmsConfiguration';
import 'mjx/input/tex/boldsymbol/BoldsymbolConfiguration';

import * as $ from 'jquery';

export class LatexMathProcessor {

  #visitor;
  #inputJax;

  constructor() {

    // mathjax one-time setup for tex input to mathml output
    const adaptor = new HTMLAdaptor(window);
    RegisterHTMLHandler(adaptor);

    this.visitor = new SerializedMmlVisitor();
    this.inputJax = new TeX({
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
  }

  static #renderSingleMml(math, visitor, doc) {

    math.typesetRoot = doc.createElement('mjx-container');
    math.typesetRoot.innerHTML = visitor.visitTree(math.root, doc);
    math.display && math.typesetRoot.setAttribute('display', 'block');
  }

  #buildDocument(elem) {

    // fix for duplicate labels
    this.inputJax.reset();

    // build the mathjax document
    const mjxdoc = mathjax.document(elem, {
      InputJax: this.inputJax,
      renderActions: {
        assistiveMml: [],
        typeset: [
          150,
          (doc) => {
            for (let math of doc.math) {
              LatexMathProcessor.#renderSingleMml(math, this.visitor, document);
            }
          },
          (math, doc) => {
            LatexMathProcessor.#renderSingleMml(math, this.visitor, document);
          }
        ],
      },
    });

    return mjxdoc;
  }

  #toElement(input) {

    if (typeof input === 'string') {
      // create a dummy element for the mathjax processor
      const pseudo = document.createElement('span');
      pseudo.innerHTML = input;
      return pseudo;
    }

    return input;
  }

  run(input) {

    // pre-process to dom element
    const elem = this.#toElement(input);

    // build the document object
    const mjxdoc = this.#buildDocument(elem);

    // convert to mathml inplace
    mjxdoc.render();

    return elem;
  }
}

// vim: set ft=javascript:
