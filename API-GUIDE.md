# API 管理和调用说明文档

## 📋 目录
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [使用示例](#使用示例)
- [API方法](#api方法)
- [错误处理](#错误处理)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 项目结构

```
source/js/
├── api-config.js      # API配置文件（端点定义、基础配置）
└── api-manager.js     # API管理器（请求、响应、错误处理）

public/js/            # 编译后的JS文件（自动生成）
└── api-config.js
└── api-manager.js
```

---

## 快速开始

### 1️⃣ 导入API文件

在你的HTML或JS文件中，按顺序导入以下文件：

```html
<!-- 先导入配置文件 -->
<script src="/js/api-config.js"></script>

<!-- 再导入管理器 -->
<script src="/js/api-manager.js"></script>
```

### 2️⃣ 初始化API管理器

```javascript
// 使用配置创建API管理器
const api = initAPIManager({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  endpoints: API_CONFIG.endpoints
})

// 或者直接使用全局实例
const api = getAPIManager()
```

### 3️⃣ 开始发送请求

```javascript
// 最简单的GET请求
const result = await api.get('/posts')
console.log(result)

// 如果成功
if (result.success) {
  console.log('数据:', result.data)
} else {
  console.log('错误:', result.error)
}
```

---

## 配置说明

### api-config.js 配置项

```javascript
const API_CONFIG = {
  // 基础配置
  baseURL: '/api',              // API服务器地址
  timeout: 10000,               // 请求超时时间（毫秒）
  headers: {
    'Content-Type': 'application/json'  // 默认请求头
  },

  // API 端点定义
  endpoints: {
    user: {
      profile: '/user/profile',       // 获取用户信息
      update: '/user/update',         // 更新用户信息
    },
    comment: {
      list: '/comments',              // 获取评论列表
      create: '/comments/create',     // 创建评论
    },
    post: {
      list: '/posts',                 // 获取文章列表
      detail: '/posts/:id',           // 获取文章详情
    }
  }
}
```

**修改配置的方式：**

1. 直接编辑 `source/js/api-config.js`
2. 运行 `npm run build` 生成新的 public 文件
3. 或使用环境变量覆盖（开发时）

---

## 使用示例

### 基础HTTP方法

#### GET 请求 - 获取数据
```javascript
// 简单GET请求
const posts = await api.get('/posts')

// 带查询参数的GET请求
const searchResult = await api.get('/posts?category=tech&limit=10')

// 自定义选项
const userInfo = await api.get('/user/profile', {
  headers: { 'Authorization': 'Bearer TOKEN' },
  customTimeout: 5000
})
```

#### POST 请求 - 创建数据
```javascript
const newComment = await api.post('/comments/create', {
  content: '这是一条评论',
  postId: 123,
  author: 'John'
})

if (newComment.success) {
  console.log('评论已创建:', newComment.data)
} else {
  console.log('创建失败:', newComment.error)
}
```

#### PUT 请求 - 全量更新
```javascript
const updateUser = await api.put('/user/profile', {
  name: 'New Name',
  email: 'new@example.com',
  bio: '新的个人简介'
})
```

#### PATCH 请求 - 部分更新
```javascript
const partialUpdate = await api.patch('/posts/123', {
  title: '更新标题'  // 只更新标题，其他字段不变
})
```

#### DELETE 请求 - 删除数据
```javascript
const deleteResult = await api.delete('/comments/456')

if (deleteResult.success) {
  console.log('已删除')
} else {
  console.log('删除失败:', deleteResult.error)
}
```

### 使用端点别名

API配置中定义了别名，可以用更简洁的方式调用：

```javascript
// 方式1: 直接使用完整路径（传统方式）
const posts = await api.get('/posts')

// 方式2: 使用端点别名（推荐）
const posts = await api.call('post', 'list')

// 使用带参数的端点别名
const postDetail = await api.call('post', 'detail', { id: 123 })

// 创建评论
const comment = await api.call('comment', 'create', 
  { content: '很好', postId: 123 },
  { method: 'POST' }
)

// 删除评论
const deleteComment = await api.call('comment', 'delete',
  { id: 456 },
  { method: 'DELETE' }
)
```

### 批量请求

同时发送多个请求，等待全部完成：

```javascript
const results = await api.batch([
  { endpoint: '/posts' },
  { endpoint: '/user/profile' },
  { 
    endpoint: '/comments', 
    method: 'POST', 
    data: { content: '评论' } 
  }
])

if (results.success) {
  console.log('所有请求完成:', results.data)
} else {
  console.log('批量请求失败:', results.error)
}
```

---

## API方法

### get(endpoint, options)
发送GET请求，获取数据。

```javascript
const result = await api.get('/endpoint', {
  headers: { 'Custom-Header': 'value' },
  customTimeout: 5000
})
```

**返回值：**
```javascript
{
  success: true,        // 是否成功
  status: 200,         // HTTP状态码
  data: {...}          // 响应数据
}
```

### post(endpoint, data, options)
发送POST请求，创建数据。

```javascript
const result = await api.post('/comments', {
  content: 'Hello',
  author: 'John'
}, options)
```

### put(endpoint, data, options)
发送PUT请求，全量更新数据。

### patch(endpoint, data, options)
发送PATCH请求，部分更新数据。

### delete(endpoint, options)
发送DELETE请求，删除数据。

### request(endpoint, options)
通用请求方法，可自定义所有参数。

```javascript
const result = await api.request('/endpoint', {
  method: 'POST',
  data: { key: 'value' },
  headers: { 'Custom': 'header' },
  customTimeout: 8000
})
```

### call(category, action, params, options)
使用端点别名调用API。

```javascript
// 按分类和操作调用
const result = await api.call('post', 'detail', { id: 123 })
```

### batch(requests)
批量发送多个请求。

```javascript
const results = await api.batch([
  { endpoint: '/posts', method: 'GET' },
  { endpoint: '/comments', method: 'POST', data: {...} }
])
```

---

## 错误处理

### 响应对象结构

所有API调用都返回统一的响应对象：

```javascript
{
  success: boolean,     // 请求是否成功
  status: number,       // HTTP状态码（0表示网络错误）
  data: any,           // 成功时的数据
  error: string,       // 失败时的错误信息
  endpoint: string     // 请求的端点
}
```

### 完整的错误处理示例

```javascript
async function fetchUserData(userId) {
  try {
    const result = await api.get(`/users/${userId}`)

    if (result.success) {
      // 请求成功
      console.log('用户数据:', result.data)
      return result.data
    } else {
      // API返回错误
      console.error(`错误 ${result.status}: ${result.error}`)
      
      // 根据错误类型处理
      switch (result.status) {
        case 401:
          console.log('需要重新登录')
          // 重定向到登录页面
          break
        case 404:
          console.log('用户不存在')
          break
        case 500:
          console.log('服务器错误，请稍后重试')
          break
        default:
          console.log('发生错误，请重试')
      }
    }
  } catch (error) {
    console.error('请求异常:', error)
  }
}
```

### 常见HTTP状态码

| 状态码 | 含义 | 处理方式 |
|--------|------|---------|
| 200 | 成功 | 取出数据正常处理 |
| 201 | 已创建 | 成功创建资源 |
| 400 | 请求参数错误 | 检查参数是否正确 |
| 401 | 未授权 | 需要登录 |
| 403 | 禁止访问 | 权限不足 |
| 404 | 资源不存在 | 检查端点和ID是否正确 |
| 500 | 服务器错误 | 联系开发者 |
| 503 | 服务暂时不可用 | 稍后重试 |

---

## 最佳实践

### 1️⃣ 统一的加载状态管理

```javascript
let isLoading = false

async function loadPosts() {
  isLoading = true
  
  try {
    const result = await api.get('/posts')
    
    if (result.success) {
      // 更新UI
      displayPosts(result.data)
    } else {
      // 显示错误信息
      showError(result.error)
    }
  } finally {
    isLoading = false
  }
}
```

### 2️⃣ 添加请求头（如认证令牌）

```javascript
async function getProtectedData() {
  const token = localStorage.getItem('authToken')
  
  const result = await api.get('/protected', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  return result
}
```

### 3️⃣ 自定义超时时间

```javascript
// 某些耗时操作可以增加超时
const result = await api.post('/long-running-task', 
  { data: 'value' },
  { customTimeout: 30000 }  // 30秒
)
```

### 4️⃣ 添加新的API端点

当需要调用新的API时，先在 `api-config.js` 中添加：

```javascript
// source/js/api-config.js
endpoints: {
  analytics: {
    report: '/analytics/report',
    export: '/analytics/export'
  }
}
```

然后就可以使用了：

```javascript
const report = await api.call('analytics', 'report')
```

### 5️⃣ 在HTML中使用

```html
<script src="/js/api-config.js"></script>
<script src="/js/api-manager.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', async () => {
    // 初始化
    const api = initAPIManager({
      baseURL: 'https://api.example.com',
      endpoints: API_CONFIG.endpoints
    })

    // 获取数据
    const result = await api.get('/posts')
    
    if (result.success) {
      console.log(result.data)
    }
  })
</script>
```

---

## 常见问题

### Q1: 如何添加新的API端点？

**A:** 在 `source/js/api-config.js` 中的 `endpoints` 对象里添加：

```javascript
endpoints: {
  newCategory: {
    action: '/new/endpoint'
  }
}
```

然后运行 `npm run build`，重新加载页面。

### Q2: 请求超时怎么办？

**A:** 提高超时时间：

```javascript
const result = await api.get('/slow-endpoint', {
  customTimeout: 30000  // 30秒
})
```

### Q3: 如何处理CORS问题？

**A:** CORS错误通常是后端配置问题。需要后端服务器添加响应头：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
```

### Q4: 怎样用作异步函数等待结果？

**A:** 所有方法都返回Promise，可以用 `await` 等待：

```javascript
// 方式1: async/await
const data = await api.get('/posts')

// 方式2: .then()
api.get('/posts').then(result => {
  console.log(result)
})
```

### Q5: 如何在多个页面使用同一个配置？

**A:** 只需在所有页面都引入这两个JS文件：

```html
<script src="/js/api-config.js"></script>
<script src="/js/api-manager.js"></script>
```

### Q6: 能否修改全局配置？

**A:** 可以，创建新的APIManager实例：

```javascript
const customApi = new APIManager({
  baseURL: 'https://custom.api.com',
  timeout: 20000,
  endpoints: API_CONFIG.endpoints
})
```

---

## 📚 完整示例应用

```javascript
// 初始化
const api = initAPIManager({
  baseURL: 'https://api.example.com',
  endpoints: API_CONFIG.endpoints
})

// 获取文章列表
async function getPosts() {
  const result = await api.call('post', 'list')
  if (result.success) {
    return result.data
  } else {
    console.error('获取失败:', result.error)
    return []
  }
}

// 获取文章详情
async function getPostDetail(postId) {
  const result = await api.call('post', 'detail', { id: postId })
  return result.success ? result.data : null
}

// 创建评论
async function createComment(postId, content) {
  const result = await api.call('comment', 'create',
    { postId, content, author: 'Anonymous' },
    { method: 'POST' }
  )
  return result.success ? result.data : null
}

// 删除评论
async function deleteComment(commentId) {
  const result = await api.call('comment', 'delete',
    { id: commentId },
    { method: 'DELETE' }
  )
  return result.success
}

// 使用示例
document.addEventListener('DOMContentLoaded', async () => {
  const posts = await getPosts()
  console.log('文章列表:', posts)

  if (posts.length > 0) {
    const detail = await getPostDetail(posts[0].id)
    console.log('第一篇文章详情:', detail)

    const comment = await createComment(posts[0].id, '很好的文章！')
    console.log('评论已发布:', comment)
  }
})
```

---

## 🔧 开发和维护

### 更新API端点后

1. 编辑 `source/js/api-config.js`
2. 运行 `npm run build`
3. 刷新浏览器或部署

### 调试请求

所有请求都会输出日志到浏览器控制台：

```
[API] 请求失败: /endpoint
[API] /endpoint - 404: 资源不存在
```

### 查看完整的请求/响应

在浏览器开发者工具的Network标签页可以查看完整的HTTP请求和响应。

---

**文档版本**: 1.0  
**最后更新**: 2026年5月  
**维护者**: Blog项目团队
