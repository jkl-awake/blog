# API 快速参考卡片

## 🚀 30秒快速开始

### 1. 在HTML中引入
```html
<script src="/js/api-config.js"></script>
<script src="/js/api-manager.js"></script>
```

### 2. 初始化API
```javascript
const api = initAPIManager({
  baseURL: 'https://api.example.com',
  endpoints: API_CONFIG.endpoints
})
```

### 3. 发送请求
```javascript
// GET 请求
const posts = await api.get('/posts')

// POST 请求
const result = await api.post('/comments', { content: 'Hello' })

// 使用别名
const data = await api.call('post', 'list')
```

---

## 📌 常用方法

| 方法 | 用途 | 示例 |
|------|------|------|
| `api.get(url)` | 获取数据 | `api.get('/posts')` |
| `api.post(url, data)` | 创建数据 | `api.post('/comments', {...})` |
| `api.put(url, data)` | 全量更新 | `api.put('/user', {...})` |
| `api.patch(url, data)` | 部分更新 | `api.patch('/post/1', {...})` |
| `api.delete(url)` | 删除数据 | `api.delete('/comment/1')` |
| `api.call(category, action)` | 使用别名调用 | `api.call('post', 'list')` |
| `api.batch(requests)` | 批量请求 | `api.batch([...])` |

---

## ✅ 检查请求是否成功

```javascript
const result = await api.get('/posts')

if (result.success) {
  console.log('成功:', result.data)
} else {
  console.log('失败:', result.error)
  console.log('状态码:', result.status)
}
```

---

## 🔑 关键概念

### 响应对象结构
```javascript
{
  success: true,        // 是否成功
  status: 200,         // HTTP状态码
  data: {...},         // 响应数据（成功时）
  error: 'message'     // 错误信息（失败时）
}
```

### HTTP 方法选择
- **GET** - 查询数据 ✅
- **POST** - 创建新数据 ✅
- **PUT** - 完整替换数据 ✅
- **PATCH** - 更新部分数据 ✅
- **DELETE** - 删除数据 ✅

---

## 💡 实用技巧

### 添加认证令牌
```javascript
const result = await api.get('/protected', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 自定义超时
```javascript
const result = await api.get('/slow-api', {
  customTimeout: 30000  // 30秒
})
```

### 带查询参数的GET
```javascript
const result = await api.get('/posts?page=1&limit=10')
```

### 使用别名（推荐）
```javascript
// 定义在 api-config.js 中
// 然后调用
const result = await api.call('post', 'list')
const detail = await api.call('post', 'detail', { id: 123 })
```

---

## 🚨 常见错误处理

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `success: false, status: 401` | 未授权 | 检查认证令牌，重新登录 |
| `success: false, status: 404` | 资源不存在 | 检查URL和ID是否正确 |
| `success: false, status: 500` | 服务器错误 | 联系后端开发者 |
| `success: false, status: 0` | 超时/网络错误 | 检查网络，增加超时时间 |

---

## 📁 文件清单

| 文件 | 位置 | 说明 |
|------|------|------|
| `api-config.js` | `source/js/` | API配置（端点定义） |
| `api-manager.js` | `source/js/` | API管理器核心代码 |
| `api-example.js` | `source/js/` | 使用示例 |
| `API-GUIDE.md` | 项目根目录 | 完整使用文档 |
| `QUICK-REFERENCE.md` | 项目根目录 | 本文件 |

---

## 🔧 配置API端点

编辑 `source/js/api-config.js`：

```javascript
endpoints: {
  newCategory: {
    action: '/api/path'
  }
}
```

然后运行：
```bash
npm run build
```

---

## 📝 完整示例

```javascript
// 初始化
const api = initAPIManager({
  baseURL: 'https://api.example.com',
  endpoints: API_CONFIG.endpoints
})

// 获取文章列表
async function loadPosts() {
  const result = await api.get('/posts')
  
  if (result.success) {
    return result.data
  } else {
    console.error('获取失败:', result.error)
    return []
  }
}

// 创建评论
async function addComment(content) {
  const result = await api.post('/comments', {
    content: content,
    author: 'John',
    timestamp: new Date().toISOString()
  })
  
  if (result.success) {
    console.log('评论已发布')
    return result.data
  } else {
    console.error('发布失败:', result.error)
    return null
  }
}

// 删除评论
async function removeComment(id) {
  const result = await api.delete(`/comments/${id}`)
  return result.success
}

// 使用
document.addEventListener('DOMContentLoaded', async () => {
  const posts = await loadPosts()
  console.log(posts)
})
```

---

## 🎯 建议流程

1. ✅ **查看文档** → 阅读 `API-GUIDE.md`
2. ✅ **理解示例** → 研究 `api-example.js`
3. ✅ **修改配置** → 编辑 `api-config.js`，添加你的API端点
4. ✅ **编译代码** → 运行 `npm run build`
5. ✅ **开始使用** → 在你的代码中使用API

---

## 📞 需要帮助？

### 查看浏览器控制台
所有日志都会输出到浏览器开发者工具（F12）：
```
[API] 请求成功
[操作] 开始获取...
[成功] 数据已返回
```

### 查看Network标签
在浏览器开发者工具的 Network 标签页可以查看完整的HTTP请求和响应。

### 常见问题
详见 `API-GUIDE.md` 中的常见问题部分。

---

**版本**: 1.0  
**最后更新**: 2026年5月
