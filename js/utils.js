import * as $ from 'jquery';

export function initFontSizeSlider() {

  $( '#font-size-control' ).on('moved.zf.slider', function(e) {
    const elem = $( e.currentTarget ).find('input').first();
    const newsize = elem.val().toString() + 'rem';
    $( ':root' ).css('--base-font-size', newsize);
  });
}

export function initDarkModeToggle() {

  $( '#dark-mode-switch' ).on('change', function() {
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
      $( '#dark-mode-switch' ).prop('checked', true);
      $( 'html' ).attr('data-theme', 'dark');
    } else {
      // user prefers light mode or has no preference set, so set light mode
      $( '#dark-mode-switch' ).prop('checked', false);
      $( 'html' ).attr('data-theme', 'light');
    }
  } else {
    // can't use matchmedia, so assume dark mode by default
    $( '#dark-mode-switch' ).prop('checked', true);
    $( 'html' ).attr('data-theme', 'dark');
  }
}

export function divWrap(elements, classes) {

  const wrapper = document.createElement('div');
  $( wrapper ).addClass(classes).append(elements);
  return wrapper;
}

export function createButtonWithIcon(labelText, iconName) {

  const button = document.createElement('button');
  return $( button )
    .attr('type', 'button')
    .addClass(['primary', 'button', 'icon-button', `md-${iconName}`])
    .html(labelText);
}

// vim: set ft=javascript:
