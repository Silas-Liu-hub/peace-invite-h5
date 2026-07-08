# peace-invite-h5

一个可直接部署到 GitHub Pages 的静态 H5 页面，用来做“和平精英组队邀请”。

## 文件结构

- `index.html`：页面结构
- `style.css`：视觉样式与移动端适配
- `script.js`：循环追问、尝试唤起和平精英、微信提示与失败兜底
- `.github/workflows/deploy-pages.yml`：GitHub Pages 自动部署工作流

## 本地运行

直接打开 `index.html` 就可以预览页面。

如果你想更接近线上环境，也可以在当前目录启动一个本地静态服务，例如：

```bash
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173`

## 自动部署到 GitHub Pages

项目已经内置 GitHub Actions 自动部署配置。

首次使用时这样做：

1. 在 GitHub 新建仓库，比如 `peace-invite-h5`
2. 把当前项目推送到仓库的 `main` 分支
3. 打开仓库 `Settings` -> `Pages`
4. 在 `Source` 里选择 `GitHub Actions`
5. 之后每次 push 到 `main`，都会自动触发部署

部署成功后，页面地址通常是：

```text
https://你的用户名.github.io/peace-invite-h5/
```

## 手动推送示例

如果你本地还没初始化 Git，可以运行：

```bash
git init
git add .
git commit -m "feat: add peace invite h5"
git branch -M main
git remote add origin https://github.com/你的用户名/peace-invite-h5.git
git push -u origin main
```

## 微信环境说明

微信内可能会拦截应用唤起。如果点击“同意”后没有拉起游戏，建议点右上角菜单，选择“在浏览器打开”后再试。
