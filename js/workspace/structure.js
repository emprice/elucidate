import { latexToUnicode } from './utils';
import { sanitize } from 'dompurify';

import * as $ from 'jquery';

export class LatexStructureProcessor {

  #toString(input) {

    if (input instanceof Element) {
      // grab the string inner html for processing
      return input.innerHTML;
    }

    return input;
  }

  run(input) {

    var buffer = this.#toString(input);

    // TODO: handle \part and \chapter
    // see https://www.overleaf.com/learn/latex/Sections_and_chapters#Document_sectioning

    // clip between \begin{document} and \end{document}
    buffer = buffer.replace(/(?:.|\n)*?\\begin{document}/, '<article>');
    buffer = buffer.replace(/\\end{document}(?:.|\n)*/g, '</article>');

    // strip comments
    buffer = buffer.replaceAll(/(?:[^\\]|^)(\%.*)$/gm, '');

    // replace special latex codes with unicode characters
    buffer = latexToUnicode(buffer);

    // extract math temporarily; this is necessary because we don't want to
    // throw off mathjax by modifying math early
    let match;
    var protect = new Array(), count = 0;
    const dispmath = /\\begin{(equation|align|multline|eqnarray)}((?:.|\n)*?)\\end{\1}/g;
    const inlnmath = /(\$.+?\$)|(\\\(.+?\\\))/g;

    while ((match = dispmath.exec(buffer)) !== null) {
      buffer = buffer.slice(0, match.index) +
        `<span id="protected-${count}"></span>` +
        buffer.slice(dispmath.lastIndex, buffer.length);
      count = protect.push(match[0]);
      dispmath.lastIndex = 0;
    }

    while ((match = inlnmath.exec(buffer)) !== null) {
      buffer = buffer.slice(0, match.index) +
        `<span id="protected-${count}"></span>` +
        buffer.slice(inlnmath.lastIndex, buffer.length);
      count = protect.push(match[0]);
      inlnmath.lastIndex = 0;
    }

    // separate environments
    const envr = /\\begin{(\w+)}((?:.|\n)*?)\\end{\1}/g;
    while ((match = envr.exec(buffer)) !== null) {
      buffer = buffer.slice(0, match.index) +
        `<p class="${match[1]}">${match[2]}</p>` +
        buffer.slice(envr.lastIndex, buffer.length);
      envr.lastIndex = 0;
    }

    // convert nested commands to spans
    const nested = /(?:\\(\w+)(?:\[(.+?)\])?)?{([^\\\{\}]*?)}/g;
    while (nested.exec(buffer) !== null) {
      buffer = buffer.replaceAll(nested, '<span class="$1" data-options="$2">$3</span>');
    }

    // en-paragraph text
    buffer = buffer.replaceAll(/((?:.|\n)+?)(?:\n{2,}|$)/g, '<p>$1</p>\n\n');

    // map recognized latex special characters to their html entities
    // TODO: lots of symbols missing here
    buffer = buffer.replaceAll(/\\%/g, '%');
    buffer = buffer.replaceAll(/\\&/g, '&amp;');
    buffer = buffer.replaceAll(/---/g, '&mdash;');
    buffer = buffer.replaceAll(/--/g, '&ndash;');
    buffer = buffer.replaceAll(/(.)~(.)/g, '$1&nbsp;$2');

    // wrap sections and replace headings
    const elem = $( document.createElement('div') ).html(buffer);

    // title -> h1
    elem.find('span.title').unwrap('p').each((i, e) => {
      $( e ).replaceWith($( document.createElement('h1') ).html($( e ).html()));
    });

    // section -> h2
    elem.find('span.section').unwrap('p').each((i, e) => {
      const section = $( e ).nextUntil('span.section').addBack();
      section.wrapAll(document.createElement('section'));
      $( e ).replaceWith($( document.createElement('h2') ).html($( e ).html()));
    });

    // subsection -> h3
    elem.find('span.subsection').unwrap('p').each((i, e) => {
      const section = $( e ).nextUntil('span.subsection').addBack();
      section.wrapAll(document.createElement('section'));
      $( e ).replaceWith($( document.createElement('h3') ).html($( e ).html()));
    });

    // subsubsection -> h4
    elem.find('span.subsubsection').unwrap('p').each((i, e) => {
      const section = $( e ).nextUntil('span.subsubsection').addBack();
      section.wrapAll(document.createElement('section'));
      $( e ).replaceWith($( document.createElement('h4') ).html($( e ).html()));
    });

    // keywords
    elem.find('span.keywords').unwrap('p').each((i, e) => {
      const kw = $( e ).html().split(', ').map((k) =>
        $( document.createElement('li') ).html(k));
      $( e ).replaceWith($( document.createElement('ul') ).append(kw))
    });

    // citations
    elem.find('span.citet, span.citep').each((i, e) => {
      const refs = $( e ).html();
      $( e ).attr('data-refs', refs).html('');
    });

    // put back protected math
    protect.forEach((e, i) => {
      elem.find(`#protected-${i}`).first().html(e);
    });

    // remove any empty elements after processing
    elem.find(':empty:not(.citep):not(.citet)').remove();

    return elem.get(0);
  }
}

// vim: set ft=javascript:
