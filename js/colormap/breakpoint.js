import * as $ from 'jquery';
import { Slider, Dropdown } from 'fdn/js/foundation';
import { divWrap, createButtonWithIcon } from '../utils';

export class Breakpoint {

  constructor({ id, luminosity, u, v, color }) {

    this.luminosity = luminosity;
    this.chrominance = { u, v };
    this.color = color;

    // make the slider handle
    this.handle = document.createElement('span');
    $( this.handle )
      .addClass(['slider-handle', 'active'])
      .css({
        left: `${100 * this.luminosity}%`,
        transform: `translateX(${-100 * this.luminosity}%) translateY(-50%)`,
        backgroundColor: this.color,
      })
      .attr({
        id: `breakpoint${id}-handle`,
        tabindex: 0,
        role: 'button',
        'aria-label': `Breakpoint handle for Y = ${luminosity}`,
      });

    // make the dropdown
    this.dropdown = document.createElement('div');
    $( this.dropdown )
      .attr({
        id: `breakpoint${id}-dropdown`,
        'data-dropdown': '',
        'data-position': 'bottom',
        'data-alignment': 'center',
        'data-close-on-click': true,
        'data-allow-overlap': true,
      })
      .addClass('dropdown-pane');

    // connect the handle and the dropdown
    $( this.handle ).attr({
      'data-toggle': $( this.dropdown ).attr('id'),
    });

    // make a "big" swatch
    this.swatch = document.createElement('div');
    $( this.swatch )
      .addClass('swatch')
      .css({
        backgroundColor: this.color,
      })
      .attr({
        id: $( this.dropdown ).attr('id') + '-swatch',
      });
    const swatchLabel = document.createElement('label');
    $( swatchLabel )
      .attr({
        for: $( this.swatch ).attr('id'),
      })
      .html('Swatch');

    // wrap swatch elements
    const swatchContainer = divWrap([swatchLabel, this.swatch]);

    // make a custom hex input
    this.hexInput = document.createElement('input');
    $( this.hexInput )
      .attr({
        id: $( this.dropdown ).attr('id') + '-hex',
      })
      .val(color);
    const hexLabel = document.createElement('label');
    $( hexLabel )
      .attr({
        for: $( this.hexInput ).attr('id'),
      })
      .html('Hex code');
    this.set = createButtonWithIcon('Set', 'done');

    // wrap hex input elements
    const hexInputWrapper = divWrap([this.hexInput, this.set]);
    const hexContainer = divWrap([hexLabel, hexInputWrapper], ['hex']);

    // make a delete button for this breakpoint
    this.delete = createButtonWithIcon('Delete', 'delete');

    // add everything to the dropdown
    $( this.dropdown ).append([
      swatchContainer,
      hexContainer,
      this.delete,
    ]);
  }

  update({ luminosity, u, v, color }) {

    this.color = color;
    this.luminosity = luminosity;
    this.chrominance.u = u;
    this.chrominance.v = v;

    $( this.handle ).css({
      left: `${100 * this.luminosity}%`,
      transform: `translateX(${-100 * this.luminosity}%) translateY(-50%)`,
      backgroundColor: this.color,
    });

    $( this.swatch ).css({
      backgroundColor: this.color,
    });
  }
}

// vim: set ft=javascript:
