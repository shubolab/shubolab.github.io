# shubolab.github.io

Shubo 的个人 About 与博客站点，使用接近真实 shell 的 Termux 多会话界面。

- 纯静态 HTML / CSS / JavaScript，无构建依赖。
- 首页资料来自 `shubolab/shubolab`，以 `gh repo view` 风格的纯文本展示。
- 三个页面表现为 Termux Session 1–3，文章使用类似 `less` 的阅读状态栏。
- 首页终端支持 `help`、`whoami`、`ls posts`、`cat about.md`、`cat contact.txt`、`gh profile`、`open 1`、`open 2` 等命令，并支持历史和 Tab 补全。
- SSH 相关文章只公开本机真实 Host alias，连接地址、用户、端口、密钥和代理配置均已脱敏。
- 推送到 `main` 后由 GitHub Actions 自动发布到 GitHub Pages。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 <http://localhost:4173>。
