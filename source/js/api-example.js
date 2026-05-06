/**
 * API 使用示例
 * 展示如何在实际项目中使用API管理器
 * 
 * 使用方法:
 * 1. 在 HTML 中按顺序引入文件:
 *    <script src="/js/api-config.js"></script>
 *    <script src="/js/api-manager.js"></script>
 *    <script src="/js/api-example.js"></script>
 */

// ============================================
// 1. 初始化 API 管理器
// ============================================

let api

document.addEventListener('DOMContentLoaded', () => {
  // 初始化API管理器
  api = initAPIManager({
    baseURL: 'https://api.example.com',  // 改成你的实际API地址
    timeout: 10000,
    endpoints: API_CONFIG.endpoints
  })

  console.log('[应用] API管理器已初始化')
})

// ============================================
// 2. 文章相关操作
// ============================================

/**
 * 获取文章列表
 */
async function fetchPostList(options = {}) {
  console.log('[操作] 开始获取文章列表...')

  const result = await api.call('post', 'list', options)

  if (result.success) {
    console.log('[成功] 获取到文章列表:', result.data)
    return result.data
  } else {
    console.error('[失败] 获取文章列表失败:', result.error)
    showNotification('获取文章列表失败: ' + result.error, 'error')
    return []
  }
}

/**
 * 获取文章详情
 */
async function fetchPostDetail(postId) {
  console.log(`[操作] 获取文章 ${postId} 的详情...`)

  const result = await api.call('post', 'detail', { id: postId })

  if (result.success) {
    console.log('[成功] 获取文章详情:', result.data)
    return result.data
  } else {
    console.error('[失败] 获取文章失败:', result.error)
    return null
  }
}

/**
 * 获取文章浏览量
 */
async function fetchPostViews(postId) {
  const result = await api.call('post', 'views', { id: postId })
  return result.success ? result.data : null
}

// ============================================
// 3. 评论相关操作
// ============================================

/**
 * 获取评论列表
 */
async function fetchCommentList(options = {}) {
  console.log('[操作] 获取评论列表...')

  const result = await api.get('/comments', { data: options })

  if (result.success) {
    console.log('[成功] 获取到评论列表:', result.data)
    return result.data
  } else {
    console.error('[失败] 获取评论列表失败:', result.error)
    return []
  }
}

/**
 * 创建评论
 */
async function createComment(commentData) {
  console.log('[操作] 创建评论:', commentData)

  const result = await api.post('/comments/create', commentData)

  if (result.success) {
    console.log('[成功] 评论已发布:', result.data)
    showNotification('评论已发布成功！', 'success')
    return result.data
  } else {
    console.error('[失败] 创建评论失败:', result.error)
    showNotification('评论失败: ' + result.error, 'error')
    return null
  }
}

/**
 * 删除评论
 */
async function deleteComment(commentId) {
  console.log(`[操作] 删除评论 ${commentId}...`)

  const result = await api.delete(`/comments/${commentId}`)

  if (result.success) {
    console.log('[成功] 评论已删除')
    showNotification('评论已删除', 'success')
    return true
  } else {
    console.error('[失败] 删除评论失败:', result.error)
    showNotification('删除失败: ' + result.error, 'error')
    return false
  }
}

// ============================================
// 4. 用户相关操作
// ============================================

/**
 * 获取用户信息
 */
async function fetchUserProfile() {
  console.log('[操作] 获取用户信息...')

  const token = localStorage.getItem('authToken')
  const result = await api.get('/user/profile', {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })

  if (result.success) {
    console.log('[成功] 获取用户信息:', result.data)
    return result.data
  } else {
    console.error('[失败] 获取用户信息失败:', result.error)
    return null
  }
}

/**
 * 更新用户信息
 */
async function updateUserProfile(userData) {
  console.log('[操作] 更新用户信息:', userData)

  const token = localStorage.getItem('authToken')
  const result = await api.put('/user/profile', userData, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })

  if (result.success) {
    console.log('[成功] 用户信息已更新:', result.data)
    showNotification('个人信息已更新', 'success')
    return result.data
  } else {
    console.error('[失败] 更新失败:', result.error)
    showNotification('更新失败: ' + result.error, 'error')
    return null
  }
}

// ============================================
// 5. 高级用法
// ============================================

/**
 * 批量获取多个资源
 */
async function fetchDashboardData() {
  console.log('[操作] 开始加载仪表板数据...')

  const results = await api.batch([
    { endpoint: '/posts', method: 'GET' },
    { endpoint: '/comments', method: 'GET' },
    { endpoint: '/user/profile', method: 'GET' }
  ])

  if (results.success) {
    console.log('[成功] 仪表板数据加载完成')
    return {
      posts: results.data[0],
      comments: results.data[1],
      userProfile: results.data[2]
    }
  } else {
    console.error('[失败] 加载失败:', results.error)
    return null
  }
}

/**
 * 搜索文章（带重试机制）
 */
async function searchPosts(keyword, retries = 3) {
  console.log(`[操作] 搜索文章: "${keyword}" (重试次数: ${retries})`)

  for (let i = 0; i < retries; i++) {
    const result = await api.get(`/posts/search?q=${encodeURIComponent(keyword)}`, {
      customTimeout: 5000
    })

    if (result.success) {
      console.log('[成功] 搜索完成:', result.data)
      return result.data
    }

    if (i < retries - 1) {
      console.log(`[重试] 第 ${i + 1} 次重试...`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  console.error('[失败] 搜索失败，已重试', retries, '次')
  showNotification('搜索失败，请稍后重试', 'error')
  return null
}

/**
 * 具有加载状态的异步操作
 */
async function fetchDataWithLoading(element, fetchFunction) {
  try {
    // 显示加载状态
    element.classList.add('loading')
    element.disabled = true

    // 执行操作
    const data = await fetchFunction()

    return data
  } catch (error) {
    console.error('[错误] 操作异常:', error)
    showNotification('发生错误，请稍后重试', 'error')
    return null
  } finally {
    // 移除加载状态
    element.classList.remove('loading')
    element.disabled = false
  }
}

// ============================================
// 6. 工具函数
// ============================================

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
  console.log(`[通知] ${type.toUpperCase()}: ${message}`)

  // 如果使用了Snackbar组件（Butterfly主题自带）
  if (typeof btf !== 'undefined' && btf.snackbarShow) {
    btf.snackbarShow(message)
  } else {
    // 备用方案：使用alert
    alert(message)
  }
}

/**
 * 处理API错误的统一方法
 */
function handleAPIError(error, fallbackMessage = '请求失败') {
  if (error.status === 401) {
    console.warn('[认证] 未授权，需要重新登录')
    // 重定向到登录页面
    window.location.href = '/login'
    return
  }

  if (error.status === 403) {
    console.warn('[权限] 无权限访问此资源')
    showNotification('您无权限访问此资源', 'error')
    return
  }

  if (error.status === 404) {
    console.warn('[404] 资源不存在')
    showNotification('所请求的资源不存在', 'error')
    return
  }

  if (error.status === 0) {
    console.error('[网络] 请求超时或网络错误')
    showNotification('网络错误，请检查你的连接', 'error')
    return
  }

  console.error(`[${error.status}] ${error.error}`)
  showNotification(fallbackMessage, 'error')
}

// ============================================
// 7. 页面集成示例
// ============================================

/**
 * 初始化页面（在 DOMContentLoaded 后调用）
 */
async function initializePage() {
  console.log('[页面] 开始初始化...')

  // 1. 获取文章列表
  const posts = await fetchPostList()

  // 2. 获取用户信息
  const userProfile = await fetchUserProfile()

  // 3. 渲染页面
  if (posts && posts.length > 0) {
    renderPostList(posts)
  }

  if (userProfile) {
    renderUserProfile(userProfile)
  }

  console.log('[页面] 初始化完成')
}

/**
 * 渲染文章列表
 */
function renderPostList(posts) {
  console.log('[渲染] 正在渲染文章列表...')
  // 这里添加你的DOM操作代码
  posts.forEach(post => {
    console.log(`- ${post.title}`)
  })
}

/**
 * 渲染用户信息
 */
function renderUserProfile(profile) {
  console.log('[渲染] 正在渲染用户信息...')
  console.log(`用户: ${profile.name}`)
}

// ============================================
// 8. 事件监听示例
// ============================================

/**
 * 监听评论表单提交
 */
function setupCommentFormListener() {
  const form = document.getElementById('comment-form')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const content = form.querySelector('textarea[name="content"]').value
    const postId = form.dataset.postId

    if (!content.trim()) {
      showNotification('请输入评论内容', 'error')
      return
    }

    const success = await createComment({
      content: content.trim(),
      postId: postId,
      author: 'Anonymous'
    })

    if (success) {
      form.reset()
      // 刷新评论列表
      await refreshCommentList()
    }
  })
}

/**
 * 刷新评论列表
 */
async function refreshCommentList() {
  console.log('[操作] 刷新评论列表...')
  const comments = await fetchCommentList()
  renderCommentList(comments)
}

/**
 * 渲染评论列表
 */
function renderCommentList(comments) {
  console.log('[渲染] 评论列表已更新，共', comments.length, '条')
  // 添加你的DOM操作代码
}

// ============================================
// 9. 导出供其他模块使用
// ============================================

// 如果使用模块系统
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchPostList,
    fetchPostDetail,
    fetchCommentList,
    createComment,
    deleteComment,
    fetchUserProfile,
    updateUserProfile,
    searchPosts,
    initializePage
  }
}

// 或者作为全局对象暴露
window.BlogAPI = {
  posts: {
    list: fetchPostList,
    detail: fetchPostDetail,
    views: fetchPostViews
  },
  comments: {
    list: fetchCommentList,
    create: createComment,
    delete: deleteComment
  },
  user: {
    profile: fetchUserProfile,
    update: updateUserProfile
  },
  search: searchPosts,
  init: initializePage
}
