# 依賴安全修補

## 2026-10-30

- `shadcn` 升級至 ^4.23.0。
- 更新間接依賴的 override 下限：`fast-uri` 4.2.3、`@hono/node-server` 2.1.3、`qs` 6.16.1、`ip-address` 10.7.4，修正 10-25 留下的 moderate / low 公告。
- `deepmerge` 4.3.1（GHSA-gcqx-w48m-w2h4，low）尚無官方修補版本，列入 allowlist，見下方說明。
- `pnpm audit` 僅剩已列入 allowlist 的公告。

## 2026-10-25

- `zod` high 公告（GHSA-mrhx-c7xc-m3w5，影響 `<4.6.6`）：直接依賴升級至 `^4.6.6`（解析為 4.6.7）；`shadcn` 由 4.7.0 升級至 `^4.22.1`，改用 `zod ^4.2.0`，移除 zod 3.25.76。
- `shadcn → @modelcontextprotocol/sdk → express → body-parser` 的 high 公告（GHSA-27r3-jxmh-p828）：override 改為 `body-parser@>=2.0.0 <2.4.0: '>=2.4.0'`，解析為 2.4.0。
- `jsdom → undici` 的 high 公告（GHSA-xjj6-f33q-929c）與兩項 moderate 公告：override 改為 `undici@>=7.0.0 <7.30.1: 7.30.1`。
- `browserslist` override 由固定 `4.28.7` 改為 `'>=4.28.7'`，避免與 shadcn 4.22.1 要求的 `^4.29.3` 衝突。
- 剩餘 `ip-address`、`fast-uri` 的 moderate / low 公告不影響 CI 的 high 門檻。

## 2026-10-22

- CI 的 `pnpm audit --prod --audit-level high` 因 `shadcn → @modelcontextprotocol/sdk` 1.31.0 的 high 公告（GHSA-22jm-h49p-29qw、GHSA-46jr-4wx8-v453）失敗；override 改為 `'@modelcontextprotocol/sdk@<1.32.0': '>=1.32.0'`，解析為 1.32.1。
- `prisma → @prisma/dev → hono` 的 moderate 公告（GHSA-5r4p-p66f-jhc7）：override 改為 `hono@<4.13.11: 4.13.11`。
- Storybook 全系列套件與 `eslint-plugin-storybook` 升級至 10.6.3，修正 critical 公告 GHSA-f2ph-cmg5-wxc8。
- `vite` 升級至 ^8.1.6（解析為 8.3.5），修正 GHSA-587h-7wmj-h5pm 等 5 項公告。
- Vitest 套件同步升級至 4.1.12，帶入 `@vitest/mocker` 4.1.12，修正 GHSA-qxg6-89mg-rqv8、GHSA-xp26-3454-mjgp。
- 14 項安全警示全數修正；`pnpm audit` 僅剩已列入 allowlist 的 `braces` 公告。

## 2026-10-15

- Next.js 與 `eslint-config-next` 升級至 16.4.1，Vitest 套件同步升級至 4.1.11。
- 間接依賴的安全版本限制統一維護於 `pnpm-workspace.yaml`，避免與 `package.json` 的重複設定互相覆蓋。
- 56 項安全警示透過依賴更新修正；剩餘的 `braces` 公告依專案決定列入 allowlist。

## deepmerge 4.3.1：GHSA-gcqx-w48m-w2h4

[官方安全公告](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) 列出 `mergeObject()` 回傳物件可被 prototype poisoning 的問題（low），目前尚無官方修補版本。

依賴來源為 `shadcn → deepmerge`，只在執行 shadcn CLI 新增元件時使用，應用程式執行期間不會載入。

此項目列入 `pnpm-workspace.yaml` 的 `auditConfig.ignoreGhsas`，不表示漏洞已修復。待官方發布修補版本，或 shadcn 改用其他套件後，應移除此 allowlist 項目。

## braces 3.0.3：CVE-2026-93687

[官方安全公告](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) 列出深層巢狀輸入造成堆疊耗盡的問題，目前尚無官方修補版本。

依賴來源為開發工具：`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`。

本專案使用上游原版套件，不維護自訂補丁。以下設定位於 `pnpm-workspace.yaml`，相容於 CI 使用的 pnpm 10.29.3：

```yaml
auditConfig:
  ignoreGhsas:
    - GHSA-vfj7-8cjw-p6xm
```

此 allowlist 僅接受 `GHSA-vfj7-8cjw-p6xm`（CVE-2026-93687），不表示漏洞已修復。深層巢狀 glob 輸入仍有造成工具程序堆疊耗盡的風險；目前接受此開發工具依賴的風險，等待官方修補。

CI 的 `pnpm audit --prod --audit-level high` 會自動讀取這份設定，其他未列入 allowlist 的 high / critical 公告仍會阻擋部署。一般 `pnpm audit` 也會套用同一份 allowlist。

待官方修補版本發布後，應更新依賴並移除此 allowlist 項目。

驗證指令：

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm audit
pnpm audit --prod --audit-level high
pnpm tsc
pnpm lint
pnpm test:unit
pnpm build
```
