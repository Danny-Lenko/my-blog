export const mapCmsPagination = (pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  }) => {
    const { page, pageSize, pageCount } = pagination;
  
    return {
      page,
      limit: pageSize,
      totalPages: pageCount,
      nextPage: page < pageCount ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  };
  