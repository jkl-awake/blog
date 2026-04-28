# 内容维护手册

这份文档是给你自己长期维护这个站点用的。

目标不是解释 Hexo 原理，而是让你以后遇到这些事情时，知道应该改哪里、怎么改、改完怎么预览、怎么发布：

- 新增文章
- 修改文章
- 删除文章
- 修改固定页面
- 修改站点标题、作者、菜单、头像、社交链接
- 新增图片和在文章里引用图片
- 修改首页文案
- 本地预览
- 推送到 GitHub
- 在服务器更新上线
- 出问题时怎么排查

---

## 1. 你平时真正会改的文件

日常维护时，绝大多数操作都只会落在下面这些文件里：

```text
source/_posts/                  所有文章
source/about/index.md           关于页
source/projects/index.md        项目页
source/now/index.md             此刻页
source/timeline/index.md        时间线页
source/img/                     图片资源
source/css/custom.css           自定义样式
source/js/custom.js             首页和自定义交互
_config.yml                     站点主配置
_config.butterfly.yml           主题配置
README.md                       项目说明
README-CONTENT.md               内容维护说明
```

你可以把整个项目理解为两层：

1. 内容层
   - `source/_posts/`
   - `source/about/`
   - `source/projects/`
   - `source/now/`
   - `source/timeline/`

2. 配置和外观层
   - `_config.yml`
   - `_config.butterfly.yml`
   - `source/css/custom.css`
   - `source/js/custom.js`

如果只是写文章、改页面内容，尽量不要去碰 CSS 和 JS。

---

## 2. 文章放在哪里

文章都放在：

```text
source/_posts/
```

例如：

```text
source/_posts/2026-04-28-site-kickoff.md
source/_posts/2026-03-18-project-roadmap.md
source/_posts/2025-12-02-server-online.md
```

建议你的文件名一直使用这个规则：

```text
YYYY-MM-DD-语义化英文名.md
```

例如：

```text
2026-05-03-nginx-reverse-proxy-notes.md
2026-05-04-my-weekly-log.md
2026-05-05-server-backup-plan.md
```

原因很简单：

- 按日期排序时清楚
- 文件名不依赖中文编码
- 后面在服务器或终端里找文件更方便

---

## 3. 一篇文章的标准写法

你以后新增文章时，建议直接复制这个模板。

```md
---
title: 这是一篇新文章
date: 2026-05-01 21:00:00
updated: 2026-05-01 21:00:00
description: 这里写文章摘要，会显示在首页摘要、搜索结果和 SEO 描述里。
categories:
  - 运维
tags:
  - Nginx
  - Docker
  - Deploy
cover: false
---

这里开始写正文。

你可以直接写 Markdown 内容。
```

### 每个字段是什么意思

`title`
- 文章标题
- 首页和文章页都会显示

`date`
- 发布时间
- 文章会按这个时间排序

`updated`
- 更新时间
- 建议你每次大改文章都顺手更新

`description`
- 非常重要
- 首页摘要、搜索摘要、SEO 描述会用到
- 建议每篇文章都写，不要留空

`categories`
- 分类
- 建议一篇文章只有一个主分类，最多两个
- 不要分得太碎

`tags`
- 标签
- 可以多个
- 用来横向连接内容

`cover: false`
- 当前这个站点首页是时间线风格，不走大封面卡片
- 所以建议默认都写 `false`

---

## 4. 如何新增一篇文章

### 方法一：手动新建文件

在：

```text
source/_posts/
```

下新建一个文件，比如：

```text
source/_posts/2026-05-03-nginx-reverse-proxy.md
```

然后粘贴模板：

```md
---
title: Nginx 反向代理配置记录
date: 2026-05-03 20:30:00
updated: 2026-05-03 20:30:00
description: 记录一次把 Docker 中的静态博客挂到 Debian 宿主机 Nginx 下的过程。
categories:
  - 运维
tags:
  - Nginx
  - Reverse Proxy
  - Docker
cover: false
---

这里开始写正文。
```

### 方法二：使用 Hexo 命令生成

你也可以在项目根目录执行：

```bash
npx hexo new "Nginx 反向代理配置记录"
```

生成后再去：

```text
source/_posts/
```

找到新文件并补全 `description`、`categories`、`tags`、`cover: false`。

我更建议你手动建，因为你现在已经有自己的固定命名风格了。

---

## 5. 如何修改文章

直接打开文章对应的 `.md` 文件改就可以。

例如：

```text
source/_posts/2026-04-28-site-kickoff.md
```

### 常见修改动作

改标题：

```yml
title: 新标题
```

改摘要：

```yml
description: 新摘要
```

改分类：

```yml
categories:
  - 建站
```

改标签：

```yml
tags:
  - Hexo
  - Butterfly
  - Timeline
```

改正文：
- 直接改 Front Matter 下方的 Markdown 内容

改完内容后，建议同步改：

```yml
updated: 2026-05-03 22:10:00
```

---

## 6. 如何删除文章

直接删除对应的 Markdown 文件。

例如删除：

```text
source/_posts/2026-03-18-project-roadmap.md
```

然后重新生成或重新部署，文章就会从这些地方一起消失：

- 首页
- 归档页
- 分类页
- 标签页
- 搜索结果

---

## 7. 如何写正文内容

文章正文支持标准 Markdown。

### 标题

```md
# 一级标题
## 二级标题
### 三级标题
```

### 列表

```md
- 第一项
- 第二项
- 第三项
```

```md
1. 第一步
2. 第二步
3. 第三步
```

### 代码块

````md
```bash
docker compose up -d --build
```
````

### 链接

```md
[OpenAI](https://openai.com)
```

### 图片

```md
![示例图片](/img/example.png)
```

### 引用

```md
> 这是一段引用
```

### 分隔线

```md
---
```

---

## 8. 如何插入图片

### 第一步：把图片放进 `source/img/`

例如：

```text
source/img/nginx-setup.png
source/img/server-topology.jpg
source/img/my-avatar.png
```

### 第二步：在文章或页面里引用

Markdown 写法：

```md
![Nginx 配置截图](/img/nginx-setup.png)
```

HTML 写法：

```html
<img src="/img/nginx-setup.png" alt="Nginx 配置截图">
```

### 命名建议

图片文件名建议用英文和短横线：

```text
good:
server-backup-plan.png
nginx-homepage.jpg

avoid:
图片1.png
最新截图(最终版).jpg
```

原因：

- 命令行里更好处理
- 服务器上更稳
- 链接不会太难看

---

## 9. 固定页面怎么改

当前这个站点有 4 个固定页面：

- `source/about/index.md`
- `source/projects/index.md`
- `source/now/index.md`
- `source/timeline/index.md`

这些页面现在是 Markdown + 一些 HTML 区块混写。

### 最稳的修改方式

不要大改 HTML 结构，优先只改文字内容。

也就是说：

- 保留 `<div class="timeline-page">`
- 保留 `<div class="timeline-stack">`
- 保留 `<div class="project-grid">`
- 保留 `<div class="status-grid">`
- 只改标题、段落、卡片文字

### 关于页

文件：

```text
source/about/index.md
```

建议放：

- 个人介绍
- 工作方式
- 关注主题
- 站点定位

### 项目页

文件：

```text
source/projects/index.md
```

建议放：

- 长期维护的项目
- 每个项目的简介
- 技术栈
- 状态

### 此刻页

文件：

```text
source/now/index.md
```

建议放：

- 最近在做什么
- 本周重点
- 本月重点
- 接下来计划

### 时间线页

文件：

```text
source/timeline/index.md
```

建议放：

- 阶段节点
- 项目里程碑
- 站点版本变化

---

## 10. 如何新增一个固定页面

例如你想加一个“读书”页面。

### 第一步：创建目录和文件

```text
source/reading/index.md
```

### 第二步：写页面头信息

```md
---
title: 读书
date: 2026-05-03 23:00:00
top_img: false
aside: true
---

这里写页面内容。
```

### 第三步：把它加到菜单里

打开：

```text
_config.butterfly.yml
```

在 `menu:` 里加一项：

```yml
读书: /reading/ || fas fa-book
```

### 第四步：本地预览

```bash
npm run server
```

---

## 11. 如何修改站点基础信息

主站点信息在：

```text
_config.yml
```

你最常改的是这几项：

```yml
title: 时间褶皱
subtitle: 一条持续更新的个人时间线
description: 用 Hexo 和 Butterfly 搭建的时间线风格个人网站
author: Your Name
url: https://example.com
language: zh-CN
timezone: Asia/Shanghai
```

### 实际建议

你上线前至少改成自己的真实信息：

```yml
title: 你的站点名
subtitle: 你的副标题
description: 你的站点描述
author: 你的名字
url: https://你的域名
```

`url` 很重要。

如果这里不改，下面这些东西会不对：

- RSS
- sitemap
- 社交分享链接
- canonical 链接
- Open Graph 信息

---

## 12. 如何修改主题配置

主题配置在：

```text
_config.butterfly.yml
```

### 你最常改的部分

#### 菜单

```yml
menu:
  首页: / || fas fa-house
  时间线: /timeline/ || fas fa-timeline
  项目: /projects/ || fas fa-diagram-project
  此刻: /now/ || fas fa-bolt
  关于: /about/ || fas fa-user
```

格式是：

```yml
菜单名: /路径/ || 图标类名
```

#### 头像

```yml
avatar:
  img: /img/avatar-line.svg
  effect: true
```

#### 社交链接

```yml
social:
  fas fa-envelope: mailto:hello@example.com || Email || '#3f5c4d'
  fab fa-github: https://github.com/jkl-awake || GitHub || '#1f2937'
```

格式是：

```yml
图标类名: 链接 || 文本说明 || 颜色
```

#### 侧栏作者简介

```yml
aside:
  card_author:
    enable: true
    description: 这里是你的简介
```

#### 公告

```yml
aside:
  card_announcement:
    enable: true
    content: 这里是公告内容
```

#### 首页副标题轮播文字

```yml
subtitle:
  enable: true
  effect: true
  sub:
    - 第一行
    - 第二行
    - 第三行
```

---

## 13. 首页文案改哪里

首页除了主题配置里的副标题，还有一部分是自定义注入的引导区。

这部分在：

```text
source/js/custom.js
```

你会看到类似这些文字：

- `PERSONAL TIMELINE`
- `查看完整时间线`
- `浏览项目清单`
- `了解最近在做什么`

如果只是改文字，可以直接改这里的字符串。

如果不是很确定，不要随便改 DOM 结构，比如：

- `insertBefore`
- `.recent-post-items`
- `#recent-posts`

这些结构改错了，首页容易错位。

---

## 14. 样式改哪里

自定义样式在：

```text
source/css/custom.css
```

这个文件主要控制：

- 首页 hero 卡片
- 时间线卡片
- 自定义页面卡片
- 自定义配色
- 首页按钮样式

### 样式修改建议

先改颜色、间距、字号这类轻改动：

- `color`
- `background`
- `padding`
- `margin`
- `font-size`
- `border-radius`

不要轻易改这些核心布局选择器，除非你知道自己在做什么：

- `#recent-posts`
- `.recent-post-items`
- `#content-inner`
- `.layout`

---

## 15. 本地如何预览

项目根目录执行：

```bash
npm install
```

启动本地预览：

```bash
npm run server
```

浏览器打开：

```text
http://localhost:4000
```

如果只是重新生成静态文件：

```bash
npm run build
```

---

## 16. 一次完整的内容更新流程

假设你今天要新增一篇文章并修改“此刻”页面。

### 第一步：改内容

新增：

```text
source/_posts/2026-05-03-my-log.md
```

修改：

```text
source/now/index.md
```

### 第二步：本地预览

```bash
npm run server
```

打开：

```text
http://localhost:4000
```

### 第三步：提交到 GitHub

```bash
git add .
git commit -m "更新文章和 now 页面"
git push
```

### 第四步：服务器更新

```bash
cd /opt/blog
git pull
docker compose up -d --build
```

---

## 17. 服务器如何更新上线

在 Debian 服务器上：

```bash
cd /opt/blog
git pull
docker compose up -d --build
```

如果想看启动日志：

```bash
docker compose logs -f
```

如果只是重启容器：

```bash
docker compose restart
```

如果要停掉：

```bash
docker compose down
```

---

## 18. 如果文章没显示出来，先检查什么

### 情况一：本地没显示

检查：

- 文件是不是放在 `source/_posts/`
- 文件是不是 `.md`
- Front Matter 开头结尾的 `---` 有没有写对
- `date` 格式是否正确
- 是否执行了 `npm run server` 或 `npm run build`

### 情况二：本地有，服务器没有

检查：

- 是否执行了 `git add .`
- 是否执行了 `git commit`
- 是否执行了 `git push`
- 服务器是否执行了 `git pull`
- 服务器是否执行了 `docker compose up -d --build`

---

## 19. 如果图片不显示，先检查什么

按下面顺序查：

1. 图片是否真的在 `source/img/`
2. 引用路径是不是 `/img/文件名`
3. 文件扩展名对不对，比如 `.png` `.jpg`
4. 文件名大小写是否一致
5. 是否重新构建并部署

例如你放的是：

```text
source/img/server-topology.png
```

那引用必须写成：

```md
![拓扑图](/img/server-topology.png)
```

不要写成：

```md
![拓扑图](img/server-topology.png)
```

---

## 20. 如果页面样式错乱，先检查什么

优先检查：

- `source/css/custom.css`
- `source/js/custom.js`

尤其是这类操作之后最容易出问题：

- 改首页结构
- 改 `insertBefore`
- 改 `.recent-post-items`
- 改 `#recent-posts`
- 改 `.layout`

如果你只是改文字，尽量不要动这些结构。

---

## 21. 推荐的分类和标签策略

### 分类建议少而稳

例如：

- 建站
- 运维
- 项目
- 写作
- 随记

不要一篇文章一个分类。

### 标签可以更细

例如：

- Hexo
- Butterfly
- Docker
- Nginx
- Deploy
- Server
- Backup

分类负责主归属，标签负责横向连接。

---

## 22. 建议你优先替换的内容

如果你想尽快把这个站变成自己的，优先改这些地方：

1. `_config.yml`
   - `title`
   - `subtitle`
   - `description`
   - `author`
   - `url`

2. `_config.butterfly.yml`
   - 邮箱
   - GitHub
   - 侧栏简介
   - 公告
   - 菜单名称

3. 固定页面
   - `source/about/index.md`
   - `source/projects/index.md`
   - `source/now/index.md`
   - `source/timeline/index.md`

4. 文章
   - 把示例文章逐步替换成你自己的真实内容

---

## 23. 你以后最常用的命令

安装依赖：

```bash
npm install
```

本地预览：

```bash
npm run server
```

生成静态文件：

```bash
npm run build
```

提交代码：

```bash
git add .
git commit -m "更新内容"
git push
```

服务器上线：

```bash
cd /opt/blog
git pull
docker compose up -d --build
```

---

## 24. 最后给你的维护原则

长期维护这个站时，按下面顺序做最稳：

1. 先改内容
2. 再本地预览
3. 再提交 GitHub
4. 最后服务器重建

以及：

- 改文字时，优先改 Markdown 和配置
- 改视觉时，优先改 `source/css/custom.css`
- 改首页结构时，只小步调整
- 不是必要，不要直接碰主题源码

这样后面你维护起来会轻很多。
