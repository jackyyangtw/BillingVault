# 依賴安全修補

## 2026-10-15

- Next.js 與 `eslint-config-next` 升級至 16.4.1，Vitest 套件同步升級至 4.1.11。
- 間接依賴的安全版本限制統一維護於 `pnpm-workspace.yaml`，避免與 `package.json` 的重複設定互相覆蓋。
- 56 項安全警示透過依賴更新修正；剩餘的 `braces` 公告依專案決定列入 allowlist。

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
