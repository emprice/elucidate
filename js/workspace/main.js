import * as $ from 'jquery';

import { Slider, OffCanvas, Sticky, Drilldown } from 'fdn/js/foundation';
import { initDarkModeToggle, initFontSizeSlider } from '../utils';
import { LhsPanel } from './lhs';
import { RhsPanel } from './rhs';

export default (function() {

  $( document ).ready(() => {

    // common user interface elements
    initFontSizeSlider();
    initDarkModeToggle();

    // application data
    const app = {
      lhs: new LhsPanel(),
      rhs: new RhsPanel(),
    };

    $( '#open-file-button' ).on('click', (e) => {
      $( '#open-file' ).trigger('click');
      e.target.blur();
    });

    $( '#open-file' ).on('change', (e) => {
      [...e.target.files].forEach(async (file, idx) => {
        await app.lhs.openDocument(file);
      });
    });

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
