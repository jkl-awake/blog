# API 管理系统使用指南

本项目包含一个简单易用的 **API 统一管理系统**，用于集中管理和调用所有 API 请求。

## 📁 文件结构

```
source/js/
├── api-config.js      # API 端点和配置定义
├── api-manager.js     # 核心管理器（处理请求/响应/错误）
└── api-example.js     # 使用示例和最佳实践

文档文件/
├── API-GUIDE.md              # 📚 完整使用文档
├── QUICK-REFERENCE.md        # ⚡ 快速参考卡片
└── API.md                    # 本文件（入口）
```

## 🚀 快速开始（3步）

### 1️⃣ 编译生成 JS 文件

```bash
npm run build
```

这会将 `source/js/` 中的文件编译到 `public/js/` 目录。

### 2️⃣ 在 HTML 中引入

按顺序引入两个文件：

```html
<script src="/js/api-config.js"></script>
<script src="/js/api-manager.js"></script>
```

### 3️⃣ 初始化并使用

```javascript
// 初始化 API 管理器
const api = initAPIManager({
  baseURL: 'https://api.example.com',
  endpoints: API_CONFIG.endpoints
})

// 发送 GET 请求
const result = await api.get('/posts')

// 检查是否成功
if (result.success) {
  console.log('数据:', result.data)
} else {
  console.log('错误:', result.error)
}
```

## 📖 文档导航

### 🎯 新手推荐

1. **先看** [QUICK-REFERENCE.md](QUICK-REFERENCE.md) — 5分钟快速了解基本用法
2. **再看** [source/js/api-example.js](source/js/api-example.js) — 查看实际代码示例
3. **深入** [API-GUIDE.md](API-GUIDE.md) — 学习完整功能和最佳实践

### 📚 按需查看

| 文档 | 内容 | 何时阅读 |
|------|------|---------|
| [QUICK-REFERENCE.md](QUICK-REFERENCE.md) | 常用方法、快速参考 | 需要快速查找用法时 |
| [API-GUIDE.md](API-GUIDE.md) | 完整教程、详细示例 | 想深入理解所有功能 |
| [api-example.js](source/js/api-example.js) | 代码示例、实战代码 | 想看实际使用方式 |
| [api-config.js](source/js/api-config.js) | 配置文件 | 需要添加新的 API 端点 |
| [api-manager.js](source/js/api-manager.js) | 核心代码 | 想了解内部实现原理 |

## 💡 核心特性

✅ **简单易用** — 无需复杂配置，开箱即用

✅ **统一管理** — 所有 API 端点集中在一个配置文件

✅ **完整功能** — 支持 GET、POST、PUT、PATCH、DELETE 等

✅ **错误处理** — 自动处理超时、网络错误等异常

✅ **请求拦截** — 支持自定义请求头、认证令牌等

✅ **批量请求** — 同时发送多个请求并等待完成

✅ **可追踪** — 所有请求都输出到浏览器控制台

## 🔧 基础用法

### 发送不同类型的请求

```javascript
// GET 请求
const posts = await api.get('/posts')

// POST 请求
const result = await api.post('/comments', {
  content: 'Hello',
  author: 'John'
})

// PUT 请求（全量更新）
const updated = await api.put('/user/1', {
  name: 'New Name',
  email: 'new@example.com'
})

// PATCH 请求（部分更新）
const patched = await api.patch('/post/1', {
  title: '新标题'
})

// DELETE 请求
const deleted = await api.delete('/comment/1')
```

### 使用端点别名（推荐）

在 `api-config.js` 中定义别名后，可以用更简洁的方式调用：

```javascript
// 列表
const posts = await api.call('post', 'list')

// 详情
const detail = await api.call('post', 'detail', { id: 123 })

// 创建
const created = await api.call('comment', 'create',
  { content: '很好', postId: 123 },
  { method: 'POST' }
)
```

### 处理响应

```javascript
const result = await api.get('/posts')

// 统一的响应格式
{
  success: true,        // 是否成功
  status: 200,         // HTTP 状态码
  data: [...],         // 成功时的数据
  error: 'message'     // 失败时的错误信息
}

if (result.success) {
  // 处理数据
  displayPosts(result.data)
} else {
  // 处理错误
  console.error(`错误 ${result.status}: ${result.error}`)
}
```

## 🛠️ 配置管理

### 添加新的 API 端点

编辑 `source/js/api-config.js`：

```javascript
endpoints: {
  // 新增一个分类
  analytics: {
    report: '/analytics/report',
    export: '/analytics/export'
  }
}
```

然后编译：

```bash
npm run build
```

### 改变基础 URL

```javascript
const api = initAPIManager({
  baseURL: 'https://your-api-domain.com',
  endpoints: API_CONFIG.endpoints
})
```

### 自定义超时时间

```javascript
const result = await api.get('/slow-api', {
  customTimeout: 30000  // 30秒超时
})
```

## 🔑 常用场景

### 添加认证令牌

```javascript
const token = localStorage.getItem('authToken')
const result = await api.get('/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### 批量获取多个资源

```javascript
const results = await api.batch([
  { endpoint: '/posts' },
  { endpoint: '/user/profile' },
  { endpoint: '/comments' }
])

if (results.success) {
  console.log('所有数据:', results.data)
}
```

### 带重试的请求

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const result = await api.get(url)
    if (result.success) return result.data
    
    if (i < retries - 1) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  return null
}
```

## 🐛 错误处理

常见 HTTP 状态码：

| 状态码 | 含义 | 处理方式 |
|--------|------|---------|
| 200 | 成功 | 取出 `result.data` 处理 |
| 201 | 已创建 | 成功创建资源 |
| 400 | 参数错误 | 检查参数是否正确 |
| 401 | 未授权 | 需要登录或刷新令牌 |
| 403 | 禁止访问 | 权限不足 |
| 404 | 资源不存在 | 检查 URL 是否正确 |
| 500 | 服务器错误 | 联系后端开发者 |
| 0 | 超时/网络错误 | 检查网络，增加超时 |

## 📞 获取帮助

- 🎯 快速查找 → [QUICK-REFERENCE.md](QUICK-REFERENCE.md)
- 📚 详细文档 → [API-GUIDE.md](API-GUIDE.md)
- 💻 代码示例 → [api-example.js](source/js/api-example.js)
- 🔧 配置文件 → [api-config.js](source/js/api-config.js)

## ❓ 常见问题

**Q: 怎样添加新的 API 端点？**

A: 在 `source/js/api-config.js` 中的 `endpoints` 对象里添加，然后运行 `npm run build`。

**Q: 如何处理请求超时？**

A: 使用 `customTimeout` 选项增加超时时间：`api.get(url, { customTimeout: 30000 })`

**Q: 支持 CORS 跨域请求吗？**

A: 支持，但需要后端配置响应头 `Access-Control-Allow-Origin` 等。

**Q: 所有响应都是什么格式？**

A: 统一格式：`{ success: boolean, status: number, data: any, error: string }`

---

**版本**: 1.0  
**最后更新**: 2026年5月  

👉 **开始阅读**: [QUICK-REFERENCE.md](QUICK-REFERENCE.md) → [api-example.js](source/js/api-example.js) → [API-GUIDE.md](API-GUIDE.md)
