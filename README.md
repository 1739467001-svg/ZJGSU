# 🦐 会议室预约虾 · 数字孪生 / Meeting-Room Digital Twin

> 浙江工商大学 · 信电人工智能学院
> 把「会议室预约虾」从二维热力图，升级为可漫游的 **三维现实模拟 (Reality-Twin)**。
> 先做好**现实模拟**，再接入实时数据完成**数字孪生**。

一个用 **React + Three.js (React Three Fiber)** 构建的、可一键部署到 Vercel 的三维会议室
预约可视化系统。宏观可俯瞰整栋楼六间会议室的实时占用，点击任意房间即可「推镜进入」，
看到桌椅、投影、白板、空调、采光窗俱全的立体会议室，并直接在三维场景里完成按时段预约。

---

## ✨ 已实现的能力 (Phase 1 · 现实模拟)

| 模块 | 说明 |
| --- | --- |
| 🏢 **楼层总览** | 3F / 5F 两层楼板悬浮堆叠，317 / 318 / 330 / 513 / 529 / 534 六间房以玻璃体块呈现，按当前时段**绿=空闲 / 红=占用 / 蓝=我的**实时上色，并发光描边 |
| 🪧 **悬浮 HUD 牌** | 每间房顶部漂浮信息牌：房号、楼层、容量、全天占用比，以及一条 10 格「全天迷你热力条」（直接对应原系统热力图） |
| 🎥 **推镜进房** | 点击房间，摄像机平滑飞入该房间的精细三维内景（`camera-controls` 缓动 + 切场闪屏过渡） |
| 🪑 **立体内景** | 会议桌 + 环桌座椅（数量随容量变化）、吊装投影 + 投影光锥、投影幕 / 电视 / 白板、壁挂空调、房门、采光窗、吊顶灯带、镜面反射地面、全息状态环 |
| 🧑‍🤝‍🧑 **占用可视化** | 时段被占用时座位上出现「人」并亮起红色全息状态牌（显示预约人）；空闲时为绿色「可预约」；本人预约为蓝色 |
| 🕐 **时间轴** | 底部时间轴可拖动 / 步进 / **自动播放**，整栋楼随时间「亮起又熄灭」——数字孪生的时间维度 |
| 🗓️ **三维内预约** | 右侧面板按时段一键**预约 / 取消**，3D 场景即时联动（与原系统「整间·按时段」预约口径一致） |
| 📊 **指挥中心 HUD** | 顶部实时时钟、今日预约数、当前占用 X/6、整体利用率，沿用「会议室预约虾 AI 指挥中心」的深色科技风 |

数据为**确定性 mock**（每次刷新一致），完整复刻线上 6 间房 × 10 个时段的结构与命名
（黎美杉、吴静文、高明…，当前登录人 **平力俊**）。

## 🛣️ 路线图 (Phase 2 · 孪生)

现实模拟已就绪，接入真实数据只需替换一处数据源——3D 层无需任何改动：

- `src/data/source.ts` 中已预留 `fetchLiveBookings(date)`，对接现有 **Flask v2 API**
  （`X-API-Key` 鉴权，参见技术路线图）。把 `getInitialBookings()` 换成它即可让孪生「活」起来。
- 后续可叠加：钉钉身份直通、座位级（个人座位）孪生、设备 IoT 状态、人流热力、历史回放等。

---

## 🚀 本地运行

```bash
npm install
npm run dev        # http://localhost:5173
```

构建与预览：

```bash
npm run build      # 类型检查 + 生产构建到 dist/
npm run preview    # 本地预览 dist
```

## ☁️ 部署到 Vercel

仓库已含 `vercel.json`，开箱即用：

1. 在 Vercel 导入本仓库（Framework 会自动识别为 **Vite**）。
2. Build Command `vite build`，Output `dist`（已在 `vercel.json` 配置）。
3. Deploy 完成即得到一个可分享的演示链接。

> 接入真实数据时，在 Vercel 项目环境变量里配置 `VITE_API_BASE` 与 `VITE_API_KEY`
> （见 `.env.example`），再启用 `fetchLiveBookings`。

---

## 🧩 技术栈

- **React 18** + **TypeScript** + **Vite 5**
- **three** · **@react-three/fiber** · **@react-three/drei** · **@react-three/postprocessing**（Bloom 辉光）
- **zustand**（状态）· **framer-motion**（界面动效）· **tailwindcss**（样式）· **lucide-react**（图标）

## 📁 目录结构

```
src/
├─ data/        # 房间、时段、mock 预约、数据源 seam (source.ts)
├─ store/       # zustand 全局状态（视图、选中房间、时间轴、预约）
├─ lib/         # 纯函数：状态判定、配色、利用率
├─ three/       # 三维：Scene / Building(总览) / RoomBlock / RoomInterior(内景)
│               #       Furniture(家具) / CameraRig(运镜) / Effects(后处理)
└─ ui/          # 覆盖层：TopBar / Sidebar / DetailPanel / TimeScrubber / Loading
```

## 🎮 操作

- **拖拽**旋转视角，**滚轮**缩放
- **点击房间**（或左侧列表）进入三维内景
- 右侧面板**预约 / 取消**时段；点击时段可在 3D 中预览该时刻
- 底部**时间轴**拖动或▶播放，观察全天占用变化
- **Esc** 返回总览

---

数据与房间信息为演示用途的现实模拟，最终以学院线上系统为准。
