#include <math.h>
#include <string.h>
#include <stdlib.h>
#include <emscripten.h>

#include "gsl/gsl_matrix.h"
#include "gsl/gsl_blas.h"
#include "gsl/gsl_interp.h"

#define UMAX    (0.436)
#define VMAX    (0.615)

/**
 * @brief Operator (row-major ordering) to convert Y'UV to R'G'B'
 * Data from https://en.wikipedia.org/wiki/Y%E2%80%B2UV#HDTV_with_BT.709
 */
static const double matrixData[] =
    { 1.,  0.,       1.28033,
      1., -0.21482, -0.38059,
      1.,  2.12798,  0. };

/**
 * @brief Operator (row-major ordering) to convert R'G'B' to Y'UV
 * Data from https://en.wikipedia.org/wiki/Y%E2%80%B2UV#HDTV_with_BT.709
 */
static const double invMatrixData[] =
    {  0.2126,   0.7152,   0.0722,
      -0.09991, -0.33609,  0.436,
       0.615,   -0.55861, -0.05639 };

double clamp(double t)
{
    return fmin(fmax(t, 0), 1);
}

EMSCRIPTEN_KEEPALIVE
void convertHexToUv(const unsigned char *hex, double *rgb, double *xyz)
{
    gsl_matrix_const_view view1 = gsl_matrix_const_view_array(invMatrixData, 3, 3);
    gsl_vector_const_view view2 = gsl_vector_const_view_array(rgb, 3);
    gsl_vector_view view3 = gsl_vector_view_array(xyz, 3);

    rgb[0] = hex[0] / 255.;
    rgb[1] = hex[1] / 255.;
    rgb[2] = hex[2] / 255.;

    gsl_blas_dgemv(CblasNoTrans, 1, &view1.matrix,
        &view2.vector, 0, &view3.vector);
}

EMSCRIPTEN_KEEPALIVE
void convertUvToHex(double *xyz, double *rgb, unsigned char *hex)
{
    gsl_matrix_const_view view1 = gsl_matrix_const_view_array(matrixData, 3, 3);
    gsl_vector_const_view view2 = gsl_vector_const_view_array(xyz, 3);
    gsl_vector_view view3 = gsl_vector_view_array(rgb, 3);

    gsl_blas_dgemv(CblasNoTrans, 1, &view1.matrix,
        &view2.vector, 0, &view3.vector);

    hex[0] = 0xff & lround(255 * clamp(rgb[0]));
    hex[1] = 0xff & lround(255 * clamp(rgb[1]));
    hex[2] = 0xff & lround(255 * clamp(rgb[2]));
}

EMSCRIPTEN_KEEPALIVE
void convertCoordToHex(double *xyz, double *rgb, unsigned char *hex)
{
    /* transform [0,1] coordinates to actual U, V values */
    xyz[1] = UMAX * (2 * xyz[1] - 1);
    xyz[2] = VMAX * (2 * xyz[2] - 1);

    convertUvToHex(xyz, rgb, hex);
}

EMSCRIPTEN_KEEPALIVE
void sampleUvPlane(double Y, double *xyz, double *rgb,
    unsigned char *img, size_t nx, size_t nz)
{
    size_t i, j;
    double dU, dV, *p;
    unsigned char *c;

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

    for (i = 0, p = rgb, c = img; i < nz; ++i)
    {
        for (j = 0; j < nx; ++j)
        {
            (*c++) = 0xff & lround(255 * clamp(*p++));
            (*c++) = 0xff & lround(255 * clamp(*p++));
            (*c++) = 0xff & lround(255 * clamp(*p++));
            (*c++) = 0xff;
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void sampleColormap(double *Y, double *U, double *V,
    size_t nb, double *xyz, double *rgb, unsigned char *hex,
    unsigned char *img, size_t nsx, size_t nsy)
{
    size_t i, j;
    double *p;
    unsigned char *c;

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
            (*p++) = u;
            (*p++) = v;
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

    for (i = 0, p = rgb, c = img; i < nsy; ++i)
    {
        for (j = 0; j < nsx; ++j)
        {
            (*c++) = 0xff & lround(255 * clamp(*p++));
            (*c++) = 0xff & lround(255 * clamp(*p++));
            (*c++) = 0xff & lround(255 * clamp(*p++));
            (*c++) = 0xff;
        }
    }

    for (j = 0, p = rgb, c = hex; j < nsx; ++j)
    {
        (*c++) = 0xff & lround(255 * clamp(*p++));
        (*c++) = 0xff & lround(255 * clamp(*p++));
        (*c++) = 0xff & lround(255 * clamp(*p++));
    }
}

/* vim: set ft=c.doxygen: */
