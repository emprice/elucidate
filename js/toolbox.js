import * as $ from 'jquery';

import { Slider, OffCanvas, Sticky, Drilldown } from 'fdn/js/foundation';
import { initDarkModeToggle, initFontSizeSlider } from './utils';

export default (function() {

  $( document ).ready(() => {

    // run only when document is fully loaded
    initFontSizeSlider();
    initDarkModeToggle();

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
