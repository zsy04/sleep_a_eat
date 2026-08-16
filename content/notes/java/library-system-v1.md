---
title: "图书管理系统 1.0：控制台增删改查"
date: "2026-08-16"
tags: ["Java", "项目实战", "图书管理系统"]
minutes: 20
---

# 需求

1. 具有记忆功能
2. 具有增删改查的功能
3. 在控制台上运行

# 代码示例

## 实现代码

```java
package com.test.LibryManangementStstem;

import java.io.*;
import java.util.*;

public class SystemDome {
    private static  LinkedList<Book> LIST ;

    static void main() throws Exception{

        Scanner scanner = new Scanner(System.in);
        lode();
        System.out.println("正在初始化....");
        while (true){
            System.out.println("=========图书管理系统===========");
            System.out.println("1.添加书籍");
            System.out.println("2.删除书籍");
            System.out.println("3.查询书籍");
            System.out.println("4.修改书籍");
            System.out.println("5.退出系统");
            System.out.println("===============================");

            switch (scanner.nextLine()){
                case "1" -> {
                    add(scanner);
                    break;
                }
                case "2" -> {
                    delete(scanner);
                    break;
                }
                case "3" -> {
                    get();
                    break;
                }
                case "4" -> {
                    modify(scanner);
                    break;
                }
                case "5" -> {
                    System.out.println("正在保存文件.....");
                    save();
                    System.out.println("正在退出系统....");
                    return;
                }
            }
        }
    }

    //保存文件
    private static void save() throws Exception{

        ObjectOutputStream Ool = new ObjectOutputStream(new FileOutputStream("F:\\java\\project\\new\\src\\com\\test\\LibryManangementStstem\\BookName.txt"));
        Ool.writeObject(LIST);
        Ool.flush();

    }

    @SuppressWarnings("unchecked")
    //载入到系统内
    public static void lode() throws Exception{
        File file = new File("F:\\java\\project\\new\\src\\com\\test\\LibryManangementStstem\\BookName.txt");
        if (file.exists()){
            ObjectInputStream Oil = new ObjectInputStream(new FileInputStream(file));
            LIST = (LinkedList<Book>) Oil.readObject();
        }else {
            LIST = new LinkedList<>();
        }

    }

    //添加书籍
    private static void add(Scanner scanner) throws Exception {
        //输入书籍的基本信息
        System.out.print("输入书名：");
        String name = scanner.nextLine();
        System.out.print("输入作者名：");
        String author = scanner.nextLine();
        System.out.print("输入价格：");
        int price = scanner.nextInt();
        //将书籍的基本信息储存到类中
        Book book = new Book(name, author, price);
        System.out.println("已保存书籍"+book.getName());
        //将类保存到链表中
        LIST.add(book);
        save();
        System.out.println("保存成功");
    }

    //删除书籍
    private static void delete(Scanner scanner){


        int index = scanner.nextInt();
        if(index > LIST.size()+1 || index <= 0){
            System.out.println("删除失败，请输入正确书号");
        }
        System.out.print("要删除几号书");
        LIST.remove(index-1);
        System.out.println("删除"+index+"号书成功");

    }

    //查询书籍
    private static void get(){
        for (int i = 0; i < LIST.size(); i++) {
            System.out.println((i+1) + "."+ LIST.get(i));
        }
    }

    //修改书籍
    private static void modify(Scanner scanner) throws Exception {

        System.out.print("输入你要修改的书号：");
        int index = scanner.nextInt();

        System.out.print("要修改几号书");
        while(index > LIST.size()+1 || index <= 0){
            System.out.println("修改失败，请输入正确书号:");
            index = scanner.nextInt();
        }
        Book book = LIST.get(index-1);
        System.out.print("要修改哪一项：");
        scanner.nextLine();
        switch (scanner.nextLine()){
            case "name" -> {
                System.out.print("修改为：");
                book.setName(scanner.nextLine());
            }
            case "author" ->{
                System.out.print("修改为：");
                book.setAuthor(scanner.nextLine());
            }
            case "price" ->{
                System.out.print("修改为：");
                book.setPrice(scanner.nextInt());
            }
        }
        save();
        System.out.println("修改"+index+"号书成功");
    }
}
```

## Book类

```java
package com.test.LibryManangementStstem;


import java.io.Serializable;

public class Book  implements Serializable {

    private String name;
    private String author;
    private int price;

    public Book(String name, String author, int price) {
        this.name = name;
        this.author = author;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    @Override
    public String toString() {
        return "《"+name+"》"+"作者："+author+"("+price+"$";
    }
}
```

# 分析

## 代码主体

```java
static void main() throws Exception{

        Scanner scanner = new Scanner(System.in);
        lode();
        System.out.println("正在初始化....");
        while (true){
            System.out.println("=========图书管理系统===========");
            System.out.println("1.添加书籍");
            System.out.println("2.删除书籍");
            System.out.println("3.查询书籍");
            System.out.println("4.修改书籍");
            System.out.println("5.退出系统");
            System.out.println("===============================");

            switch (scanner.nextLine()){
                case "1" -> {
                    add(scanner);
                    break;
                }
                case "2" -> {
                    delete(scanner);
                    break;
                }
                case "3" -> {
                    get();
                    break;
                }
                case "4" -> {
                    modify(scanner);
                    break;
                }
                case "5" -> {
                    System.out.println("正在保存文件.....");
                    save();
                    System.out.println("正在退出系统....");
                    return;
                }
            }
        }
    }
```

在主体内实现了对不同功能的跳转与整合，给出了用户基本的操作指南

通过`switch-case`来实现对功能的选择

## 记忆模块

存储模块与载入模块共同组成了记忆模块

两个模块都使用了IO流来对文件实现了保存于载入

### 存储模块

```java
private static void save() throws Exception{

        ObjectOutputStream Ool = new ObjectOutputStream(new FileOutputStream("...\\BookName.txt"));
        Ool.writeObject(LIST);
        Ool.flush();

    }
```

通过ObjectOutPutStream来将数据存储到内存当中

在当中要注意的是ObjectOutPutStream的构造必须是其他的流

### 载入模块

```java
    @SuppressWarnings("unchecked")
    //载入到系统内
    public static void lode() throws Exception{
        File file = new File("...\\BookName.txt");
        if (file.exists()){
            ObjectInputStream Oil = new ObjectInputStream(new FileInputStream(file));
            LIST = (LinkedList<Book>) Oil.readObject();
        }else {
            LIST = new LinkedList<>();
        }
    }
```

通过ObjectOutPutStream来将数据从内存导入到系统当中

在当中要注意的是ObjectInPutStream的构造必须是其他的流

要留意到当内存中没有存储数据的情况下

## 添加模块

```java
    //添加书籍
    private static void add(Scanner scanner) throws Exception {
        //输入书籍的基本信息
        System.out.print("输入书名：");
        String name = scanner.nextLine();
        System.out.print("输入作者名：");
        String author = scanner.nextLine();
        System.out.print("输入价格：");
        int price = scanner.nextInt();
        //将书籍的基本信息储存到类中
        Book book = new Book(name, author, price);
        System.out.println("已保存书籍"+book.getName());
        //将类保存到链表中
        LIST.add(book);
        save();
        System.out.println("保存成功");
    }
```

通过链表来对数据进行保存，因为链表的删除，增加的速度快

记得在存储数据的过程中记得类的构造方法

## 删除模块

```java
    //删除书籍
    private static void delete(Scanner scanner){


        int index = scanner.nextInt();
        if(index > LIST.size()+1 || index <= 0){
            System.out.println("删除失败，请输入正确书号");
        }
        System.out.print("要删除几号书");
        LIST.remove(index-1);
        System.out.println("删除"+index+"号书成功");

    }
```

通过`remove()`方法来进行删除

在删除的时候记得呈现的书号是+1的所以要在删除的过程-1

## 查询模块

```java
    //查询书籍
    private static void get(){
        for (int i = 0; i < LIST.size(); i++) {
            System.out.println((i+1) + "."+ LIST.get(i));
        }
    }
```

为了符合正常的数数习惯在呈现时要+1

## 修改模块

```java
    //修改书籍
    private static void modify(Scanner scanner) throws Exception {

        System.out.print("输入你要修改的书号：");
        int index = scanner.nextInt();

        System.out.print("要修改几号书");
        while(index > LIST.size()+1 || index <= 0){
            System.out.println("修改失败，请输入正确书号:");
            index = scanner.nextInt();
        }
        Book book = LIST.get(index-1);
        System.out.print("要修改哪一项：");
        scanner.nextLine();
        switch (scanner.nextLine()){
            case "name" -> {
                System.out.print("修改为：");
                book.setName(scanner.nextLine());
            }
            case "author" ->{
                System.out.print("修改为：");
                book.setAuthor(scanner.nextLine());
            }
            case "price" ->{
                System.out.print("修改为：");
                book.setPrice(scanner.nextInt());
            }
        }
        save();
        System.out.println("修改"+index+"号书成功");
    }
```

修改的方式可以通过对删除来改造

为了能够更加精准的修改可以通过`switch-case`来设定修改位置

