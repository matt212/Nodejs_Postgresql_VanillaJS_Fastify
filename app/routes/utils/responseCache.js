const RESPONSE_CACHE_TTL = 90000;

function createResponseCache() {

  const responseCache = new Map();

  function clearResponseCache() {
    responseCache.clear();
  }

  async function withResponseCache(request, callback, options = {}) {

    const prefix = options.prefix || '';

    const cacheKey = JSON.stringify({
      prefix,
      url: request.url,
      body: request.body
    });

    const cached = responseCache.get(cacheKey);

    console.log(
      '[CACHE]',
      'PID:', process.pid,
      'PREFIX:', prefix,
      'HIT:', !!cached,
      'EXPIRED:', cached ? cached.expires <= Date.now() : false
    );

    if (cached && cached.expires > Date.now()) {

      console.log('[CACHE] RETURNING CACHED RESULT');

      return cached.value;
    }

    console.log('[CACHE] EXECUTING DATABASE QUERY');

    const result = await callback();

    responseCache.set(cacheKey, {
      value: result,
      expires: Date.now() + RESPONSE_CACHE_TTL
    });

    return result;
  }

  return {
    withResponseCache,
    clearResponseCache
  };
}

module.exports = {
  createResponseCache
};