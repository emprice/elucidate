import * as $ from 'jquery';
import { Buffer } from 'buffer';
import { Slider, OffCanvas, Tooltip } from 'fdn/js/foundation';

import { Breakpoint } from './breakpoint';
import { initDarkModeToggle } from '../utils';

import tristimulus from './tristimulus.bin.js';

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
  //return allocateArray(instance, Float64Array, instance.HEAPF64, n);

  const nb = Float64Array.BYTES_PER_ELEMENT;
  var offset = instance._malloc(n * nb);
  const array = new Float64Array(instance.HEAPU8.buffer, offset, n);

  return {
    array: array,
    ptr: offset,
  };
}

function allocateCharArray(instance, n) {
  return allocateArray(instance, Uint8Array, instance.HEAPU8, n);
}

function allocateImageArray(instance, elem, nx, ny) {

  const n = 4 * nx * ny;
  const nb = Uint8ClampedArray.BYTES_PER_ELEMENT;
  var offset = instance._malloc(n * nb);

  const query = $( elem );
  query.attr({
    width: nx,
    height: ny,
  });
  const qelem = query.get(0);
  const ctx = qelem.getContext('2d');

  const array = new Uint8ClampedArray(instance.HEAPU8.buffer, offset, n);
  const img = new ImageData(array, nx, ny);

  return {
    image: img,
    elem: query,
    canvas: qelem,
    context: ctx,
    array: array,
    ptr: offset,
  };
}

function freeArray(instance, array) {

  array.array = null;
  instance._free(array.ptr);
  array.ptr = 0;
}

function colorDataToHex(array) {

  const buffer = Buffer.from(array);
  return '#' + buffer.toString('hex');
}

function colorListToJson(array, nsamp) {

  const buffer = Buffer.from(array);
  const numBytesPerColor = 3;
  var start = 0;
  var clist = [];

  while (start < numBytesPerColor * nsamp) {
    clist.push('#' + buffer.toString('hex', start, start + numBytesPerColor));
    start += numBytesPerColor;
  }

  return clist;
}

export default (function() {

  $( document ).ready(() => {

    initDarkModeToggle();

    // load the wasm library
    const instance = tristimulus();

    instance.then((inst) => {

      var luminosity = Number($( '#luminosity-input' ).val());
      var breakpoints = new Map();
      var counter = 0;

      const nsampx = 128;
      const nsampy = 16;

      const nx = 128;
      const ny = 128;

      // allocate memory accessible from both wasm and js
      const xyz = allocateDoubleArray(inst, 3 * nx * ny);
      const rgb = allocateDoubleArray(inst, 3 * nx * ny);
      const colors = allocateImageArray(inst, '#colors', nx, ny);

      const xyz1 = allocateDoubleArray(inst, 3);
      const rgb1 = allocateDoubleArray(inst, 3);
      const hex1 = allocateCharArray(inst, 3);

      const xyzsamp = allocateDoubleArray(inst, 3 * nsampx * nsampy);
      const rgbsamp = allocateDoubleArray(inst, 3 * nsampx * nsampy);
      const preview = allocateImageArray(inst, '#preview', nsampx, nsampy);
      const hexsamp = allocateCharArray(inst, 3 * nsampx);

      // when the wasm is ready, compute an initial image
      inst._sampleUvPlane(luminosity, xyz.ptr, rgb.ptr, colors.ptr, nx, ny);
      colors.context.putImageData(colors.image, 0, 0);
      $( '#zoom' ).css({
        backgroundColor: '#00000000'
      });

      colors.elem.on('mousemove', (e) => {
        const w = colors.elem.width();
        const h = colors.elem.height();

        xyz1.array[0] = luminosity;
        xyz1.array[1] = e.offsetX / w;
        xyz1.array[2] = e.offsetY / h;

        inst._convertCoordToHex(xyz1.ptr, rgb1.ptr, hex1.ptr);
        $( '#zoom' ).css({
          backgroundColor: colorDataToHex(hex1.array),
        });
      });

      colors.elem.on('mouseleave', () => {
        $( '#zoom' ).css({
          backgroundColor: '#00000000'
        });
      });

      colors.elem.on('click', (e) => {
        const w = colors.elem.width();
        const h = colors.elem.height();

        xyz1.array[0] = luminosity;
        xyz1.array[1] = e.offsetX / w;
        xyz1.array[2] = e.offsetY / h;

        inst._convertCoordToHex(xyz1.ptr, rgb1.ptr, hex1.ptr);
        const color = colorDataToHex(hex1.array);

        if (breakpoints.has(luminosity)) {
          // breakpoint already exists, so update it
          const bp = breakpoints.get(luminosity);
          bp.update({
            luminosity,
            u: xyz1.array[1],
            v: xyz1.array[2],
            color
          });
        } else {
          // add the new breakpoint
          const bp = new Breakpoint({
            id: counter,
            luminosity,
            u: xyz1.array[1],
            v: xyz1.array[2],
            color
          });
          $( '#breakpoints-control' ).append([bp.handle, bp.dropdown]);
          breakpoints.set(luminosity, bp);
          counter++;

          $( bp.handle )
            .on('click', bp, (ee) => {
              // move luminosity slider to match the current active breakpoint
              // NOTE: as a side effect, the style is updated, if necessary
              if (!($( ee.data.handle ).hasClass('active'))) {
                $( '#luminosity-input' )
                  .val(ee.data.luminosity)
                  .trigger('change');
              }
            });

          $( bp.set )
            .on('click', bp, (ee) => {
              const bp = ee.data;
              var color = $( bp.hexInput ).val();

              hex1.array.set(Buffer.from(color.slice(1), 'hex'));
              inst._convertHexToUv(hex1.ptr, rgb1.ptr, xyz1.ptr);

              // HACK: clamp the luminosity to match the granularity of
              // the luminosity slider
              xyz1.array[0] = Number(xyz1.array[0].toFixed(2));
              inst._convertUvToHex(xyz1.ptr, rgb1.ptr, hex1.ptr);
              color = colorDataToHex(hex1.array);

              breakpoints.delete(bp.luminosity);
              bp.update({
                luminosity: xyz1.array[0],
                u: xyz1.array[1],
                v: xyz1.array[2],
                color });
              $( bp.hexInput ).val(color);
              breakpoints.set(xyz1.array[0], bp);

              $( '#luminosity-input' )
                .val(bp.luminosity)
                .trigger('change');
            });

          $( bp.delete ).on('click', bp, (ee) => {
            const bp = ee.data;
            $( bp.dropdown ).remove();
            $( bp.handle ).remove();
            breakpoints.delete(bp.luminosity);
          });

          // update styling -- do this last!
          $( bp.handle ).foundation();
          $( bp.dropdown ).foundation();
        }
      });

      $( '#luminosity-control' )
        .on('moved.zf.slider', (e) => {
          // get the new luminosity value
          luminosity = Number($( '#luminosity-input' ).val());

          // replace the image
          inst._sampleUvPlane(luminosity, xyz.ptr, rgb.ptr, colors.ptr, nx, ny);
          colors.context.putImageData(colors.image, 0, 0);

          // mark all breakpoints as inactive
          $( '#breakpoints-control .slider-handle' ).removeClass('active');
        })
        .on('changed.zf.slider', (e) => {
          // get the new luminosity value
          luminosity = Number($( '#luminosity-input' ).val());

          if (breakpoints.has(luminosity)) {
            // breakpoint already exists, so mark it as active if
            // it isn't already; this also removes the active state styling
            // from any other handles
            const bp = breakpoints.get(luminosity);
            if (!($( bp.handle ).hasClass('active'))) {
              $( '#breakpoints-control .slider-handle' ).removeClass('active');
              $( bp.handle ).addClass('active');
            }
          }
        });

      $( '#interpolate-button' )
        .on('click', (e) => {
          if (breakpoints.size < 2) {
            $( '#breakpoints-label' ).foundation('show');
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

            inst._sampleColormap(ybrk.ptr, ubrk.ptr, vbrk.ptr,
              nbreak, xyzsamp.ptr, rgbsamp.ptr, hexsamp.ptr,
              preview.ptr, nsampx, nsampy);
            preview.context.putImageData(preview.image, 0, 0);
            preview.elem.css({
              visibility: 'visible',
            });

            const clist = colorListToJson(hexsamp.array, nsampx);
            const json = JSON.stringify(clist);
            const python = `import json
from matplotlib.colors import LinearSegmentedColormap
clist = json.loads('${json}')
cmap = LinearSegmentedColormap.from_list('custom', clist)`

            const jsonUri = `data:text/plain;base64,${btoa(json)}`;
            $( '#get-json-button' )
              .attr({
                href: jsonUri,
              })
              .removeClass('disabled')
              .removeAttr('aria-disabled');

            const pyUri = `data:text/plain;base64,${btoa(python)}`;
            $( '#get-python-button' )
              .attr({
                href: pyUri,
              })
              .removeClass('disabled')
              .removeAttr('aria-disabled');

            const imgUri = $( '#preview' ).get(0).toDataURL('image/png');
            $( '#get-image-button' )
              .attr({
                href: imgUri,
              })
              .removeClass('disabled')
              .removeAttr('aria-disabled');

            freeArray(inst, ybrk);
            freeArray(inst, ubrk);
            freeArray(inst, vbrk);
          }

          // return button to inactive appearance
          e.target.blur();
        });

      colors.elem.on('click', (e) => {
        $( '#breakpoints-label' ).foundation('hide');
      });

      $( '#luminosity-control' ).on('moved.zf.slider', (e) => {
        $( '#breakpoints-label' ).foundation('hide');
      });

      $( '#grayscale-button' ).on('click', (e) => {
        colors.elem.toggleClass('grayscale');
        preview.elem.toggleClass('grayscale');

        // return button to inactive appearance
        e.target.blur();
      });

      $( window ).on('unload', () => {
        freeArray(inst, xyz);
        freeArray(inst, rgb);
        freeArray(inst, colors);

        freeArray(inst, xyz1);
        freeArray(inst, rgb1);
        freeArray(inst, hex1);

        freeArray(inst, xyzsamp);
        freeArray(inst, rgbsamp);
        freeArray(inst, preview);
        freeArray(inst, hexsamp);
      });
    });

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
