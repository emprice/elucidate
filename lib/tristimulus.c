#include <math.h>
#include <string.h>
#include <stdlib.h>
#include <emscripten.h>

#include "zlib.h"
#include "gsl/gsl_matrix.h"
#include "gsl/gsl_blas.h"

#define XN      (0.950489)
#define YN      (1.)
#define ZN      (1.088840)

#define CMAX    (100.)
#define CMIN    (0.)

#define HMAX    (2 * M_PI)
#define HMIN    (0.)

#define DELTA       (6. / 29.)
#define INTERCEPT   (4. / 29.)

static const double matrixInverseData[] =
    {  2.36461385, -0.89654057, -0.46807328,
      -0.51516621,  1.4264081,   0.0887581,
       0.0052037,  -0.01440816,  1.00920446 };

unsigned short le16(unsigned short x)
{
    return x;   /* no-op */
}

unsigned short be16(unsigned short x)
{
    unsigned short y;

    y  = (0x00ff & x) << 8;
    y |= (0xff00 & x) >> 8;

    return y;
}

unsigned int be32(unsigned int x)
{
    unsigned long y;

    y  = (0x000000ff & x) << 24;
    y |= (0x0000ff00 & x) << 8;
    y |= (0x00ff0000 & x) >> 8;
    y |= (0xff000000 & x) >> 24;

    return y;
}

double finv(double t)
{
    return ((t > DELTA) ? (t * t * t) :
        (3 * (DELTA * DELTA) * (t - INTERCEPT)));
}

double clamp(double t)
{
    return fmin(fmax(t, 0), 1);
}

EMSCRIPTEN_KEEPALIVE
void xyzToRgb(double L, double u, double v,
    double *xyz, double *rgb, unsigned char *hex)
{
    double C, h, a, b;

    gsl_matrix_const_view view1 = gsl_matrix_const_view_array(matrixInverseData, 3, 3);
    gsl_vector_const_view view2 = gsl_vector_const_view_array(xyz, 3);
    gsl_vector_view view3 = gsl_vector_view_array(rgb, 3);

    h = (HMAX - HMIN) * u + HMIN;
    C = (CMAX - CMIN) * v + CMIN;

    a = C * cos(h);
    b = C * sin(h);

    xyz[0] = XN * finv((L + 16) / 116. + a / 500.);
    xyz[1] = YN * finv((L + 16) / 116.);
    xyz[2] = ZN * finv((L + 16) / 116. - b / 200.);

    // https://en.wikipedia.org/wiki/CIE_1931_color_space#Construction_of_the_CIE_XYZ_color_space_from_the_Wright%E2%80%93Guild_data
    gsl_blas_dgemv(CblasNoTrans, 1, &view1.matrix,
        &view2.vector, 0, &view3.vector);

    hex[0] = 0xff & lround(255 * clamp(rgb[0]));
    hex[1] = 0xff & lround(255 * clamp(rgb[1]));
    hex[2] = 0xff & lround(255 * clamp(rgb[2]));
}

EMSCRIPTEN_KEEPALIVE
void xyzToRgbArray(double L, double *xyz, double *rgb,
    unsigned char *png, size_t nx, size_t nz)
{
    size_t i, j;
    double dC, dh, *p1, *p2;

    unsigned char *q8;
    unsigned short *q16;
    unsigned int *q32;

    unsigned char *chunkoff, *origoff;
    unsigned long chunksz, origsz, datasz;

    gsl_matrix_const_view view1 = gsl_matrix_const_view_array(matrixInverseData, 3, 3);
    gsl_matrix_const_view view2 = gsl_matrix_const_view_array(xyz, nx * nz, 3);
    gsl_matrix_view view3 = gsl_matrix_view_array(rgb, nx * nz, 3);

    dC = (CMAX - CMIN) / (nx - 1);
    dh = (HMAX - HMIN) / (nz - 1);

    for (i = 0, p1 = xyz; i < nx; ++i)
    {
        for (j = 0; j < nz; ++j)
        {
            // https://en.wikipedia.org/wiki/CIELAB_color_space#Cylindrical_model
            double C = i * dC;
            double h = j * dh;

            double a = C * cos(h);
            double b = C * sin(h);

            // https://en.wikipedia.org/wiki/CIELAB_color_space#From_CIELAB_to_CIEXYZ
            (*p1++) = XN * finv((L + 16) / 116. + a / 500.);
            (*p1++) = YN * finv((L + 16) / 116.);
            (*p1++) = ZN * finv((L + 16) / 116. - b / 200.);
        }
    }

    // https://en.wikipedia.org/wiki/CIE_1931_color_space#Construction_of_the_CIE_XYZ_color_space_from_the_Wright%E2%80%93Guild_data
    gsl_blas_dgemm(CblasNoTrans, CblasTrans, 1,
        &view2.matrix, &view1.matrix, 0, &view3.matrix);

    q32 = (unsigned int *) png;

    /* magic bytes for png */
    (*q32++) = 0x474e5089;  /* 0x89504e47 -> big endian */
    (*q32++) = 0x0a1a0a0d;  /* 0x0d0a1a0a -> big endian */

    /*** image header ***/

    (*q32++) = 0x0d000000;  /* 13 bytes -> big endian */

    chunkoff = (unsigned char *) q32;
    chunksz = 17;           /* 13 bytes + 4 name bytes */

    (*q32++) = 0x52444849;  /* 0x49484452 = 'IHDR' -> big endian */
    (*q32++) = be32(nx);    /* image width */
    (*q32++) = be32(nz);    /* image height */

    q8 = (unsigned char *) q32;
    (*q8++) = 0x8;          /* bit depth (bits/sample) */
    (*q8++) = 0x6;          /* color mode = truecolor + alpha */
    (*q8++) = 0x0;          /* compression method */
    (*q8++) = 0x0;          /* filter method */
    (*q8++) = 0x0;          /* interlacing method */

    q32 = (unsigned int *) q8;
    (*q32++) = be32(crc32(0, chunkoff, chunksz));

    /*** image data ***/

    origsz = (4 * nx + 1) * nz;
    datasz = origsz + 11;

    (*q32++) = be32(datasz);    /* data size = image size + 11 header bytes */

    chunkoff = (unsigned char *) q32;
    chunksz = datasz + 4;       /* run crc32 hash on data + name bytes */

    (*q32++) = 0x54414449;      /* 0x49444154 = 'IDAT' -> big endian */

    q8 = (unsigned char *) q32;
    (*q8++) = 0x08;             /* zlib header, compression method */
    (*q8++) = 0x1d;             /* zlib header, flags */
    (*q8++) = 0x80;             /* deflate header */

    q16 = (unsigned short *) q8;
    (*q16++) = be16(origsz);    /* size of filtered data */
    (*q16++) = be16(~origsz);   /* bitwise inverse */

    origoff = (unsigned char *) q16;

    for (i = 0, p1 = xyz, p2 = rgb,
         q8 = (unsigned char *) q16; i < nx; ++i)
    {
        (*q8++) = 0x00;     /* filter method (none) */

        for (j = 0; j < nz; ++j)
        {
            (*q8++) = 0xff & lround(255 * clamp(*p2++));
            (*q8++) = 0xff & lround(255 * clamp(*p2++));
            (*q8++) = 0xff & lround(255 * clamp(*p2++));
            (*q8++) = 0xff;
        }
    }

    q32 = (unsigned int *) q8;
    (*q32++) = be32(adler32(0, origoff, origsz));
    (*q32++) = be32(crc32(0, chunkoff, chunksz));

    (*q32++) = 0;               /* no data in trailer */
    (*q32++) = 0x444e4549;      /* 0x49454e44 = 'IEND' -> big endian */
    (*q32++) = 0x826042ae;      /* 0xae426082 = crc32 hash -> big endian */
}

/* vim: set ft=c.doxygen: */
