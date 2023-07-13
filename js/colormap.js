import tristimulus from './tristimulus.bin.js';

import { Buffer } from 'buffer';

import * as $ from 'jquery';

import { Slider, OffCanvas } from 'fdn/js/foundation';
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

      const nx = 100;
      const ny = 100;
      const numExtraBytes = 68;
      const filteredDataSize = (4 * nx + 1) * ny;

      // allocate memory accessible from both wasm and js
      const xyz = allocateDoubleArray(inst, 3 * nx * ny);
      const rgb = allocateDoubleArray(inst, 3 * nx * ny);
      const png = allocateCharArray(inst, filteredDataSize + numExtraBytes);

      const xyz1 = allocateDoubleArray(inst, 3);
      const rgb1 = allocateDoubleArray(inst, 3);
      const hex1 = allocateCharArray(inst, 3);

      // when the wasm is ready, compute an initial image
      inst._xyzToRgbArray(75, xyz.ptr, rgb.ptr, png.ptr, nx, ny);
      const dataUri = imageDataToUri(png.array);
      $( '#colors' ).attr('src', dataUri);
      $( '#zoom' ).css({
        backgroundColor: 'rgb(0 0 0 / 0%)'
      });

      $( '#colors' ).on('mousemove', (e) => {
        const x = e.offsetX / $( '#colors' ).width();
        const y = e.offsetY / $( '#colors' ).height();

        inst._xyzToRgb(75, x, y, xyz1.ptr, rgb1.ptr, hex1.ptr);
        const color = colorDataToHex(hex1.array);
        $( '#zoom' ).css({
          backgroundColor: color,
        });
      });

      $( '#colors' ).on('mouseleave', () => {
        $( '#zoom' ).css({
          backgroundColor: 'rgb(0 0 0 / 0%)'
        });
      });

      $( window ).on('unload', () => {
        freeArray(inst, xyz);
        freeArray(inst, rgb);
        freeArray(inst, png);

        freeArray(inst, xyz1);
        freeArray(inst, rgb1);
        freeArray(inst, hex1);
      });
    });

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
