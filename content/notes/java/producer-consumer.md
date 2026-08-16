---
title: "多线程练习：厨师与顾客（生产者-消费者）"
date: "2026-08-16"
tags: ["Java", "多线程", "练习"]
minutes: 15
---

# 需求

1. 有顾客与厨师
2. 厨师每3ms生产一个菜品
3. 顾客每4ms消费一个菜品

# 代码

```java
package com.test;

import com.sun.tools.javac.Main;
import java.util.Date;
import java.util.LinkedList;
import java.util.Queue;

public class AddAndTakeDome {
    //1.生产方法
    //2.消费方法
    //3.货架
    //4.生产进程
    //5.消费进程

    //3.货架
    private static final Queue<Object> List = new LinkedList<>();

    static void main() {
        //4.生产进程
        new Thread(AddAndTakeDome::add, "厨师1").start();
        new Thread(AddAndTakeDome::add, "厨师2").start();

        //5.消费进程
        new Thread(AddAndTakeDome::take,"顾客1").start();
        new Thread(AddAndTakeDome::take,"顾客2").start();
        new Thread(AddAndTakeDome::take,"顾客3").start();
    }

    //1.生产方法
    private static void add(){
        while (true){
            try {
                Thread.sleep(3000);
                synchronized (List){
                    System.out.println(new Date()+":"+Thread.currentThread().getName()+"生产了菜品");
                    List.offer(new Object());
                    List.notifyAll();
                }
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    //2.消费方法
    private static void take(){
        while (true){
            try {
                synchronized (List){
                    while (List.isEmpty()) List.wait();
                    System.out.println(new Date()+":"+Thread.currentThread().getName()+"食用了菜品");
                    List.poll();
                }
                Thread.sleep(4000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

# 代码解析

## 代码主体

```java
    static void main() {
        //4.生产进程
        new Thread(AddAndTakeDome::add, "厨师1").start();
        new Thread(AddAndTakeDome::add, "厨师2").start();

        //5.消费进程
        new Thread(AddAndTakeDome::take,"顾客1").start();
        new Thread(AddAndTakeDome::take,"顾客2").start();
        new Thread(AddAndTakeDome::take,"顾客3").start();
    }
```

代码主体承担了多线程的任务，通过多个线程的设计可以完成厨师与顾客并行运行

## 货架

```java
    //3.货架
    private static final Queue<Object> List = new LinkedList<>();
```

使用了队列来保障商品的进出是符合先进先出的情况，保障货架中的商品不会产生残留，虽然栈貌似也可以完成

## 生产模块

```java
    //1.生产方法
    private static void add(){
        while (true){
            try {
                Thread.sleep(3000);
                synchronized (List){
                    System.out.println(new Date()+":"+Thread.currentThread().getName()+"生产了菜品");
                    List.offer(new Object());
                    List.notifyAll();
                }
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
```

生产模块产品的生产并将其放到了货架上等待顾客取出商品

`List.notifyAll();`这个方法是为了唤醒因为没有商品而持续等待的顾客

## 消费模块

```java
    //2.消费方法
    private static void take(){
        while (true){
            try {
                synchronized (List){
                    while (List.isEmpty()) List.wait();
                    System.out.println(new Date()+":"+Thread.currentThread().getName()+"食用了菜品");
                    List.poll();
                }
                Thread.sleep(4000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
```

消费模块中首先要注意的是当货架上没有商品的情况，这个必须第一时间进行判断

在这里使用`while`循环而不是使用`if`是因为需要多次判断货架中是否有商品，而不是单次判断

在这里使用`List.wait()`方法这会造成进程的阻塞，只有当唤醒时才会再次使用，所以要在上面的生产模块中添加`List.notifyAll()`以唤醒方法

## 总结

两个模块都使用了`synchronized`来保障了进程的同步性，防止出现两个进程出现不安全的情况。