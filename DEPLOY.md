# Debian Docker 部署

这个站点适合用静态方式部署：`Hexo` 在构建阶段生成 `public/`，运行阶段只用 `Nginx` 托管静态文件。

## 服务器准备

确认 Debian 服务器已经安装好 Docker。

如果你要用 `docker compose`，还需要确认 Compose 插件可用：

```bash
docker compose version
```

## 方式一：直接在服务器构建并运行

把项目传到服务器，例如放到：

```bash
/opt/blog
```

进入目录后执行：

```bash
docker compose up -d --build
```

默认会映射到服务器 `8080` 端口，访问：

```text
http://你的服务器IP:8080
```

## 方式二：只运行容器，交给现有反向代理

如果你的 Debian 上已经有 Nginx 或其他反向代理，可以保持容器仍然监听 `8080`，然后在宿主机上反代到：

```text
127.0.0.1:8080
```

这样 HTTPS、域名和多个站点的统一入口都放到宿主机处理，会更清楚。

## 常用命令

构建并启动：

```bash
docker compose up -d --build
```

查看日志：

```bash
docker compose logs -f
```

重启：

```bash
docker compose restart
```

停止并删除容器：

```bash
docker compose down
```

## 更新站点

你改完内容后，在服务器项目目录重新执行：

```bash
docker compose up -d --build
```

这会重新构建 Hexo 静态文件并替换线上容器。

## 域名与正式上线前要改

上线前至少要把下面两处改成你的真实信息：

- `_config.yml` 里的 `url`
- `_config.butterfly.yml` 里的邮箱、GitHub、作者信息

例如：

```yml
url: https://your-domain.com
author: your-name
```

如果 `url` 还是占位地址，RSS、sitemap、部分分享链接会是错的。
