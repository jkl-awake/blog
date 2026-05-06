/**
 * API 管理器
 * 统一管理所有API请求的发送、响应处理和错误处理
 */

class APIManager {
  constructor(config = {}) {
    // 合并默认配置
    this.config = {
      baseURL: config.baseURL || '/api',
      timeout: config.timeout || 10000,
      headers: config.headers || { 'Content-Type': 'application/json' }
    }
    this.endpoints = config.endpoints || {}
  }

  /**
   * 获取完整URL
   * @param {string} endpoint - 端点路径
   * @returns {string} 完整URL
   */
  getFullURL(endpoint) {
    // 如果端点已经是完整URL（包含http/https），直接返回
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint
    }
    return `${this.config.baseURL}${endpoint}`
  }

  /**
   * 通用fetch请求方法
   * @param {string} endpoint - API端点
   * @param {object} options - 请求选项
   * @returns {Promise} 返回Promise
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      headers = {},
      customTimeout = null
    } = options

    const fullURL = this.getFullURL(endpoint)
    const requestHeaders = { ...this.config.headers, ...headers }
    const timeout = customTimeout || this.config.timeout

    // 构建请求配置
    const fetchOptions = {
      method,
      headers: requestHeaders
    }

    // 如果有请求体数据，添加到请求中
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data)
    }

    try {
      // 添加超时控制
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(fullURL, {
        ...fetchOptions,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // 解析响应
      const contentType = response.headers.get('content-type')
      let responseData

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      // 处理响应状态
      if (!response.ok) {
        return this.handleError(response.status, responseData, endpoint)
      }

      return {
        success: true,
        status: response.status,
        data: responseData
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`[API] 请求超时: ${endpoint}`)
        return {
          success: false,
          status: 0,
          error: `请求超时（${this.config.timeout}ms）`,
          endpoint
        }
      }
      console.error(`[API] 请求失败: ${endpoint}`, error)
      return {
        success: false,
        status: 0,
        error: error.message,
        endpoint
      }
    }
  }

  /**
   * 处理API错误
   * @param {number} status - HTTP状态码
   * @param {object} data - 响应数据
   * @param {string} endpoint - 端点
   * @returns {object} 错误对象
   */
  handleError(status, data, endpoint) {
    const errorMap = {
      400: '请求参数错误',
      401: '未授权，请登录',
      403: '禁止访问',
      404: '资源不存在',
      500: '服务器错误',
      503: '服务暂时不可用'
    }

    const errorMessage = errorMap[status] || `API错误 (${status})`

    console.error(`[API] ${endpoint} - ${status}: ${errorMessage}`)

    return {
      success: false,
      status,
      error: errorMessage,
      data,
      endpoint
    }
  }

  /**
   * GET 请求
   * @param {string} endpoint - API端点
   * @param {object} options - 请求选项
   * @returns {Promise} 返回Promise
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options
    })
  }

  /**
   * POST 请求
   * @param {string} endpoint - API端点
   * @param {object} data - 请求数据
   * @param {object} options - 请求选项
   * @returns {Promise} 返回Promise
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      data,
      ...options
    })
  }

  /**
   * PUT 请求
   * @param {string} endpoint - API端点
   * @param {object} data - 请求数据
   * @param {object} options - 请求选项
   * @returns {Promise} 返回Promise
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      data,
      ...options
    })
  }

  /**
   * PATCH 请求
   * @param {string} endpoint - API端点
   * @param {object} data - 请求数据
   * @param {object} options - 请求选项
   * @returns {Promise} 返回Promise
   */
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      data,
      ...options
    })
  }

  /**
   * DELETE 请求
   * @param {string} endpoint - API端点
   * @param {object} options - 请求选项
   * @returns {Promise} 返回Promise
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    })
  }

  /**
   * 使用端点别名的便捷方法
   * @param {string} category - 分类（如 'user', 'post'）
   * @param {string} action - 操作（如 'profile', 'list'）
   * @param {object} params - 参数对象
   * @param {object} options - 请求选项
   * @returns {Promise} 返回Promise
   */
  async call(category, action, params = {}, options = {}) {
    if (!this.endpoints[category] || !this.endpoints[category][action]) {
      console.error(`[API] 未找到端点: ${category}.${action}`)
      return {
        success: false,
        error: '端点不存在'
      }
    }

    let endpoint = this.endpoints[category][action]

    // 处理URL参数（如 /posts/:id）
    for (const [key, value] of Object.entries(params)) {
      endpoint = endpoint.replace(`:${key}`, value)
    }

    // 根据请求类型选择HTTP方法
    const method = options.method || 'GET'

    if (method === 'GET') {
      // GET请求：参数作为查询字符串
      const queryString = new URLSearchParams(params).toString()
      if (queryString) {
        endpoint += `?${queryString}`
      }
      return this.get(endpoint, options)
    } else {
      // POST/PUT等请求：参数作为请求体
      return this.request(endpoint, {
        method,
        data: params,
        ...options
      })
    }
  }

  /**
   * 批量请求
   * @param {array} requests - 请求数组
   * @returns {Promise} 返回Promise
   */
  async batch(requests) {
    const promises = requests.map(req => {
      const { endpoint, method = 'GET', data, options = {} } = req
      return this.request(endpoint, { method, data, ...options })
    })

    try {
      const results = await Promise.all(promises)
      return {
        success: true,
        data: results
      }
    } catch (error) {
      console.error('[API] 批量请求失败', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 创建全局实例
let apiManager = null

function initAPIManager(config) {
  apiManager = new APIManager(config)
  return apiManager
}

function getAPIManager() {
  if (!apiManager) {
    console.warn('[API] APIManager 未初始化，使用默认配置')
    apiManager = new APIManager()
  }
  return apiManager
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APIManager,
    initAPIManager,
    getAPIManager
  }
}
