# CLAUDE.md

## デザインシステム

フロントエンドのスタイルは Lutica Design System に従う。正本は Artifact として公開されている。

- 正本: https://claude.ai/artifact/DwArjsh98Mu3CJDUkhzZuu
- リポジトリ内のコピー: `packages/frontend/src/design-system/`
  - `tokens.css`: 自動生成。手で編集しない
  - `bundle.css`: コンポーネントの CSS（`lu-*` クラス）

### デザインシステム側のCSSを直すとき

`bundle.css` を直したら、Artifact の `project/components/bundle.css` にも同じ修正を反映する。反映するときは次も行う。

- `project/design-system.json` の `lastChange` を更新する（`by` はユーザー名、`via` は `Claude Code`、`note` に変更内容）
- 公開前に Artifact を `read` で読み直す（誰かが先に更新していると公開が拒否される）
