function encodeParams(
    obj: Record<string, any>,
    prefix = ''
  ): string[] {
    const query: string[] = [];
  
    for (const key in obj) {
      if (obj[key] === undefined) continue;
  
      const fullKey = prefix
        ? `${prefix}[${encodeURIComponent(key)}]`
        : encodeURIComponent(key);
  
      const value = obj[key];
  
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          query.push(`${fullKey}[${i}]=${encodeURIComponent(v)}`);
        });
      } else if (typeof value === 'object' && value !== null) {
        query.push(...encodeParams(value, fullKey));
      } else {
        query.push(`${fullKey}=${encodeURIComponent(value)}`);
      }
    }
  
    return query;
  }
  
  export function buildStrapiQuery(
    baseParams: Record<string, any>,
    searchParams?: Record<string, string | string[] | undefined>
  ): string {
    const merged = { ...baseParams };
  
    if (searchParams) {
      if (searchParams.page) {
        merged.pagination = merged.pagination || {};
        merged.pagination.page = parseInt(searchParams.page as string);
      }
  
      if (searchParams.pageSize) {
        merged.pagination = merged.pagination || {};
        merged.pagination.pageSize = parseInt(searchParams.pageSize as string);
      }
    }
  
    const queryString = encodeParams(merged).join('&');
    return queryString;
  }
  