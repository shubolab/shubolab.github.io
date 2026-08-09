# shubolab.github.io

Shubo 的个人 About 与博客站点，使用克制的 Linux terminal 风格。

- 纯静态 HTML / CSS / JavaScript，无构建依赖。
- 首页资料来自 `shubolab/shubolab`，并嵌入 GitHub Profile Summary。
- 首页终端支持 `help`、`about`、`profile`、`posts`、`contact`、`open 1`、`open 2` 等命令。
- SSH 相关文章只公开本机真实 Host alias，连接地址、用户、端口、密钥和代理配置均已脱敏。
- 推送到 `main` 后由 GitHub Actions 自动发布到 GitHub Pages。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 <http://localhost:4173>。
