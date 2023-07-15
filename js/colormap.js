import tristimulus from './tristimulus.bin.js';

import { Buffer } from 'buffer';

import * as $ from 'jquery';

import { Slider, OffCanvas, Dropdown, Tooltip } from 'fdn/js/foundation';
import { initDarkModeToggle } from './utils';

function allocateArray(instance, type, heap, n) {

  // https://stackoverflow.com/a/49448982/1552418
  const nb = type.BYTES_PER_ELEMENT;
  var offset = instance._malloc(n * nb);
  heap.set(new type(n), offset / nb);

  return {
    array: heap.subarray(offset / nb, offset / nb + n),
    ptr: offset
  };
}

function allocateDoubleArray(instance, n) {
  return allocateArray(instance, Float64Array, instance.HEAPF64, n);
}

function allocateCharArray(instance, n) {
  return allocateArray(instance, Uint8Array, instance.HEAPU8, n);
}

function freeArray(instance, array) {

  array.array = null;
  instance._free(array.ptr);
  array.ptr = 0;
}

function imageDataToUri(array) {

  const buffer = Buffer.from(array);
  const prefix = 'data:image/png;base64,';
  return prefix + buffer.toString('base64');
}

function colorDataToHex(array) {

  const buffer = Buffer.from(array);
  return '#' + buffer.toString('hex');
}

export default (function() {

  $( document ).ready(() => {

    initDarkModeToggle();

    // load the wasm library
    const instance = tristimulus();

    instance.then((inst) => {

      var luminosity = Number($( '#luminosityInput' ).val());
      var breakpoints = new Map();
      var counter = 0;

      const nsampx = 32;
      const nsampy = 16;
      const sampsize = (4 * nsampx + 1) * nsampy;

      const nx = 100;
      const ny = 100;
      const numExtraBytes = 68;
      const imgsize = (4 * nx + 1) * ny;

      // allocate memory accessible from both wasm and js
      const xyz = allocateDoubleArray(inst, 3 * nx * ny);
      const rgb = allocateDoubleArray(inst, 3 * nx * ny);
      const png = allocateCharArray(inst, imgsize + numExtraBytes);

      const xyz1 = allocateDoubleArray(inst, 3);
      const rgb1 = allocateDoubleArray(inst, 3);
      const hex1 = allocateCharArray(inst, 3);

      const xyzsamp = allocateDoubleArray(inst, 3 * nsampx * nsampy);
      const rgbsamp = allocateDoubleArray(inst, 3 * nsampx * nsampy);
      const pngsamp = allocateCharArray(inst, sampsize + numExtraBytes);

      // when the wasm is ready, compute an initial image
      // NOTE: the image is not visible at first to avoid a flash
      // of empty content; once the image is computed, it is set
      // to visible below
      inst._xyzToRgbArray(luminosity, xyz.ptr, rgb.ptr, png.ptr, nx, ny);
      const dataUri = imageDataToUri(png.array);
      $( '#colors' ).attr('src', dataUri).css({
        visibility: 'visible',
      });
      $( '#zoom' ).css({
        backgroundColor: '#00000000'
      });

      $( '#colors' ).on('mousemove', (e) => {
        const w = $( '#colors' ).width();
        const h = $( '#colors' ).height();

        const U = e.offsetX / w;
        const V = e.offsetY / h;

        inst._xyzToRgb(luminosity, U, V, xyz1.ptr, rgb1.ptr, hex1.ptr);
        $( '#zoom' ).css({
          backgroundColor: colorDataToHex(hex1.array),
        });
      });

      $( '#colors' ).on('mouseleave', () => {
        $( '#zoom' ).css({
          backgroundColor: '#00000000'
        });
      });

      $( '#colors' ).on('click', (e) => {
        const w = $( '#colors' ).width();
        const h = $( '#colors' ).height();

        const U = e.offsetX / w;
        const V = e.offsetY / h;

        inst._xyzToRgb(luminosity, U, V, xyz1.ptr, rgb1.ptr, hex1.ptr);
        const color = colorDataToHex(hex1.array);

        const key = luminosity.toString();
        if (breakpoints.has(key)) {
          // breakpoint already exists, so just update it
          const bp = breakpoints.get(key);
          bp.color = color;
          bp.chrominance.u = U;
          bp.chrominance.v = V;
          $( bp.swatch ).css({
            backgroundColor: color,
          });
        } else {
          // create a new breakpoint
          const handle = document.createElement('span');
          $( handle )
            .addClass(['slider-handle', 'active'])
            .css({
              left: `${100 * luminosity}%`,
              transform: `translateX(${-100 * luminosity}%) translateY(-50%)`,
            })
            .attr({
              tabindex: 0,
              role: 'button',
              'aria-label': `Breakpoint ${counter} handle`,
            })
            .appendTo($( '#breakpointsControl' ));

          // make the dropdown
          const dropdown = document.createElement('div');
          $( dropdown )
            .attr({
              id: `dropdown${counter++}`,
              'data-dropdown': '',
              'data-position': 'bottom',
              'data-alignment': 'center',
              'data-close-on-click': true,
            })
            .addClass('dropdown-pane')
            .appendTo($( '#breakpointsControl' ));

          // connect the handle and the dropdown
          $( handle ).attr({
            'data-toggle': $( dropdown ).attr('id'),
          });

          // make a "big" swatch
          const swatch = document.createElement('div');
          $( swatch )
            .addClass('swatch')
            .css({
              backgroundColor: color,
            })
            .attr({
              id: $( dropdown ).attr('id') + '-swatch',
            });
          const swatchLabel = document.createElement('label');
          $( swatchLabel )
            .attr({
              for: $( swatch ).attr('id'),
            })
            .html('Swatch');
          $( dropdown ).append([swatchLabel, swatch]);

          // make a delete button
          const deleteButtonIcon = document.createElement('span');
          $( deleteButtonIcon ).addClass(['icon', 'md-delete']);
          const deleteButtonLabel = document.createElement('span');
          $( deleteButtonLabel ).html('Delete');
          const deleteButton = document.createElement('button');
          $( deleteButton )
            .attr('type', 'button')
            .addClass(['primary', 'button'])
            .append($( deleteButtonIcon ))
            .append($( deleteButtonLabel ))
            .appendTo($( dropdown ));

          // add to the breakpoint map
          const bp = {
            key,
            handle,
            dropdown,
            swatch,
            color,
            luminosity,
            chrominance: {
              u: U,
              v: V,
            },
          };
          breakpoints.set(key, bp);

          $( handle )
            .on('click', bp, (h) => {
              if (!$( h.data.handle ).hasClass('active')) {
                // move luminosity slider to match the current active breakpoint
                // NOTE: as a side effect, the style is updated
                $( '#luminosityInput' )
                  .val(h.data.luminosity)
                  .trigger('change');
              }
            })
            .on('focus', bp, (h) => {
              $( h.data.handle ).addClass('active');
            })
            .on('blur', bp, (h) => {
              $( h.data.handle ).removeClass('active');
            });

          $( deleteButton ).on('click', bp, (b) => {
            $( b.data.dropdown ).remove();
            $( b.data.handle ).remove();
            breakpoints.delete(b.data.key);
          });

          $( handle ).foundation();
          $( dropdown ).foundation();
        }

        // update the color of the element using updated map
        const bp = breakpoints.get(key);
        $( bp.handle ).css({
          backgroundColor: bp.color,
        });
      });

      $( '#luminosityControl' )
        .on('moved.zf.slider', (e) => {
          // get the new luminosity value
          const elem = $( e.currentTarget ).find('input').first();
          luminosity = Number(elem.val());

          // replace the image
          inst._xyzToRgbArray(luminosity, xyz.ptr, rgb.ptr, png.ptr, nx, ny);
          const dataUri = imageDataToUri(png.array);
          $( '#colors' ).attr('src', dataUri);

          // mark all breakpoints as inactive
          $( '#breakpointsControl span.slider-handle' )
            .removeClass('active');
        })
        .on('changed.zf.slider', (e) => {
          // get the new luminosity value
          const elem = $( e.currentTarget ).find('input').first();
          luminosity = Number(elem.val());

          const key = luminosity.toString();
          if (breakpoints.has(key)) {
            // breakpoint already exists, so mark it as active
            const bp = breakpoints.get(key);
            $( bp.handle ).addClass('active');
          }
        });

      $( '#interpolateButton' )
        .on('click', (e) => {
          if (breakpoints.size < 2) {
            $( '#breakpointsLabel' ).foundation('show');
          } else {
            const brsort = Array.from(breakpoints.values()).toSorted((a, b) => {
              return a.luminosity - b.luminosity;
            });

            const nbreak = brsort.length;
            const ybrk = allocateDoubleArray(inst, nbreak);
            const ubrk = allocateDoubleArray(inst, nbreak);
            const vbrk = allocateDoubleArray(inst, nbreak);

            brsort.forEach((obj, idx) => {
              ybrk.array[idx] = obj.luminosity;
              ubrk.array[idx] = obj.chrominance.u;
              vbrk.array[idx] = obj.chrominance.v;
            });

            inst._sample(ybrk.ptr, ubrk.ptr, vbrk.ptr, nbreak,
              xyzsamp.ptr, rgbsamp.ptr, pngsamp.ptr, nsampx, nsampy);
            const dataUri = imageDataToUri(pngsamp.array);
            $( '#preview' ).attr('src', dataUri).css({
              visibility: 'visible',
            });

            freeArray(inst, ybrk);
            freeArray(inst, ubrk);
            freeArray(inst, vbrk);
          }

          // return button to inactive appearance
          e.target.blur();
        });

      $( '#colors' ).on('click', (e) => {
        $( '#breakpointsLabel' ).foundation('hide');
      });

      $( '#luminosityControl' ).on('moved.zf.slider', (e) => {
        $( '#breakpointsLabel' ).foundation('hide');
      });

      $( '#grayscaleButton' ).on('click', (e) => {
        $( '#colors' ).toggleClass('grayscale');
        $( '#preview' ).toggleClass('grayscale');

        // return button to inactive appearance
        e.target.blur();
      });

      $( window ).on('unload', () => {
        freeArray(inst, xyz);
        freeArray(inst, rgb);
        freeArray(inst, png);

        freeArray(inst, xyz1);
        freeArray(inst, rgb1);
        freeArray(inst, hex1);

        freeArray(inst, xyzsamp);
        freeArray(inst, rgbsamp);
        freeArray(inst, pngsamp);
      });
    });

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
