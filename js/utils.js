import * as $ from 'jquery';

export function initDarkModeToggle() {

  $( '#darkModeSwitch' ).on('change', function() {
    // when the toggle changes, update the html attribute to reflect the
    // current preference, which affects the rest of the page indirectly
    // through css
    const isDark = $( this ).prop('checked');
    $( 'html' ).attr('data-theme', (isDark) ? 'dark' : 'light');
  });

  // https://stackoverflow.com/a/57795495/1552418
  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // user prefers dark mode, so set dark mode
      $( '#darkModeSwitch' ).prop('checked', true);
      $( 'html' ).attr('data-theme', 'dark');
    } else {
      // user prefers light mode or has no preference set, so set light mode
      $( '#darkModeSwitch' ).prop('checked', false);
      $( 'html' ).attr('data-theme', 'light');
    }
  } else {
    // can't use matchmedia, so assume dark mode by default
    $( '#darkModeSwitch' ).prop('checked', true);
    $( 'html' ).attr('data-theme', 'dark');
  }
}

// vim: set ft=javascript:
