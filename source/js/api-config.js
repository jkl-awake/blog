/**
 * API 配置文件
 * 集中管理所有API端点和基础配置
 */

const API_CONFIG = {
  // 基础配置
  baseURL: process.env.API_BASE_URL || '/api',
  timeout: 10000, // 请求超时时间（毫秒）
  headers: {
    'Content-Type': 'application/json'
  },

  // API 端点定义
  endpoints: {
    // 示例：用户相关API
    user: {
      profile: '/user/profile',      // 获取用户信息
      update: '/user/update',         // 更新用户信息
      settings: '/user/settings'      // 获取用户设置
    },

    // 示例：评论相关API
    comment: {
      list: '/comments',              // 获取评论列表
      create: '/comments/create',     // 创建评论
      delete: '/comments/:id',        // 删除评论
    },

    // 示例：文章相关API
    post: {
      list: '/posts',                 // 获取文章列表
      detail: '/posts/:id',           // 获取文章详情
      views: '/posts/:id/views'       // 获取文章浏览量
    },

    // 时间线API
    timeline: {
      list: '/timeline',              // 获取时间线事件列表
      detail: '/timeline/:id'          // 获取时间线事件详情
    },

    // 示例：第三方集成API
    thirdParty: {
      analytics: 'https://api.example.com/analytics',  // 分析服务
      cdn: 'https://cdn.example.com/assets'            // CDN服务
    }
  },

  // 常见状态码映射
  statusCode: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG
}
