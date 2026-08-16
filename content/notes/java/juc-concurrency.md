---
title: "JUC 并发编程学习笔记"
date: "2026-08-16"
tags: ["Java", "并发", "JUC"]
minutes: 35
---

# JUC 并发编程学习笔记

> 学习方式：苏格拉底式提问 + 概念优先 + 每节点配套项目与测试
> 学习状态：Phase 0 进行中

---

## 📚 总学习路线图

| 阶段 | 内容 | 状态 |
|------|------|------|
| **Phase 0** | JavaSE 多线程前置补课（进程/线程、创建方式、生命周期、synchronized/wait-notify、线程安全问题） | ✅ 已完成 |
| **Phase 1** | 第一章 再谈多线程——synchronized 底层的锁升级（重量级→自旋→轻量级→偏向）、锁消除/粗化 | ✅ 已完成 |
| **Phase 1** | JMM 内存模型、volatile 关键字、happens-before 规则 | ✅ 已完成 |
| **Phase 2** | 第二章 锁框架（Lock/Condition/ReentrantLock/公平锁/读写锁） | ⏳ 待学习 |
| **Phase 2** | AQS 队列同步器原理 | ⏳ 待学习 |
| **Phase 2** | 并发集合（CopyOnWriteArrayList/ConcurrentHashMap/阻塞队列） | ⏳ 待学习 |
| **Phase 2** | 原子类与线程协作工具（CountDownLatch/CyclicBarrier/Semaphore） | ⏳ 待学习 |
| **Phase 3** | 第三章 线程池 ThreadPoolExecutor（7 参数/拒绝策略/Executors） | ⏳ 待学习 |
| **Phase 3** | Fork/Join 框架与 CompletableFuture 异步编程 | ⏳ 待学习 |
| **实战** | 为已掌握的各节点编写配套 Maven 项目与单元测试 | ⏳ 待学习 |

---

# Phase 0: JavaSE 多线程前置补课

> 📌 文档原文强调："JavaSE 多线程部分要求必须掌握，否则无法继续学习本教程！"
> 本阶段从零基础开始补齐 JUC 所需的前置知识。

---

## 0.1 进程 vs 线程

### 🍳 餐厅类比

想象你开了一家餐厅，后厨要同时处理多个订单。有两种方案：

- **方案 A：建多个独立小厨房** —— 每个厨房有自己的灶台、锅具、食材仓库、一个厨师。厨师们互不打扰，但跨厨房搬食材很麻烦。
- **方案 B：建 1 个大厨房** —— 一个共享的灶台、锅具、食材仓库，雇多个厨师一起干活。拿食材方便，但可能"抢"同一口锅。

一个 Java 程序运行起来，**更像方案 B 的大厨房**。

### 📋 类比 → 正式定义 映射表

| 厨房类比 | 计算机概念 | 关键特性 |
|---------|-----------|---------|
| 一整个厨房（含仓库/灶台/锅） | **进程（Process）** | 拥有**独立内存空间**，进程间隔离 |
| 厨房里的一个厨师 | **线程（Thread）** | 进程内的**执行单元**，共享进程内存 |
| 锅、食材（会被抢的资源） | **共享变量/临界资源** | 多线程会并发访问，需保护 |
| "给锅上锁" | **互斥锁**（synchronized/Lock） | 同一时刻只允许一个线程访问 |
| 跨厨房搬食材 | **进程间通信 IPC** | 开销大，数据不直接共享 |
| 厨师切换任务（煮饭时去炒菜） | **线程切换/上下文切换** | 线程切换比进程切换快得多 |

### 📖 正式定义

> **进程**：程序的一次运行实例，拥有独立的内存空间。一个进程里至少有一个线程（主线程）。
>
> **线程**：进程内的执行单元，是 CPU 调度的最小单位。同一进程内的多个线程**共享内存**，但每个线程有自己的栈和程序计数器。

### 🔑 关键结论

- 一个 Java 程序 = **一个进程**（一个大厨房）
- 一个进程内可以有**多个线程**（多个厨师）共享同一份内存
- 多线程的好处：共享内存方便、切换成本低
- 多线程的问题：资源竞争 → 需要"锁"来保护

---

## 0.2 并发 vs 顺序执行

### 🍳 煮饭场景

要做一顿饭：① 煮饭（电饭煲自动 20 分钟）② 炒青菜（5 分钟）③ 烧汤（10 分钟）

- **顺序执行**：先煮饭 → 等完 → 炒菜 → 等完 → 烧汤 = 35 分钟
- **并发执行**：按下煮饭开关 → 期间去炒菜、烧汤 = 总耗时大幅缩短

### 📖 概念区分

| 执行方式 | 类比 | 计算机概念 |
|---------|------|-----------|
| 先煮饭→等完→炒菜→等完→烧汤 | 一个执行者串行做 | **顺序执行（Sequential）** |
| 按下煮饭→期间去炒菜→烧汤 | 一个执行者任务间快速切换 | **并发（Concurrent）** |
| 多个厨师同时干活 | 多个执行者真正同时 | **并行（Parallel）** |

> **并发的价值**：当一线程在等待（如 I/O、sleep）时，CPU 可以去执行其他线程，从而提高整体效率。

---

## 0.3 创建线程的 3 种方式

### 🎯 核心思想

**线程本身（厨师）和 要执行的代码（菜谱）是分开的**：
- `Thread` = 厨师
- `Runnable` = 菜谱（里面有个 `run()` 方法写着"怎么做菜"）

### 方式 1：实现 Runnable 接口（最常用）

```java
public static void main(String[] args) {
    // 写一张"菜谱"：告诉线程要执行什么代码
    Runnable recipe = () -> {
        for (int i = 0; i < 3; i++) {
            System.out.println("线程在执行：" + i);
        }
    };
    
    // 雇一个厨师，把菜谱交给他
    Thread cook = new Thread(recipe);
    cook.start();  // 厨师开始干活（注意是 start()，不是 run()！）
    
    System.out.println("主线程结束");
}
```

### 方式 2：继承 Thread 类（简单但有限制）

```java
class MyThread extends Thread {
    @Override
    public void run() {  // 重写 run()，写菜谱
        System.out.println("线程在执行");
    }
}

public static void main(String[] args) {
    new MyThread().start();  // 直接雇厨师（菜谱已经写死在厨师身上）
}
```

### 方式 3：实现 Callable 接口（带返回值，进阶用）

```java
// 菜谱有"返回值"——比如厨师做完菜要端给你
Callable<Integer> recipe = () -> {
    return 42;  // 执行完返回一个结果
};
ExecutorService pool = Executors.newSingleThreadExecutor();
Future<Integer> future = pool.submit(recipe);  // 提交任务
Integer result = future.get();  // 等着拿结果
```

### 📊 3 种方式对比

| 方式 | 菜谱载体 | 能否有返回值 | 推荐场景 |
|------|---------|------------|---------|
| Runnable | `run()` 方法 | ❌ 无 | 大多数场景（推荐） |
| 继承 Thread | 重写 `run()` | ❌ 无 | 简单演示（Java 单继承限制大） |
| Callable | `call()` 方法 | ✅ 有 | 需要拿到线程执行结果时 |

---

## 0.4 start() vs run() —— 新手最容易踩的坑

### 🔧 本质区别

```java
Thread cook = new Thread(recipe);

cook.start();  // ✅ 雇厨师上岗 → 真的开了个新线程 → 新线程里自动跑 run()
cook.run();    // ❌ 没雇厨师 → 主人自己照菜谱做 → 在 main 线程里跑，没多线程效果！
```

### 📋 对比表

| 调用 | 类比 | 真的开了新线程吗？ |
|------|------|-----------------|
| `start()` | 厨师上岗，他在自己的工位上做菜 | ✅ 是 |
| `run()` | 主人自己照着菜谱做菜（就是个普通方法调用） | ❌ 不是，仍在 main 线程 |

> ⚠️ **直接调 `run()` 是新手最常犯的错**——程序跑出来"看起来没问题"，但其实是单线程串行执行的，多线程根本没生效！
>
> **永远记住：`start()` 才会创建新线程，`run()` 只是普通方法调用。**

---

## 0.5 线程安全与变量共享 ⭐ 核心中的核心

### 🎯 最核心的法则

> **多线程冲突的根源是"共享可变数据"，不是"共享代码"。**

| 概念 | 类比 | 多线程下会冲突吗？ |
|------|------|-----------------|
| 代码（Runnable / 方法） | **菜谱**（一张纸） | ❌ 不会！菜谱可以被无数人看 |
| 可变数据（变量 / 字段） | **食材**（一个鸡蛋） | ✅ 会！两个人抢同一个鸡蛋才打架 |

### 🔥 反例：什么时候才冲突？

```java
// ❌ 不冲突：只打印，没有共享变量
Runnable recipe = () -> System.out.println("hello");
new Thread(recipe).start();
new Thread(recipe).start();  // 安全！

// ✅ 冲突：共享了可变数据 count
static int count = 0;
Runnable r = () -> {
    for (int i = 0; i < 10000; i++) count++;  // 两个厨师同时改同一个 count
};
new Thread(r).start();
new Thread(r).start();
// 期望 count=20000，实际可能 13742、18903... 每次不一样
```

### 📖 变量作用域 → 线程安全性 总表（必背！）

| 变量类型 | 声明位置 | 是否共享 | 多线程安全吗？ | 例子 |
|---------|---------|---------|--------------|------|
| **局部变量** | 方法内部 | ❌ 每个线程一份 | ✅ 安全 | 方法内 `int local = 0;` |
| **实例字段** | 类里无 static | ⚠️ 多线程访问同一对象时共享 | ⚠️ 可能不安全 | `obj.count` |
| **静态字段** | 类里有 static | ✅ 全局唯一 | ⚠️ 可能不安全 | `static int count` |
| **方法参数** | 方法签名 | ❌ 每个线程一份 | ✅ 安全 | `void run(int x)` |

### 🎯 判断口诀

> **先问"几个对象？"，再问"这个字段在对象里还是方法里？"**

- **局部变量** = 厨师**自己口袋**里的本子 → 永远不共享 → ✅ 安全
- **实例字段** = **某个厨房**里的食材筐 → 多个线程访问**同一对象**时共享 → ⚠️ 可能不安全（即使没 static！）
- **静态字段** = 餐厅**门口公共菜单牌** → 永远共享 → ⚠️ 可能不安全

### ⚠️ 关键误区澄清

**误区：** "没有 static = 不共享 = 安全"
**正解：** 实例字段即使没有 static，只要**多个线程访问同一个对象**，它就是共享的！

```java
class Counter {
    int count = 0;  // 实例字段（无 static）
    public void increment() {
        int temp = count;   // 局部变量 ✅ 安全
        temp++;
        count = temp;       // 写回共享 count ⚠️ 不安全！
    }
}

// ❌ 不安全：两个线程共用一个 counter 对象
Counter counter = new Counter();
Runnable r = () -> { for (...) counter.increment(); };
new Thread(r).start();
new Thread(r).start();

// ✅ 安全：每个线程建自己的 counter（各自进各自的厨房）
Runnable r = () -> {
    Counter c = new Counter();   // 局部变量！每个线程独立一个厨房
    for (...) c.increment();
};
new Thread(r).start();
new Thread(r).start();
```

### 🔑 为什么 `count++` 不安全？

`count++` 看起来是一行代码，实际是 **3 步操作**：
```
1. 读 count 的值
2. 把值 +1
3. 写回 count
```

两个线程同时执行 `count++` 可能这样交错：
```
线程1: 读到 count=0
线程2: 读到 count=0   ← 两个都读到 0
线程1: 写回 count=1
线程2: 写回 count=1   ← 期望是 2，实际是 1！丢了一次更新
```

### 📌 后续 JUC 的所有内容都是围绕"怎么保护共享数据"展开

| JUC 工具 | 作用 |
|---------|------|
| `synchronized` / `Lock` | 保护"食材"（加锁） |
| `ConcurrentHashMap` | 让多个线程安全地读写"食材" |
| `ThreadLocal` | 给每个厨师发**自己的食材**（不共享，就没冲突） |
| `volatile` | 保证"食材"对所有人可见 |

---

## 0.6 线程的生命周期（6 种状态）

> 📌 为什么重要？后面 JUC 里所有的工具——`wait/notify`、`Lock`、`Condition`、`CountDownLatch`、线程池——本质上都是**在不同状态间切换线程**。

### 🍳 厨师类比 6 种状态

| 状态 | 类比 | 怎么进入 |
|------|------|---------|
| **NEW**（新建） | 厨师已签合同但还没上班 | `new Thread()` 创建后，**没调 `start()`** |
| **RUNNABLE**（可运行） | 厨师在岗，可能正在做菜、也可能等 CPU 派活 | 调了 `start()` |
| **BLOCKED**（阻塞） | 厨师想用一口被别人占用的锅，只能干等 | 等待 `synchronized` 锁 |
| **WAITING**（无限等待） | 厨师被通知"先歇着，叫你你再干"，没期限 | 调了 `wait()` / `join()` |
| **TIMED_WAITING**（限期等待） | 厨师说"我睡 5 分钟，到点叫我" | 调了 `sleep(t)` / `wait(t)` |
| **TERMINATED**（终止） | 厨师下班走人 | `run()` 执行完毕 |

> ⚠️ **注意**：Java 把"正在运行"和"等待 CPU"合并成了 `RUNNABLE`——因为线程什么时候真在 CPU 上跑，是操作系统决定的，Java 管不着。

### 📜 状态转换图

```
        new Thread()
   ┌─────────────┐
   │     NEW     │
   └──────┬──────┘
          │ start()
          ▼
   ┌─────────────┐  wait()/join()   ┌──────────┐
   │  RUNNABLE   │─────────────────▶│ WAITING  │
   │             │◀─────notify()────┤          │
   │             │                  └──────────┘
   │             │  sleep(t)/wait(t)┌──────────┐
   │             │─────────────────▶│TIMED_WTG │
   │             │◀─────超时/notify─┤          │
   │             │                  └──────────┘
   │             │  等 synchronized ┌──────────┐
   │             │─────────────────▶│ BLOCKED  │
   │             │◀─────拿到锁──────┤          │
   └──────┬──────┘                  └──────────┘
          │ run() 结束
          ▼
   ┌─────────────┐
   │ TERMINATED  │
   └─────────────┘
```

### 📝 状态判断示例

```java
Thread t = new Thread(() -> {
    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {}
});

System.out.println(t.getState());  // NEW（还没 start）

t.start();
Thread.sleep(1000);
System.out.println(t.getState());  // TIMED_WAITING（在 sleep）

t.join();
System.out.println(t.getState());  // TERMINATED（run 结束）
```

---

## 0.7 synchronized —— JavaSE 的锁（学习中）

> `synchronized` 是 JavaSE 阶段的锁机制，JUC 的 `Lock` 就是在它基础上改进的。
> 核心思想：锁的是"对象"，不是"代码"。谁拿到锁对象，谁就能进同步代码块。

### 📖 写法 1：同步代码块（最灵活，推荐）

```java
public class Kitchen {
    private int count = 0;                      // 共享食材
    private final Object lock = new Object();   // 专门做锁的对象（一口锅）

    public void increment() {
        synchronized (lock) {       // ← 括号里是"锁对象"
            count++;                // 只有拿到锁的线程才能进来
        }                           // 出了括号自动释放锁
    }
}
```

**关键**：`synchronized(obj)` 锁的是**括号里那个对象**（不是括号里的代码）。
- 谁先拿到 `obj` 这把锁 → 谁就能进代码块
- 其他线程在门外等 → 进入 `BLOCKED` 状态
- 出代码块 → 自动释放锁 → 其他 BLOCKED 线程有机会抢

### 📖 写法 2：同步方法（简洁）

```java
public class Counter {
    private int count = 0;

    // 实例同步方法：锁的是 this（当前对象）
    public synchronized void inc() {
        count++;
    }

    // 静态同步方法：锁的是 Counter.class（Class 对象）
    public static synchronized void staticMethod() {
        // ...
    }
}
```

### 📋 锁对象对照表（必背）

| 写法 | 锁的是谁？ | 适用场景 |
|------|----------|---------|
| `synchronized(obj) { ... }` | 括号里的 `obj` | 需要精细控制锁的范围 |
| `public synchronized void m()` | `this`（当前实例） | 整个方法都需要同步 |
| `public static synchronized void m()` | `类名.class`（Class 对象） | 静态方法同步 |

### 🍳 厨师类比

- `lock` 对象 = **那口锅**
- `synchronized(lock)` = "我要用这口锅，谁占了我就等"
- 拿到锁 = 拿到锅的使用权 → 进代码块做菜
- 出代码块 = 用完锅，还回去 → 其他 `BLOCKED` 的厨师有机会抢

### 🔑 三个关键点

1. **锁的是对象，不是代码**：两段不同的代码只要 `synchronized` 同一个对象，它们之间也会互斥
2. **自动释放**：代码块执行完（或抛异常）会自动释放锁，不需要手动 unlock
3. **可重入**：同一个线程可以对同一个锁多次加锁（不会自己锁死自己）

### 📝 验证题：甲/乙/丙 三种写法对比

判断下面 3 段代码能否让 count 正确累加（两个线程各加 10000 次，期望 20000）：

**甲. 同步代码块 + 共用一个 Counter**
```java
class Counter {
    private int count = 0;
    private final Object lock = new Object();

    public void inc() {
        synchronized (lock) { count++; }
    }
}
// 两个线程共用同一个 Counter 对象，各调 10000 次 inc()
```

**乙. 同步方法 + 共用一个 Counter**
```java
class Counter {
    private int count = 0;

    public synchronized void inc() {   // 锁 this
        count++;
    }
}
// 两个线程共用同一个 Counter 对象
```

**丙. 同步代码块 + 每个线程各 new 一个 Counter ⚠️**
```java
class Counter {
    private int count = 0;
    private final Object lock = new Object();

    public void inc() {
        synchronized (lock) { count++; }
    }
}
// 注意：每个线程 new 了自己的 Counter
// 线程1: Counter c1 = new Counter(); for(...) c1.inc();
// 线程2: Counter c2 = new Counter(); for(...) c2.inc();
```

**答案与分析**：

| 代码 | 结果 | 原因 |
|------|------|------|
| 甲 | ✅ 正确（count=20000） | 两个线程共用同一个 `lock` 对象，互斥生效 |
| 乙 | ✅ 正确（count=20000） | 两个线程共用同一个 `this`，互斥生效 |
| 丙 | ⚠️ 各自 count=10000，但**没有累加成 20000** | 每个线程有自己的 `lock` 对象，**两把不同的锁互不干扰**，所以根本没起到互斥作用 |

**核心结论**：**锁要起作用，必须多个线程竞争"同一把锁"（同一个对象）！**
不同对象 = 不同锁 = 没有互斥效果。

### ⚠️ 常见误区

1. **以为 `synchronized` 锁的是代码** → 错！锁的是对象
2. **以为只要加了 `synchronized` 就安全** → 错！如果每个线程用不同的锁对象，等于没加锁
3. **以为 `synchronized(new Object())` 有用** → 错！每次 new 都是不同对象，等于没锁

```java
// ❌ 错误写法：每次进来都是新对象，等于没锁
public void inc() {
    synchronized (new Object()) {   // 每次都是不同的锁！
        count++;
    }
}

// ✅ 正确写法：用同一个对象做锁
private final Object lock = new Object();
public void inc() {
    synchronized (lock) {   // 永远是同一把锁
        count++;
    }
}
```

---

## 0.8 wait/notify —— 线程间的协作（学习中）

> `synchronized` 解决"互斥"（别抢同一口锅），`wait/notify` 解决"协作"（一个等另一个）。

### 🍳 引入场景：餐厅出餐台

```
厨师（生产者）→ [出餐台：最多放 5 盘菜] → 服务员（消费者）
```

- 出餐台满了 → 厨师等
- 出餐台空了 → 服务员等
- 厨师放菜 → 通知服务员
- 服务员端菜 → 通知厨师

### 📖 核心 API

```java
obj.wait();       // 当前线程释放 obj 的锁，趴下睡着（进入 WAITING）
obj.notify();     // 拍醒一个在 obj 上睡着的线程
obj.notifyAll();  // 拍醒所有在 obj 上睡着的线程
```

### 🔒 三条铁律

1. **必须在 `synchronized(obj)` 块内调用** —— 没拿到锁会抛 `IllegalMonitorStateException`
2. **`wait()` 会释放锁** —— 不释放的话别的线程进不来，死锁
3. **`notify()` 不立即释放锁** —— 要等当前 `synchronized` 块执行完才释放

### 🍳 厨师类比

| 操作 | 类比 |
|------|------|
| `synchronized(出餐台)` | 走到出餐台前，占住位置 |
| `wait()` | 发现没菜，趴下睡，**让出位置**（释放锁） |
| `notify()` | 厨师放菜后，**喊一声**"有菜了" |
| 被唤醒后 | 服务员醒来，重新抢位置（重新拿锁）才能端菜 |

### 📝 完整代码：生产者-消费者

```java
import java.util.LinkedList;
import java.util.Queue;

// 出餐台（共享的队列）
class MessageQueue {
    private final Queue<String> queue = new LinkedList<>();
    private final int capacity = 5;  // 最多放 5 盘菜

    // 生产者调用：放菜
    public synchronized void put(String dish) throws InterruptedException {
        while (queue.size() == capacity) {
            wait();   // 出餐台满了，厨师趴下等（释放 this 锁）
        }
        queue.offer(dish);
        System.out.println("厨师放了：" + dish + "，当前 " + queue.size() + " 盘");
        notifyAll();  // 喊服务员：有菜了
    }

    // 消费者调用：端菜
    public synchronized String take() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();   // 出餐台空了，服务员趴下等（释放 this 锁）
        }
        String dish = queue.poll();
        System.out.println("服务员端走：" + dish + "，剩 " + queue.size() + " 盘");
        notifyAll();  // 喊厨师：有空位了
        return dish;
    }
}

public class Main {
    public static void main(String[] args) {
        MessageQueue mq = new MessageQueue();

        // 厨师线程（生产者）
        new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try { mq.put("菜" + i); } catch (InterruptedException e) {}
            }
        }, "厨师").start();

        // 服务员线程（消费者）
        new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                try { mq.take(); } catch (InterruptedException e) {}
            }
        }, "服务员").start();
    }
}
```

### 🔑 关键细节 1：为什么用 `while` 不用 `if`？

```java
// ❌ 错误：用 if
if (queue.isEmpty()) wait();   // 醒来后不再检查，可能出问题

// ✅ 正确：用 while
while (queue.isEmpty()) wait();  // 醒来后再检查一次
```

**原因：虚假唤醒（spurious wakeup）** —— 线程可能没被 `notify` 也会自己醒；即使被 `notify` 唤醒，条件可能已被其他线程改变。所以醒来后必须**再检查一次条件** → 用 `while`。

### 🔑 关键细节 2：wait() vs sleep() 对比

| 对比项 | `wait()` | `sleep()` |
|-------|---------|----------|
| 所属 | Object 方法 | Thread 静态方法 |
| 是否释放锁 | ✅ 释放 | ❌ 不释放 |
| 唤醒方式 | notify/notifyAll/超时 | 超时自动 |
| 使用前提 | 必须在 synchronized 块内 | 任意位置 |

### ⚠️ 常见误区

1. **在 synchronized 块外调 wait()** → 抛 `IllegalMonitorStateException`
2. **以为 wait() 不释放锁** → 错！wait() 会释放锁，不然死锁
3. **用 if 不用 while** → 虚假唤醒导致条件判断失效
4. **用 notify() 不用 notifyAll()** → 可能漏唤醒（多个线程等待时）

---

## 0.9 线程安全三大问题（已完成）

> 这是 JUC 第一章的核心理论。多线程下有 3 个隐蔽问题，JUC 的 `volatile`、`synchronized`、`happens-before` 全是为解决它们而生的。

| 问题 | 含义 | 解决工具 |
|------|------|---------|
| **可见性** | 一个线程对共享变量的修改，另一个线程看不到 | `volatile` / `synchronized` |
| **原子性** | 操作不可分割，不能被中途打断 | `synchronized` / `Lock` / 原子类 |
| **有序性** | 编译器/CPU 可能重排序指令，导致执行顺序与代码不一致 | `volatile` / `happens-before` |

---

### 🔍 可见性（Visibility）

#### 🍳 JMM 模型：主内存 vs 工作内存

```
        ┌─────────────────┐
        │   主内存（公共菜单板）   │  ← 所有共享变量存在这里
        │   running = ?      │
        └────────┬──────────┘
           ↗ 复制 ↓ 刷回
   ┌─────────┐    ┌─────────┐
   │线程A工作内存│    │线程B工作内存│  ← 每个线程有自己的"小本子"（CPU 缓存）
   │running=? │    │running=? │
   └─────────┘    └─────────┘
```

**JMM 两条规则**：
1. 每个线程有自己的工作内存（对应 CPU 缓存），存放共享变量的副本
2. 线程不能直接读写主内存，必须通过工作内存

#### 🔥 可见性问题示例

```java
static boolean running = true;   // 没有 volatile

// 线程 A
while (running) { }   // A 一直读自己工作内存的副本（= true）

// 线程 B
running = false;      // B 改了自己副本，可能没及时刷回主内存
                     // 即使刷回了，A 也不会去主内存重新读 → A 看不见 → 死循环
```

#### ✅ 解决：`volatile` 关键字

```java
static volatile boolean running = true;   // ← 加 volatile
```

| 操作 | volatile 的行为 |
|------|----------------|
| **写** volatile 变量 | 立刻刷回主内存 + 让其他线程的工作内存副本失效 |
| **读** volatile 变量 | 直接从主内存读（不用工作内存的缓存） |

#### ⚠️ volatile 只保证可见性，不保证原子性！

```java
static volatile int count = 0;
// count++ 仍然不安全！（见原子性章节）
```

#### 🔑 时序问题 ≠ 可见性问题

| 情况 | 是 bug 吗？ |
|------|-----------|
| B 在 A 写**之前**读，读到旧值 | ❌ 正常时序 |
| A 已写，但 B 还读到旧值（缓存没刷新） | ✅ **这才是可见性 bug** |

volatile 解决的是第 2 种。第 1 种只是"谁先执行"的时序问题，不是 bug。

---

### 🔒 原子性（Atomicity）

#### 🎯 定义

> 一个操作或一组操作，要么全部执行完且不被打断，要么全不执行。

#### 🔥 `count++` 不是原子的

`count++` 实际是 3 步：
```
1. 读 count 的值
2. 把值 +1
3. 写回 count
```

即使加了 volatile（保证可见性），两个线程仍可能：
```
A: 读 count=5（主内存）
B: 读 count=5（主内存）   ← 都看到最新值 5，但都基于 5 计算
A: 写 count=6
B: 写 count=6             ← 期望 7，丢了一次！
```

**类比**：volatile = 强制厨师看公共菜单板（看得见），但两个厨师同时看到"鸡蛋剩 1 个"都伸手拿 → 还是要打架。可见性 ≠ 原子性。

#### ✅ 三种解法

```java
// 解法 1：synchronized（互斥锁）
synchronized (lock) { count++; }

// 解法 2：AtomicInteger（JUC 原子类，底层 CAS）
static AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();

// 解法 3：Lock（JUC）
lock.lock();
try { count++; } finally { lock.unlock(); }
```

#### 📊 验证题答案

| 代码 | 能否到 20000？ | 原因 |
|------|--------------|------|
| 甲（无同步） | ❌ | 无原子性，count++ 被打断 |
| 乙（volatile） | ❌ | volatile 只保证可见性，不保证原子性 |
| 丙（AtomicInteger） | ✅ | 原子类保证原子性 |
| 丁（synchronized） | ✅ | 互斥锁保证原子性 |

---

### 🔀 有序性（Ordering）

#### 🎯 定义

> 程序代码的**实际执行顺序**可能和**书写顺序**不一致，因为编译器和 CPU 会"指令重排序"优化性能。

- **单线程下**：重排不影响结果（as-if-serial 语义）
- **多线程下**：可能出大问题

#### 🔥 经典案例：DCL 单例模式（面试高频）

```java
class Singleton {
    private static Singleton instance;   // ⚠️ 没有 volatile

    public static Singleton getInstance() {
        if (instance == null) {                    // 第一次检查
            synchronized (Singleton.class) {
                if (instance == null) {            // 第二次检查
                    instance = new Singleton();    // ⚠️ 这一行会被重排！
                }
            }
        }
        return instance;
    }
}
```

`instance = new Singleton()` 实际是 3 步：
```
① 分配内存空间
② 初始化对象（调用构造方法）
③ 把内存地址赋给 instance
```

重排序可能变成 ①→③→②：
```
时刻1: 线程A 执行 ① 分配内存
时刻2: 线程A 执行 ③ 把地址赋给 instance（instance != null，但对象没初始化！）
时刻3: 线程B 第一次检查 instance == null？→ false！直接 return
时刻4: 线程B 拿到"半成品"对象 → 💥 NPE
```

#### ✅ 解决：加 `volatile` 禁止重排序

```java
private static volatile Singleton instance;   // ← volatile 禁止 ②③ 重排
```

---

### 📊 volatile 的两大作用汇总

| 作用 | 说明 |
|------|------|
| ① 保证可见性 | 强制读写主内存 |
| ② 禁止指令重排序 | 通过内存屏障（memory barrier） |

> ⚠️ volatile **不保证原子性**（count++ 仍不安全）

---

### 📖 happens-before 规则（Phase 1 详讲）

Java 定义的"先行发生"规则，规定哪些操作的结果对后续操作可见：

| 规则 | 含义 |
|------|------|
| 程序顺序规则 | 同一线程内，前面的操作 happens-before 后面的 |
| 监视器锁规则 | unlock happens-before 后续对同一把锁的 lock |
| volatile 规则 | 写 volatile 变量 happens-before 后续读同一变量 |
| 传递性 | A happens-before B，B happens-before C → A happens-before C |

---

### 🎯 三大问题总结表

| 问题 | 含义 | 解决工具 | volatile 能解决？ |
|------|------|---------|----------------|
| **可见性** | 一个线程的修改，另一个看不到 | `volatile` / `synchronized` | ✅ 能 |
| **原子性** | 操作被中途打断 | `synchronized` / `Lock` / `AtomicXxx` | ❌ 不能 |
| **有序性** | 执行顺序 ≠ 书写顺序 | `volatile`（禁止重排）/ `happens-before` | ✅ 能 |

---

# Phase 1: 第一章 再谈多线程（学习中）

## 1.1 synchronized 的底层实现（已完成）

### 🔍 synchronized 在字节码层面的两种体现

#### 方式 1：同步代码块 → `monitorenter` / `monitorexit` 指令

```java
public void inc() {
    synchronized (lock) { count++; }
}
```

字节码（javap 反汇编）：
```
public void inc();
   6: monitorenter          ← 加锁
  18: monitorexit           ← 正常退出，释放锁
  22: astore_2              ← 异常处理
  24: monitorexit           ← 异常退出，也释放锁（编译器自动加！）
```

**注意**：有两个 `monitorexit`！
- 第 1 个：正常退出释放锁
- 第 2 个：**异常时也释放锁**（这就是 synchronized 出异常自动释放锁的原因——字节码层面就保证了）

#### 方式 2：同步方法 → `ACC_SYNCHRONIZED` 标记

```java
public synchronized void incSync() { count++; }
```

字节码：
```
public synchronized void incSync();
   flags: (0x0021) ACC_PUBLIC, ACC_SYNCHRONIZED   ← 方法标志位
   // 没有 monitorenter/monitorexit 指令！
```

JVM 看到方法有 `ACC_SYNCHRONIZED` 标记 → 自动在方法进入时加锁、退出时解锁。

### 📊 两种写法对比

| 写法 | 字节码表达 | 锁信息存在哪 |
|------|----------|------------|
| `synchronized void m()` | `ACC_SYNCHRONIZED` 标记 | 对象头（Mark Word）|
| `synchronized(this){...}` | 显式 `monitorenter`/`monitorexit` | 对象头（Mark Word）|

> **两种写法锁的都是同一个对象，锁信息都存在对象头的 Mark Word 里。区别只是 JVM 实现加锁的"指令方式"不同。**

### 🔧 真实字节码演示

测试文件：[SyncBytecodeDemo.java](file:///f:/learn/demo/SyncBytecodeDemo.java)

反汇编命令：
```powershell
javac SyncBytecodeDemo.java
javap -c -v SyncBytecodeDemo.class
```

---

## 1.2 Java 对象头与 Mark Word（已完成）

### 📦 Java 对象的内存布局

```
┌─────────────────────────────────────────┐
│           Java 对象内存布局                │
├─────────────────────────────────────────┤
│  对象头 (Object Header)                   │  ← 锁信息在这里！
│  ┌─────────────────┬───────────────────┐ │
│  │  Mark Word      │  Klass Pointer    │ │
│  │  (64 bit)       │  (类型指针)        │ │
│  └─────────────────┴───────────────────┘ │
├─────────────────────────────────────────┤
│  实例数据 (Instance Data)                 │  ← 你写的字段
├─────────────────────────────────────────┤
│  对齐填充 (Padding)                       │  ← 8字节对齐
└─────────────────────────────────────────┘
```

### 🔑 Mark Word 的内容（64 bit）

| 内容 | 说明 |
|------|------|
| hashCode | 对象的哈希值（`hashCode()` 从这拿） |
| 分代年龄 | GC 用的（对象熬过几轮垃圾回收） |
| **锁标志位** | **当前锁状态**（无锁/偏向/轻量级/重量级） |
| 线程 ID | 偏向锁时，记录"偏向哪个线程" |
| 指针 | 轻量级/重量级锁时，指向锁记录或 monitor |

### 📊 Mark Word 的 4 种锁状态

| 锁状态 | 标志位 | Mark Word 存了啥 | 场景 |
|--------|-------|-----------------|------|
| **无锁** | 01 | hashCode、GC年龄 | 没人用 |
| **偏向锁** | 01 | 线程ID | 只有一个线程用（优化） |
| **轻量级锁** | 00 | 指向栈中锁记录的指针 | 两个线程轻度竞争 |
| **重量级锁** | 10 | 指向 monitor 的指针 | 激烈竞争 |

### 💡 对象占用空间

`new Object()` 即使没字段，也占空间（对象头）：
- 64 位 JVM：Mark Word（8字节）+ Klass Pointer（8字节）= 16 字节
- 开启压缩指针：Mark Word（8字节）+ Klass Pointer（4字节）= 12 字节，对齐到 16 字节

---

## 1.3 锁升级机制（已完成）

> JDK 6 之前，synchronized 只有"重量级锁"——一加锁就找操作系统帮忙，开销大。JDK 6 后引入**锁升级**：根据竞争激烈程度，自动选择不同"重量"的锁。

### 🔥 重量级锁为什么"重"？

```
普通操作（用户态）：    代码直接跑，很快
重量级锁操作（内核态）：要"请操作系统帮忙"→ 系统调用 → 切换内核态 → 很慢！
```

| 操作 | 代价 |
|------|------|
| 线程阻塞（挂起） | 操作系统介入，运行态→阻塞态，保存现场 |
| 线程唤醒 | 操作系统介入，阻塞态→运行态，恢复现场 |
| 用户态↔内核态切换 | 每次切换耗时，是普通操作的几十倍 |

### 📊 三级锁设计

#### 🔵 偏向锁（Biased Locking）—— 单线程场景

```
第一次：线程A用锁 → Mark Word 记录 A 的线程 ID（贴标签"A 专用"）
之后：A 每次用锁，比对线程 ID 是自己 → 直接进，不用抢 ✅
只有别的线程来抢时，才撤销偏向，升级锁
```

- **Mark Word 存**：线程 ID
- **开销**：几乎为 0（只比对线程 ID）
- ⚠️ JDK 15 后被废弃（收益不大，维护复杂），但面试常考

#### 🟡 轻量级锁（Lightweight Lock）—— 轻度竞争

```
A、B 偶尔抢锁：
- 用 CAS 尝试抢锁
- 抢到了就用，没抢到就"自旋"（原地转圈）再试
- 不找操作系统！
```

- **Mark Word 存**：指向栈中锁记录（Lock Record）的指针
- **开销**：CAS（用户态，不找操作系统）
- **关键**：用"自旋"代替"阻塞"，省去系统调用

#### 🔴 重量级锁（Heavyweight Lock）—— 激烈竞争

```
10 个线程激烈抢锁，自旋太浪费 CPU
→ 升级为重量级锁：抢不到的线程去"睡觉"（阻塞）
→ 锁空了，操作系统叫醒一个
```

- **Mark Word 存**：指向 monitor（ObjectMonitor）的指针
- **开销**：系统调用（用户态→内核态切换）
- **关键**：抢不到的线程真的阻塞（不消耗 CPU），但唤醒代价大

### 📈 锁升级路径（只能升级，不能降级）

```
   无锁 ──第一次有线程用──▶ 偏向锁
                              │
                         第二个线程来竞争
                              ▼
                          轻量级锁
                              │
                         自旋失败（竞争激烈）
                              ▼
                          重量级锁
```

| 升级触发条件 | 升级到 |
|------------|-------|
| 第一次有线程获取锁 | 偏向锁 |
| 出现第二个线程竞争 | 轻量级锁 |
| 自旋超过阈值还没抢到 | 重量级锁 |

> ⚠️ 锁升级是**单向**的，一旦升级不能降级（除非锁完全释放后空闲期被 GC 重置）

### 🔑 重要：锁升级是 JVM 自动做的，你不用写代码

你永远只写 `synchronized(lock){...}`，三种锁都是 JVM 运行时自动选择：
- 你不用写偏向锁/轻量级锁/重量级锁的专用语法
- JVM 根据 Mark Word 的状态自动判断用哪种锁

### 🍳 完整厨师类比对照表

| 锁类型 | 厨师类比 | Mark Word 存啥 | 开销 |
|--------|---------|---------------|------|
| 偏向锁 | 锅上贴"张三专用"标签 | 线程 ID | 几乎为 0 |
| 轻量级锁 | 两人抢，原地转圈等（自旋） | 栈中锁记录指针 | CAS（用户态）|
| 重量级锁 | 抢不到的去睡觉（阻塞），保安叫醒 | monitor 指针 | 系统调用（内核态）|

### 📝 验证题答案

场景：A 先用锁很久没人抢，后 B 来抢，自旋 10 次没抢到。

锁状态变化：
```
① 无锁 → ② 偏向锁（A）→ ③ 轻量级锁（B 来竞争）→ ④ 重量级锁（自旋失败）
```

### ❓ 为什么竞争激烈时要升级重量级锁？

自旋的坏处：浪费 CPU。10 个线程自旋 = 10 个 CPU 核心全在转圈干等。
重量级锁让抢不到的线程阻塞（睡觉），把 CPU 让出来干别的活。

---

## 1.4 锁优化：锁消除与锁粗化（已完成）

> JVM 还有两个"偷偷优化" synchronized 的手段，都是自动做的，程序员不用管。

### 🗑️ 锁消除（Lock Elimination）

> JVM 通过**逃逸分析**，发现锁对象不可能被其他线程访问 → **自动删除锁**。

```java
// 优化前：每次 append 都加锁
StringBuffer sb = new StringBuffer();   // sb 是局部变量
sb.append("a");   // synchronized
sb.append("b");   // synchronized
sb.append("c");   // synchronized

// JVM 优化后（锁消除）：sb 没逃逸出方法，删掉所有锁
sb.append("a");   // 无锁 ✅
sb.append("b");   // 无锁 ✅
sb.append("c");   // 无锁 ✅
```

- **原理**：逃逸分析在 JIT 编译时分析出 sb 是局部变量、不逃逸 → 删 synchronized
- **经典场景**：StringBuffer、Vector、Hashtable 在单线程代码里局部使用时

### 🔗 锁粗化（Lock Coarsening）

> 连续多次对**同一对象**加锁解锁 → JVM **合并成一次大锁**。

```java
// 优化前：加锁解锁 1000 次
for (int i = 0; i < 1000; i++) {
    synchronized (lock) { count++; }
}

// JVM 优化后（锁粗化）：合并成 1 次
synchronized (lock) {
    for (int i = 0; i < 1000; i++) { count++; }
}
```

- **原理**：连续锁同一对象，中间没别的代码需要锁 → 合并更高效

### 📊 两种优化对比

| 优化 | 触发条件 | 效果 | 时机 |
|------|---------|------|------|
| **锁消除** | 锁对象不逃逸（局部变量） | 删掉所有锁 | JIT 编译时（逃逸分析） |
| **锁粗化** | 连续多次锁同一对象 | 合并成一次锁 | JIT 编译时 |

> 共同点：都是 JVM **自动**做的，写 synchronized 就行，JVM 帮你优化到最优。

## 1.5 JMM 八大原子操作（已完成）

> 把"线程读写变量"拆解成具体的原子步骤。每个操作都不可分割。

### 📋 8 大操作一览

| 操作 | 作用于 | 干什么 | 厨师类比 |
|------|-------|--------|---------|
| **lock** | 主内存 | 锁定变量（独占） | 锁住菜单板 |
| **unlock** | 主内存 | 解锁 | 解锁菜单板 |
| **read** | 主内存 | 从主内存读变量值，准备传输 | 从菜单板"抄"下来 |
| **load** | 工作内存 | 把 read 读到的值存入工作内存 | 抄到自己小本子 |
| **use** | 工作内存 | 把工作内存的值传给执行引擎 | 看小本子，拿去算 |
| **assign** | 工作内存 | 执行引擎结果赋给工作内存 | 算完记回小本子 |
| **store** | 工作内存 | 把工作内存的值传到主内存 | 从小本子抄出 |
| **write** | 主内存 | 把 store 传来的值写入主内存 | 写到菜单板 |

### 🔑 配对规则

```
读取流程（主内存 → CPU）：
  read ──▶ load ──▶ use

写入流程（CPU → 主内存）：
  assign ──▶ store ──▶ write

加锁流程：
  lock ──▶ ...操作... ──▶ unlock
```

- read 和 load **必须成对**
- store 和 write **必须成对**
- lock 和 unlock **不一定每次都要**（synchronized 才用）

### 🔥 count++ 的完整 8 步

```java
synchronized (lock) {
    count++;
}
```

| 步骤 | 操作 | 干什么 |
|------|------|--------|
| ① | lock | 进入 synchronized，锁定 |
| ② | read | 从主内存读 count 值 |
| ③ | load | 装入工作内存 |
| ④ | use | 传给执行引擎 |
| ⑤ | assign | 执行引擎算 +1，赋值给工作内存 |
| ⑥ | store | 工作内存的值传到主内存 |
| ⑦ | write | 写入主内存 |
| ⑧ | unlock | 退出 synchronized，解锁 |

### ⚠️ 关键：锁覆盖整个过程

```
lock ──────────────────────────── unlock
  │ read → load → use → assign → store → write │
  └──────────── 锁保护这一整段 ────────────┘
```

锁的作用：保证 ②~⑦ 不被别的线程打断 → 这就是 synchronized 实现"原子性"的原理！

### 📝 记忆口诀

```
读写各三步，加锁在两头：
  lock → read → load → use       （读：主内存→CPU）
       → assign → store → write  （写：CPU→主内存）
                              → unlock
```

## 1.6 volatile 的内存屏障原理（已完成）

> volatile 通过**内存屏障（Memory Barrier）**实现"可见性"和"禁止重排序"两大作用。

### 📖 内存屏障概念

一道"栅栏"，告诉 CPU/编译器：**栅栏两边的指令不能跨过栅栏重排**。

### 4 种屏障

| 屏障 | 全称 | 作用 | 厨师类比 |
|------|------|------|---------|
| **StoreStore** | 写-写屏障 | 前面的写必须在后面的写之前完成 | 抄菜单板前，先把手头要写的写完 |
| **StoreLoad** | 写-读屏障 | 写必须在后续读之前完成（最强） | 写完菜单板后，确保后面读的人看到最新版 |
| **LoadLoad** | 读-读屏障 | 前面的读必须在后面的读之前完成 | 读完菜单板，后面读的也是最新的 |
| **LoadStore** | 读-写屏障 | 前面的读必须在后面的写之前完成 | 读完菜单板，后面的写不会乱 |

### 📊 volatile 的屏障插入策略

#### volatile 写

| 位置 | 插入的屏障 | 作用 |
|------|----------|------|
| 写**之前** | StoreStore | 确保前面的普通写先完成 |
| 写**之后** | StoreLoad | 确保这次写对后续读可见（保证可见性！） |

#### volatile 读

| 位置 | 插入的屏障 | 作用 |
|------|----------|------|
| 读**之后** | LoadLoad + LoadStore | 确保这次读在后续读/写之前 |

### 🔍 屏障示例

```
volatile 写 x = 1：

  [普通写] a = 2
  ─── StoreStore 屏障 ─── ← "先把 a=2 写完，再写 x"
  [volatile 写] x = 1
  ─── StoreLoad 屏障 ─── ← "x 写完了，后面读的人一定能看到 x=1"（可见性！）
  [后续读] int y = x
```

### 🎯 volatile 两大作用的底层原理

| volatile 的作用 | 怎么实现的 |
|----------------|----------|
| 保证可见性 | StoreLoad 屏障（写完立刻刷新到主内存，读时直接从主内存读） |
| 禁止重排序 | 4 种屏障配合（指令不能跨屏障重排） |
- 不保证原子性

## 1.7 happens-before 完整规则（已完成）

> happens-before 不是"时间上先发生"，而是"前一个操作的结果对后一个操作可见"。这是 JMM 给程序员的承诺。

### 📋 完整 8 条规则

| # | 规则名 | 含义 | 例子 |
|---|-------|------|------|
| 1 | **程序顺序规则** | 同一线程内，前面的操作 happens-before 后面的 | 线程内 `a=1` 先于 `b=a+1` |
| 2 | **监视器锁规则** | unlock happens-before 后续对同一把锁的 lock | 线程A释放锁 → 线程B获取锁，A的操作对B可见 |
| 3 | **volatile 规则** | 写 volatile 变量 happens-before 后续读同一变量 | 线程A写 volatile x → 线程B读 x，A的操作对B可见 |
| 4 | **线程启动规则** | `Thread.start()` happens-before 子线程的所有操作 | 主线程 start 前写的变量，子线程能看到 |
| 5 | **线程终止规则** | 子线程的所有操作 happens-before `Thread.join()` 返回 | 子线程写的变量，主线程 join 后能看到 |
| 6 | **线程中断规则** | `interrupt()` 调用 happens-before 被中断线程检测到中断 | |
| 7 | **对象终结规则** | 对象初始化完成 happens-before `finalize()` 方法 | |
| 8 | **传递性** | A happens-before B，B happens-before C → A happens-before C | 把多个规则串起来 |

### 🍳 厨师类比记忆

| 规则 | 厨师类比 |
|------|---------|
| 程序顺序 | 一个厨师自己的步骤有先后 |
| 监视器锁 | 厨师A用完锅（解锁）→ 厨师B才能用（加锁），A做的菜B能看到 |
| volatile | 厨师A写"公共菜单板" → 厨师B看菜单板，一定能看到A写的 |
| 线程启动 | 主厨师叫新厨师来（start）→ 之前写的菜单新厨师能看到 |
| 线程终止 | 新厨师下班（join）→ 主厨师能看到新厨师做的所有菜 |
| 传递性 | A告诉B，B告诉C → A间接告诉C |

### 🔑 happens-before 的本质

> **happens-before 不是说"时间上先发生"，而是说"前一个操作的结果对后一个操作可见"。**

JMM 给程序员的承诺：只要你按规则写代码，JVM 保证可见性，不用你自己操心内存屏障。

### 📝 验证题答案

**场景 A（start）**：子线程能读到 x=10 ✅
- 原因：线程启动规则——主线程在 start() 之前的操作 happens-before 子线程的任何操作

**场景 B（join）**：主线程能读到 y=20 ✅
- 原因：线程终止规则——子线程的所有操作 happens-before join() 返回
- join() 隐含"内存同步"：把子线程的工作内存刷新到主内存

---

# Phase 2: 第二章 多线程编程核心（学习中）

## 2.1 Lock 接口 vs synchronized（已完成）

### ❓ 为什么有了 synchronized 还要造 Lock？

synchronized 有 5 大局限，Lock 逐一解决：

| 局限 | synchronized | Lock 的解法 |
|------|-------------|------------|
| ① 不能中断 | 死等 | `lockInterruptibly()` 可被中断 |
| ② 不能超时 | 死等 | `tryLock(timeout)` 可设超时 |
| ③ 不能试锁 | 必须等 | `tryLock()` 抢不到立刻返回 false |
| ④ 只有一个等待队列 | 单 wait/notify | `newCondition()` 可开多个 |
| ⑤ 锁释放不灵活 | 必须出代码块才释放 | `unlock()` 可在任意位置调 |

### 📖 Lock 接口核心方法

```java
public interface Lock {
    void lock();                    // 普通加锁
    void lockInterruptibly();       // 可中断加锁
    boolean tryLock();              // 试锁（抢不到立刻返回 false）
    boolean tryLock(long time, TimeUnit unit);  // 超时试锁
    void unlock();                  // 解锁（必须手动调！）
    Condition newCondition();       // 创建条件变量（可开多个）
}
```

### 🔧 用法对比

```java
// synchronized 写法（自动释放）
synchronized (lock) {
    // 临界区
}

// Lock 写法（手动释放，必须放 finally）
Lock lock = new ReentrantLock();
lock.lock();
try {
    // 临界区
} finally {
    lock.unlock();   // 必须放 finally！防异常时锁不释放
}
```

### ⚠️ Lock 底层实现 ≠ synchronized

- synchronized → JVM 内置 monitor（C++ 实现，对象头 + ObjectMonitor）
- Lock → 纯 Java 代码，用 **CAS + AQS** 实现

Lock 是 JUC 用 Java 代码"重新造"的锁，不依赖 synchronized。AQS 原理在 2.6 节详讲。

## 2.2 ReentrantLock 可重入锁（已完成）

### 📖 什么是"可重入"

> **同一个线程**可以多次获取**同一把锁**，不会死锁。内部用**计数器**记录"重入了几次"。

### 🔧 计数器原理

```
每次 lock()：
  if (当前线程 == 持有锁的线程)
      计数器++   ← 重入，直接进
  else
      排队等      ← 不是同一线程，得等

每次 unlock()：
  计数器--
  if (计数器 == 0)
      真正释放锁   ← 归零才释放
```

### 📊 示例

```
线程A 调 methodA()：
  lock.lock()     → 计数器 = 1
    调 methodB()：
    lock.lock()   → 发现还是线程A！计数器 = 2
    lock.unlock() → 计数器 = 1（没归零，不真正释放）
  lock.unlock()   → 计数器 = 0（归零！真正释放锁）
```

### 🍳 厨师类比

| 场景 | 不可重入（错误） | 可重入（正确） |
|------|----------------|--------------|
| 厨师A占着锅，又想用同一口锅 | "你已经占了，不能再用！" 死锁 | "是你啊，再用一次没事，记一笔" ✅ |
| 厨师A用完一次 | 直接让出锅 | 减一笔，全用完才让出 |

### ✅ synchronized 也是可重入的！

```java
synchronized (lock) {           // 第一次拿锁
    synchronized (lock) {       // 第二次拿同一把锁 → 不会死锁！
        System.out.println("ok");
    }
}
```

### 📊 可重入锁对比

| | synchronized | ReentrantLock |
|---|-------------|---------------|
| 可重入？ | ✅ 是 | ✅ 是 |
| 计数器在哪 | monitor 的 count | AQS 的 state |
| 漏释放会怎样 | 不会漏（自动释放） | **会漏！必须手动配对** |

### 📖 使用场景

**场景 1：方法嵌套调用**
```java
public void add(int n) {
    lock.lock();           // ① 加锁
    try {
        count += n;
        print();           // 调用另一个也加锁的方法
    } finally {
        lock.unlock();     // ③ 解锁
    }
}
public void print() {
    lock.lock();           // ② 重入！
    try { System.out.println(count); }
    finally { lock.unlock(); }
}
```

**场景 2：递归调用**
```java
public int factorial(int n) {
    lock.lock();
    try {
        if (n <= 1) return 1;
        return n * factorial(n - 1);   // 递归重入
    } finally {
        lock.unlock();
    }
}
```

**场景 3：子类调用父类的同步方法**
```java
class Parent {
    synchronized void method() { ... }
}
class Child extends Parent {
    synchronized void method() {
        super.method();   // 子类加锁后调父类 → 重入
    }
}
```

### ⚠️ 关键教训

- lock/unlock 必须**严格配对**，漏一个 unlock 就死锁
- unlock 必须放 `finally` 块里，防异常导致漏释放
- synchronized 的优势：自动释放，不怕漏
## 2.3 公平锁 vs 非公平锁（已完成）

### 🔵 公平锁（Fair Lock）

> 线程按**先来后到**的顺序获取锁（FIFO 队列）。

- ✅ 不会饥饿（每个线程都能等到）
- ❌ 吞吐量低（每次线程切换有开销）

### 🟡 非公平锁（Non-Fair Lock）

> 新来的线程**直接试抢**锁，抢不到再排队。

- ✅ 吞吐量高（省去线程切换开销）
- ❌ 可能饥饿（某线程可能一直被插队）

### 📊 ReentrantLock 的构造方法

```java
new ReentrantLock();        // 默认非公平锁！
new ReentrantLock(true);    // true = 公平锁
new ReentrantLock(false);   // false = 非公平锁
```

### 📊 完整对比

| | 公平锁 | 非公平锁 |
|---|-------|---------|
| 获取顺序 | 先来后到（FIFO） | 新来可插队 |
| 饥饿 | ❌ 不会 | ✅ 可能 |
| 吞吐量 | 低 | 高 |
| 线程切换 | 频繁 | 少 |
| ReentrantLock | `new ReentrantLock(true)` | `new ReentrantLock()` 默认 |
| synchronized | ❌ 不支持 | ✅ 只能非公平 |

### 🍳 厨师类比

| | 公平锁 | 非公平锁 |
|---|-------|---------|
| 锅空了给谁 | 等最久的人 | 谁手快给谁 |
| 好处 | 人人有饭吃 | 整体效率高 |
| 坏处 | 效率低 | 有人可能饿死 |

### 🔧 为什么非公平锁吞吐量高？

```
公平锁：线程A 释放锁 → 唤醒队首线程B → B 从阻塞→运行（切换开销大）
非公平锁：线程A 释放锁 → 线程A 可能立刻又抢到 → 不用切换（省开销）
```

### 📌 实战原则

> **高并发场景 → 非公平锁（吞吐量优先）**
> **需要严格顺序 → 公平锁（很少用）**

面试标准答案："高并发电商扣库存，用非公平锁。因为非公平锁吞吐量更高，高并发下性能更好。饥饿风险在实际中很少发生。如果需要保证订单顺序，应该用消息队列而非锁。"

## 2.4 Condition 条件变量（已完成）

### 📖 Condition 是什么

> Condition 是 Lock 配套的"wait/notify 升级版"。一个 Lock 可以创建**多个** Condition，每个 Condition 是独立的等待队列。

### 📊 API 对照表

| synchronized | Lock + Condition | 作用 |
|-------------|-----------------|------|
| `wait()` | `await()` | 等待 |
| `notify()` | `signal()` | 唤醒一个 |
| `notifyAll()` | `signalAll()` | 唤醒所有 |

### 🔑 核心优势：多个等待队列

```
synchronized：只有一个等待队列
  → notifyAll 唤醒所有人（生产者 + 消费者都醒）

Lock + Condition：可以有多个等待队列
  → notFull.signal() 只唤醒等"没满"的生产者
  → notEmpty.signal() 只唤醒等"没空"的消费者
```

### 🔧 完整代码：多 Condition 生产者-消费者

```java
class BoundedBuffer {
    private final Lock lock = new ReentrantLock();
    private final Condition notFull  = lock.newCondition();  // 条件1：没满
    private final Condition notEmpty = lock.newCondition();  // 条件2：没空
    private final Queue<Integer> queue = new LinkedList<>();
    private final int capacity = 10;

    public void put(int item) throws InterruptedException {
        lock.lock();
        try {
            while (queue.size() == capacity) {
                notFull.await();     // 满了 → 在 notFull 队列等
            }
            queue.add(item);
            notEmpty.signal();       // 有货了 → 只唤醒消费者！
        } finally {
            lock.unlock();
        }
    }

    public int take() throws InterruptedException {
        lock.lock();
        try {
            while (queue.isEmpty()) {
                notEmpty.await();    // 空了 → 在 notEmpty 队列等
            }
            int item = queue.poll();
            notFull.signal();        // 有空位了 → 只唤醒生产者！
        } finally {
            lock.unlock();
        }
        return item;
    }
}
```

### 📊 对比

| | synchronized | Condition |
|---|-------------|-----------|
| 等待队列数量 | 1 个 | **多个**（notFull + notEmpty） |
| 唤醒精度 | notifyAll 唤醒所有人 | signal 精准唤醒某一类 |
| 生产者放完货 | 唤醒所有人 | **只唤醒消费者** |
| 消费者取完货 | 唤醒所有人 | **只唤醒生产者** |

### ⚠️ 重要规则

| 规则 | 说明 |
|------|------|
| ✅ 必须**同一个 Lock** | await 和 signal 都要在同一个 lock 的 lock/unlock 之间 |
| ✅ 必须**同一个 Condition** | 在 condA 上 await，就要用 condA.signal 唤醒 |
| ❌ **不能同一个线程** | 必须是不同线程（A 等、B 唤醒） |

### 📊 何时用 Condition vs wait/notify？

| 场景 | 推荐 |
|------|------|
| 简单的互斥同步 | synchronized（简单） |
| 需要多个等待队列 | Lock + Condition |
| 生产者-消费者 | Lock + Condition（精准唤醒） |
| 需要 tryLock/超时/中断 | Lock |
- ConcurrentHashMap
- 阻塞队列（ArrayBlockingQueue / LinkedBlockingQueue / SynchronousQueue）

## 2.4 原子类
- AtomicInteger / AtomicLong / AtomicReference
- CAS 原理

## 2.5 线程协作工具
- CountDownLatch
- CyclicBarrier
- Semaphore

---

# Phase 3: 第三章 并发编程进阶（待学习）

## 3.1 线程池 ThreadPoolExecutor
### 7 大参数
- corePoolSize：核心线程数
- maximumPoolSize：最大线程数
- keepAliveTime：非核心线程空闲时间
- unit：时间单位
- workQueue：等待队列
- threadFactory：线程工厂
- handler：拒绝策略

### 拒绝策略
- AbortPolicy（默认，抛异常）
- CallerRunsPolicy（提交者自己跑）
- DiscardOldestPolicy（丢队列最老任务）
- DiscardPolicy（直接丢弃）

### 任务类型与线程数
- CPU 密集型：核心数 + 1
- IO 密集型：核心数 × 2

## 3.2 Executors 工具类
- newFixedThreadPool
- newSingleThreadExecutor
- newCachedThreadPool

## 3.3 Fork/Join 框架
## 3.4 CompletableFuture 异步编程

---

# 复习题与答案

## ✅ 题 1：进程 vs 线程类比

**场景**：餐厅后厨方案 A（独立小厨房）vs 方案 B（大厨房共享）

**问题**：
1. 两个厨师同时想用同一口锅怎么办？
2. 跨厨房搬食材为什么麻烦？
3. 一个 Java 程序更像哪个方案？

**答案**：
1. 加互斥锁，同一时刻只允许一个厨师用。在方案 B 中这是"线程锁"（synchronized/Lock）。
2. 跨厨房 = 进程间通信 IPC，开销大、数据不直接共享。
3. Java 程序 = 一个进程 = 方案 B 的大厨房，线程 = 厨师共享内存。

---

## ✅ 题 2：变量安全性判断

| 代码 | 安全性 | 理由 |
|------|-------|------|
| `Runnable r = () -> System.out.println("hi");` | ✅ 安全 | 无共享变量 |
| `static int count = 0; Runnable r = () -> count++;` | ❌ 不安全 | static 字段全局共享，count++ 非原子 |
| 局部变量 `int local = 0;` 在 lambda 内 | ✅ 安全 | 局部变量每个线程独立一份 |
| `static List<Integer> list = new ArrayList<>(); r = () -> list.add(1);` | ❌ 不安全 | 共享可变对象 ArrayList |

---

## ✅ 题 3：实例字段安全性

```java
class Counter {
    int count = 0;  // 无 static
    public void increment() {
        int temp = count;  // 局部变量 ✅
        temp++;
        count = temp;      // 实例字段 ⚠️
    }
}
```

**判断**：
- `temp` 局部变量 → ✅ 安全
- `count` 实例字段 → ⚠️ 当多个线程访问**同一个 Counter 对象**时不安全
- 整体：❌ 不安全，最终 count 远小于 2000

**关键**：没有 static ≠ 安全！实例字段在"多线程访问同一对象"时就是共享的。

---

## ✅ 题 4：X/Y 对比

```java
// X：不安全 —— 两个线程共用外部 new 的 counter
Counter counter = new Counter();
Runnable r = () -> { for (...) counter.increment(); };
new Thread(r).start();
new Thread(r).start();

// Y：安全 —— 每个线程在 lambda 内部 new 自己的 counter
Runnable r = () -> {
    Counter counter = new Counter();  // 局部变量
    for (...) counter.increment();
};
new Thread(r).start();
new Thread(r).start();
```

---

## ✅ 题 5：线程状态判断

```java
Thread t = new Thread(() -> { Thread.sleep(2000); });
System.out.println(t.getState());  // ① NEW
t.start();
Thread.sleep(1000);
System.out.println(t.getState());  // ② TIMED_WAITING（在 sleep）
t.join();
System.out.println(t.getState());  // ③ TERMINATED
```

| 时刻 | 状态 | 理由 |
|------|------|------|
| ① | NEW | 还没 start() |
| ② | TIMED_WAITING | 已 start()，正在 sleep(2000) |
| ③ | TERMINATED | join() 等待结束后，run() 已执行完 |

---

## 📖 关键术语速查

| 术语 | 含义 |
|------|------|
| 进程 Process | 程序运行实例，独立内存空间 |
| 线程 Thread | 进程内执行单元，共享内存 |
| 并发 Concurrent | 一个执行者任务间切换 |
| 并行 Parallel | 多个执行者真正同时 |
| 互斥锁 | 同一时刻只允许一个线程访问 |
| 上下文切换 | 线程间切换的开销 |
| 线程安全 | 多线程下结果正确 |
| 临界资源 | 被多线程共享的可变数据 |
| CAS | Compare And Swap，无锁算法 |

---

> 📅 学习进度更新：2026-08-01
> 🎉 Phase 0 + Phase 1 全部完成！
> 📍 已掌握：Phase 0 前置知识 + Phase 1 synchronized 底层（字节码/对象头/锁升级/锁优化）、JMM 八大原子操作、volatile 内存屏障、happens-before 完整 8 条规则
> ⏭️ 下一步：Phase 2 第二章 锁框架（Lock/Condition/ReentrantLock/公平锁/读写锁）
