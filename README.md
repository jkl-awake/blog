# Timeline Blog

一个基于 `Hexo + Butterfly` 的时间线风格个人网站。

仓库里只保留站点内容、配置、自定义样式脚本和 Docker 部署文件；主题通过 `npm` 安装，不再把整份主题源码提交进仓库。

如果你要自己长期维护内容，先看：

```text
README-CONTENT.md
```

## 本地开发

安装依赖：

```bash
npm install
```

启动本地预览：

```bash
npm run server
```

默认访问：

```text
http://localhost:4000
```

生成静态文件：

```bash
npm run build
```

生成结果位于：

```text
public/
```

## 目录结构

```text
source/                  站点内容
source/_posts/           文章
source/about/            关于页
source/projects/         项目页
source/now/              此刻页
source/timeline/         时间线页
source/css/custom.css    自定义样式
source/js/custom.js      自定义交互
docker/nginx/            Nginx 配置
Dockerfile               Docker 镜像构建
compose.yaml             Docker Compose 部署
_config.yml              Hexo 主配置
_config.butterfly.yml    Butterfly 主题配置
```

## Docker 部署

构建并启动：

```bash
docker compose up -d --build
```

默认映射端口：

```text
8080 -> 80
```

访问：

```text
http://server-ip:8080
```

## 上线前要改

至少改这两处：

- `_config.yml` 里的 `url`
- `_config.butterfly.yml` 里的邮箱、GitHub、作者信息

例如：

```yml
url: https://your-domain.com
author: jkl-awake
```

## 更新部署

服务器上拉取新代码后重新构建：

```bash
git pull
docker compose up -d --build
```

## 说明

如果服务器在中国大陆并且使用域名正式对外提供访问，是否需要备案取决于服务器地域和域名接入场景，不取决于是否使用 `80` 端口。
