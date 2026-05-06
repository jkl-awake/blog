/**
 * 时间线数据加载和绑定
 * 从 API 获取时间线事件，并渲染到页面上
 */

let timelineAPI = null

/**
 * 初始化时间线API
 */
function initTimelineAPI() {
  timelineAPI = initAPIManager({
    baseURL: 'https://your-api-domain.com',  // ✏️ 改成你的实际API地址
    endpoints: API_CONFIG.endpoints
  })
  console.log('[时间线] API 已初始化')
}

/**
 * 获取时间线事件列表
 */
async function fetchTimelineEvents() {
  if (!timelineAPI) {
    console.error('[时间线] API 未初始化')
    return []
  }

  console.log('[时间线] 开始加载时间线事件...')

  const result = await timelineAPI.call('timeline', 'list')

  if (result.success) {
    console.log('[时间线] 成功加载事件:', result.data)
    return result.data || []
  } else {
    console.error('[时间线] 加载失败:', result.error)
    showTimelineError(result.error)
    return []
  }
}

/**
 * 渲染时间线事件到页面
 */
function renderTimelineEvents(events) {
  const timelineStack = document.querySelector('.timeline-stack')

  if (!timelineStack) {
    console.warn('[时间线] 未找到 .timeline-stack 容器')
    return
  }

  // 清空现有内容（除了第一个卡片可能是"下一步"）
  timelineStack.innerHTML = ''

  if (!events || events.length === 0) {
    timelineStack.innerHTML = '<p style="text-align: center; color: #999;">暂无时间线事件</p>'
    return
  }

  // 渲染每个事件
  events.forEach((event, index) => {
    const card = createTimelineCard(event, index)
    timelineStack.appendChild(card)
  })

  console.log(`[时间线] 已渲染 ${events.length} 个事件`)
}

/**
 * 创建单个时间线卡片
 */
function createTimelineCard(event, index) {
  const card = document.createElement('div')
  card.className = 'tl-card'
  card.style.animationDelay = `${index * 100}ms`  // 错开动画时间

  // 处理日期格式
  const dateStr = event.date || event.dateStr || '未知日期'

  // 处理描述（可能是 description 或 desc）
  const description = event.description || event.desc || ''

  card.innerHTML = `
    <p class="tl-date">${dateStr}</p>
    <h3>${event.title || '无标题'}</h3>
    <p>${description}</p>
  `

  return card
}

/**
 * 显示加载错误提示
 */
function showTimelineError(errorMessage) {
  const timelineStack = document.querySelector('.timeline-stack')

  if (!timelineStack) return

  const errorDiv = document.createElement('div')
  errorDiv.className = 'timeline-error'
  errorDiv.style.cssText = `
    text-align: center;
    color: #e74c3c;
    padding: 20px;
    background: #fadbd8;
    border-radius: 4px;
    margin: 20px 0;
  `
  errorDiv.textContent = `⚠️ 加载失败: ${errorMessage}`

  timelineStack.parentElement.insertBefore(errorDiv, timelineStack)

  // 3秒后移除
  setTimeout(() => errorDiv.remove(), 3000)
}

/**
 * 页面加载时初始化和加载时间线
 */
document.addEventListener('DOMContentLoaded', async () => {
  // 检查是否在时间线页面
  if (!document.querySelector('.timeline-page')) {
    return
  }

  // 初始化 API
  initTimelineAPI()

  // 加载时间线事件
  const events = await fetchTimelineEvents()

  // 渲染到页面
  renderTimelineEvents(events)

  // 监听页面动画
  setupTimelineAnimations()
})

/**
 * 设置时间线卡片的入场动画
 */
function setupTimelineAnimations() {
  const cards = document.querySelectorAll('.tl-card')

  if (!('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.12
  })

  cards.forEach((card) => observer.observe(card))
}

/**
 * 手动刷新时间线（如果需要）
 */
async function refreshTimeline() {
  console.log('[时间线] 开始刷新...')
  const events = await fetchTimelineEvents()
  renderTimelineEvents(events)
  setupTimelineAnimations()
  console.log('[时间线] 刷新完成')
}

// 暴露全局接口供其他脚本调用
window.TimelineManager = {
  init: initTimelineAPI,
  fetch: fetchTimelineEvents,
  render: renderTimelineEvents,
  refresh: refreshTimeline
}
