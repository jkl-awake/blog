# API 集成改动指南

## 概览

这份指南说明当你的后端 API 搭建好后，需要如何改动项目代码来集成 API 数据。

## 🎯 目标

将硬编码的静态数据改成从 API 动态加载，以时间线功能为例。

---

## 📝 改动清单

### ✅ 已完成的改动

以下改动已经为你做好了，直接可用：

#### 1. **修改 api-config.js** 
   - 添加了时间线 API 端点定义：
   ```javascript
   timeline: {
     list: '/timeline',        // 获取时间线事件列表
     detail: '/timeline/:id'   // 获取时间线事件详情
   }
   ```

#### 2. **创建 timeline-loader.js**
   - 处理时间线数据的加载和渲染
   - 自动监听页面加载事件
   - 处理错误和加载状态

#### 3. **修改 source/timeline/index.md**
   - 移除硬编码的事件卡片
   - 改用动态渲染
   - 添加了 JS 脚本引入

### ⚙️ 需要你改动的地方

#### 1. **配置 API 基础 URL**

编辑 `source/js/timeline-loader.js`，找到这一行（第 10-12 行）：

```javascript
function initTimelineAPI() {
  timelineAPI = initAPIManager({
    baseURL: 'https://your-api-domain.com',  // ✏️ 改成你的实际API地址
    endpoints: API_CONFIG.endpoints
  })
}
```

改成你的实际 API 地址，例如：
```javascript
baseURL: 'https://api.example.com'
// 或
baseURL: 'https://your-server.com:8080/api'
// 或本地开发
baseURL: 'http://localhost:3000'
```

#### 2. **编译生成文件**

```bash
npm run build
```

这会将 `source/js/` 中的所有文件编译到 `public/js/` 目录。

#### 3. **本地测试**

```bash
npm run server
```

访问 http://localhost:4000/timeline/ 查看效果。

---

## 📊 API 数据格式要求

你的后端 API 需要按照以下格式返回数据：

### GET /timeline 响应格式

```json
{
  "data": [
    {
      "id": 1,
      "title": "个人站改造成时间线结构",
      "date": "2026.04",
      "description": "首页从常规博客流改为时间流入口，保留文章能力..."
    },
    {
      "id": 2,
      "title": "开始梳理长期维护的项目",
      "date": "2026.03",
      "description": "把零散记录收束成少数几个明确主题..."
    }
  ]
}
```

**字段说明：**
| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| id | number | ✅ | 事件唯一标识 |
| title | string | ✅ | 事件标题 |
| date | string | ✅ | 事件日期（格式：2026.04） |
| description | string | ✅ | 事件描述 |

### 或者使用别名字段

如果你的 API 返回的字段名不同，`timeline-loader.js` 也支持别名：

```javascript
// 支持这些字段名：
{
  "title": "...",           // 或
  "description": "...",     // 或 "desc"
  "date": "...",            // 或 "dateStr"
}
```

---

## 🔄 工作流程

### 开发阶段

1. **启动本地 API 服务**
   ```bash
   # 在你的后端项目目录
   npm start  # 或 python manage.py runserver 等
   ```

2. **配置 API 地址**
   ```javascript
   // source/js/timeline-loader.js
   baseURL: 'http://localhost:3000'  // 改成你的本地 API 地址
   ```

3. **编译和预览**
   ```bash
   npm run build
   npm run server
   ```

4. **访问预览**
   - 打开 http://localhost:4000/timeline/
   - 打开浏览器开发者工具（F12）查看控制台日志

### 测试 API 是否正常

在浏览器控制台中运行：

```javascript
// 手动测试 API
await TimelineManager.fetch()

// 刷新时间线
await TimelineManager.refresh()
```

---

## 📡 完整数据流

```
用户访问 /timeline/ 页面
  ↓
页面加载完成 (DOMContentLoaded)
  ↓
timeline-loader.js 自动执行
  ↓
1. 初始化 API 管理器 (initTimelineAPI)
  ↓
2. 发起 GET /timeline 请求
  ↓
3. 后端返回 JSON 数据
  ↓
4. 解析 JSON 数据
  ↓
5. 循环创建 HTML 卡片元素
  ↓
6. 渲染到 .timeline-stack 容器
  ↓
7. 触发页面动画效果
  ↓
显示最终时间线页面
```

---

## 🛠️ 排查常见问题

### 问题1: 时间线卡片没有显示

**检查步骤：**

1. 打开浏览器开发者工具（F12）→ Console 标签
2. 查看是否有错误日志，例如：
   ```
   [时间线] 加载失败: 404 Not Found
   ```

3. 确认：
   - ✅ API 地址是否正确配置
   - ✅ 后端 API 是否正常运行
   - ✅ 是否有 CORS 跨域问题

### 问题2: 显示 "加载失败"

可能原因：
- API 地址错误 → 改 `baseURL`
- API 服务未启动 → 启动后端服务
- CORS 配置问题 → 后端配置响应头

### 问题3: Network 标签看不到请求

在浏览器 F12 → Network 标签查看：
- 如果有 `/timeline` 请求，检查状态码
- 如果没有请求，可能是 JS 未加载

**解决办法：**
```bash
npm run build  # 重新编译
npm run server # 重启服务
```

### 问题4: 浏览器控制台报错

常见错误消息：

| 错误 | 原因 | 解决 |
|------|------|------|
| `Cannot read property 'querySelector'` | JS 加载顺序错误 | 检查脚本顺序 |
| `api-config.js not found` | 文件未编译 | 运行 `npm run build` |
| `CORS error` | 跨域问题 | 后端配置 CORS |
| `API未初始化` | 脚本未执行 | 检查浏览器控制台 |

---

## 🚀 其他页面集成

时间线只是例子。如果要在其他页面使用 API 数据，参考以下模板：

### 模板: 新增一个页面的 API 集成

#### 1. 在 `api-config.js` 中添加端点

```javascript
endpoints: {
  myFeature: {
    list: '/my-feature',
    detail: '/my-feature/:id'
  }
}
```

#### 2. 创建加载脚本 `source/js/myfeature-loader.js`

```javascript
let api = null

function initAPI() {
  api = initAPIManager({
    baseURL: 'https://your-api.com',
    endpoints: API_CONFIG.endpoints
  })
}

async function fetchData() {
  const result = await api.call('myFeature', 'list')
  if (result.success) {
    return result.data
  } else {
    console.error('加载失败:', result.error)
    return []
  }
}

function renderData(data) {
  const container = document.querySelector('.my-feature-container')
  // 你的渲染逻辑
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.querySelector('.my-feature-page')) return
  
  initAPI()
  const data = await fetchData()
  renderData(data)
})

window.MyFeatureManager = {
  fetch: fetchData,
  render: renderData
}
```

#### 3. 在页面中引入并使用

```html
<div class="my-feature-page">
  <div class="my-feature-container">
    <!-- 数据将加载到这里 -->
  </div>
</div>

<script src="/js/api-config.js"></script>
<script src="/js/api-manager.js"></script>
<script src="/js/myfeature-loader.js"></script>
```

---

## 📋 快速改动检查表

- [ ] 后端 API 已部署到线上/本地
- [ ] 修改了 `source/js/timeline-loader.js` 中的 `baseURL`
- [ ] 运行了 `npm run build` 编译
- [ ] 运行了 `npm run server` 启动本地预览
- [ ] 访问 /timeline/ 页面能看到数据
- [ ] 浏览器控制台没有错误

---

## 📞 需要帮助？

1. **查看页面日志** → 打开浏览器 F12 → Console 查看
2. **查看网络请求** → 打开浏览器 F12 → Network 查看
3. **查看源代码** → [source/js/timeline-loader.js](source/js/timeline-loader.js)
4. **查看 API 文档** → [API.md](API.md)

---

**版本**: 1.0  
**最后更新**: 2026年5月  

