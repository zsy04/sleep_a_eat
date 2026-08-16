---
title: "集合练习：Collection 的基本操作"
date: "2026-08-16"
tags: ["Java", "集合", "练习"]
minutes: 15
---

# Collection

## 简单练习

```java
package src.com.java_learn.SetLean;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

public class CollectionDome {
    public static void main(String[] args)throws Exception {
        //创建Collection集合并添加元素
        Collection collection = new ArrayList();
        collection.add("格鲁");
        collection.add("崔");
        collection.add("文");
        collection.add("甘");


        System.out.println("集合内个数" + collection.size());
        System.out.println(collection);

        //删除元素
//        collection.remove("格鲁");
//        collection.clear();
//
//        System.out.println(collection);

        //遍历元素
        //1.增强for
        for (Object o : collection) {
            System.out.println(o);
        }

        System.out.println("------------------------");
        //2.迭代器
        Iterator it = collection.iterator();
        while (it.hasNext()){
            //collection.remove("格鲁");
            //在使用迭代器时不能使用collection的删除方法
            System.out.println(it.next());
        }

        //判断
        System.out.println(collection.contains("格鲁"));
        System.out.println(collection.isEmpty());


    }

}
```

代码结果为

```
集合内个数4
[格鲁, 崔, 文, 甘]
格鲁
崔
文
甘
------------------------
格鲁
崔
文
甘
true
false
```

## 保存类信息

```java
package src.com.java_learn.SetLean;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

public class CollectionDome2 {
    public static void main(String[] args) {
        //创建数据
        Student gan = new Student("甘",001);
        Student wen = new Student("闻",002);
        Student cui = new Student("崔",003);


        //创建集合，添加数据
        Collection cot = new ArrayList<>();
        cot.add(gan);
        cot.add(wen);
        cot.add(cui);

        System.out.println("元素个数"+cot.size());
        System.out.println(cot);

        System.out.println("---------------------------------");
        //删除数据
        cot.remove(gan);
        System.out.println(cot.toString());

        System.out.println("---------------------------------");
        //遍历数据
        //1.增强for
        for (Object o : cot) {
            System.out.println(o);
        }
        System.out.println("---------------------------------");
        //2.迭代器
        Iterator it = cot.iterator();

        while (it.hasNext()){
            System.out.println(it.next());
        }

        //判断
        System.out.println(cot.contains(gan));
        System.out.println(cot.isEmpty());
    }
}
```

代码结果为

```
元素个数3
[Student{name='甘', StuNo=1}, Student{name='闻', StuNo=2}, Student{name='崔', StuNo=3}]
---------------------------------
[Student{name='闻', StuNo=2}, Student{name='崔', StuNo=3}]
---------------------------------
Student{name='闻', StuNo=2}
Student{name='崔', StuNo=3}
---------------------------------
Student{name='闻', StuNo=2}
Student{name='崔', StuNo=3}
false
false
```

# List

## 简单练习

```java
package src.com.java_learn.SetLean;

import java.util.ArrayList;
import java.util.List;

public class ListDome {
    List list = new ArrayList<>();

    public static void main(String[] args) {
        //创建List集合，并添加数据
        List list = new ArrayList<>();
        list.add(20);
        list.add(30);
        list.add(40);
        list.add(50);
        list.add(60);
        list.add(70);
        System.out.println("元素个数"+list.size());
        System.out.println(list.toString());

        System.out.println("----------------------");

        //删除数据
        list.remove(0);
        //这里删除的第一时间识别的是下标是一个int类型，所以为了删除数据20这一项所以需要使用Integer来对这个数字进行引用
        list.remove(new Integer(20));
        System.out.println("元素个数"+list.size());
        System.out.println(list.toString());

        System.out.println("----------------------");

        //补充方法
        List subList = list.subList(1,3);
        System.out.println(subList);
        System.out.println("----------------------");
    }
}
```

代码结果为

```
元素个数6
[20, 30, 40, 50, 60, 70]
----------------------
元素个数5
[30, 40, 50, 60, 70]
----------------------
[40, 50]
----------------------
```

# ArrayList

## 简单练习

```java
package src.com.java_learn.SetLean;

import src.com.java_learn.SetLean.Student;

import java.util.ArrayList;

public class ArrayListDome {
    public static void main(String[] args) {
        //创建ArrayList，并添加数据
        ArrayList arrList = new ArrayList();

        Student s1 = new Student("格鲁",00);
        Student s2 = new Student("甘",01);
        Student s3 = new Student("文",02);
        Student s4 = new Student("崔",03);

        arrList.add(s1);
        arrList.add(s2);
        arrList.add(s3);
        arrList.add(s4);
        arrList.add(new Student("文",02));
        System.out.println("元素数量"+arrList.size());
        System.out.println(arrList.toString());

        System.out.println("---------------------------");

        //删除数据
        arrList.remove(s1);
        System.out.println("元素数量"+arrList.size());
        System.out.println(arrList.toString());
        System.out.println("---------------------------");
    }
}
```

代码结果为

```
元素数量5
[Student{name='格鲁', StuNo=0}, Student{name='甘', StuNo=1}, Student{name='文', StuNo=2}, Student{name='崔', StuNo=3}, Student{name='文', StuNo=2}]
---------------------------
元素数量4
[Student{name='甘', StuNo=1}, Student{name='文', StuNo=2}, Student{name='崔', StuNo=3}, Student{name='文', StuNo=2}]
---------------------------
```

由上文代码可以发现其中添加可以重复，所以接下来将解决添加重复的问题

重复的原因是`ArrayList`中判断其中对象相等的依据是先`HashTable`（哈希表）中的地址来判断，之后再`equals`来判断其中的值是否相等

所以如果要防止重复，那么就可以重写`equals`方法，如果值相等就将两个对象合并成一个以此来实现添加不重复的问题

