#include <math.h>
#include <string.h>
#include <stdlib.h>
#include <emscripten.h>

#include "zlib.h"
#include "gsl/gsl_matrix.h"
#include "gsl/gsl_blas.h"
#include "gsl/gsl_interp.h"

#define EPS     (1e-3)

#define UMAX    (0.436)
#define VMAX    (0.615)

static const double matrixData[] =
    { 1., 0., 1.28033, 1., -0.21482, -0.38059, 1., 2.12798, 0. };

uint16_t le16(uint16_t x)
{
    return x;   /* no-op */
}

uint16_t be16(uint16_t x)
{
    uint16_t y;

    y  = (0x00ff & x) << 8;
    y |= (0xff00 & x) >> 8;

    return y;
}

uint32_t be32(uint32_t x)
{
    uint32_t y;

    y  = (0x000000ff & x) << 24;
    y |= (0x0000ff00 & x) << 8;
    y |= (0x00ff0000 & x) >> 8;
    y |= (0xff000000 & x) >> 24;

    return y;
}

double clamp(double t)
{
    return fmin(fmax(t, 0), 1);
}

void encodePngImage(const double *rgb, size_t nx, size_t ny, unsigned char *png)
{
    size_t i, j;
    const double *p;

    uint8_t *q8;
    uint16_t *q16;
    uint32_t *q32;

    unsigned char *chunkoff, *origoff;
    unsigned long chunksz, origsz, datasz;

    q32 = (uint32_t *) png;

    /* magic bytes for png */
    (*q32++) = 0x474e5089;  /* 0x89504e47 -> big endian */
    (*q32++) = 0x0a1a0a0d;  /* 0x0d0a1a0a -> big endian */

    /*** image header ***/

    (*q32++) = 0x0d000000;  /* 13 bytes -> big endian */

    chunkoff = (uint8_t *) q32;
    chunksz = 17;           /* 13 bytes + 4 name bytes */

    (*q32++) = 0x52444849;  /* 0x49484452 = 'IHDR' -> big endian */
    (*q32++) = be32(nx);    /* image width */
    (*q32++) = be32(ny);    /* image height */

    q8 = (uint8_t *) q32;
    (*q8++) = 0x8;          /* bit depth (bits/sample) */
    (*q8++) = 0x6;          /* color mode = truecolor + alpha */
    (*q8++) = 0x0;          /* compression method */
    (*q8++) = 0x0;          /* filter method */
    (*q8++) = 0x0;          /* interlacing method */

    q32 = (uint32_t *) q8;
    (*q32++) = be32(crc32(0, chunkoff, chunksz));

    /*** image data ***/

    origsz = (4 * nx + 1) * ny;
    datasz = origsz + 11;

    (*q32++) = be32(datasz);    /* data size = image size + 11 header bytes */

    chunkoff = (uint8_t *) q32;
    chunksz = datasz + 4;       /* run crc32 hash on data + name bytes */

    (*q32++) = 0x54414449;      /* 0x49444154 = 'IDAT' -> big endian */

    q8 = (uint8_t *) q32;
    (*q8++) = 0x08;             /* zlib header, compression method */
    (*q8++) = 0x1d;             /* zlib header, flags */
    (*q8++) = 0x80;             /* deflate header */

    q16 = (uint16_t *) q8;
    (*q16++) = be16(origsz);    /* size of filtered data */
    (*q16++) = be16(~origsz);   /* bitwise inverse */

    origoff = (uint8_t *) q16;

    for (i = 0, p = rgb, q8 = (uint8_t *) q16; i < ny; ++i)
    {
        (*q8++) = 0x00;     /* filter method (none) */

        for (j = 0; j < nx; ++j)
        {
            (*q8++) = 0xff & lround(255 * clamp(*p++));
            (*q8++) = 0xff & lround(255 * clamp(*p++));
            (*q8++) = 0xff & lround(255 * clamp(*p++));
            (*q8++) = 0xff;
        }
    }

    q32 = (uint32_t *) q8;
    (*q32++) = be32(adler32(0, origoff, origsz));
    (*q32++) = be32(crc32(0, chunkoff, chunksz));

    /*** image trailer ***/

    (*q32++) = 0;               /* no data in trailer */
    (*q32++) = 0x444e4549;      /* 0x49454e44 = 'IEND' -> big endian */
    (*q32++) = 0x826042ae;      /* 0xae426082 = crc32 hash -> big endian */
}

EMSCRIPTEN_KEEPALIVE
void xyzToRgb(double Y, double U, double V,
    double *xyz, double *rgb, unsigned char *hex)
{
    gsl_matrix_const_view view1 = gsl_matrix_const_view_array(matrixData, 3, 3);
    gsl_vector_const_view view2 = gsl_vector_const_view_array(xyz, 3);
    gsl_vector_view view3 = gsl_vector_view_array(rgb, 3);

    xyz[0] = Y;
    xyz[1] = UMAX * (2 * U - 1);
    xyz[2] = VMAX * (2 * V - 1);

    gsl_blas_dgemv(CblasNoTrans, 1, &view1.matrix,
        &view2.vector, 0, &view3.vector);

    hex[0] = 0xff & lround(255 * clamp(rgb[0]));
    hex[1] = 0xff & lround(255 * clamp(rgb[1]));
    hex[2] = 0xff & lround(255 * clamp(rgb[2]));
}

EMSCRIPTEN_KEEPALIVE
void xyzToRgbArray(double Y, double *xyz, double *rgb,
    unsigned char *png, size_t nx, size_t nz)
{
    size_t i, j;
    double dU, dV, *p;

    gsl_matrix_const_view view1 = gsl_matrix_const_view_array(matrixData, 3, 3);
    gsl_matrix_const_view view2 = gsl_matrix_const_view_array(xyz, nx * nz, 3);
    gsl_matrix_view view3 = gsl_matrix_view_array(rgb, nx * nz, 3);

    dU = 2 * UMAX / (nx - 1);
    dV = 2 * VMAX / (nz - 1);

    for (i = 0, p = xyz; i < nz; ++i)
    {
        for (j = 0; j < nx; ++j)
        {
            double U = j * dU - UMAX;
            double V = i * dV - VMAX;

            (*p++) = Y;
            (*p++) = U;
            (*p++) = V;
        }
    }

    gsl_blas_dgemm(CblasNoTrans, CblasTrans, 1,
        &view2.matrix, &view1.matrix, 0, &view3.matrix);
    encodePngImage(rgb, nx, nz, png);
}

EMSCRIPTEN_KEEPALIVE
void sample(double *Y, double *U, double *V, size_t nb, double *xyz,
    double *rgb, unsigned char *png, size_t nsx, size_t nsy)
{
    size_t i, j;
    double *p;

    const gsl_interp_type *T = gsl_interp_linear;
    if (nb > 2) T = gsl_interp_polynomial;

    gsl_interp *uinterp = gsl_interp_alloc(T, nb);
    gsl_interp_accel *uaccel = gsl_interp_accel_alloc();
    gsl_interp_init(uinterp, Y, U, nb);

    gsl_interp *vinterp = gsl_interp_alloc(T, nb);
    gsl_interp_accel *vaccel = gsl_interp_accel_alloc();
    gsl_interp_init(vinterp, Y, V, nb);

    double dy = (Y[nb-1] - Y[0]) / (nsx - 1);

    for (i = 0, p = xyz; i < nsy; ++i)
    {
        for (j = 0; j < nsx; ++j)
        {
            double y = j * dy + Y[0];
            double u = gsl_interp_eval(uinterp, Y, U, y, uaccel);
            double v = gsl_interp_eval(vinterp, Y, V, y, vaccel);

            (*p++) = y;
            (*p++) = UMAX * (2 * u - 1);
            (*p++) = VMAX * (2 * v - 1);
        }
    }

    gsl_interp_free(uinterp);
    gsl_interp_accel_free(uaccel);

    gsl_interp_free(vinterp);
    gsl_interp_accel_free(vaccel);

    gsl_matrix_const_view view1 = gsl_matrix_const_view_array(matrixData, 3, 3);
    gsl_matrix_const_view view2 = gsl_matrix_const_view_array(xyz, nsx * nsy, 3);
    gsl_matrix_view view3 = gsl_matrix_view_array(rgb, nsx * nsy, 3);

    gsl_blas_dgemm(CblasNoTrans, CblasTrans, 1,
        &view2.matrix, &view1.matrix, 0, &view3.matrix);
    encodePngImage(rgb, nsx, nsy, png);
}

/* vim: set ft=c.doxygen: */
