/**Output API */

/**
 * Output API per FE
 * - mai identico allo schema interno
 */
export type ConfigurationPublicDTO = {
    id: string;
    status: string;
    solutionId: string;
    productId: string;
    businessId?: string;
  };
  