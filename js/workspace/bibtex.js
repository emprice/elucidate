import { latexToUnicode } from './utils';
import { sanitize } from 'dompurify';

export class BibtexCitationProcessor {

  #toString(input) {

    if (input instanceof Element) {
      // grab the string inner html for processing
      return input.innerHTML;
    }

    return input;
  }

  #toElement(input, output) {

    // if original input is string, wrap everything in a div
    if (typeof input === 'string') {
      input = document.createElement('div');
    }

    input.innerHTML = sanitize(output);
    return input;
  }

  run(input) {

    var buffer = this.#toString(input);

    // citep and citet become spans with data entries
    buffer = buffer.replaceAll(/\\citep{([\w\+\-\.,]+?)}/g,
      '<span class="citep" data-refs="$1"></span>');
    buffer = buffer.replaceAll(/\\citet{([\w\+\-\.,]+?)}/g,
      '<span class="citet" data-refs="$1"></span>');

    return this.#toElement(input, buffer);
  }
}

export class BibtexEntryProcessor {

  run(buffer) {

    let match;
    var items = {};
    const entry = /@(article|book|booklet|conference|inbook|incollection|inproceedings|manual|mastersthesis|misc|phdthesis|proceedings|techreport|unpublished)\{(.+),((?:.|\n)+?)\}(?=(?:\n*(?:(?:\n@.+)|$)))/gi;

    while ((match = entry.exec(buffer)) !== null) {
      var item = {};
      const type = match[1].toLowerCase();
      const id = match[2];
      const inner = match[3];
      const keyval = /\s*(\w+)\s+=\s+((?:.|\n)+?)(?:(?:,\n(?=\s*\w+\s+=))|$)/g;

      while ((match = keyval.exec(inner)) !== null) {
        const key = match[1].toLowerCase();
        item[key] = latexToUnicode(match[2])
          .replaceAll(/\n/g, '')
          .replaceAll(/\s{2,}/g, ' ')
          .replaceAll(/(?=^|[^\\]){/g, '')
          .replaceAll(/(?<!\\)}/g, '')
          .replace(/^"((?:.|\n)+)"$/, '$1');
      }

      item.kind = type;
      item.author = item.author.split(' and ').map((name) => {
        // author names frequently use "~" between initials; get rid of those now
        name = name.replaceAll(/~/g, ' ');

        // attempt to extract a first and last name from a name that wasn't
        // already split by a comma
        const lastfirst = /^((?:[a-zA-Z\u00c0-\u017f.]+ )+?)((?:(?:[a-z\u00df-\u00ff.]\w+) )*(?:[A-Z\u00c0-\u00de.]\w+))/;
        if ((!name.includes(',')) && ((match = lastfirst.exec(name)) !== null)) {
          return match[2].trim() + ', ' + match[1].trim();
        } else {
          return name;
        }
      });
      items[id] = item;
    }

    return items;
  }
}

// vim: set ft=javascript:
