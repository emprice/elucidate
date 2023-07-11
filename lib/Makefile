CFLAGS = -Wall -O3 -I gsl -I zlib -ferror-limit=5 -std=gnu99
LDFLAGS = -s WASM=1 -s EXPORTED_FUNCTIONS="['_malloc', '_free']" \
		  -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 \
		  -L gsl/.libs -L gsl/cblas/.libs -lgsl -lgslcblas -L zlib -lz -lm

default: ../js/tristimulus.bin.js

../js/%.bin.js: %.o
	emcc $(CFLAGS) $(LDFLAGS) -s EXPORT_NAME=$(*F) $^ -o $@

%.o: %.c Makefile
	emcc $(CFLAGS) -c $< -o $@

# vim: set ft=make:
