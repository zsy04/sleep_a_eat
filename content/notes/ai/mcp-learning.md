---
title: "MCP 学习笔记：模型上下文协议"
date: "2026-08-16"
tags: ["AI", "MCP", "协议"]
minutes: 30
---

# MCP 学习笔记

> 学习开始日期：2026-07-31
> 学习主题：Model Context Protocol（模型上下文协议）
> 参考文档：[MCP 官方文档](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)
> 说明：本文档记录学习过程中所有对话与纠正，每次对话后即时更新。

---

## 目录

- [一、MCP 是什么](#一mcp-是什么)
- [二、第一轮：基本认识的纠正](#二第一轮基本认识的纠正)
- [三、第二轮：四个角色定义的纠正](#三第二轮四个角色定义的纠正)
- [四、术语发音表](#四术语发音表)
- [五、第三轮：角色职责再澄清](#五第三轮角色职责再澄清)
- [六、第四轮：传输层概念澄清](#六第四轮传输层概念澄清)
- [七、第五轮：Client 的工作机制详解](#七第五轮client-的工作机制详解)
- [七（续）：Client 身份的再澄清](#七续client-身份的再澄清)
- [八、Server 的三类原语（Tools/Resources/Prompts）](#八server-的三类原语toolsresourcesprompts)
- [九、客户端原语：Elicitation](#九客户端原语elicitation)
- [十、发现机制与无状态协议](#十发现机制与无状态协议)
- [十一、传输层详解（重学版）](#十一传输层详解重学版)
- [十二、MRTR（Multi Round-Trip Requests）模式](#十二mrtr-multi-round-trip-requests-模式)
- [十三、OAuth 2.1 授权流程](#十三oauth-21-授权流程)
- [十四、MCP Inspector 调试工具](#十四mcp-inspector-调试工具)
- [十五、关键要点总结](#十五关键要点总结)
- [十六、待学习内容](#十六待学习内容)
- [十七、参考链接](#十七参考链接)

---

## 一、MCP 是什么

**MCP（Model Context Protocol，模型上下文协议）** 是一个开源标准，用于将 AI 应用连接到外部系统。

- **类比**：MCP 是 "AI 应用的 USB-C 接口"
- **作用**：让 AI 应用（如 Claude、ChatGPT）能标准化地连接数据源、工具和工作流
- **核心价值**：
  - 开发者：减少集成成本与复杂度
  - AI 应用：获得生态能力，提升用户体验
  - 终端用户：得到更强大的 AI 助手

### 能做什么（示例）
- Agent 访问 Google Calendar 和 Notion
- Claude Code 根据 Figma 设计生成完整 Web 应用
- 企业聊天机器人连接多个数据库
- AI 模型在 Blender 中创建 3D 设计并打印

---

## 二、第一轮：基本认识的纠正

### 我当时的表述
> MCP 可以让大模型去调用其他服务商的服务。比如通过高德地图的 MCP，让高德调用高德的工具，让 AI 生成更精美的图像。

### 被指出的两处偏差

#### 偏差 1：角色链路表述混乱
- ❌ "让高德来去调用高德的工具"
- ✅ 正确链路：`用户 → Host(AI应用) → MCP Client → MCP Server(高德提供) → 高德的工具/API`
- **关键**：是 **AI 模型决定调用哪个工具**，而不是高德主动调用；MCP 只是协议标准，高德需按此协议实现 Server

#### 偏差 2：例子选错
- ❌ 高德是地图服务，不涉及"生成精美图像"
- ✅ 高德的工具应该是地图相关能力：地理编码、路径规划、POI 搜索、天气查询
- 图像生成是另一类 MCP Server（如 DALL-E、Stable Diffusion）

---

## 三、第二轮：四个角色定义的纠正

### 我当时的表述
| 角色 | 我当时的理解 |
|---|---|
| Host | 模型输出的内容 |
| Client | 用户操作的客户端（误称为 "select"） |
| Server | 服务商 |
| Model | 调用工具、对工具形成描述、转化为规范语言 |

### 正确的角色定义

| 角色 | 正确含义 |
|---|---|
| **Host** | AI 应用程序本身，如 Claude Desktop、VS Code、Cursor。是用户直接交互的软件，内部管理多个 Client |
| **Client** | Host **内部**的协议层组件，每个 Client 维护与一个 Server 的连接。用户感知不到它 |
| **Server** | 按 MCP 协议实现的**程序**，由服务商（如高德）开发提供，暴露 tools/resources/prompts |
| **Model** | 大语言模型本身（如 Claude）。负责理解用户意图、决定调用哪个工具、整合工具结果 |

### 关键纠正点

1. **Host ≠ 输出的内容**
   - Host 是你打开的软件（如 Claude Desktop 窗口）
   - 职责：接收用户输入、协调 Client 和 Model、显示回复

2. **Client ≠ 用户操作的客户端**
   - Client 是 Host 软件内部的一个对象
   - 例：VS Code 同时连 3 个 MCP Server，内部就有 3 个 Client 实例，每个对应一个 Server
   - Client 与 Server 是**一对一连接**关系

3. **Server ≠ 服务商**
   - Server 是协议角色（程序），服务商是开发这个程序的实体
   - Server 暴露三类原语：tools / resources / prompts

4. **Model 不"描述工具"**
   - 工具描述（name、description、inputSchema）是 Server 在 `tools/list` 时提供的
   - Model 是**消费者**：读工具描述 → 决定调哪个 → 传参数 → 接收结果 → 组织成自然语言

### 正确的调用流程

以"帮我规划从北京天安门到故宫的步行路线，并告诉我沿途有什么好吃的餐厅"为例（假设已连接高德 MCP Server）：

```
1. 用户在 Host(Claude Desktop) 输入消息
        ↓
2. Host 把消息 + 可用工具列表(从 Client 拿) 发给 Model
        ↓
3. Model 理解意图，决定调用「路径规划」工具
   返回结构化工具调用请求:
   {tool:"route", args:{from:"天安门", to:"故宫", mode:"walk"}}
        ↓
4. Host 通过 Client 把请求发给 Server(高德 MCP Server)
        ↓
5. Server 执行高德 API，返回路线数据
        ↓
6. Host 把结果发回给 Model
        ↓
7. Model 可能再次调用「POI搜索」工具找餐厅（重复 3-6）
        ↓
8. Model 整合所有结果，生成自然语言回复
        ↓
9. Host 把回复显示给用户
```

### 直观类比：餐厅点餐系统

| MCP 角色 | 餐厅类比 | 说明 |
|---|---|---|
| **Host** | 餐厅整体运营系统 | 接单、调度（用户接触的入口） |
| **Client** | 服务员 | 传话给后厨（一对一） |
| **Server** | 后厨 | 高德、GitHub 等具体执行方 |
| **Model** | 主厨 | 决定用哪些食材、怎么做 |
| **工具** | 菜谱里的具体菜品 | Server 暴露的能力 |

**要点**：用户不直接跟服务员或后厨对话，而是通过 Host 下单，主厨决定调用哪些菜品，服务员传话给后厨执行。

---

## 四、术语发音表

之前对英文术语有误听（如 "stay/seeyou/Sylvia/silver"），这里统一标注发音：

| 英文 | 音标 | 中文拟音 | 说明 |
|---|---|---|---|
| **Host** | /hoʊst/ | **厚斯特** | 重音在前 |
| **Client** | /ˈklaɪənt/ | **克莱恩特** | 重音在"克莱" |
| **Server** | /ˈsɜːrvər/ | **瑟维尔** | 重音在"瑟" |
| **Model** | /ˈmɒdl/ | **莫德尔** | 重音在"莫" |
| **stdio** | /ˌstændɑːrd aɪ ˈoʊ/ | **斯坦达德-艾-欧** | 是 standard I/O 的缩写 |
| **Streamable HTTP** | /ˈstriːməbl eɪtʃ-tiː-tiː-piː/ | **斯垂莫波-艾奇-提-提-皮** | |

> 之前听到的"stay/seeyou/Sylvia/silver"其实都是 **Server**（瑟维尔）和 **stdio**（斯坦达德）的误听。

---

## 五、第三轮：角色职责再澄清

### 我当时的表述
> Host 实际上是整个 agent 的主体，它包括大模型、工具。Client 是将 host 和 server 连接起来，转化成相同的通讯协议。Host 本质上是 AI 应用工具，就是 Agent，封装了 model。stdio 是传输结构，与 SSM、SSE 有很大不同。

### ✅ 理解对的部分
- **Model 负责规范化输出工具调用请求** ✓
- **Client 是 Host 和 Server 之间的桥梁** ✓
- **Host 是 AI 应用工具，封装了 Model，类似 LangChain 中 Agent 的运行框架** ✓

### ⚠️ 需要澄清的 3 处

#### 澄清 1：Client 不是"协议转化层"
- ❌ "将它们转化成相同的通讯协议"
- ✅ Client 和 Server 之间**本来就用同一种协议**（MCP，基于 JSON-RPC 2.0）
- Client 只做两件事：**维护连接** + **转发请求/响应**，不"转化"协议
- 类比：Client 像快递员，原样送达包裹，不修改内容

#### 澄清 2：Host ≠ Agent（区分容器与内容）

| 概念 | 角色 | 关系 |
|---|---|---|
| **Host** | 容器/运行环境 | Claude Desktop 这个软件 |
| **Agent** | 容器里的"智能体" | 基于 Model 构建的决策逻辑 |
| **Model** | Agent 的大脑 | LLM 本身（如 Claude） |

类比：Host 是"汽车"，Agent 是"司机"，Model 是"司机的大脑"。Host 提供"运行的能力"，Agent 在 Host 里"做决策"。

#### 澄清 3：传输层只有两种（"SSM/SSE"是误读）

**MCP 只有两种传输层**（参考 [architecture#transport-layer](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture#transport-layer)）：

| 传输层 | 中文拟音 | 用途 | 特点 |
|---|---|---|---|
| **stdio** | 斯坦达德-艾-欧 | 本地服务器 | 进程间通信，无网络开销，单机 |
| **Streamable HTTP** | 斯垂莫波-艾奇-提-提-皮 | 远程服务器 | HTTP POST + 可选 SSE 流式推送 |

**关于 SSE 的关键澄清**：
- **SSE（Server-Sent Events）不是独立的第三种传输层**
- SSE 是 **Streamable HTTP 内部使用的一种技术**——服务端用它向客户端流式推送消息
- "SSM" 是 SSE 的误听

### Host 与工具的关系（重要纠正）

- ❌ Host "包括工具"
- ✅ Host **不"包括"工具**。Host 是 AI 应用软件，它**包含** Model 的调用能力，但工具是 **Server 暴露**的，Host 通过 Client **连接**到 Server 才能用工具

```
┌─────────── Host (Claude Desktop) ───────────┐
│                                              │
│    Model (LLM)    Client A    Client B       │
│                     │            │           │
└─────────────────────┼────────────┼───────────┘
                      ↓            ↓
              Server A(高德)   Server B(GitHub)
              [工具/资源/提示]  [工具/资源/提示]
```

### 四个角色的"职责清单"

| 角色 | 做什么 | 不做什么 |
|---|---|---|
| **Host** | 接收用户输入、协调 Model 和 Client、显示回复 | 不直接执行工具、不生成工具调用请求 |
| **Client** | 维护与一个 Server 的连接、转发请求/响应 | 不描述工具、不执行工具、不对用户可见 |
| **Server** | 暴露 tools/resources/prompts、执行工具、返回结果 | 不决定调哪个工具（Model 决定） |
| **Model** | 理解意图、决定调哪个工具、生成结构化调用请求、整合结果 | 不直接执行工具、不接触 Server |

---

## 六、第四轮：传输层概念澄清

### 两种传输层对比

| 维度 | stdio | Streamable HTTP |
|---|---|---|
| 位置 | 本地同一台机器 | 远程，跨网络 |
| 通信方式 | 标准输入/输出流 | HTTP POST + 可选 SSE |
| 性能 | 最优（无网络开销） | 有网络延迟 |
| 适用场景 | 单用户、本地工具 | 多用户、云端服务 |
| 认证 | 不需要（本地进程） | 需要 OAuth/API Key |
| 服务对象 | 通常服务单个 Client | 通常服务多个 Client |

### 完整结构图

```
┌─── stdio 传输层（本地）─────────┐    ┌─── Streamable HTTP 传输层（远程）──────────┐
│                                  │    │                                             │
│  Host ↔ Client ←stdio→ Server    │    │  Host ↔ Client ←HTTP POST→ Server          │
│         (同一台机器)              │    │         (可选 SSE 做服务端→客户端流式)        │
│                                  │    │                                             │
│  例: Claude Desktop + 文件服务器  │    │  例: Claude + 高德远程 MCP Server            │
└──────────────────────────────────┘    └─────────────────────────────────────────────┘
```

### MCP 协议分层

MCP 分为两层（参考 [architecture#layers](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture#layers)）：

- **数据层（Data Layer）**：基于 JSON-RPC 2.0 的协议，定义消息结构与语义
  - Discovery：客户端查询服务器支持的协议版本、能力、身份（`server/discover`）
  - 服务端原语：tools / resources / prompts
  - 客户端原语：Elicitation（Roots 和 Sampling 已废弃）
  - 工具类功能：通知、进度跟踪

- **传输层（Transport Layer）**：管理通信通道与认证
  - stdio：本地进程间通信
  - Streamable HTTP：远程通信，支持 OAuth 等认证

---

## 七、第五轮：Client 的工作机制详解

### 我的疑问
> Client 到底是做什么的？只说它是 Host 跟 Server 之间的传输过程太抽象了，它如何完成这些传输？

### Client 的本质

**Client 不是独立进程，是 Host 内部的一个对象**。它由 Host 用 MCP SDK 创建，活在 Host 的代码里。

参考 [build-client](https://modelcontextprotocol.io/docs/2026-07-28/develop/build-client) 文档的 Python 示例：

```python
from mcp import Client, StdioServerParameters
from mcp.client.stdio import stdio_client

# Host 内部创建 Client 的代码
async with Client(stdio_client(server_params(...))) as client:
    # client 就是 Client 对象，活在 Host 进程里
    tool_list = await client.list_tools()           # 调用方法 → 转成 JSON-RPC 发给 Server
    result = await client.call_tool("route", args)  # 同上
```

### Client 完成传输的三步

#### 第 1 步：建立连接（两种模式不同）

**stdio 模式（本地）**：
```python
# 1. 配置：描述要启动哪个 Server 子进程
params = StdioServerParameters(
    command="python",
    args=["weather.py"]
)

# 2. 创建传输通道（管道）
transport = stdio_client(params)  # 这一步会启动 Server 子进程，
                                  # 并建立 stdin/stdout 管道

# 3. Client 打开传输，建立连接
async with Client(transport) as client:
    ...
```

**Streamable HTTP 模式（远程）**：
```python
# 直接连到远程 URL，不启动子进程
async with Client(http_client("https://高德.com/mcp")) as client:
    ...
```

#### 第 2 步：把方法调用翻译成 JSON-RPC 消息

当你调用 `client.list_tools()` 时，Client 内部做的事：

```
你写的代码:  await client.list_tools()
                    ↓
Client 翻译成 JSON-RPC 2.0 消息:
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",       ← 方法名
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {"name": "...", "version": "..."}
    }
  }
}
                    ↓
通过传输层发出去（stdio 写入管道 / HTTP POST）
```

#### 第 3 步：接收响应并解析

Server 返回的也是 JSON-RPC：
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {"name": "route", "description": "...", "inputSchema": {...}}
    ]
  }
}
```

Client 接收后，把它解析成 Python 对象返回给你：
```python
tool_list = await client.list_tools()
# tool_list.tools[0].name == "route"
# tool_list.tools[0].input_schema == {...}
```

### 完整的工作流程图

```
┌─────────────── Host 进程 ───────────────┐
│                                          │
│  你的代码（Host 逻辑）                    │
│      ↓ 调用                              │
│  ┌─────────────┐                         │
│  │ Client 对象  │ ← 活在 Host 内部         │
│  └─────────────┘                         │
│         │                                │
│         │ 1.把方法调用翻译成 JSON-RPC      │
│         ↓                                │
│  ┌─────────────┐                         │
│  │  传输层通道   │                         │
│  └─────────────┘                         │
└─────────┼────────────────────────────────┘
          │
          │ 2.通过管道/HTTP 发送 JSON-RPC 消息
          │
          ↓ (stdio: 写 stdin)  /  (HTTP: POST 请求)
┌─────────────────────────────────────────┐
│  Server 进程（可能是子进程，也可能是远程）  │
│  接收 JSON-RPC → 执行工具 → 返回 JSON-RPC │
└─────────────────────────────────────────┘
          ↑
          │ 3.返回响应（JSON-RPC）
          │
┌─────────┴────────────────────────────────┐
│  Client 接收 → 解析成对象 → 返回给你的代码  │
└──────────────────────────────────────────┘
```

### Client 提供的方法（对应 JSON-RPC）

| Client 方法 | 对应的 JSON-RPC method | 用途 |
|---|---|---|
| `list_tools()` | `tools/list` | 列出 Server 暴露的所有工具 |
| `call_tool(name, args)` | `tools/call` | 调用某个工具 |
| `list_resources()` | `resources/list` | 列出资源 |
| `read_resource(uri)` | `resources/read` | 读取某个资源 |
| `list_prompts()` | `prompts/list` | 列出提示模板 |
| `get_prompt(name, args)` | `prompts/get` | 获取某个提示 |

### stdio 模式下 Client 的"隐藏职责"

在 stdio 模式下，Client 还要做一件额外的事：**启动并管理 Server 子进程的生命周期**。

```python
async with Client(transport) as client:
    # 进入 with 块：启动 Server 子进程，建立管道，协商协议版本
    ...
    # 离开 with 块：自动关闭管道，杀死 Server 子进程
```

所以 stdio 模式下，Client 实际上管两件事：
1. **进程管理**：启动/关闭 Server 子进程
2. **消息转发**：JSON-RPC 的翻译与传输

### 一句话总结

> **Client = Host 内部的"翻译官 + 传话员"**
> - 翻译官：把 Python/TS 方法调用翻译成 JSON-RPC 消息，把响应解析回对象
> - 传话员：通过 stdio 管道或 HTTP 把消息送到 Server
> - （stdio 模式下还兼任"保姆"：启动和关闭 Server 子进程）

---

## 七（续）：Client 身份的再澄清

### 我的理解偏差
> Client 相当于一个工厂，将 Host 逻辑传输过来后进行实例化，然后通过传输通道异步接收。

### 纠正：Client 不是"工厂"，是"代理对象"

| 错误理解 | 正确理解 |
|---|---|
| Client 是工厂 | Client 是**被创建的代理对象**，`stdio_client()` 才是"工厂" |
| Host 逻辑传给 Client 实例化 | Host 代码**直接创建** Client，然后**通过** Client 与 Server 通信 |

### 遥控器比喻

| 角色 | 比喻 | 说明 |
|---|---|---|
| **Host 代码（你）** | 拿遥控器的人 | 你想做什么 |
| **Client 对象** | 遥控器 | 你按按钮，它发信号 |
| **传输通道** | 红外线/蓝牙 | 信号载体 |
| **Server** | 电视/空调 | 接收信号并执行 |
| **方法调用**（如 `list_tools()`） | 按某个按钮 | 触发动作 |
| **JSON-RPC 消息** | 按钮转成的红外信号 | 实际传输的内容 |

**关键**：遥控器（Client）不是"工厂"，它是你手里的工具。你按按钮（调用方法），它把按钮信号翻译成红外信号（JSON-RPC），通过红外线（传输通道）发给电视（Server）。

### 完整的对象创建与使用流程

```python
# === 第 1 阶段：创建 Client 对象（"实例化"在这里）===

# 1.1 配置 Server 参数（描述要连哪个 Server）
params = StdioServerParameters(
    command="python",
    args=["weather.py"]
)

# 1.2 创建传输通道（这才是"工厂"角色，生产管道）
transport = stdio_client(params)

# 1.3 创建 Client 对象（Client 在这里诞生）
async with Client(transport) as client:
    # ↑ client 就是 Client 对象，像遥控器一样拿在手里

    # === 第 2 阶段：使用 Client 对象（按遥控器）===

    # 按按钮 1：列出工具
    tools = await client.list_tools()
    # Client 内部：把 list_tools() 翻译成 JSON-RPC → 通过 transport 发出去
    #            → 接收 Server 响应 → 解析成 Python 对象返回

    # 按按钮 2：调用工具
    result = await client.call_tool("get_forecast", {"lat": 39.9, "lon": 116.4})
    # 同样的流程：翻译 → 发送 → 接收 → 解析 → 返回

# === 第 3 阶段：销毁（离开 async with 块）===
# Client 自动关闭连接，stdio 模式下还会关闭 Server 子进程
```

### 对象创建关系澄清

```
stdio_client()  ← 工厂：生产传输通道（管道）
     ↓
Client(transport)  ← 构造函数：创建 Client 代理对象
     ↓
client.list_tools()  ← 你通过这个代理对象调用方法
```

### 最终确认：Client 对象的内部组成

```python
client = Client(transport)
#        ↑       ↑
#    代理对象   持有传输通道的引用
#
# client 对象内部其实有：
# ┌─────────────────────────────┐
# │  Client 对象                │
# │  ┌───────────────────────┐  │
# │  │ 1. 翻译逻辑            │  │ ← 把方法调用转成 JSON-RPC
# │  │ 2. transport 引用      │  │ ← 持有传输通道（管道/HTTP）
# │  │ 3. 生命周期状态        │  │ ← 连接是否打开、协议版本等
# │  │ 4. 方法（list_tools 等）│  │ ← 你能调用的按钮
# │  └───────────────────────┘  │
# └─────────────────────────────┘
```

> **最终结论**：Client = 一个已实例化的代理对象，内部持有传输通道引用，负责把方法调用翻译成 JSON-RPC 并通过通道收发。

---

## 八、Server 的三类原语（Tools/Resources/Prompts）

### 核心差异：控制权不同

三类原语最关键的区别是 **"谁决定使用它"**：

| 原语 | 中文 | 谁控制 | 本质 | 类比 |
|---|---|---|---|---|
| **Tools** | 工具 | **Model（模型）** | 可执行的函数 | 厨师的厨具 |
| **Resources** | 资源 | **Application（应用/Host）** | 只读数据源 | 食材库 |
| **Prompts** | 提示 | **User（用户）** | 指令模板 | 菜谱 |

**核心认知**：
- Tools 是 **Model 自己决定** 何时调用
- Resources 是 **Host 应用自己决定** 如何取用
- Prompts 是 **用户主动选择** 调用

### Tools（工具）详解

**特点**：可执行的函数，有副作用（能改数据库、发邮件、调 API）；用 JSON Schema 定义输入参数；Model 根据上下文自动决定调用。

**协议方法**：
| 方法 | 用途 |
|---|---|
| `tools/list` | 列出所有可用工具 |
| `tools/call` | 执行某个工具 |

**工具定义示例**：
```json
{
  "name": "searchFlights",
  "description": "Search for available flights",
  "inputSchema": {
    "type": "object",
    "properties": {
      "origin": {"type": "string", "description": "Departure city"},
      "destination": {"type": "string", "description": "Arrival city"},
      "date": {"type": "string", "format": "date"}
    },
    "required": ["origin", "destination", "date"]
  }
}
```

**用户监督机制**：虽然 Model 决定调用，但 Host 可实现审批对话框、预批准、活动日志等。

### Resources（资源）详解

**特点**：只读数据源，无副作用；每个资源有唯一 URI + MIME 类型；Host 应用决定如何使用。

**协议方法**：
| 方法 | 用途 |
|---|---|
| `resources/list` | 列出直接资源 |
| `resources/templates/list` | 发现资源模板 |
| `resources/read` | 读取资源内容 |
| `subscriptions/listen` | 监听资源变化 |

**两种资源模式**：
1. **Direct Resources（直接资源）** — 固定 URI
   - `calendar://events/2024`
   - `file:///Documents/passport.pdf`
2. **Resource Templates（资源模板）** — 带参数的动态 URI
   - `weather://forecast/{city}/{date}`
   - 支持参数补全（输入"Par" → 提示"Paris"）

**Host 如何使用**：直接塞给 Model / 用 embedding 检索 / 关键词搜索 / 让用户选择。

### Prompts（提示）详解

**特点**：预定义的参数化指令模板；用户主动调用（不会自动触发）；可引用 tools 和 resources 组成完整工作流；支持参数补全。

**协议方法**：
| 方法 | 用途 |
|---|---|
| `prompts/list` | 列出可用提示 |
| `prompts/get` | 获取提示详情 |

**Prompt 定义示例**：
```json
{
  "name": "plan-vacation",
  "title": "Plan a vacation",
  "arguments": [
    {"name": "destination", "type": "string", "required": true},
    {"name": "duration", "type": "number", "description": "days"},
    {"name": "budget", "type": "number", "required": false}
  ]
}
```

**常见 UI 形式**：斜杠命令（`/plan-vacation`）、命令面板、专用按钮、右键菜单。

### 三者协作的完整示例（旅行规划）

场景：用户想规划巴塞罗那之旅，Host 连接了 3 个 Server（Travel / Weather / Calendar-Email）

```
第 1 步：用户主动触发 Prompt（用户控制）
  用户输入: /plan-vacation
  参数: destination=Barcelona, duration=7, budget=3000
                    ↓
第 2 步：用户/Host 选择 Resources（应用控制）
  - calendar://my-calendar/June-2024  (日历)
  - travel://preferences/europe       (偏好)
  - travel://past-trips/Spain-2023    (历史)
  Host 把这些只读数据塞给 Model 作为上下文
                    ↓
第 3 步：Model 自动决定调用 Tools（模型控制）
  Model 读到资源后,决定:
  - 调 searchFlights() 查航班
  - 调 checkWeather() 查天气
  - 调 bookHotel() 订酒店
  - 调 createCalendarEvent() 加日历
  - 调 sendEmail() 发确认邮件
                    ↓
  Model 整合结果 → Host 显示给用户
```

### 一句话总结

| 原语 | 谁触发 | 做什么 | 类比 |
|---|---|---|---|
| **Tools** | Model 自己 | 执行动作（有副作用） | 厨具——厨师自己用 |
| **Resources** | Host 应用 | 提供只读数据 | 食材库——餐厅管理 |
| **Prompts** | 用户主动 | 提供指令模板 | 菜谱——顾客点菜 |

### 判断练习与纠正

**题目**：待办事项 MCP Server 的三个场景，分别对应哪类原语？
1. 你在输入框打 `/create-todo`，弹出表单让你填标题和截止日期
2. Claude 自动决定调用 `addTodo()` 函数把一件事加入待办
3. Claude Desktop 把你的 `todo://list/today` 数据读取出来作为上下文塞给 Claude

**我的回答与纠正**：
- 场景1：我误答成 Model/Tool → ❌ **正确答案是 Prompt**（用户主动输入斜杠命令触发模板）
- 场景2：我答 Tool → ✅ 正确（Model 自动决定调用）
- 场景3：我答 Resource → ✅ 正确（读取数据作为上下文）

**快速判断口诀**：
| 信号 | 对应原语 |
|---|---|
| 看到"用户输入 `/xxx`"或"用户主动选择" | **Prompt** |
| 看到"Claude/Model 自动决定调用函数" | **Tool** |
| 看到"读取数据作为上下文" | **Resource** |

---

## 九、客户端原语：Elicitation

### 概念澄清：Prompt ≠ "向用户提问"

**曾有的误解**：把 MCP 里的 Prompt（指令模板）当成日常语境的"提示/提问"，认为"所有向用户输出的问题都是 prompt"。

**纠正**：在 MCP 语境里，Prompt 是专有名词，指 **Server 预定义的、用户主动调用的指令模板**。它不是"向用户提问"。

### 三个概念的方向对比

| 概念 | 方向 | 做什么 | 谁主动 |
|---|---|---|---|
| **Prompt** | 用户 → Model | 用户触发模板，给 Model 一套工作指令 | **用户主动** |
| **Elicitation** | Server → 用户 | Server 执行中反过来向用户要信息 | **Server 主动要** |
| **Tool 调用** | Model → Server | Model 决定调用 Server 的函数 | **Model 主动调** |

### MCP 本质再澄清

**曾有的误解**：MCP 本质上是一个工具，放到 LangChain 里边是一个工具。

**纠正**：MCP 是**协议标准**（像 HTTP、USB-C 是标准），不是工具本身。

| 概念 | 是什么 |
|---|---|
| **MCP** | 协议标准 |
| **Tool** | MCP Server 暴露的一类原语 |
| **LangChain 的 Tool** | LangChain 框架里的工具抽象 |

关系：LangChain（作为 Host）通过 MCP Client 连接 MCP Server，把 Server 暴露的 Tools 当作 LangChain 的工具来用。

类比：MCP 是"USB-C 接口标准"，Tool 是"插在 USB-C 上的具体设备（如鼠标）"，LangChain 是"支持 USB-C 的电脑"。

### Elicitation 两种模式

| 模式 | 适用场景 | 示例 |
|---|---|---|
| **form 模式** | 简单结构化数据 | 填写姓名、邮箱、手机号 |
| **URL 模式** | 复杂第三方交互 | OAuth 登录授权 |

### Elicitation 完整流程

```
1. Server 执行中需要信息 → 调用 elicitation/create 发请求
                    ↓
2. Client 转给 Host → Host 弹表单给用户
                    ↓
3. 用户有三种选择:
   ① accept   填写并提交
   ② decline  明确拒绝（点"拒绝"按钮）
   ③ cancel   关闭表单（点 X 或 Esc）
                    ↓
4. Client 把结果返回给 Server
                    ↓
5. Server 根据:
   - accept   → 用用户提供的信息继续执行
   - decline  → 返回"用户拒绝"结果给 Model
   - cancel   → 返回"用户取消"结果给 Model
                ↓
   Model 收到"拒绝/取消"后,可以:
   - 告知用户"信息不足,无法完成"
   - 询问用户是否换其他方式
   - 用默认值继续(如果业务允许)
```

### Elicitation 小结

| 维度 | Elicitation |
|---|---|
| **方向** | Server → Host → 用户 |
| **谁主动** | Server（执行中要信息） |
| **两种模式** | form（简单数据）/ URL（复杂交互如 OAuth） |
| **用户三种响应** | accept / decline / cancel |
| **Server 处理** | 必须优雅处理三种结果，返回结构化响应 |
| **vs Prompt** | Prompt 是用户主动触发模板；Elicitation 是 Server 主动要信息 |
| **vs Tool** | Tool 是 Model 主动调 Server；Elicitation 是 Server 主动问用户 |

---

## 十、发现机制与无状态协议

### 概念澄清：MCP 不包含模型

**曾有的误解**：MCP 里边本身有一个模型，是 Agent to Agent。

**纠正**：MCP 协议**不包含模型**。Model 在 Host 里（如 Claude）。MCP 是 Host ↔ Server 的通信协议，不是 Agent to Agent。

### 谁主动：Client 主动问（server/discover）

Client 连上 Server 后，**主动调用 `server/discover`** 来问 Server 支持哪些能力。Server 不会主动推送。

### 两步发现机制

```
第 1 步：server/discover → 知道 Server 支持哪些原语类别
第 2 步：tools/list / resources/list / prompts/list → 知道具体有哪些工具/资源/提示
```

### server/discover 返回的能力声明

```json
{
  "protocolVersion": "2026-07-28",        // 协议版本
  "serverInfo": {
    "name": "weather-server",
    "version": "1.2.0"
  },
  "capabilities": {
    "tools": {},           // 支持工具（具体列表要再调 tools/list）
    "resources": {},       // 支持资源
    "prompts": {},         // 支持提示
    "elicitation": {},     // 支持反向提问
    "logging": {}          // 支持日志
  },
  "instructions": "本服务器提供天气查询..."  // 给 Model 的使用说明
}
```

### 完整流程

```
Client 调 server/discover
    ↓
Host 拿到能力声明 + 调 tools/list 拿到具体工具
    ↓
Host 把"可用工具列表"塞给 Model
    ↓
Model 根据用户意图判断该调哪个工具
```

### 版本协商与向后兼容

| 情况 | Client 行为 |
|---|---|
| Server 支持的原语 Client 都认识 | 正常使用 |
| Server 有 Client 不认识的新原语 | **忽略**，只用认识的 |
| Server 要求更高协议版本 | 通过 `_meta` 字段协商版本 |

**关键原则**：Client 不能因为遇到新原语就崩溃，要优雅降级——只用自己认识的部分。

### 三个核心概念小结

| 概念 | 说明 |
|---|---|
| **无状态协议** | Server 不记录"上次 Client 问了啥"，每次请求独立 |
| **`server/discover`** | Client 主动问 Server 的能力声明 |
| **版本协商** | 通过 `_meta` 字段协商，新原语被旧 Client 忽略 |

---

## 十一、传输层详解（重学版）

### 传输层是什么

传输层 = 搬运 JSON-RPC 消息的管道。MCP 规定两类管道：stdio 和 Streamable HTTP。

### stdio 传输层（本地）

**核心思想**：用进程的标准输入/输出当管道。Host 启动 Server 作为子进程，用它的 stdin/stdout 收发消息。

```
┌─────────── Host 进程 ───────────┐
│  Client 对象                     │
│    │ 写消息 → 子进程.stdin        │
│    │ 读消息 ← 子进程.stdout       │
└────┼─────────────────────────────┘
     ↓ 启动子进程
┌──────────────────────────────────┐
│  Server 进程（子进程）            │
│  从 stdin 读消息（收到 Client 的）│
│  往 stdout 写消息（返回给 Client）│
│  往 stderr 写日志（不影响协议）   │
└──────────────────────────────────┘
```

**关键规则**（容易踩坑）：

| 通道 | 用途 | 能否写协议消息？ |
|---|---|---|
| **stdin** | Server 接收 Client 请求 | ✅ 是 |
| **stdout** | Server 返回 Client 响应 | ✅ 是（**只能写 JSON-RPC**） |
| **stderr** | Server 写日志/调试 | ❌ 否（写这里不影响协议） |

**重要**：stdio 模式下，Server 的 stdout **只能写 JSON-RPC 消息**！写日志必须写 stderr，否则会污染协议消息。

**正确写法**：
```python
import sys
import logging

# ❌ 错误：print 默认走 stdout，会污染协议
print(f"调试：正在查询{city}")

# ✅ 正确 1：print + file 参数指向 stderr
print(f"调试：正在查询{city}", file=sys.stderr)

# ✅ 正确 2：用 logging 模块（推荐）
logging.basicConfig(stream=sys.stderr, level=logging.INFO)
logger = logging.getLogger("weather")
logger.info(f"正在查询{city}")
```

**口诀**：stdio 模式下，**stdout 是协议专用通道，日志一律走 stderr**。

### Streamable HTTP 传输层（远程）

**核心思想**：用 HTTP 请求当管道。Server 是 HTTP 服务，监听某个 URL，Client 通过 HTTP POST 发消息。

### SSE 不是独立传输层

**SSE（Server-Sent Events）** 是一种 HTTP 技术，让服务端能主动向客户端流式推送消息。

在 Streamable HTTP 传输层里，SSE 是**可选组件**：
- 普通请求-响应（如 `tools/call`）→ HTTP POST + HTTP 响应
- Server 主动推送（如进度通知）→ **可选**用 SSE 流式推送

**所以 SSE 不是独立的第三种传输层**，而是 Streamable HTTP 传输层内部的一个可选技术。

### 两种传输层对比

| 维度 | stdio | Streamable HTTP |
|---|---|---|
| **位置** | 本地同一台机器 | 远程，跨网络 |
| **通信方式** | 进程的 stdin/stdout | HTTP POST + 可选 SSE |
| **Server 形态** | 子进程 | HTTP 服务 |
| **性能** | 最优（无网络开销） | 有网络延迟 |
| **适用场景** | 单用户、本地工具 | 多用户、云端服务 |
| **认证** | 不需要（本地进程） | 需要 OAuth/API Key |
| **日志写哪里** | stderr（stdout 只能写协议） | HTTP 响应（日志走单独通道） |
| **典型例子** | Claude Desktop + 本地文件 Server | Claude + 高德远程 Server |

### 传输层选择判断题（已答对）

| 场景 | 传输层 | 理由 |
|---|---|---|
| 本地 `weather.py` + Claude Desktop | **stdio** | 本地脚本，子进程通信 |
| 远程 `https://mcp.amap.com` | **Streamable HTTP** | 远程服务，跨网络 |

### 直观类比

| 传输层 | 类比 |
|---|---|
| **stdio** | 同一间办公室里用对讲机说话（直接、快、单机） |
| **Streamable HTTP** | 跨城市用快递+电话（HTTP POST 像寄快递，SSE 像对方打电话主动通知） |

### 日志 vs 伪代码的区分（易混淆点）

**曾有的误解**：以为"怎么改"是写伪代码描述调试过程。

**纠正**：日志是"运行时记录"，不是"事后描述"。

| 做法 | 作用 | 时机 |
|---|---|---|
| 写日志（stderr） | 实时记录运行状态 | 代码运行时 |
| 写伪代码 | 设计逻辑 | 写代码前 |

```
代码跑起来 → 日志实时记录每一步状态 → 你看日志知道哪一步出问题
         ↑
   不是写伪代码描述"我想怎么排查"
```

---

## 十二、MRTR（Multi Round-Trip Requests）模式

### 定义

MRTR = 多次请求-响应往返，完成一个需要多步的任务。

### 核心特征：状态在 Host，不在 Server

**协议无状态，但任务有状态**——状态由 Model 维护，不在 Server。

```
┌─────────── Host ───────────┐
│  Model（指挥官 + 记忆者）   │  ← 任务状态在这里
│    │ 每轮决策：下一步调啥    │
│    ↓                        │
│  Client（执行者）           │
└────┬────────────────────────┘
     ↓ 第1轮
┌─────────────────┐
│ Server: 查天气   │  ← Server 不知道这是多轮任务的一部分
└─────────────────┘
     ↓ 返回结果
     Model 看结果 → 决定第2轮
     ↓ 第2轮
┌─────────────────┐
│ Server: 订伞     │  ← Server 不知道刚才查过天气
└─────────────────┘
```

### 三方职责

| 角色 | MRTR 中的职责 |
|---|---|
| **Model** | 指挥官 + 记忆者：看前一步结果，决定下一步调啥，记住任务进度 |
| **Client** | 执行者：每轮把 Model 的决策发给 Server，把结果带回 |
| **Server** | 独立工人：处理当前请求，**不关心**这是第几轮、之前调过啥 |

### 关键认知

> **Server 每次请求都是"失忆"的，但任务能多轮进行——因为状态由 Model 维护**

这正是"无状态协议"能支持复杂任务的原因：**状态不在协议层，在应用层（Model）**。

### 完整流程示例（查天气+订伞+加日历）

```
用户: "查北京明天天气,下雨就订伞+加日历"
        ↓
Model: 我需要分3步,先查天气
        ↓
第1轮: Model → Client → Server(查天气) → 返回"下雨"
        ↓
Model: 下雨了,需要订伞
        ↓
第2轮: Model → Client → Server(订伞) → 返回"订单123"
        ↓
Model: 订好了,加日历
        ↓
第3轮: Model → Client → Server(加日历) → 返回"已添加"
        ↓
Model: 整合所有结果 → "已查到下雨,伞已订(订单123),日历已加"
        ↓
Host 显示给用户
```

### 失败处理：Model 的多种选择

| 处理方式 | 说明 | 例子 |
|---|---|---|
| **降级终止** | 告诉用户失败，结束 | "伞没订到" |
| **换工具** | 调用其他平台工具 | 改调"京东购买"工具 |
| **重试** | 临时故障再试一次 | 网络超时，重试订伞 |
| **问用户** | 用 Elicitation 问用户怎么办 | 弹表单："订伞失败，要换平台吗？" |
| **跳过继续** | 跳过这步，继续后续 | 跳过订伞，直接加日历"记得买伞" |

### 关键认知：Model 不是固定流程，是有判断能力的

固定流程（传统代码）：
```
IF 订伞失败 THEN 报错退出    ← 死板
```

Model（MRTR）：
```
订伞失败 → Model 看上下文 → 自主决定:
  - 用户很急? → 降级告诉用户
  - 有备选平台? → 换工具
  - 需要用户决定? → 用 Elicitation 问
  - 后续步骤不依赖? → 跳过继续
```

### MRTR + Elicitation 协作

Model 在多轮交互中，遇到需要用户决策的节点，用 Elicitation 问用户，拿到答案后继续：

```
订伞失败
  ↓
Model 决定: 这件事需要用户拿主意
  ↓
Server 执行中调 elicitation/create
  ↓
Host 弹表单给用户: "订伞失败,要换平台吗?"
  ↓
用户选择 → Model 继续 MRTR 流程
```

### MRTR 小结

| 维度 | MRTR |
|---|---|
| **定义** | 多次请求-响应往返，完成多步任务 |
| **状态在哪** | Model（Host 端），不在 Server |
| **Server 角色** | 独立处理每次请求，"失忆" |
| **Model 角色** | 指挥官 + 记忆者 + 决策者 |
| **失败处理** | Model 自主判断：降级/换工具/重试/问用户/跳过 |
| **vs 无状态协议** | 协议无状态，状态在应用层（Model） |

---

## 十三、OAuth 2.1 授权流程

### 为什么远程 Server 需要认证

| 原因 | 说明 |
|---|---|
| **服务商要挣钱** | 认证后按身份计费、限额 |
| **防 DDoS/滥用** | 未认证直接拒绝，减少攻击 |
| **身份识别** | 知道是谁在用 |
| **权限控制** | 不同用户能用的工具不同 |
| **配额管理** | 免费/付费用户不同限额 |

### 四个核心概念

| 概念 | 一句话 | 类比 |
|---|---|---|
| **PRM**（Protected Resource Metadata） | Server 的说明书，告诉 Client 去哪认证 | 银行大堂的"开户指引牌" |
| **AS**（Authorization Server） | 专门发 token 的服务器（和 MCP Server 分开） | 银行的开户柜台 |
| **DCR**（Dynamic Client Registration） | Client 自动到 AS 注册，拿 client_id | 自动填表开户 |
| **PKCE**（Proof Key for Code Exchange） | 防授权码被截获的安全机制 | 取款时的双重验证 |

### 关键认知：MCP Server 和 AS 是分开的

```
MCP Server → 提供工具（查天气、订票等）
AS         → 负责认证（发 token）
```

### 三个不同的"码"（易混淆点）

| 码 | 哪来的 | 干什么用 | 一次性？ |
|---|---|---|---|
| **client_id** | DCR 注册时 AS 给的 | 标识"我是谁" | 否，长期用 |
| **授权码** | 用户授权后 AS 返回的 | 用来换 token | ✅ 一次性，几分钟过期 |
| **Access Token** | 用授权码换来的 | 每次请求带这个 | 有有效期，过期要刷新 |

### 银行类比

| 码 | 银行类比 |
|---|---|
| **client_id** | 银行卡号（开户拿到，长期用） |
| **授权码** | 一次性取款单（几分钟过期，只能用一次） |
| **Access Token** | 身份证（每次办业务出示，过期要补办） |
| **PKCE** | 取款密码（防止别人拿到取款单冒领） |

### 完整 OAuth 2.1 流程（6 步）

```
1. Client 连 MCP Server
2. Server 返回 401 + PRM 文档
3. Client 读 PRM → 找到 AS → DCR 注册拿 client_id
4. 授权码 + PKCE 流程:
   4a. 生成 code_verifier（秘密）+ code_challenge（派生）
   4b. 用户授权 → 拿到授权码（一次性）
   4c. 用【授权码 + code_verifier】换 Access Token
       ↑ PKCE 在此起作用:黑客截到授权码但没有 code_verifier,换不到 token
5. Client 拿到 Access Token（这是凭证,不是数据）
6. 之后每次请求带 token,Server 验证后返回工具结果
```

### PKCE 原理详解

```
Client 生成:
  code_verifier  (秘密,自己留着)
  code_challenge (从 verifier 派生,发给 AS)

换 token 时:
  Client 出示 code_verifier → AS 验证 → 发 token
  黑客截到授权码但没有 code_verifier → 换不到 token
```

### OAuth 小结

| 维度 | OAuth 2.1 in MCP |
|---|---|
| **目的** | Client 拿到 Access Token，凭 token 调用远程 Server |
| **四个概念** | PRM（说明书）/ AS（发证机关）/ DCR（自动注册）/ PKCE（防截获） |
| **三个码** | client_id（身份）/ 授权码（一次性换 token）/ Access Token（凭证） |
| **token 有效期** | 有期限，过期要刷新 |
| **vs stdio** | stdio 本地不需要认证；Streamable HTTP 远程需要 |

---

## 十四、MCP Inspector 调试工具

### 是什么

MCP Inspector 是一个**交互式调试工具**，专门用来测试和调试 MCP Server。

### 定位：Inspector 扮演 Host

Inspector 就是一个**现成的 Host**（含 Client），用来连接你的 Server 进行测试：

```
┌──── MCP Inspector ────┐
│  Host + Client         │  ← Inspector 充当 Host
│  (图形界面)            │
└──────────┬─────────────┘
           │
           ↓ 连接
┌──────────────────────┐
│  你的 MCP Server      │  ← 被测试的 Server
│  (weather.py 等)      │
└──────────────────────┘
```

**关键**：不需要自己写 Host 代码，直接用 Inspector 作为现成 Host 连接 Server 测试。

### 启动方式

```bash
npx @modelcontextprotocol/inspector <server-command>
```

例如测试天气 Server：
```bash
npx @modelcontextprotocol/inspector python weather.py
```

### 4 个核心标签页

| 标签页 | 功能 |
|---|---|
| **Resources** | 查看资源列表、读取资源内容 |
| **Prompts** | 查看提示列表、获取提示详情 |
| **Tools** | 查看工具列表、**测试调用工具** |
| **Notifications** | 查看通知、日志、错误 |

### 完整工作流程

```
1. 启动 Inspector + 指定 Server
   npx @modelcontextprotocol/inspector python weather.py
        ↓
2. Inspector 自动连接 Server
   相当于 Host → Client → Server
        ↓
3. Inspector 自动调 server/discover
   显示 Server 支持哪些原语
        ↓
4. 你在界面点击测试:
   - Resources 标签 → 看资源列表 → 点击读取
   - Prompts 标签 → 看提示列表 → 点击获取
   - Tools 标签 → 看工具列表 → 填参数 → 点击调用
   - Notifications 面板 → 看日志/错误
        ↓
5. 看结果是否正确 → 发现问题 → 修 Server → 再测
```

### Inspector 的价值

| 没有 Inspector | 有 Inspector |
|---|---|
| 要自己写 Host 代码来测试 | 直接用现成 Host |
| 要自己写 Client 调用逻辑 | 图形界面点击测试 |
| 看日志要翻终端 | Notifications 面板实时显示 |
| 测试不同工具要改代码 | 切换标签页即可 |

### 小结

| 维度 | MCP Inspector |
|---|---|
| **是什么** | 交互式调试工具 |
| **扮演谁** | Host（含 Client） |
| **测谁** | MCP Server |
| **启动** | `npx @modelcontextprotocol/inspector <server>` |
| **4 个标签页** | Resources / Prompts / Tools / Notifications |
| **价值** | 不用写 Host 代码，图形界面测试 Server |

---

## 十五、MCP 最小实现参考（Python）

> 本章是参考代码，供之后写代码时对照。对应之前学的所有理论。

### Server 端最小实现（weather_server.py）

```python
from mcp.server import Server
from mcp.types import Tool, TextContent
from mcp.server.stdio import stdio_server
import sys
import logging
import asyncio

# === 关键：日志走 stderr（不污染 stdout 协议通道）===
logging.basicConfig(stream=sys.stderr, level=logging.INFO)
logger = logging.getLogger("weather")

# === 创建 Server 对象 ===
server = Server("weather-server")

# === 暴露 Tool 原语：tools/list ===
@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="get_weather",
            description="查询指定城市的天气",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "城市名"}
                },
                "required": ["city"]
            }
        )
    ]

# === 暴露 Tool 原语：tools/call ===
@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "get_weather":
        city = arguments.get("city")
        logger.info(f"查询天气: {city}")  # 日志走 stderr
        return [TextContent(type="text", text=f"{city}今天是晴天")]
    raise ValueError(f"未知工具: {name}")

# === 启动：stdio 传输层 ===
if __name__ == "__main__":
    asyncio.run(stdio_server(server))
```

**对应理论**：
| 代码部分 | 对应理论 |
|---|---|
| `logging.basicConfig(stream=sys.stderr)` | stdio 模式 stdout 专用协议，日志走 stderr |
| `Server("weather-server")` | Server 是按 MCP 协议实现的程序 |
| `@server.list_tools()` | 暴露 Tools 原语，响应 `tools/list` |
| `@server.call_tool()` | 响应 `tools/call`，Model 决定调用 |
| `inputSchema` | JSON Schema 定义工具输入参数 |
| `stdio_server(server)` | 使用 stdio 传输层（本地子进程） |

### Client 端最小实现（client.py）

```python
from mcp import Client, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

async def main():
    # 1. 配置 Server 参数（启动哪个子进程）
    params = StdioServerParameters(
        command="python",
        args=["weather_server.py"]
    )

    # 2. 创建 Client（async with 管理生命周期）
    async with stdio_client(params) as (read, write):
        async with Client(read, write) as client:
            # ↑ Client 是代理对象,持有 transport 引用

            # 3. 发现工具（对应 server/discover + tools/list）
            tools = await client.list_tools()
            print("可用工具:", [t.name for t in tools])

            # 4. 调用工具（Model 决定调哪个,这里手动模拟）
            result = await client.call_tool("get_weather", {"city": "北京"})
            print("结果:", result)

asyncio.run(main())
```

**对应理论**：
| 代码部分 | 对应理论 |
|---|---|
| `StdioServerParameters` | 配置要连接的 Server（启动命令） |
| `stdio_client(params)` | 工厂：创建 stdio 传输通道 |
| `Client(read, write)` | 创建 Client 代理对象，持有 transport 引用 |
| `async with` | 管理生命周期（连接 → 使用 → 自动关闭） |
| `client.list_tools()` | 发现机制：Client 主动问 Server 的工具 |
| `client.call_tool()` | Model 决定调用，Client 转发给 Server |

### 运行方式

```bash
# 1. 安装 MCP SDK
pip install mcp

# 2. 运行 Client（会自动启动 Server 子进程）
python client.py

# 或用 Inspector 测试 Server（不写 Client 代码）
npx @modelcontextprotocol/inspector python weather_server.py
```

### 完整调用流程（对应理论）

```
client.py 运行
    ↓
stdio_client 启动 weather_server.py 子进程
    ↓
Client 对象创建,持有 transport 引用
    ↓
client.list_tools()
    ↓ Client 翻译成 JSON-RPC: {"method":"tools/list"}
    ↓ 通过 stdin 发给 Server 子进程
    ↓
Server 收到 → 执行 list_tools() → 返回工具列表
    ↓ 通过 stdout 返回 JSON-RPC 响应
    ↓
Client 解析响应 → 返回 Python 对象
    ↓
client.call_tool("get_weather", {"city":"北京"})
    ↓ 同样流程:翻译 → 发送 → Server 执行 → 返回
    ↓
Server 执行 call_tool() → logger.info 写 stderr → 返回"北京今天是晴天"
    ↓
Client 返回结果 → 打印
    ↓
离开 async with → 自动关闭连接和子进程
```

### 三个文件的关系

```
weather_server.py  ← Server（提供工具）
       ↑
       │ stdio 传输层（stdin/stdout）
       ↑
client.py          ← Client（连接 Server + 调用工具）
       ↑
       │ （可选）用 Inspector 代替 client.py 测试
       ↑
Inspector          ← 现成 Host,图形界面测试
```

### 关键提醒（写代码时易踩坑）

| 坑 | 正确做法 |
|---|---|
| Server 里用 `print()` 调试 | 改用 `print(..., file=sys.stderr)` 或 `logging` |
| 忘记 `async with` 管理 Client 生命周期 | 用 `async with Client(...) as client:` |
| Server 写 stdout 日志 | stdout 只能写 JSON-RPC，日志走 stderr |
| Client 不调 `list_tools` 直接 `call_tool` | 先发现再调用（虽然协议不强制，但好习惯） |

---

## 十六、关键要点总结

### ✅ 已掌握
- [x] MCP 是标准化连接 AI 与外部服务的协议
- [x] 四个角色：Host / Client / Server / Model
- [x] Client 与 Server 是一对一连接
- [x] 调用流程：用户 → Host → Model 决策 → Client 传话 → Server 执行 → 结果回流
- [x] Model 负责规范化输出工具调用请求
- [x] Host 是 Agent 运行的容器，不等同于 Agent
- [x] 传输层只有两种：stdio（本地）和 Streamable HTTP（远程）
- [x] SSE 是 Streamable HTTP 的内部技术，不是独立传输层
- [x] Client 是 Host 内部的对象，不是独立进程
- [x] Client 的三步工作：建立连接 → 翻译 JSON-RPC → 解析响应
- [x] Client 提供的方法（list_tools / call_tool / list_resources 等）
- [x] stdio 模式下 Client 还负责启动/关闭 Server 子进程
- [x] Client 是代理对象（遥控器），不是工厂；`stdio_client()` 才是创建传输通道的工厂
- [x] Client 对象内部组成：翻译逻辑 + transport 引用 + 生命周期状态 + 方法
- [x] Server 三类原语：Tools（Model 控制）/ Resources（Host 控制）/ Prompts（用户控制）
- [x] Tools 是可执行函数，有副作用，用 JSON Schema 定义输入
- [x] Resources 是只读数据源，有 URI + MIME 类型，分 Direct 和 Template 两种
- [x] Prompts 是参数化指令模板，用户主动调用，常以斜杠命令呈现
- [x] 三类原语协作流程：用户触发 Prompt → Host 选 Resources → Model 调 Tools
- [x] Elicitation 是客户端原语，方向 Server → 用户（与 Tool 方向相反）
- [x] Elicitation 两种模式：form（简单数据）/ URL（复杂交互如 OAuth）
- [x] Elicitation 用户三响应：accept / decline / cancel，Server 必须优雅处理
- [x] Prompt ≠ "向用户提问"，是用户主动触发的指令模板
- [x] MCP 是协议标准，不是工具本身（USB-C 类比）
- [x] MCP 协议不包含模型，Model 在 Host 里（非 Agent to Agent）
- [x] 发现机制：Client 主动调 `server/discover` 问能力，两步发现（先类别后具体）
- [x] 无状态协议：Server 不记录上次请求，每次独立
- [x] 版本协商：通过 `_meta` 字段，新原语被旧 Client 忽略（优雅降级）
- [x] 整体流程：Client/Host 是搬运工，分析整合是 Model 的工作
- [x] MCP 规定 5 类内容：消息格式、原语、协议方法、传输方式、版本协商
- [x] MCP 协议栈位置：应用层 MCP / 传输层 stdio+HTTP / 网络层 TCP
- [x] stdio 用法：Server stdout 只能写 JSON-RPC，日志一律走 stderr
- [x] stdio 正确写法：`print(..., file=sys.stderr)` 或 `logging.basicConfig(stream=sys.stderr)`
- [x] stdio 适用本地子进程，Streamable HTTP 适用远程 HTTP 服务
- [x] MRTR：多轮请求-响应往返，状态在 Model，不在 Server
- [x] MRTR 失败处理：Model 可降级/换工具/重试/问用户/跳过
- [x] OAuth 2.1：远程 Server 认证，PRM/AS/DCR/PKCE 四概念
- [x] OAuth 三个码区分：client_id（身份）/ 授权码（一次性）/ Access Token（凭证）
- [x] OAuth 流程 6 步 + PKCE 防授权码截获
- [x] MCP Inspector：现成 Host，图形界面测试 Server
- [x] Inspector 4 标签页：Resources/Prompts/Tools/Notifications

### ⚠️ 需要继续强化的认知
1. **工具描述由 Server 提供**，不是 Model 生成的
2. **Client 对用户透明**，用户只感知 Host
3. **Client 不做协议转化**，只维护连接和转发
4. **Host 不"包括"工具**，工具在 Server 里

---

## 十六、待学习内容

### 下一阶段学习目标
- [ ] 实际编写一个 MCP Server（Python/TypeScript）— 用户表示不写代码，可跳过

---

## 十八、参考链接

### 官方文档
- [MCP 入门介绍](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)
- [MCP 架构概览](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)
- [MCP Server 概念](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts)
- [MCP Client 概念](https://modelcontextprotocol.io/docs/2026-07-28/learn/client-concepts)
- [MCP 版本管理](https://modelcontextprotocol.io/docs/2026-07-28/learn/versioning)

### 开发实践
- [连接本地 MCP Server](https://modelcontextprotocol.io/docs/2026-07-28/develop/connect-local-servers)
- [连接远程 MCP Server](https://modelcontextprotocol.io/docs/2026-07-28/develop/connect-remote-servers)
- [构建 MCP Server](https://modelcontextprotocol.io/docs/2026-07-28/develop/build-server)
- [构建 MCP Client](https://modelcontextprotocol.io/docs/2026-07-28/develop/build-client)
- [客户端最佳实践](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices)

### 安全与工具
- [授权（OAuth 2.1）](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization)
- [安全最佳实践](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)
- [MCP Inspector 调试工具](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector)
- [调试指南](https://modelcontextprotocol.io/docs/2026-07-28/tools/debugging)

### SDK 与示例
- [官方 SDK 列表](https://modelcontextprotocol.io/docs/2026-07-28/sdk)
- [示例服务器集合](https://modelcontextprotocol.io/examples)

---

## 学习记录日志

| 日期 | 轮次 | 主题 | 状态 |
|---|---|---|---|
| 2026-07-31 | 第一轮 | MCP 基本认识纠正（高德例子） | ✅ 已记录 |
| 2026-07-31 | 第二轮 | 四个角色定义纠正（Host/Client/Server/Model） | ✅ 已记录 |
| 2026-07-31 | 第三轮 | 发音表 + 角色职责再澄清（Client 不是协议转化层） | ✅ 已记录 |
| 2026-07-31 | 第四轮 | 传输层概念澄清（stdio vs Streamable HTTP） | ✅ 已记录 |
| 2026-07-31 | 第五轮 | Client 工作机制详解（翻译官 + 传话员 + 保姆） | ✅ 已记录 |
| 2026-07-31 | 第六轮 | Client 身份再澄清（代理对象，不是工厂） | ✅ 已记录 |
| 2026-07-31 | 第七轮 | Client 对象内部组成确认（翻译逻辑 + transport 引用） | ✅ 已记录 |
| 2026-07-31 | 第八轮 | Server 三类原语（Tools/Resources/Prompts）+ 协作示例 | ✅ 已记录 |
| 2026-07-31 | 第九轮 | 三类原语判断练习与纠正（场景1误判为 Tool，实为 Prompt） | ✅ 已记录 |
| 2026-07-31 | 第十轮 | Elicitation 概念（form/URL 模式 + 三响应 + 流程设计）+ MCP 本质再澄清 | ✅ 已记录 |
| 2026-07-31 | 第十一轮 | 发现机制（server/discover）+ 无状态协议 + 版本协商 | ✅ 已记录 |
| 2026-07-31 | 第十二轮 | 整体检查（四角色+查天气流程+MCP规定内容）+ 流程纠正 | ✅ 已记录 |
| 2026-07-31 | 第十三轮 | 传输层重学（stdio stdout 专用 + 日志走 stderr + 判断题全对） | ✅ 已记录 |
| 2026-07-31 | 第十四轮 | 日志 vs 伪代码区分（日志是运行时记录，非事后描述） | ✅ 已记录 |
| 2026-07-31 | 第十五轮 | MRTR 模式（多轮交互 + 状态在 Model + 失败处理 5 种方式） | ✅ 已记录 |
| 2026-07-31 | 第十六轮 | OAuth 2.1 流程（PRM/AS/DCR/PKCE + 三个码区分） | ✅ 已记录 |
| 2026-07-31 | 第十七轮 | MCP Inspector（现成 Host + 4 标签页 + 测试流程） | ✅ 已记录 |
| 2026-07-31 | 第十八轮 | MCP 最小实现参考（Server + Client 代码 + 理论对应） | ✅ 已记录 |

> 后续每次对话后，本文档会即时更新，新增章节并追加学习记录日志。
