import * as $ from 'jquery';

export class LatexMathProcessor {

  #visitor;
  #inputJax;

  constructor() {

    // async constructor hack
    return (async () => {

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

      return this;
    })();
  }

  static #renderSingleMml(math, visitor, doc) {

    math.typesetRoot = doc.createElement('mjx-container');
    math.typesetRoot.innerHTML = visitor.visitTree(math.root, doc);
    math.display && math.typesetRoot.setAttribute('display', 'block');
  }

  async #buildDocument(elem) {

    const { mathjax } =
      await import(/* webpackChunkName: "mathjax" */ 'mjx/mathjax');

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

  async run(input) {

    // pre-process to dom element
    const elem = this.#toElement(input);

    // build the document object
    const mjxdoc = await this.#buildDocument(elem);

    // convert to mathml inplace
    mjxdoc.render();

    return elem;
  }
}

// vim: set ft=javascript:
