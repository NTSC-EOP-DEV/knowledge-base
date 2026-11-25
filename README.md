# 知识库 · Knowledge Base

收集整理的文章、演讲稿与科普长页。每篇尽量提供两种形态：**网页版**（排版完整，适合通读）与 **Markdown**（保留原文结构，便于引用与检索）。

- 在线阅读（GitHub Pages）：<https://ntsc-eop-dev.github.io/knowledge-base/>
- 网页版阅读器：进入上面的地址后，点击任意条目的「网页版」或「Markdown」即可。

## 目录

| 分类 | 文档 | 阅读 |
| --- | --- | --- |
| 物理 | 李政道《物理的挑战》（2001·北京人民大会堂） | [Markdown](docs/physics/李政道-物理的挑战.md) · [网页长页](https://ntsc-eop-dev.github.io/knowledge-base/docs/physics/%E6%9D%8E%E6%94%BF%E9%81%93-%E7%89%A9%E7%90%86%E7%9A%84%E6%8C%91%E6%88%98.html) |

> 在 GitHub 页面直接点击 `.md` 链接会由 GitHub 原生渲染；`.html` 链接指向 Pages 上的成品页面，需仓库已开启 Pages。

## 仓库结构

```
.
├── index.html                 # 目录首页（自动读取文件树生成列表 + 搜索）
├── viewer.html                # Markdown 阅读器（?doc=docs/分类/标题.md）
├── assets/
│   ├── base.css               # 公共样式
│   └── catalog.js             # 目录生成逻辑（GitHub API + 本地缓存 + 内置兜底）
├── docs/
│   └── physics/
│       ├── 李政道-物理的挑战.md
│       └── 李政道-物理的挑战.html
├── .github/workflows/pages.yml # 推送到 main 后自动部署 Pages
└── .nojekyll                   # 关闭 Jekyll，确保静态资源原样发布
```

## 新增文章

1. 在 `docs/<分类>/` 下放入 `标题.md`（必需）与 `标题.html`（可选，网页排版版）。
2. 推送到 `main`。目录首页会通过 GitHub 文件树自动收录，无需改代码。
3. 若分类是新的英文目录名，可在 `assets/catalog.js` 的 `CAT_NAMES` 中补一条中文显示名（否则直接显示目录名）。

## 说明

- 目录首页在无法访问 GitHub API 时会使用内置索引兜底，仅显示已有条目。
- 配图、史实与引用均以原文标注为准；如有版权问题请提 Issue。
