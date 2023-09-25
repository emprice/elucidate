import { EditorView } from '@codemirror/view';

export function getCodemirrorTheme() {

  // simple theme settings for a full-height editor that scrolls
  return EditorView.theme({
    '&': {
      'height': '100%',
    },
    '.cm-scroller': {
      'overflow': 'scroll',
    },
  });
}

export function latexToUnicode(buffer) {

  // https://en.wikibooks.org/wiki/LaTeX/Special_Characters
  const charmap = [
    // grave accents
    [/(?=(?:\\`{\w})|(?:{\\`\w})|(?:\\`\w{})).{1,3}?(\w)(?:{?})/g,
      { 'A': 'À', 'E': 'È', 'I': 'Ì', 'O': 'Ò', 'U': 'Ù',
        'a': 'à', 'e': 'è', 'i': 'ì', 'o': 'ò', 'u': 'ù' }],
    // acute accents
    [/(?=(?:\\'{\w})|(?:{\\'\w})|(?:\\'\w{})).{1,3}?(\w)(?:{?})/g,
      { 'A': 'Á', 'E': 'É', 'I': 'Í', 'O': 'Ó', 'U': 'Ú',
        'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú' }],
    // circumflex accents
    [/(?=(?:\\\^{\w})|(?:{\\\^\w})|(?:\\\^\w{})).{1,3}?(\w)(?:{?})/g,
      { 'A': 'Â', 'E': 'Ê', 'I': 'Î', 'O': 'Ô', 'U': 'Û',
        'a': 'â', 'e': 'ê', 'i': 'î', 'o': 'ô', 'u': 'û' }],
    // umlaut accents
    [/(?=(?:\\"{\w})|(?:{\\"\w})|(?:\\"\w{})).{1,3}?(\w)(?:{?})/g,
      { 'A': 'Ä', 'E': 'Ë', 'I': 'Ï', 'O': 'Ö', 'U': 'Ü',
        'a': 'ä', 'e': 'ë', 'i': 'ï', 'o': 'ö', 'u': 'ü' }],
    // tilde accents
    [/(?=(?:\\~{\w})|(?:{\\~\w})|(?:\\~\w{})).{1,3}?(\w)(?:{?})/g,
      { 'N': 'Ñ', 'O': 'Õ', 'n': 'ñ', 'o': 'õ' }],
    // cedilla accents
    [/(?=(?:\\c{\w})|(?:{\\c\w})|(?:\\c\w{})).{1,3}?(\w)(?:{?})/g,
      { 'C': 'Ç', 'c': 'ç' }],
    [/(?=(?:{\\\w})|(?:\\\w{})).{1,2}?(\w)(?:{?})/g,
      { 'O': 'Ø', 'o': 'ø' }],
  ];

  let cm, match;

  for (cm of charmap) {
    // cm[0] is the regex, cm[1] is a map from plain to unicode characters
    while ((match = cm[0].exec(buffer)) !== null) {
      // match[1] will be the character to replace
      if (cm[1][match[1]]) {
        buffer = buffer.slice(0, match.index) + cm[1][match[1]] +
          buffer.slice(cm[0].lastIndex, buffer.length);
      }
    }
  }

  return buffer;
}

// vim: set ft=javascript:
