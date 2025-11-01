/**
 * API Plugin with Automatic Error Handling
 * 
 * This plugin provides centralized API functions with automatic error toast notifications.
 * 
 * ERROR HANDLING:
 * - All API errors are automatically displayed as toast notifications
 * - Backend error format expected:
 *   {
 *     message: "Main error message",
 *     errors: {
 *       field1: ["Error message 1", "Error message 2"],
 *       field2: ["Error message"]
 *     }
 *   }
 * - Both the main message and field-specific errors are extracted and displayed
 * - Duplicate messages are automatically filtered out
 * 
 * USAGE IN COMPOSABLES:
 * - Use $authApi, $invoiceApi, $recipientApi for common endpoints
 * - Use $useApiFetch for custom reactive API calls
 * - Use $apiFetch for custom non-reactive API calls
 * - Use $showErrorToast to manually show error toasts
 * - Use $showSuccessToast to show success toasts
 * - Use $extractErrorMessages to extract error messages from error objects
 * 
 * EXAMPLE:
 * const { $authApi, $showErrorToast, $showSuccessToast } = useNuxtApp()
 * const { data, error } = await $authApi.login(credentials)
 * // Errors are automatically shown as toasts!
 * // Use $showSuccessToast for success messages
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const toast = useToast()
  
  // Determine the correct base URL
  // If proxyPath is set, use it (requests go through Nuxt server proxy)
  // Otherwise, use direct API URL (requests go directly to backend)
  const baseURL = config.public.proxyPath || config.public.apiBase
  
  // Helper function to get auth headers
  function getAuthHeaders() {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
    
    // Add token if it exists in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return headers
  }

  // Helper function to extract error messages from backend response
  function extractErrorMessages(errorData) {
    const messages = []
    
    // If there's a main message, add it
    if (errorData?.message) {
      messages.push(errorData.message)
    }
    
    // If there are field-specific errors, extract them
    if (errorData?.errors && typeof errorData.errors === 'object') {
      Object.keys(errorData.errors).forEach(field => {
        const fieldErrors = errorData.errors[field]
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(msg => {
            // Avoid duplicate messages
            if (!messages.includes(msg)) {
              messages.push(msg)
            }
          })
        } else if (typeof fieldErrors === 'string') {
          if (!messages.includes(fieldErrors)) {
            messages.push(fieldErrors)
          }
        }
      })
    }
    
    return messages
  }

  // Helper function to show error toast
  function showErrorToast(errorData, fallbackMessage = 'An error occurred') {
    const messages = extractErrorMessages(errorData)
    
    if (messages.length > 0) {
      // Show each unique error message
      messages.forEach(msg => {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: msg,
          life: 5000
        })
      })
    } else {
      // Fallback message
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: fallbackMessage,
        life: 5000
      })
    }
  }

  // Helper function to show success toast
  function showSuccessToast(message, summary = 'Success') {
    toast.add({
      severity: 'success',
      summary: summary,
      detail: message,
      life: 3000
    })
  }

  // Main API fetch function with proper error handling
  async function apiFetch(url, opts = {}) {
    const authHeaders = getAuthHeaders()
    
    // Extract headers from opts to prevent override
    const { headers: optsHeaders, ...restOpts } = opts
    
    try {
      const response = await $fetch(url, {
        ...restOpts,
        baseURL,
        headers: {
          ...authHeaders,
          ...optsHeaders,
        },
      })
      
      return response
    } catch (error) {
      console.error('❌ Request Failed:', error)
      // Re-throw the error so composables can handle it
      throw error
    }
  }

  // Reactive API fetch for components that need reactivity
  function useApiFetch(url, opts = {}) {
    // Extract headers from opts to prevent override
    const { headers: optsHeaders, onRequest: customOnRequest, onResponse: customOnResponse, onResponseError: customOnResponseError, ...restOpts } = opts
    
    return useFetch(url, {
      ...restOpts,
      baseURL,
      // Parse response as JSON explicitly
      parseResponse: (responseText) => {
        try {
          // Handle empty responses
          if (!responseText || responseText.trim() === '') {
            return null
          }
          
          // Ensure we're parsing JSON, not HTML
          const trimmed = responseText.trim()
          if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<HTML')) {
            console.error('❌ Received HTML instead of JSON:', responseText.substring(0, 200))
            
            // Instead of throwing an error, return a structured error response
            // This allows the composables to handle it properly
            return {
              is_success: false,
              status: 'error',
              message: 'Server configuration error: Backend returned HTML instead of JSON',
              errors: {
                server: ['The backend server is misconfigured. Please contact your administrator.']
              },
              _isHtmlError: true
            }
          }
          
          return JSON.parse(responseText)
        } catch (e) {
          // JSON parsing error - return a structured error instead of throwing
          console.error('❌ Failed to parse response:', e)
          console.error('❌ Response text:', responseText.substring(0, 500))
          
          return {
            is_success: false,
            status: 'error',
            message: 'Failed to parse server response',
            errors: {
              parse: [e.message || 'Unknown parsing error']
            }
          }
        }
      },
      onRequest({ options }) {
        // Get headers at request time and apply them
        const authHeaders = getAuthHeaders()
        options.headers = new Headers({
          ...authHeaders,
          ...optsHeaders,
        })
        
        // Call custom onRequest if provided
        if (customOnRequest) {
          customOnRequest({ options })
        }
      },
      onResponse({ response }) {
        
        // Call custom onResponse if provided
        if (customOnResponse) {
          customOnResponse({ response })
        }
      },
      onResponseError({ response }) {
        // Automatically show error toast for failed requests
        if (response?._data) {
          showErrorToast(response._data)
        } else if (response?.statusText) {
          showErrorToast({ message: response.statusText })
        }
        
        // Call custom onResponseError if provided
        if (customOnResponseError) {
          customOnResponseError({ response })
        }
      },
    })
  }

  // Auth API functions
  const authApi = {
    register(userData) {
      return useApiFetch('/customer/auth/register', {
        method: 'POST',
        body: userData,
      })
    },
    
    login(credentials) {
      return useApiFetch('/customer/auth/login', {
        method: 'POST',
        body: credentials,
      })
    },
    
    getMe() {
      return useApiFetch('/customer/auth/me', {
        method: 'GET',
      })
    },
  }

  // Invoice API functions
  const invoiceApi = {
    createInvoice(invoiceData) {
      return useApiFetch('/customer/invoices/create', {
        method: 'POST',
        body: invoiceData,
      })
    },
  }

  // Recipient API functions
  const recipientApi = {
    getRecipients() {
      return useApiFetch('/customer/recipients', {
        method: 'GET',
      })
    },
    
    createRecipient(recipientData) {
      return useApiFetch('/customer/recipients', {
        method: 'POST',
        body: recipientData,
      })
    },
  }

  return {
    provide: {
      apiFetch,
      useApiFetch,
      authApi,
      invoiceApi,
      recipientApi,
      extractErrorMessages,
      showErrorToast,
      showSuccessToast,
      },
    }
  })