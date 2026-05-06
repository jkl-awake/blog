---
title: 时间线
date: 2026-04-28 10:00:00
top_img: /img/timeline-hero.svg
aside: false
---

<div class="timeline-page">
  <p class="timeline-lead">这页不是文章归档的重复，而是把一些关键节点单独提出来，方便快速理解这个站点和个人工作的演变轨迹。</p>

  <!-- 加载指示 -->
  <div class="timeline-loading" style="text-align: center; color: #999; padding: 20px;">
    <i class="fas fa-spinner fa-spin"></i> 加载中...
  </div>

  <!-- 时间线内容将动态加载到这里 -->
  <div class="timeline-stack">
    <!-- 备用内容：当 API 加载失败时显示 -->
    <div class="tl-card">
      <p class="tl-date">下一步</p>
      <h3>接入真实内容与部署流程</h3>
      <p>替换示例文本，配置正式域名、HTTPS、备份和发布命令，这一步完成后就可以长期使用。</p>
    </div>
  </div>
</div>

<!-- 
  页面依赖的脚本（按顺序加载）：
  1. api-config.js      - API 配置
  2. api-manager.js     - API 管理器
  3. timeline-loader.js - 时间线数据加载脚本
-->
<script src="/js/api-config.js"></script>
<script src="/js/api-manager.js"></script>
<script src="/js/timeline-loader.js"></script>
