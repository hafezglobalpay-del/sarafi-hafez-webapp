import { defineEventHandler, getRequestHeaders, getQuery, readBody, setResponseHeaders, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const proxyPath = config.public.proxyPath
  
  // Only handle requests that match the proxy path
  if (!proxyPath || !event.path.startsWith(proxyPath)) {
    return
  }
  
  const apiBase = config.public.apiBase
  
  // Construct the target URL
  const path = event.path
  const query = getQuery(event)
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const targetUrl = queryString ? `${apiBase}${path}?${queryString}` : `${apiBase}${path}`
  
  
  try {
    const headers = getRequestHeaders(event)
    const method = event.method || 'GET'
    
    // Prepare headers for the proxied request
    const proxyHeaders: Record<string, string> = {
      'Accept': headers['accept'] || 'application/json',
      'Content-Type': headers['content-type'] || 'application/json',
    }
    
    // Forward important headers
    if (headers['authorization']) {
      proxyHeaders['Authorization'] = headers['authorization']
    }
    if (headers['accept-language']) {
      proxyHeaders['Accept-Language'] = headers['accept-language']
    }
    if (headers['user-agent']) {
      proxyHeaders['User-Agent'] = headers['user-agent']
    }
    
    // Read body for POST, PUT, PATCH requests
    let body = null
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await readBody(event)
    }
    
    // Make the request to the backend using $fetch.raw to get full response
    const response = await $fetch.raw(targetUrl, {
      method,
      headers: proxyHeaders,
      body: body ? JSON.stringify(body) : undefined,
      // CRITICAL: Don't throw on error status codes
      ignoreResponseError: false,
      timeout: 30000,
      retry: 3,
      retryDelay: 5000,
    })
    
    // Set the response status from backend
    setResponseStatus(event, response.status, response.statusText)
    
    // Forward important response headers
    setResponseHeaders(event, {
      'Content-Type': response.headers.get('content-type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    })
    
    // Return the response data as-is
    return response._data
    
  } catch (error: any) {
    console.error('❌ Proxy error:', error)
    
    // Try to extract error response if available
    if (error.response) {
      setResponseStatus(event, error.response.status || 500)
      return error.response._data
    }
    
    // Generic error
    setResponseStatus(event, 500)
    return {
      is_success: false,
      status: 'error',
      message: 'Proxy error: ' + (error.message || 'Unknown error'),
      errors: {}
    }
  }
})

