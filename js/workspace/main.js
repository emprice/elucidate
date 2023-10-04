import * as $ from 'jquery';
import { Slider, OffCanvas, Sticky, Drilldown } from 'fdn/js/foundation';

import { streamToString } from './utils';
import { initDarkModeToggle, initFontSizeSlider } from '../utils';
import { LhsPanel } from './lhs';
import { RhsPanel } from './rhs';

export default (function() {

  $( document ).ready(async () => {

    // common user interface elements
    initFontSizeSlider();
    initDarkModeToggle();

    // application data
    const app = {
      lhs: await new LhsPanel(),
      rhs: await new RhsPanel(),
    };

    // the actual file input is hidden and controlled with a custom
    // button (this is a common pattern)
    $( '#open-file-button' ).on('click', (e) => {
      $( '#open-file' ).trigger('click');
      $( e.target ).trigger('blur');
    });

    $( '#open-file' ).on('change', (e) => {
      [...e.target.files].forEach(async (file, idx) => {
        await app.lhs.openDocument(file);
      });
    });

    // to save the workspace, we save all open files with their names
    // in one directory, and the html/json version in a second directory
    // in another; settings are persisted in another json file at the root
    $( '#save-workspace-button' ).on('mousedown', async (e) => {
      const pako = await import(/* webpackChunkName: "compression" */ 'pako');
      const tar = await import(/* webpackChunkName: "compression" */ 'tar-stream');
      const { Buffer } = await import(/* webpackChunkName: "compression" */ 'buffer');

      const texFiles = await app.lhs.getAllBuffers();
      const htmlFiles = await app.rhs.getAllBuffers();

      const settings = {
        isDark: $( '#dark-mode-switch' ).prop('checked'),
        fontSize: $( '#font-size-control' ).find('input').first().val(),
      };

      const pack = tar.pack();

      // save the lhs files as input
      texFiles.forEach((entry) => {
        pack.entry({
          name: `input/${entry.name}`,
        }, entry.contents);
      });

      // save the rhs files as output
      htmlFiles.forEach((entry) => {
        pack.entry({
          name: `output/${entry.name}`,
        }, entry.contents);
      });

      // persist user settings
      pack.entry({
        name: 'settings.json',
      }, JSON.stringify(settings));

      pack.finalize();

      const tarContent = await streamToString(pack);
      const gzContent = Buffer.from(pako.gzip(tarContent)).toString('base64');
      const uri = `data:application/gzip;base64,${gzContent}`;
      const downloadName = `elucidateWorkspace_${new Date().toISOString()}.tar.gz`;
      $( e.target )
        .attr('href', uri)
        .attr('download', downloadName)
        .trigger('blur');
    });

    // the actual file input is hidden and controlled with a custom
    // button (this is a common pattern)
    $( '#restore-workspace-button' ).on('click', (e) => {
      $( '#restore-workspace' ).trigger('click');
      $( e.target ).trigger('blur');
    });

    $( '#restore-workspace' ).on('change', async (e) => {
      const pako = await import(/* webpackChunkName: "compression" */ 'pako');
      const tar = await import(/* webpackChunkName: "compression" */ 'tar-stream');
      const { default: Stream } = await import(/* webpackChunkName: "compression" */ 'stream');

      app.lhs.closeAllDocuments();

      try {
        const file = e.target.files[0];
        const tarContent = pako.ungzip(await file.arrayBuffer());

        const extract = tar.extract();
        extract.on('entry', async (header, stream, next) => {
          const name = header.name;
          const fulltext = await streamToString(stream);

          if (name === 'settings.json') {
            // handle workspace settings
            const settings = JSON.parse(fulltext);

            $( '#dark-mode-switch' )
              .prop('checked', settings.isDark).trigger('change');
            $( '#font-size-control' )
              .find('input').first().val(settings.fontSize).trigger('change');
          } else {
            const s = name.split('/');

            if (s[0] === 'output') {
              // only two recognized rhs files
              if (s[1] === 'metadata.json') {
                app.rhs.setMetadataContent(fulltext);
              } else if (s[1] === 'document.html') {
                app.rhs.setDocumentContent(fulltext);
              }
            } else if (s[0] === 'input') {
              // this is an lhs file; pretend to be an actual File object
              // and request loading it
              await app.lhs.openDocument({
                name: s[1],
                async text() {
                  return fulltext;
                },
              });
            }
          }

          next();
        });
        extract.on('finish', () => {
          // done
        });

        const tarStream = new Stream.Readable({
          read(size) {
            this.push(tarContent);
            this.push(null);
          }
        });
        tarStream.pipe(extract);

      } catch (err) {
        console.log(err);
      }
    });

    // putting this last may help with the "fouc" problem
    $( document ).foundation();
  });
})();

// vim: set ft=javascript:
