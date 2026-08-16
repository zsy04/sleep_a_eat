---
title: "Object 类：所有类的超类"
date: "2026-08-16"
tags: ["Java", "常用类", "Object"]
minutes: 20
---

# Object类

[Object类文档](https://www.runoob.com/java/java-object-class.html)

- 超类、基类，所有类的直接或间接父类，位于继承树的最顶层
- 任何类，如没有书写extends显示继承某个类，都默认直接继承Object类，否则为间接继承
- Object类中所定义的方法，是所有对象都具备的方法
- Object类型可以储存任何对象
  - 作为参数，可接受任何对象
  - 作为返回值，可返回任何对象

## getClass()方法

- ```java
  public final Class<?> getClass(){}
  ```

- 返回引用中储存的实际对象类型

- 应用：通常用于判断两个引用中实际储存对象类型是否一致

实例

```java
package com.java_learn.OffenUseClass.Object;

import java.lang.reflect.Array;
import java.util.ArrayList;

class dome1 {
    public static void main(String[] args) {


        //getClass() with Object
        Object obj1 = new Object();
        System.out.println("obj1的类为：" + obj1.getClass());

        //getClass() with String
        String obj2 = new String();
        System.out.println("obj2的类为：" + obj2.getClass());

        //getClass() with ArrayList
        ArrayList<Integer> obj3 = new ArrayList<>();
        System.out.println("obj3的类为：" + obj3.getClass());
    }
}
```

程序结果为

```
obj1的类为：class java.lang.Object
obj2的类为：class java.lang.String
obj3的类为：class java.util.ArrayList
```

## hashCode()方法

- ```java
  public int hashCode(){}
  ```

- 返回该对象的哈希码值

- 哈希值根据对象的地址或字符串或数字使用hash算法计算出来的int类型的数值

- 一般情况下相同对象返回相同哈希码

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome2 {
    public static void main(String[] args) {

        Object obj1 = new Object();
        Object obj2 = new Object();
        Object obj3 = obj1;

        System.out.println(obj1.hashCode());
        System.out.println(obj2.hashCode());
        System.out.println(obj3.hashCode());

    }
}
```

程序结果为

```
2003749087
1324119927
2003749087
```

## toString()方法

- ```java
  public String toString(){}
  ```

- 返回该对象的字符串形式(表现形式)

- 可以根据程序需求覆盖该方法，如:展示对象的各个属性值

实例

```java
class RunoobTest {
    public static void main(String[] args) {
 
        // toString() with Object
        Object obj1 = new Object();
        System.out.println(obj1.toString());
 
        Object obj2 = new Object();
        System.out.println(obj2.toString());
 
        Object obj3 = new Object();
        System.out.println(obj3.toString());
    }
}
```

程序结果为

```
java.lang.Object@d716361
java.lang.Object@6ff3c5b5
java.lang.Object@3764951d
```

如果要正常使用可以尝试对"toString()"方法进行重写

实例

```java
//Student类
package com.java_learn.OffenUseClass.Object;

public class Student {

    public String name = "田伽尘";
    public short age = 21;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public short getAge() {
        return age;
    }

    public void setAge(short age) {
        this.age = age;
    }
	
    
    //重写toString类将其变为我们需要的格式
    public String toString(){
        return  name+":"+age;
    }
    
    //快捷键实现的格式
    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

```java
//实现类
package com.java_learn.OffenUseClass.Object;

public class Application {

    public static void main(String[] args) {

        Student std1 = new Student();

        System.out.println(std1.toString());

    }

}
```

程序结果为

```
田伽尘:21
Student{name='田伽尘', age=21}
```

方法重写有快捷方法

## equals()方法

- ```java
  public boolean eqals(Object obj){}
  ```

- 默认实现为(this == obj)，比较两个对象的***地址***是否相同

- 可进行覆盖，比较两个对象是否相同

实例

```java
package com.java_learn.OffenUseClass.Object;

public class Application {

    public static void main(String[] args) {

        Student std1 = new Student();
        Student std2 = new Student();

        System.out.println(std1.equals(std2));
    }
    
}

```

程序结果为

```
false
```

该方法比较的是两个对象的***地址***是否相同，比较的不是里面储存的数值

实例

```java
package com.java_learn.OffenUseClass.Object;

public class Application {

    public static void main(String[] args) {

        Student std1 = new Student();
        Student std2 = new Student();

        System.out.println(std1.equals(std2));

        System.out.println("==========================");

        Student std3 = new Student("李云洁", (short) 21);
        Student std4 = new Student("李云洁", (short) 21);

        System.out.println(std3.equals(std4));
    }
    
}
```

程序输出结果为

```
false
==========================
false
```

### 对equals()的重写

代码部分

 ```java
     @Override
     public boolean equals(Object obj) {
 
         //1.判断两个对象是否是同一个引用
         if(this == obj){
             return true;
         }
         //2.判断obj是否为null
         if(obj == null){
             return false;
         }
         //3.判断是否为同一类型
         if(obj instanceof Student){
             //4.强制类型转换
             Student std = (Student) obj;
             //5.比较属性
             if (this.name.equals(std.getName()) && this.age == ((Student) obj).getAge()){
                 return true;
             }
         }
         return false;
     }
 ```

实例

```java
package com.java_learn.OffenUseClass.Object;

public class Application {

    public static void main(String[] args) {

        Student std1 = new Student("王硕", (short) 21);
        Student std2 = new Student("金源", (short) 22);

        System.out.println(std1.equals(std2));

        System.out.println("==========================");

        Student std3 = new Student("李云洁", (short) 21);
        Student std4 = new Student("李云洁", (short) 21);

        System.out.println(std3.equals(std4));
    }

}
```

程序输出结果为

```java
false
==========================
true
```

## finalize()方法

- 当对象被判定为垃圾对象时，由JVM自动调用此方法，用以标记垃圾对象，进入回收序列
- 垃圾对象：没有有效引用指向此对象时，为垃圾对象
- 垃圾回收：由GC销毁垃圾对象，释放数据存储空间
- 自动回收机制：JVM的内存耗尽，一次性回收所有对象
- 手动回收机制：使用"System.gc();"通知JVM执行垃圾回收

# 包装类

- 基本数据类型所对应的引用数据类型
- Object可统一所有数据，包装类的默认值为null

## 包装类的对应

| 基本数据类型 | 包装类型  |
| :----------: | :-------: |
|     byte     |   Byte    |
|    short     |   Short   |
|     int      |  Integer  |
|     long     |   Long    |
|    float     |   Float   |
|    double    |  Double   |
|   boolean    |  Boolean  |
|     char     | Character |

## 类型转换与装箱、拆箱

### 拆箱

**Number类**

[Number类文档](https://www.runoob.com/manual/jdk11api/java.base/java/lang/Number.html)

在"Number类"中由六种方法可以拆箱，将引用类型转变为数值

| 变量和类型        | 方法            |              描述               |
| :---------------- | :-------------- | :-----------------------------: |
| `byte`            | `byteValue()`   |   返回指定数字的值 `byte` 。    |
| `abstract double` | `doubleValue()` |  返回指定数字的值 `double` 。   |
| `abstract float`  | `floatValue()`  |   返回指定数字的值 `float` 。   |
| `abstract int`    | `intValue()`    | 以 `int`返回指定数字的 `int` 。 |
| `abstract long`   | `longValue()`   |   以 `long`返回指定数字的值。   |
| `short`           | `shortValue()`  |   返回指定数字的值 `short` 。   |

### 装箱

在每个包装类型中有装箱的方法

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome3 {
    public static void main(String[] args) {

        int num1 = 10;
        //手动装箱
        //
        Integer integer1 = new Integer(num1);
        //使用"Integer.valueOf()"方法将会在256位大小的缓存中寻找一块空间存储数据
        //如果超出256位大小的缓存则会在堆中创建空间来存放
        Integer integer2 = Integer.valueOf(num1);
        System.out.println("手动装箱");
        System.out.println(integer1);
        System.out.println(integer2);

        Integer integer3 = new Integer(20);
        //手动拆箱
        int num2 = integer3.intValue();
        System.out.println("手动拆箱");
        System.out.println(num2);


        int num3 = 50;
        //自动装箱
        Integer integer4 = num3;
        System.out.println("自动装箱");
        System.out.println(integer4);
        //自动拆箱
        int num4 = integer4;
        System.out.println("自动拆箱");
        System.out.println(num4);

    }
}

```

输出结果为

```
手动装箱
10
10
手动拆箱
20
自动装箱
50
自动拆箱
50
```

### 基本类型与字符串之间的转换

#### 基本类型转字符串

1. 使用""字符串来让旁边的数字自动转化为字符串

   ```java
   String s1 = num1 + ""；
   ```

2. 使用"Integer.toString()"方法

   ```java
   String str2 = Integer.toString(num1)
   ```

   ```java
   Integer.toString(值，进制)
   ```

   实例

   ```java
   package com.java_learn.OffenUseClass.Object;
   
   public class dome4 {
       public static void main(String[] args) {
   
           int num1 = 10;
   
           String str1 = Integer.toString(num1, 16);
   
           System.out.println(str1);
   
       }
   }
   ```

   程序结果为

   ```
   a
   ```

   

#### 字符串转基本类型

使用"Xxxx.parsexxx()"方法

```java
//以int为例
String str2 = "150";
int num2 = Integer.parseing(str2);
```

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome4 {
    public static void main(String[] args) {

        int num1 = 255;
        String str2 = "150";

        String str1 = Integer.toString(num1, 16);
        int num2 = Integer.parseInt(str2);


        System.out.println(str1);
        System.out.println(num2);



    }
}
```

程序结果为

```
ff
150
```

##### 注意点

当使用"Integer.parsexxx()"方法时字符串内只能由数字，不能有其他的字符

#### Boolean字符串转变为基本类型

只有当字符串为"true"时，转变为基本类型才是"true"，其他都为false

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome4 {
    public static void main(String[] args) {
        
        String str3 = "true";
        String str4 = "Boolean";

        Boolean bool1 = Boolean.parseBoolean(str3);
        Boolean bool2 = Boolean.parseBoolean(str4);

        System.out.println(bool1);
        System.out.println(bool2);

    }
}

```

程序结果为

```
true
false
```

## 缓冲区（缓存，Catch）

- 缓冲区内Java预先建立了256位大小缓存空间，类型包括常用的包装类对象
- 在实际应用中，对已经创建的对象进行复用

### 思考

```java
package com.java_learn.OffenUseClass.Object;

public class dome5 {
    public static void main(String[] args) {
		
        //这两个会是相等吗？
        Integer integer1 = new Integer(100);
        Integer integer2 = new Integer(100);
		
        System.out.println(integer1 == integer2);
        System.out.println("=============================================");
        //====================================================
		
        //这两个会是相等吗？
        Integer integer3 = 100;
        Integer integer4 = 100;

        System.out.println(integer3 == integer4 );
        System.out.println("=============================================");
        //=====================================================
		
        //这两个会是相等吗？
        Integer integer5 = 200;
        Integer integer6 = 200;

        System.out.println(integer5 == integer6);


    }
}

```

程序结果是

```
false
=============================================
true
=============================================
false
```

**根据结果来说**

1. 当使用构造器来赋值时会将数据直接储存到堆中，最后对比的时数据所在地址

```java
Integer integer1 = new Integer(100);
Integer integer2 = new Integer(100);
		
System.out.println(integer1 == integer2);
```

```
false
```

2. 当使用自动装箱时，即使用"Integer.valueOf()"方法时如果没有超出缓存的大小则会储存在缓存里

```java
Integer integer3 = 100;
Integer integer4 = 100;

System.out.println(integer3 == integer4 );
```

```
true
```

3. 如果超出了缓存则会将其放在堆中，最后对比的时数据储存的地址

```java
Integer integer3 = 100;
Integer integer4 = 100;

System.out.println(integer3 == integer4 );
```

```
false
```

# String类

[菜鸟教程文档](https://www.runoob.com/java/java-string.html)

[API文档](https://www.runoob.com/manual/jdk11api/java.base/java/lang/String.html)

## 概述

- 字符串是常量，创建后不会改变
- 字符串储存在字符串池当中，可以共享

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome6 {
    public static void main(String[] args) {

        System.out.println("===================直接赋值==================");
        String str1 = "张三";
        String str2 = "李四";
        String str3 = "李四";

        System.out.println(str1 == str2);
        System.out.println(str2 == str3);

        System.out.println("=================构造器=================");

        String str4 = new String("java");
        String str5 = new String("java");

        System.out.println(str4 == str5);
        System.out.println("===============equals()=================");
        System.out.println(str4.equals(str5));

    }
}
```

程序结果是

```
===================直接赋值==================
false
true
=================构造器=================
false
===============equals()=================
true
```

**注意**

1. 当直接赋值时，程序先在字符串池中创建字符串，然后在栈中的容器中放入指向字符串的地址，所以当两个有相同字符串的对象对比时两者相等
2. 当使用构造器时，程序依然先在字符串池中创建字符串，但它会在堆中也创建一个容器来储存放置指向字符串池中字符串的地址，之后再在栈中创造一个容器在其中放入指向堆中用来储存字符串池中字符串地址的容器的地址



## 字符串常用方法

### int length()

*用来返回字符串长度*

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome7 {
    public static void main(String[] args) {

        String str = "java是一门计算机语言";

        System.out.println(str.length());
        System.out.println(str.charAt(0));
        System.out.println(str.concat("java"));

    }
}
```

程序结果为

```
12
j
true
false
```

### String charAt(int index)

*用来输出特定位置的字符*

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome7 {
    public static void main(String[] args) {

        String str = "java是一门计算机语言";

        System.out.println(str.length());
        System.out.println(str.charAt(0));
        System.out.println(str.concat("java"));

    }
}
```

程序结果为

```
12
j
true
false
```

### Boolean concat(String str)

*用来查找字符串中有没有与其相同字符*

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome7 {
    public static void main(String[] args) {

        String str = "java是一门计算机语言";

        System.out.println(str.length());
        System.out.println(str.charAt(0));
        System.out.println(str.concat("java"));

    }
}
```

程序结果为

```
12
j
true
false
```

### char [] toCharArray()

*将字符串转变为数组*

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome7 {
    public static void main(String[] args) {

        String str = "java是一门计算机语言";

        char [] array = str.toCharArray();

        for (int i = 0; i < array.length; i++) {
            System.out.print(array[i]);
        }
    }
}

```

程序结果为

```
java是一门计算机语言
```

### int indexOf(String str, int index)

*查找str首次出现位置下标*

**如果有显示下标，如果没有显示-1**

后面的index表示从那位开始来数

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome7 {
    public static void main(String[] args) {

        String str = "java是一门计算机语言";

        int index1 = str.indexOf("j");
        int index2 = str.indexOf("b");

        System.out.println(index1);
        System.out.println(index2);
    }
}

```

程序结果为

```
0
-1
```

### int lastIndexOf(String str)

*查找str最后出现位置下标*

**如果有显示下标，如果没有显示-1**

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome7 {
    public static void main(String[] args) {

        String str = "java是一门java计算机语言";

        int index3 = str.lastIndexOf("j");
        int index4 = str.lastIndexOf("b");

        System.out.println(index3);
        System.out.println(index4);

    }
}

```

程序结果是

```
7
-1
```

### string trim()

*去掉字符串中的空格*

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome7 {
    public static void main(String[] args) {

        String str = "      java是一门java计算机语言              ";

        String str1 = str.trim();
        System.out.println(str1);
    }
}
```

程序结果是

```
java是一门java计算机语言
```



### String toUpperCase()/toLowerCase()

*Upper将小写转变为大写,Lower将大写转变为小写*

实例

```java
package com.java_learn.OffenUseClass.Object;

import java.util.Locale;

public class dome7 {
    public static void main(String[] args) {

        String str = "      java是一门java计算机语言              ";
        
        String str2 = str.toUpperCase(Locale.ROOT);
        String str3 = str.toLowerCase(Locale.ROOT);

        System.out.println(str2);
        System.out.println(str3);
    }
}

```

程序结果是

```
JAVA是一门JAVA计算机语言
java是一门java计算机语言
```

### Boolean endWith(String str)/starWith(String str)

*end判断字符串是否以str结尾,star判断字符串是否以str开头*

实例

```java
package com.java_learn.OffenUseClass.Object;

import java.util.Locale;

public class dome7 {
    public static void main(String[] args) {

        String str = "java是一门java计算机语言";
        
        Boolean bool1 = str.endsWith("语言");
        Boolean bool2 = str.endsWith("java");
        Boolean bool3 = str.startsWith("java");
        Boolean bool4 = str.startsWith("语言");

        System.out.println(bool1);
        System.out.println(bool2);
        System.out.println(bool3);
        System.out.println(bool4);
    }
}

```

程序结果是

```
true
false
true
false
```

### String replace(char oldChar, char newChar)

*可以将旧字符串转换为新字符串*

实例

```java
package com.java_learn.OffenUseClass.Object;

import java.util.Locale;

public class dome7 {
    public static void main(String[] args) {

        String str = "java是一门java计算机语言";

        String str4 = str.replace("java", "cpp");

        System.out.println(str4);
    }
}

```

程序结果为

```
cpp是一门cpp计算机语言
```

### String [] split(String str)

*以str为界限进行分割*

实例

```java
package com.java_learn.OffenUseClass.Object;

import java.util.Locale;

public class dome7 {
    public static void main(String[] args) {

       	String [] strarray = str.split("java");

        for (int i = 0; i < strarray.length; i++) {
          System.out.print(strarray[i]);
       }
    }
}

```

程序结果为

```
是一门计算机语言
```

# StringBuffer()和StringBuilder()

- StringBuffer:可变长字符串，jdk1.0提供，运行效率较慢、线程安全
- StringBuilder:可变长字符串，jdk5.0提供，运行效率快、线程不安全

## 使用

1. append()	追加

   ```java
   append(String);
   ```

   

2. insert()         添加

   ```java
   insert(插入位置(int), 替换内容(String));
   ```

   

3. replace()      替换

   ```java
   replace(起始位置(int)，结束位置(int)，替换内容(String));
   ```

   

4. delete()        删除

   ```java
   delete(起始位置(int), 结束位置());
   ```

5. toString()    组成字符串

实例

```java
package com.java_learn.OffenUseClass.Object;

public class dome8 {
    public static void main(String[] args) {

        StringBuffer sb = new StringBuffer();

        //1.append()        追加
        sb.append("javaNB");
        System.out.println(sb.toString());

        //2.insert()        添加
        sb.insert(0,"cppNB");
        System.out.println(sb.toString());

        //replace()         替换
        sb.replace(0,3,"php");
        System.out.println(sb.toString());

        //delete()          删除
        sb.delete(0,sb.length());
        System.out.println(sb.length());
    }
}
```

程序的结果为

```
javaNB
cppNBjavaNB
phpNBjavaNB
0
```

## 证明StringBuffer()或StringBuilder()运行速度比String快

### String类代码

```java
package com.java_learn.OffenUseClass.Object;

//String类
public class dome9 {
    public static void main(String[] args) {

        long start = System.currentTimeMillis();

        String str = "";

        for (int i = 0; i < 99999; i++) {
            str += i;
        }

        long end = System.currentTimeMillis();

        System.out.println("用时" + (end - start));

    }
}
```

程序运行结果为

```
用时12954
```

### StringBuffer代码

```java
package com.java_learn.OffenUseClass.Object;

//StringBuffer类
public class DomeStringBuffer {
    public static void main(String[] args) {

        long start = System.currentTimeMillis();

        StringBuffer sb = new StringBuffer();

        for (int i = 0; i < 99999; i++) {
            sb.append(i);
        }

        long end = System.currentTimeMillis();

        System.out.println("用时" + (end - start));

    }

}
```

程序运行结果为

```
用时4
```

# BigDecimal类

- 位置：在java.math包中
- 作用：精确计算浮点数
- 方法：
  1. BigDecimal add(BigDecimal bd)	加
  2. BigDecimal subtract(BigDecimal bd)	减
  3. BigDecimal multiply(BigDecimal bd)	乘
  4. BigDecimal divide(BigDecimal bd)	除

## 引入

因为**double和float**类型是取近似值，所以在做计算时会产生误差，为了解决这个问题所以引入了**BigDecimal**类型

实例

```java
package com.java_learn.OffenUseClass.Object;

public class DomeDouble {
    public static void main(String[] args) {

        double num1 = 1.0;
        double num2 = 0.9;
        double result1 = 0.0;

        result1 = num1 - num2;

        System.out.println(result1);
    }
}
```

结果

```
0.09999999999999998
```

由此可见double类无法完成这样的计算

## 实例

```java
package com.java_learn.OffenUseClass.Object;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class DomeBigDecimal {
    public static void main(String[] args) {

        BigDecimal bd1 = new BigDecimal("1.0");
        BigDecimal bd2 = new BigDecimal("0.9");
        BigDecimal result = new BigDecimal("0.0");

        //加法
        result = bd1.add(bd2);
        System.out.println(result);

        //减法
        result = bd1.subtract(bd2);
        System.out.println(result);

        //乘法
        result = bd1.multiply(bd2);
        System.out.println(result);

        //除法
        result = bd1.divide(bd2, 2, RoundingMode.HALF_DOWN);
        System.out.println(result);
    }
}
```

结果

```
1.9
0.1
0.90
1.11
```

由此可见通过BigDecimal类可以减少误差

## 注意点

主要注意点在除法，需要设定除法最多取到第几位小数，最后的取舍原则是什么

```java
divide(BigDecimal divisor, int scale, RoundingMode roundingMode);
//HALF_UP四舍五入向上取舍
//HALF_DOWN四舍五入向下取舍
```

# System类

*System系统类，主要用于获取系统的属性数据和其他操作，构造方法私有*

|             方法名              |                           说明                            |
| :-----------------------------: | :-------------------------------------------------------: |
|   static void arraycopt(...)    |                         复制数组                          |
| static long currentTimeMillis() |             获取当前系统时间，返回的是毫秒值              |
|        static void gc()         |             建议JVM赶快启动垃圾回收器回收垃圾             |
|  static void exit(int status)   | 退出JVM，如果参数是0表示正常退出JVM，非0则表示异常退出JVM |

