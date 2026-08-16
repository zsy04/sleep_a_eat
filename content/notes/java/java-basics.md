---
title: "Java 基础语法全笔记"
date: "2026-08-16"
tags: ["Java", "基础语法"]
minutes: 40
---

# 基础知识

# 一 注释

*注释可以帮助更好的理解自己编写的代码，提高代码的可读性*

## 注释的分类

注释共有三种

1. 单行注释
2. 多行注释
3. 文档注释

### 单行注释

单行注释可以直接附在代码旁边，帮助更好的理解当前代码的意思

```java
//这是一个单行注释
```



### 多行注释

多行注释可以为写出的代码块进行注释

```java
/*
这是一组多行注释
这是一组多行注释
这是一组多行注释
这是一组多行注释
*/
```



### 文档注释

通常出现在类、方法、字段等的声明前面，用于生成代码文档，这种注释可以被工具提取并生成 API 文档

```java
/**
*这是一个文档注释
*它通常包含有关类、方法或字段的详细信息
*/
```

#### 参数信息

```java
@author							//作者名
@version						//版本号
@since							//致命所需要的伪造使用jdk版本
@param							//参数名
@return							//返回值情况
@throws							//异常情况抛出
```

*当在方法前使用时会自动生成文档*

# 二 标识符

类名、变量名以及方法名都被称为标识符。

## 关键字

关键字这些保留字**不能被用于**常量、变量和任何标识符的名称

[查询关键字]([Java 基础语法 | 菜鸟教程](https://www.runoob.com/java/java-basic-syntax.html))

## 标识符注意点

- 所有的标识符都应该以字母（A-Z 或者 a-z）,美元符（$）、或者下划线（_）开始
- 首字符之后可以是字母（A-Z 或者 a-z）,美元符（$）、下划线（_）或数字的任何字符组合
- 关键字不能用作标识符
- 标识符是**大小写敏感**的
- 合法标识符举例：age、$salary、_value、__1_value
- 非法标识符举例：123abc、-salary
- 尽量使用英文作为标识符

# 三 数据类型

- ***Java是强类型语言***

要求变量使用必须严格符合规定，所用变量必须先定义后使用

## Java数据类型

*Java数据类型分为两大类*

- ### 基础类型（primitive type）

*基础数据类型公用八个*

1. 整形：
   1. ) byte:占1个字节
   2. ) shout：占2个字节
   3. ) int：占4个字节
   4. ) long:  占8个字节  ***long类型后面的值需要加上L***
2. 浮点型：
   1. float: 占4个字节   ***float类型后面需要加上F***
   2. double：占8个字节
3. 字符型：char: 占2个字节
4. 布尔型：boolean:占1位 ***只有true和false两个值***



- ### 引用类型（reference type）

1. 类
2. 接口
3. 数组

## 拓展

### 整数拓展

#### 进制

二进制：0b

十进制：

八进制：0

十六进制：0x

**举例：十进制为10时：**

二进制：1010b

八进制：012

十六进制：0xA

### 浮点类拓展

***浮点数会出现内存与精度问题***

***！！！！不要用浮点数进行比较！！！！***

***！！！！不要用浮点数进行比较！！！！***

***！！！！不要用浮点数进行比较！！！！***

```java
float f = 0.1f;
double d = 1.0/10;

System.out.proutln(f == d);			//false

float f2 = 23232323231f;
float f3 = d1 + 1;

System.out.proutln(f2 == f3);		//true
```

***！！！！要避免使用浮点数进行比较！！！！***

***！！！！要避免使用浮点数进行比较！！！！***

***！！！！要避免使用浮点数进行比较！！！！***

浮点数是有限的，离散的，具有舍入误差的，是具有大约的，处于接近但不等于状态的

### 字符类拓展

字符在程序内是用编码来调用和保存的

Unicode

### 转义字符

[查询转义字符](https://www.runoob.com/java/java-basic-datatypes.html)

### 布尔值拓展

```java
boolean flag = true;
if(flag == true){};				//新手
if(flag){};						//老手
//if(默认当条件为 == true)
```

# 四 类型转换

*由于Java是强类型语言，所以在有些运算时需要用到类型转换*

**优先级：**

```java
低------------------------------------>高
byte,short,char->int->long->float->double
```

运算中，不同类型的数据需要先转化为同一种类型，然后计算。

#### 自动类型转换

自动类型转换的前提是由优先级低向优先级高的转换

#### 强制类型转换

强制类型转换的前提是由优先级高向优先级低的转换

格式为

```java
(转换类型名)变量名
```

示例：

```java
int big = 128;
byte small = (byte)big;
Sytem.out.println()
```

#### 注意点

1. 不能对布尔值进行转换
2. 不能把对象转换为不相干的类型
3. 在把高容量转换为低容量时，需要使用强制类型转换
4. 转换时可能产生内存溢出，或精度问题！

```java
int money = 10_0000_0000;
int years = 20;
int total = money * years;							//所求值大于int的范围，计算式溢出
long total2 = money * years;						//两个参数为int类型在计算过程已经溢出，即在转换前就已经出现问题
long total3 = money * (long)years;					//正确做法，在计算之前就将值转换为long类型
```

# 五 变量

*Java时强类型语言，每个变量都必须声明其类型*

Java变量是程序中最基本的存储单元，其要素包括变量名，变量类型和***作用域***

```java
type varName [= value][{, varName[= value]}];
//数据类型   变量名 = 值；可以输用逗隔开来声明多个同类型变量。
```

注意事项：

- 每个变量都有类型，类型可以是基本类型，也可以是引用类型
- 变量名必须是合法标识符
- 变量声明是一条完整的语句，因此每个声明都必须以分号结束

## 作用域

- 类变量

  写在类里面

  需要加关键词"static"

- 实例变量

  写在类中间

  ***从属于对象***

  不加关键词"static"

- 局部变量

  ***必须声明和初始化***

  写在方法里面

```java
public class Variable{
    static int allClicks = 0;			//类变量
    String str = "hello world!";		//实例变量
	
    public void method(){
        int i = 0;						//局部变量
    }
}
```

## 默认值（实例变量）

如果不进行初始化 

**默认值为**

整型，浮点型：**0，0.0**

布尔值：**false**

其余为：**null**

## 常量

*初始化后，之后不会再改变的值*

*常量可以理解为一种特殊的变量，它的值设定后程序运行过程中不允许再被改变*

```java
final [数据类型] 常量名   = 值;
final double 	PI		= 3.14;
```

***常量名一般用大写字符***

- 修饰符，不存在先后顺序

## 变量的命名规则

- 所有变量、方法、类名：见名知意

- 类成员变量：首字母小写和驼峰原则：

  ```java
  monthSallary
  ```

  

- 局部变量：首字母小写和驼峰原则：

  ```java
  monthSallary
  ```

  

- 常量：大写字母和下划线：

  ```java
  MAX_VALUE
  ```

  

- 类名：首字母大写和驼峰原则：

  ```java
  Man,GoodMan
  ```

- 方法名：首字母小写和驼峰原则：

  ```java
  run(),runMan()
  ```

# 六 运算符

  - 算数运算符：+,-,*,/,%,++,--
  
    *当通过算数运算符进行运算时，默认的数据类型为“int”*
  
    *当运算过程中有long时，最终算出的值数据类型为“long”*
  
    *"++","--"自增,自减，为一元运算符*
  
    ```java
    int a = 3;
    int b = a++;					//先赋值后自增
    int c = ++a;					//先自增后赋值
    
    System.out.println(a);
    System.out.println(b);
    // a++   a = a + 1;
    System.out.println(a);
    // a++   a = a + 1;
    System.out.println(c);
    ```
  
    **幂运算**
  
    需要运用Math类，有很多运算需要运用工具类来进行操作；
  
  - 赋值运算符: =
  
  - 关系运算符:>,<,<=,>=,==,!= instanceof
  
  - 逻辑运算符:&&,||,!
  
    **短路运算**
  
    逻辑运算中会出现短路运算的情况，比如当使用"&&"时如果前面的条件为假则后面的代码不再会进行运算；
  
  - 位运算符:&,|,^,~,>>,<<,>>>    ()
  
    *位运算符的运算速度很快，他是通过计算机底层来运算*
  
    **">>"右移，表示除以二；*
  
    *"<<"左移，表示乘以二；*
  
  - 条件运算符:  ?:
  
    ```java
    A ? B : C;
    ```
  
    *意思为当A为真是执行B，当A为假时执行C*
  
  - 拓展赋值运算符: +=,-=,*=,/=
  
  - 字符串连接："+"
  
    *"+"两侧出现"string"类型会将其他操作数转变为"string"类型并连接*
  
    ```java
    int a = 10;
    int b = 20;
    System.out.println("" + a + b);			//输出为1020
    System.out.println(a + b + "");			//输出为30
    ```
  
    *上面出现的情况为先运算了"a + b"再通过""来输出字符串*

## 优先级

    [优先级查询]([Java 运算符 | 菜鸟教程](https://www.runoob.com/java/java-operators.html))

# 七 包机制

*为了更好的组织类，Java提供了包机制，用于区别类名的命名空间。*

## 包机制格式

```java
package pkg1[. pkg2[. pkg3...]];
```

***一般利用公司域名倒置作为包名***

*示例*

*百度 www.baidu.com*

*包名为com.baidu.www*

*为了能供使用其他的包需要再程序的开始使用"import"语句来完成此功能*

```java
import package[. package2...].(classname|*);
```

# 八 流程控制

## scanner 输入

**语法**

```java
Scanner s = new Scanner(System.in);
```

Scanner类需要与next()与nextLine()这样的方法共同使用

简单代码运用，计算输入数字总和与

```java
package com.java_learn;

import java.util.Scanner;

public class Dome3 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        //总和
        double sum = 0.0;
        //个数
        short num = 0;

        System.out.println("请输入数字");

        while(scanner.hasNextDouble()){
            double x = 0;

            x = scanner.nextDouble();
            sum += x;
            num++;

            System.out.println("当前共有" + num + "个数，当前总和为" + sum + "当前平均数为" + sum/num);

        }

        System.out.println("总和为" + sum);
        System.out.println("平均数为" + sum/num);

        scanner.close();
    }
}
```

# 九 顺序结构

从上到下以此顺序执行，它是任何一个算法都离不开的基本算法结构

# 选择结构

## 分类

1. if单选结构
2. if双选结构
3. if多选结构
4. 嵌套if结构
5. switch多选择结构

### if单选结构

**语法**

```java
if(布尔表达式){
    //如果布尔表达式为true将执行的语句
}
```

单次判断只看是否为真

### if双选结构

**语法**

```java
if(布尔表达式){
    //如果布尔表达式为true将执行的语句
}else{
    //如果布尔表达式为false将执行的语句
}
```

示例

```java
import javax.swing.*;

public class ForDome1 {
    public static void main(String[] args) {

        int oddsum = 0;
        int evensum = 0;

        for (int i = 0; i <= 100; i++) {
            if(i%2 == 0){
                evensum += i;
            }else {
                oddsum += i;
            }
        }

        System.out.println("奇数和为" + oddsum);
        System.out.println("偶数和和为" + evensum);

    }
}
```



### if多选结构

**语法**

```java
if(布尔表达式1){
    //如果布尔表达式1为true将执行的语句
}else if(布尔表达式2){
    //如果布尔表达式2为true将执行的语句
}else if(布尔表达式3){
    //如果布尔表达式3为true将执行的语句
}else{
    //如果以上布尔表达式都不为true时执行代码
}
```

### if嵌套结构

```java
if(布尔表达式1){
  	//如果布尔表达式1为true将执行的语句
    if(布尔表达式2){
        //如果布尔表达式2为true将执行的语句
    }
}
```

### switch选择结构

**语法**

```java
switch(expression){
    case value:
        //语句
        break;//可选
    case value:
        //语句
        break;//可选
    case value:
        //语句
        break;//可选
    //可以有任何数量的case语句
    default ://可选
        //语句
}
```

小例子

```java
import java.util.Scanner;

public class SwitchDome1 {
    public static void main(String[] args) {

        System.out.println("请输入要使用的功能");
        System.out.println("1.进入");
        System.out.println("2.退出");
        System.out.println("3.下一层");
        System.out.println("4.上一层");

        Scanner scanner = new Scanner(System.in);
        int function = scanner.nextInt();

        switch(function){

            case 1:
                System.out.println("进入");
                break;
            case 2:
                System.out.println("退出");
                break;
            case 3:
                System.out.println("下一层");
                break;
            case 4:
                System.out.println("上一层");
                break;
            default:
                System.out.println("非法命令");
        }

        scanner.close();
    }
}

```

# 十 循环结构

## 分类

1. while循环
2. do...循环
3. for循环

### while循环

**语法**

```java
while(布尔表达式){
    //循环体
}
```

示例

```java
public class Test {
   public static void main(String[] args) {
      int x = 10;
      while( x < 20 ) {
         System.out.print("value of x : " + x );
         x++;
         System.out.print("\n");
      }
   }
}
```



### do循环

*对于 while 语句而言，如果不满足条件，则不能进入循环。但有时候我们需要即使不满足条件，也至少执行一次。*

*do…while 循环和 while 循环相似，不同的是，do…while 循环至少会执行一次。*

**语法**

```java
do{
    //循环体
}while(布尔表达式)
```

**注意：**布尔表达式在循环体的后面，所以语句块在检测布尔表达式之前已经执行了。 如果布尔表达式的值为 true，则语句块一直执行，直到布尔表达式的值为 false。

示例

```java
public class Test {
   public static void main(String[] args){
      int x = 10;
 
      do{
         System.out.print("value of x : " + x );
         x++;
         System.out.print("\n");
      }while( x < 20 );
   }
}
```

### for循环

*虽然所有循环结构都可以用 while 或者 do...while表示，但 Java 提供了另一种语句 —— for 循环，使一些循环结构变得更加简单。*

**语法**

```java
for(初始化;布尔表达式;更新){
    //循环体
}
```

关于 for 循环有以下几点说明：

- 最先执行初始化步骤。可以声明一种类型，但可初始化一个或多个循环控制变量，也可以是空语句。
- 然后，检测布尔表达式的值。如果为 true，循环体被执行。如果为false，循环终止，开始执行循环体后面的语句。
- 执行一次循环后，更新循环控制变量。
- 再次检测布尔表达式。循环执行上面的过程。

示例

```java
public class Test {
   public static void main(String[] args) {
 
      for(int x = 10; x < 20; x = x+1) {
         System.out.print("value of x : " + x );
         System.out.print("\n");
      }
   }
}
```



## break和continue

### break

*break 主要用在循环语句或者 switch 语句中，用来跳出整个语句块。*

*break 跳出最里层的循环，并且继续执行该循环下面的语句。*

**语法**

break 的用法很简单，就是循环结构中的一条语句：

```java
break;
```

示例

```java
import java.util.Scanner;

public class SwitchDome1 {
    public static void main(String[] args) {

        System.out.println("请输入要使用的功能");
        System.out.println("1.进入");
        System.out.println("2.退出");
        System.out.println("3.下一层");
        System.out.println("4.上一层");

        Scanner scanner = new Scanner(System.in);
        int function = scanner.nextInt();

        switch(function){

            case 1:
                System.out.println("进入");
                break;
            case 2:
                System.out.println("退出");
                break;
            case 3:
                System.out.println("下一层");
                break;
            case 4:
                System.out.println("上一层");
                break;
            default:
                System.out.println("非法命令");
        }

        scanner.close();
    }
}

```





### continue

*continue 适用于任何循环控制结构中。作用是让程序立刻跳转到下一次循环的迭代。*

*在 for 循环中，continue 语句使程序立即跳转到更新语句。*

*在 while 或者 do…while 循环中，程序立即跳转到布尔表达式的判断语句。*

**语法**

```java
continue;
```

示例

```java
public class Test {
   public static void main(String[] args) {
      int [] numbers = {10, 20, 30, 40, 50};
 
      for(int x : numbers ) {
         if( x == 30 ) {
        continue;
         }
         System.out.print( x );
         System.out.print("\n");
      }
   }
}
```



# 练习1

## 计算0到100之间的奇数和与偶数和

源码

```java
package com.java_learn;

import javax.swing.*;

public class ForDome1 {
    public static void main(String[] args) {

        int oddsum = 0;
        int evensum = 0;

        for (int i = 0; i <= 100; i++) {
            if(i%2 == 0){
                evensum += i;
            }else {
                oddsum += i;
            }
        }

        System.out.println("奇数和为" + oddsum);
        System.out.println("偶数和和为" + evensum);

    }
}
```

**难点：**

1. 筛选0-100中的奇数和偶数

## 使用for循环输出1-1000之间能被5整除的数，并且每行输出3个

源码

```java
package com.java_learn;

public class ForDome2 {
    public static void main(String[] args) {

        for (int i = 0; i <= 1000; i++) {
            if(i%5 == 0){
                System.out.print(i + "\t");
            }if(i%(5 * 3) == 0){
                System.out.println();
            }
        }
    }
}
```

**难点**

1. 筛选1-1000中能被5整除的数
2. 将每三个数输出为一行

 ## 九九乘法表

源码

```java
package com.java_learn;

public class ForDome3 {
    public static void main(String[] args) {
        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print( i + "*" + j + "=" + i*j + "\t" );
            }
            System.out.println();
        }
    }
}
```

**难点：**

1. 两次for循环使出现重复的乘法表格
2. 通过筛选将重复的部分筛出（j <= i）

## 输出三角形

我的源码

```java
package com.java_learn;

public class TestDome {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(j);
            }
        for (int j = 1; j <= i; j++) {
            System.out.print(j);
        }
            System.out.println();
        }
    }
}
```

正确答案

```java
package com.java_learn;

public class TestDome2 {
    public static void main(String[] args) {
        for (int i = 0; i <= 5; i++) {
            for (int j = 5; j > i; j--) {
                System.out.print(" ");
            }
            for (int j = 0; j <= i; j++) {
                System.out.print("*");
            }
            for (int j = 0; j < i; j++){
                System.out.print("*");
            }
            System.out.println();
        }

    }
}
```

**难点**

1. 将三角形的输出过程分解为三个部分

# 十一 方法

*Java方法是语句的集合，它们在一起执行一个功能。*

- 方法是解决一类问题的步骤的有序组合
- 方法包含于类或对象中
- 方法在程序中被创建，在其他地方被引用

**优点**

1. 是程序变得简洁而清晰
2. 便于程序维护
3. 提高了开发效率
4. 提高了代码的重用性

## 定义

**语法**

```java
修饰符 返回值类型 方法名(参数类型 参数名){
    ....;
    方法体;
    ....;
    return 返回值;
}
```

方法包含一个方法头和一个方法体。下面是一个方法的所有部分：

- **修饰符：**修饰符，这是可选的，告诉编译器如何调用该方法。定义了该方法的访问类型。
- **返回值类型 ：**方法可能会返回值。returnValueType 是方法返回值的数据类型。有些方法执行所需的操作，但没有返回值。在这种情况下，returnValueType 是关键字**void**。
- **方法名：**是方法的实际名称。方法名和参数表共同构成方法签名。
- **参数类型：**参数像是一个占位符。当方法被调用时，传递值给参数。这个值被称为实参或变量。参数列表是指方法的参数类型、顺序和参数的个数。参数是可选的，方法可以不包含任何参数。
- **方法体：**方法体包含具体的语句，定义该方法的功能。

**参数可以不止一个**

示例

```java
public class MethodDome1 {
    public static void main(String[] args) {

        int a = 10;
        int b = 20;

        System.out.println(Max(a,b));

    }
    //返回两个整形变量数据的较大值
    public static int Max(int a ,int b){
        int result;
        if(a == b){
            System.out.println("两个数字相等");
            return 0;
        }else if(a > b){
            result = a;
        }else{
            result = b;
        }
        return result;
    }
}
```

## 设计方法的原则

方法的本意是功能块，就是实现某个功能的语句块的集合。

我们设计方法的时候尽量保持方法的**原子性**

***即一个方法只完成一个功能，这样有利于我们的后期拓展***

## 方法的命名规则

- 方法名：首字母小写和驼峰原则：

```java
run(),runMan()
```

## 方法的调用规则

Java 支持两种调用方法的方式，根据方法是否返回值来选择。

当程序调用一个方法时，程序的控制权交给了被调用的方法。当被调用方法的返回语句执行或者到达方法体闭括号时候交还控制权给程序。

当方法返回一个值的时候，方法调用通常被当做一个值。例如：

```java
int larger = max(30, 40);
```

如果方法返回值是void，方法调用一定是一条语句。例如，方法println返回void。下面的调用是个语句：

```java
System.out.println("欢迎访问菜鸟教程！");
```



## 形参与实参

示例

*接下来的讨论都围绕着这个示例来讲解*

```java
public class MethodDome1 {
    public static void main(String[] args) {		  //real_A与real_B就是这个方法的实参

        int real_A = 10;
        int real_B = 20;

        System.out.println(Max(a,b));

    }


public static int Max(int form_A ,int form_B){			//form_A与form_B就是这个方法的形参    
        int result;
        if(a == b){
            System.out.println("两个数字相等");
            return 0;
        }else if(a > b){
            result = a;
        }else{
            result = b;
        }
        return result;
    }
}
```

**形参：**形参即形式参数，形参是在方法中使用的，它代表着从主方法中引入的数据的流向，在上面的示例中"form_A"与"form_B"就是形参

**实参：**实参即实际参数，实参是在主方法中传入的，它代表着要流入即将被使用方法的数据，在上面的示例中"real_A"与"real_B"就是实参

## 值传递与引用传递

***java中的只有值传递***

在java中将主方法的所获取的实参传递到方法中的形参，是将其复制一份值再将其储存到其他地方的内存，再放到方法中计算。

这样的形式就是值运算，这样做并不会影响到实参的值。

而引用传递则是将实参所在的内存地址传递到方法，方法直接调用内存地址中的值进行计算

这样的形式就是引用传递，这样做会影响到实参中的值。

详细解释可以点击下发的链接

[详细解释]([(3 封私信 / 12 条消息) 为什么大家都说Java中只有值传递？ - 知乎](https://zhuanlan.zhihu.com/p/102048219))

## 方法的重载

重载就是再一个类中，有相同的函数名称，但形参不同的函数

方法重载的规则：

1. 方法名称必须相同
2. 参数列表必须不同（个数不同，理性不同，参数排列顺序不同等）
3. 方法的返回类型可以相同也可以不同
4. 仅仅返回类型不同不足以能为方法的重载

实现理论：

方法名相同时，编译器会根据调用方法的参数个数、参数类型等章鱼哥陪陪，以原则对应的方法，如果匹配失败则编译器报错

示例

```java
package com.java_learn;

public class MethodDome1 {
    public static void main(String[] args) {

        int a = 10;
        int b = 20;

        System.out.println(Max(a,b));

    }
    //返回两个整形变量数据的较大值
    public static int Max(int a ,int b){
        int result = 0;
        if(a == b){
            System.out.println("两个数字相等");
            return 0;
        }else if(a > b){
            result = a;
        }else{
            result = b;
        }
        return result;
    }
	//返回两个浮点型变量数据的较大值
    public static double Max(double a ,double b){
        double result = 0;
        if(a == b){
            System.out.println("两个数字相等");
            return 0;
        }else if(a > b){
            result = a;
        }else{
            result = b;
        }
        return result;
    }
    // 返回三个整型变量数据的最大值
        public static int Max(int a, int b, int c) {
            if (a == b && b == c) {
                System.out.println("三个数字相等");
                return a; // 或者返回0，根据你原来的逻辑
            }

            int max = a;
            if (b > max) {
                max = b;
            }
            if (c > max) {
                max = c;
            }
            return max;
        }
}
```

## 可变参数

*JDK 1.5 开始，Java支持传递同类型的可变参数给一个方法。*

可变参数的声明如下所示：

```java
typeName... parameterName
```

在方法声明中，在指定参数类型后加一个省略号(...) 。

一个方法中只能指定一个可变参数，**它必须是方法的最后一个参数。任何普通的参数必须在它之前声明。**

示例

```java
public class VarargsDemo {
    public static void main(String[] args) {
        // 调用可变参数的方法
        printMax(34, 3, 3, 2, 56.5);
        printMax(new double[]{1, 2, 3});
    }
 
    public static void printMax( double... numbers) {
        if (numbers.length == 0) {
            System.out.println("No argument passed");
            return;
        }
 
        double result = numbers[0];
 
        for (int i = 1; i <  numbers.length; i++){
            if (numbers[i] >  result) {
                result = numbers[i];
            }
        }
        System.out.println("The max value is " + result);
    }
}
```

## 递归

*递归就是：A方法调用A方法,就是自己解决自己*

递归可以实现用简单程序解决复杂问题，它可以将一个大型的复杂问题层层转化为一个与原问题相似但规模较小的问题来求解，递归只需要少量的程序就可以描述出解题过程所需要的多次重复计算，大大减少了代码量，递归的能力在于有限的语句来定义对象的无限集合。

递归包含两部分：

- 递归头：什么时候不调用自身方法。如果没有头将陷入死循环。
- 递归体：什么时候需要调用自身方法。

示例

```java
package com.java_learn;

import java.util.Scanner;

public class MethodDome2 {
    public static void main(String[] args) {

        System.out.println("请问要算出几的阶乘");
        Scanner scanner = new Scanner(System.in);

        int a = scanner.nextInt();

        System.out.println(a + "的阶乘为" + Factorial(a));
        scanner.close();
    }


    public static int Factorial(int factorialVale){

        int result = 0;

        if(factorialVale == 1){
             result = factorialVale;
        }else{
            result = factorialVale * Factorial(factorialVale - 1);
        }

        return result;

    }

}
```

# 练习2

## 编写计算器

```java
package com.java_learn;

import java.util.Scanner;

public class TestDome3 {
    public static void main(String[] args) {

        //result来储存计算结果

        Scanner scanner = new Scanner(System.in);

        do {

            System.out.println("计算器");
            System.out.println("请输入要进行的运算（+,-,*,/），当输入‘q’时推出计算器");

            String function = scanner.nextLine();

            if (function.equals("q")){
                System.out.println("计算机已退出");
                break;
            }

            if(!function.equals("+")&&!function.equals("-")&&!function.equals("*")&&!function.equals("/")){
                System.out.println("输入不合法");
                continue;
            }

            //在循环中创建num1，num2来容纳将要计算的数字
            double num1 = 0.0;
            double num2 = 0.0;

            System.out.println("请输入数字一");
            while(!scanner.hasNextDouble()){
                System.out.println("输入错误，请输入数字：");
                scanner.next();
            }
            num1 = scanner.nextDouble();

            System.out.println("请输入数字二");
            while(!scanner.hasNextDouble()){
                System.out.println("输入错误，请输入数字：");
                scanner.next();
            }
            num2 = scanner.nextDouble();

            if(function.equals("/") && num2 == 0){
                System.out.println("除数不能为零");
                continue;
            }

            double result = calculate(function, num1, num2);
            System.out.println(num1 + " " + function + " " + num2 + " " + "=" +  " " + result);

        }while(true);

        scanner.close();

    }

    public static double calculate(String function, double a, double b){
        /*
         * 当输入字符为什么符号时执行什么运算
         * 通过result来储存计算结果
         *
         */
        switch(function){
            case "+" :
                return Add(a, b);
            case "-":
                return reduce(a, b);
            case "*":
                return ride(a, b);
            case"/":
                return except(a, b);
            default:
                return 0.0;
        }
    }

    //加法功能
    public static double Add(double a, double b){
        return a + b;
    }
    //减法功能
    public static double reduce(double a,double b){
        return a - b;
    }
    //乘法功能
    public static double ride(double a,double b){
        return a * b;
    }
    //除法功能
    public static double except(double a,double b){
        return  a / b;
    }
}
```

# 十二 数组

数组对于每一门编程语言来说都是重要的数据结构之一，当然不同语言对数组的实现及处理也不尽相同。

Java 语言中提供的数组是用来存储固定大小的同类型元素。

## 语法

```java
dataType[] arrayRefVar;   // 首选的方法
 
或
 
dataType arrayRefVar[];  // 效果相同，但不是首选方法
```

## 创建数组

Java语言使用new操作符来创建数组，语法如下：

```
arrayRefVar = new dataType[arraySize];
```

上面的语法语句做了两件事：

- 一、使用 dataType[arraySize] 创建了一个数组。
- 二、把新创建的数组的引用赋值给变量 arrayRefVar。

数组变量的声明，和创建数组可以用一条语句完成，如下所示：

```
dataType[] arrayRefVar = new dataType[arraySize];
```

另外，你还可以使用如下的方式创建数组。

```
dataType[] arrayRefVar = {value0, value1, ..., valuek};
```

数组的元素是通过索引访问的。数组索引从 0 开始，所以索引值从 0 到 arrayRefVar.length-1。

## 数组初始化

### 静态初始化

```java
int [] a ={1, 2, 3};
Man [] man ={new Man(1, 1), new Man(1, 2)};
```

### 动态初始化

```java
int [] a = new a[2];
a[0] = 1;
a[1] = 2;
```

### 数组默认初始化

因为数组被分配了空间，所有其中带有隐式初始化，初始化的值为0

## 数组特点

1. 数组的长度是固定的，在一开始就创建了不能改变
2. 元素必须是相同类型不能使混合类型
3. 数组的数据可以是任何类型包括基本类型和引用类型
4. 数组变量属于引用类型，数组可以看作使对象，数组中的每个元素相当于该对象的成员变量

*数组本身就是对象，JAVA的对象储存在堆中，因此数组无论是保存原始类型还是其他对象类型*

***数组对象本身是在堆中***

## 数组边界

下标合法区间为[0, length-1],越界就会报错

示例

```java
public static void main(String[] arry){
    int [] a = new a[2];
    System.out.println(a[2]);
}
```

这样就会显示

```java
ArrayIndexOutOfBoundsException   //数组下标越界异常
```

**小结**

1. 数组是相同数据类型的有序集合
2. 数组也是对象，数组元素相当于对象的成员变量
3. 数组的长度是确定的，不可变的。入股越界则会报错

## 数组使用

### For-Each循环

JDK 1.5 引进了一种新的循环类型，被称为 For-Each 循环或者加强型循环，它能在不使用下标的情况下遍历数组。

语法格式如下：

```java
for(type element: array)
{
    System.out.println(element);
}
```

示例

该实例用来显示数组 myList 中的所有元素：

```java
public class TestArray {
   public static void main(String[] args) {
      double[] myList = {1.9, 2.9, 3.4, 3.5};
 
      // 打印所有数组元素
      for (double element: myList) {
         System.out.println(element);
      }
   }
}
```

### 数组作为方法入参

数组可以作为参数传递给方法。

例如，下面的例子就是一个打印 int 数组中元素的方法:

示例

```java
public static void printArray(int[] array) {
  for (int i = 0; i < array.length; i++) {
    System.out.print(array[i] + " ");
  }
}

printArray(new int[]{3, 1, 2, 6, 4, 2});
```

### 数组作为返回值

```java
public static int[] reverse(int[] list) {
  int[] result = new int[list.length];
 
  for (int i = 0, j = result.length - 1; i < list.length; i++, j--) {
    result[j] = list[i];
  }
  return result;
}
```

## 多维数组

*多维数组可以看成是数组的数组，比如二维数组就是一个特殊的一维数组，其每一个元素都是一个一维数组*

```java
String[][] str = new String[3][4];
```

多维数组的动态初始化(以二维数组为例)

直接为每一维数据分配空间

示例

```java
type[][] typeName = new type[typeLength1][typeLength2];
```

type 可以为基本数据类型和复合数据类型，typeLength1 和 typeLength2 必须为正整数，typeLength1 为行数，typeLength2 为列数。

示例

```java
int[][] a = new int[2][3];
```

解析：

二维数组 a 可以看成一个两行三列的数组。

从最高维开始，分别为每一维分配空间，例如：

```java
String[][] s = new String[2][];
s[0] = new String[2];
s[1] = new String[3];
s[0][0] = new String("Good");
s[0][1] = new String("Luck");
s[1][0] = new String("to");
s[1][1] = new String("you");
s[1][2] = new String("!");
```

解析：

**s[0]=new String[2]** 和 **s[1]=new String[3]** 是为最高维分配引用空间，也就是为最高维限制其能保存数据的最长的长度，然后再为其每个数组元素单独分配空间 **s0=new String("Good")** 等操作。

## Arrays类

java.util.Arrays 类能方便地操作数组，它提供的所有方法都是静态的。

具有以下功能：

- 给数组赋值：通过 fill 方法。
- 对数组排序：通过 sort 方法,按升序。
- 比较数组：通过 equals 方法比较数组中元素值是否相等。
- 查找数组元素：通过 binarySearch 方法能对排序好的数组进行二分查找法操作。

| 序号 | 方法和说明                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **public static int binarySearch(Object[] a, Object key)** 用二分查找算法在给定数组中搜索给定值的对象(Byte,Int,double等)。数组在调用前必须排序好的。如果查找值包含在数组中，则返回搜索键的索引；否则返回 (-(*插入点*) - 1)。 |
| 2    | **public static boolean equals(long[] a, long[] a2)** 如果两个指定的 long 型数组彼此*相等*，则返回 true。如果两个数组包含相同数量的元素，并且两个数组中的所有相应元素对都是相等的，则认为这两个数组是相等的。换句话说，如果两个数组以相同顺序包含相同的元素，则两个数组是相等的。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。 |
| 3    | **public static void fill(int[] a, int val)** 将指定的 int 值分配给指定 int 型数组指定范围中的每个元素。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。 |
| 4    | **public static void sort(Object[] a)** 对指定对象数组根据其元素的自然顺序进行升序排列。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。 |

## 冒泡排序

*冒泡排序无疑是最出名的排序算法，总共有八大排序*

* 冒泡排序代码还是很简单，两层循环，外层冒泡轮数，里层依次比较
* 我们看到循环嵌套就应该想到这个算法的复杂度为O(n2)

### 代码

```java
public static int[] sort(int[] array){
    
    int temp = 0;
    
    for(i = 0; i < array.longth - 1 - i; i++){
        for(j = 0; j < array.longth - 1 - i; j++){
            if(num1[j + 1] < num2[j]){
                temp = num1[j + 1];
                num1[j + 1] = num[j];
                num[j + 1] = temp;
            }
        }
    }
}
```

## 稀疏数组

*稀疏数组（Sparse Array）是一种用于处理数据中大量重复元素或缺失元素的数据结构。它通过只存储非零或非默认值的元素来优化存储，从而节省存储空间和提高效率。*

### 基本概念

稀疏数组主要用于表示那些大部分元素为零或相同值的数组。传统的数组在存储这类数据时会浪费大量的存储空间，因为需要存储大量的重复值。稀疏数组通过只存储非零或非默认值的元素来优化存储。

### 表示方法

三元组表示法：

- 用于表示二维稀疏数组，记录非零元素的行索引、列索引和值。
- 例如，一个稀疏矩阵可以用一个包含多个三元组（行，列，值）的列表来表示。

哈希表表示法

- 使用哈希表来存储非零元素，键是元素的索引，值是元素的值。
- 这种方法适用于任意维度的稀疏数组，并且可以高效地进行插入、删除和查找操作。

列表表示法

- 将稀疏数组转换为一个包含非零元素及其位置的列表。
- 这种方法适用于一维稀疏数组，可以通过遍历列表来访问非零元素。

### 代码实现

```java
public class SparseArrayDemo {
    public static void main(String[] args) {
        // 1. 创建原始二维数组（11×11 五子棋棋盘）
        int[][] original = new int[11][11];
        original[1][2] = 1; // 黑子
        original[2][3] = 2; // 白子

        // 打印原始数组
        System.out.println("原始数组：");
        for (int[] row : original) {
            for (int val : row) {
                System.out.printf("%d\t", val);
            }
            System.out.println();
        }

        // 2. 统计有效元素个数
        int count = 0;
        for (int i = 0; i < original.length; i++) {
            for (int j = 0; j < original[i].length; j++) {
                if (original[i][j] != 0) {
                    count++;
                }
            }
        }

        // 3. 构建稀疏数组
        int[][] sparse = new int[count + 1][3];
        sparse[0][0] = original.length;       // 总行数
        sparse[0][1] = original[0].length;    // 总列数
        sparse[0][2] = count;                 // 有效元素个数

        // 填充有效元素
        int index = 1; // 从第1行开始记录有效元素
        for (int i = 0; i < original.length; i++) {
            for (int j = 0; j < original[i].length; j++) {
                if (original[i][j] != 0) {
                    sparse[index][0] = i;
                    sparse[index][1] = j;
                    sparse[index][2] = original[i][j];
                    index++;
                }
            }
        }

        // 打印稀疏数组
        System.out.println("\n稀疏数组：");
        for (int[] row : sparse) {
            System.out.printf("%d\t%d\t%d\n", row[0], row[1], row[2]);
        }

        // 4. 从稀疏数组还原原始数组
        int rows = sparse[0][0];
        int cols = sparse[0][1];
        int[][] restored = new int[rows][cols];

        for (int i = 1; i < sparse.length; i++) {
            int row = sparse[i][0];
            int col = sparse[i][1];
            int val = sparse[i][2];
            restored[row][col] = val;
        }

        // 打印还原后的数组
        System.out.println("\n还原后的数组：");
        for (int[] row : restored) {
            for (int val : row) {
                System.out.printf("%d\t", val);
            }
            System.out.println();
        }
    }
}
```

# 十三 面向对象

## 面向过程与面向对象的对比

面向过程思考

* 步骤清晰简单，第一步做什么，第二部做什么...
* 面对过程适合处理一些简单的问题

面向对象思考

* 物以类聚，分类的思维模式，思考问题首先会解决需要解决问题需要那些分类，然后对这些分类进行单独思考。最后，才对某个分类下的细节进行面向过程的思索。
* 面向对象适合处理复杂问题，适合处理需要多人协作解决问题。

***对于描述复杂事务，为了从宏观上把握，从整体上合理分析，我们需要使用面向对象的思路来对整个系统进行分析。但是，从具体到微观操作，仍然需要面向过程的思路去解决***

## 基础定义

面向对象编程(Object-Oriented Programming,OOP)

面向对象变成的本质是：以类的方式组织代码，以对象的组织(封装)数据。

**抽象**

三大特性：

* 封装
* 继承
* 多态

## 方法的调用

1. 静态方法
2. 非静态方法
3. 形参与实参
4. 值传递与引用传递
5. this关键词

## 类与对象的关系

- 类是一种抽象的数据类型，他是对某一类事务整体描述/定义，但是并布恩那个代表一个具体的事物

- 对象是抽象概念的具体实例

### 创建与初始化对象

* 使用new关键字创造对象
* 使用new关键词时，除了分配内存空间之外，还会给创建好的对象进行默认初始化以及对类中构造器的调用
* 类中的构造器也成为构造方法，是在进行创建对象的时候必须进行调用的。并且构造器有以下两个特点：
  1. 必须和类的名字相同
  2. 必须没有返回类型，也不能写void

***构造器必须掌握***

 ## 构造方法

 构造器可以初始化对象

1. 使用new关键词，本质是在调用构造器

### 无参构造

*如果一个类中没有定义任何构造方法，Java 会默认提供一个无参构造方法。*

```java
public class Person {
    public Person() {
        System.out.println("Person对象已创建");
    }
}
```

- 在没有显式定义构造方法时，Java 自动提供一个默认的无参构造方法。
- 一旦定义了其他构造方法，Java 将不再提供默认构造方法。

### 有参构造

一旦定义了有参构造，无参构造就必须显示定义**(一旦定义有参构造，就必须有其对应的无参构造，所以定义了有参构造就直接定义个无参构造放在有参构造之上就行)**

*可以定义带有参数的构造方法，用来在创建对象时为属性赋值：*

```java
public class Person {
    String name;
    int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

调用有参构造方法时，可以为对象的属性进行初始化：

```java
Person p = new Person("Alice", 25);
```

### this关键字

在构造方法中，this 关键字通常用于两种情况：

1. 引用当前对象的属性和方法：当构造方法的参数名与类属性名相同时，使用this来区分属性和参数。

   ```java
   public Person(String name, int age) {
       this.name = name; // this.name 表示类的属性
       this.age = age;
   }
   ```

   

2. 调用另一个构造方法：可以使用this()调用当前类的其他构造方法，常用于避免重复代码，但必须放在构造方法的第一行。

   ```java
   public Person(String name) {
       this(name, 0); // 调用另一个双参数的构造方法
   }
   
   public Person(String name, int age) {
       this.name = name;
       this.age = age;
   }
   ```

### 构造方法的重载

java支持构造方法的重载，即可以和在同一个类中定义多个构造方法，只要参数列表不同即可。

示例

```java
public class Person {
    String name;
    int age;

    //无参构造
    public Person() {
        this.name = "Unknown";
        this.age = 0;
    }

    //有参构造
    public Person(String name) {
        this.name = name;
        this.age = 0;
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

创建对象时，Java会根据传入的参数数量和类型自动选择构造的方法：

```java
Person p1 = new Person(); // 调用无参构造方法
Person p2 = new Person("Alice"); // 调用单参数构造方法
Person p3 = new Person("Bob", 30); // 调用双参数构造方法
```

### 额外

构造器：

1. 和类名相同
2. 没有返回值

作用

1. new 本质在调用构造方法
2. 初始化对象的值

注意点：

1. 定义有参构造后，如果想使用无参构造，需要显示的定义一个无参的构造

### 快捷键

Alt+Insert

## 封装

*封装在面向对象程式设计方法中，封装（英语：Encapsulation）是指一种将抽象性函式接口的实现细节部分包装、隐藏起来的方法。*

*封装可以被认为是一个保护屏障，防止该类的代码和数据被外部类定义的代码随机访问。*

*要访问该类的代码和数据，必须通过严格的接口控制。*

*封装最主要的功能在于我们能修改自己的实现代码，而不用修改那些调用我们代码的程序片段。*

*适当的封装可以让程式码更容易理解与维护，也加强了程式码的安全性。*

封装的基本原则

- 该露的露，该藏的藏

  我们程序设计要追求**高内聚，低耦合**。高内聚就是类的内部数据操作细节自己完成，不允许外部干涉；低耦合指仅暴露少量的方法给外部使用

- 封装**(数据的隐藏)**

  通常，赢禁止直接访问一个数据的实际表示，而应通过数据接口来访问，这称为信息隐藏。

- 记住这句话就够：属性私有，get/set**(提供方法来对私有的属性进行设置，显示与修改)**

### 封装的优点

1. 良好的封装能够减少耦合。
2. 类内部的结构可以自由修改。
3. 可以对成员变量进行更精确的控制。
4. 隐藏信息，实现细节。
5. 对要修改的值进行隐形的检查，提高代码的安全性
6. 统一接口
7. 提高系统的可维护性

### 封装的实现步骤

1. 通过修改属性的可见性来限制对属性的访问(一般为private)

   ```java
   public class Person {
       private String name;
       private int age;
   }
   ```

   这段代码中，将**name**和**age**属性设置为私有，只能本类菜能访问，其他类都访问不了，如此就对信息进行了隐藏。

2. 对每个值属性提供对外的公共方法访问，也就是创建一对赋取值方法，用于对私有属性的访问

   ```java
   public class Person{
       private String name;
       private int age;
   
       public int getAge(){
         return age;
       }
   
       public String getName(){
         return name;
       }
   
       public void setAge(int age){
         this.age = age;
       }
   
       public void setName(String name){
         this.name = name;
       }
   }
   ```

   采用 **this** 关键字是为了解决实例变量（private String name）和局部变量（setName(String name)中的name变量）之间发生的同名的冲突。

示例

```java
/* 文件名: EncapTest.java */
public class EncapTest{
 
   private String name;
   private String idNum;
   private int age;
 //get获取这个数据
   public int getAge(){
      return age;
   }
 
   public String getName(){
      return name;
   }
 
   public String getIdNum(){
      return idNum;
   }
 
//set给数据设置值
    
   public void setAge( int newAge){
      age = newAge;
   }
 
   public void setName(String newName){
      name = newName;
   }
 
   public void setIdNum( String newId){
      idNum = newId;
   }
}
```

以上实例中public方法是外部类访问该类成员变量的入口。

通常情况下，这些方法被称为getter和setter方法。

因此，任何要访问类中私有成员变量的类都要通过这些getter和setter方法。

通过如下的例子说明EncapTest类的变量怎样被访问：

```java
/* F文件名 : RunEncap.java */
public class RunEncap{
   public static void main(String args[]){
      EncapTest encap = new EncapTest();
      encap.setName("James");
      encap.setAge(20);
      encap.setIdNum("12343ms");
 
      System.out.print("Name : " + encap.getName()+ 
                             " Age : "+ encap.getAge());
    }
}
```

结果为

```java
Name : James Age : 20
```

#### 快捷键

Alt+Insert中的Getter and Setter

## 继承

### 定义

java类中只有单继承，没有多继承！

继承是java面向对象编程技术的一块基石，因为它允许创建分等级层次的类。

继承就是子类继承父类的特征和行为，使得子类对象（实例）具有父类的实例域和方法，或子类从父类继承方法，使得子类具有父类相同的行为。

#### 继承的格式

在 Java 中通过 extends 关键字可以申明一个类是从另外一个类继承而来的

```java
class 父类 {
}
 
class 子类 extends 父类 {
}
```

### 继承的作用

对多种部分相同的对象进行抽象建模，将其公共部分抽象为父类，将其私有部分抽象为子类，子类具有父类的全部公共方法与全部公共属性。

1. 可以简化重复代码
2. 可以更好显示出代码逻辑

### 继承的特性

- 子类拥有父类非 private 的属性、方法。
- 子类可以拥有自己的属性和方法，即子类可以对父类进行扩展。
- 子类可以用自己的方式实现父类的方法。
- Java 的继承是单继承，但是可以多重继承，单继承就是一个子类只能继承一个父类，多重继承就是，例如 B 类继承 A 类，C 类继承 B 类，所以按照关系就是 B 类是 C 类的父类，A 类是 B 类的父类，这是 Java 继承区别于 C++ 继承的一个特性。
- 提高了类之间的耦合性（继承的缺点，耦合度高就会造成代码之间的联系越紧密，代码独立性越差）。

### 快捷键

CTRL+H，可以显示出继承树

通过继承树可以看出所以类都是Object的子类

### 关键字

继承可以使用 extends 和 implements 这两个关键字来实现继承，而且所有的类都是继承于 java.lang.Object，当一个类没有继承的两个关键字，则默认继承 Object（这个类在 **java.lang** 包中，所以不需要 **import**）祖先类。

#### extends关键字

在 Java 中，类的继承是单一继承，也就是说，一个子类只能拥有一个父类，所以 extends 只能继承一个类。

```javA
public class Animal { 
    private String name;   
    private int id; 
    public Animal(String myName, int myid) { 
        //初始化属性值
    } 
    public void eat() {  //吃东西方法的具体实现  } 
    public void sleep() { //睡觉方法的具体实现  } 
} 
 
public class Penguin  extends  Animal{ 
}
```

#### implements关键字

使用 implements 关键字可以变相的使java具有多继承的特性，使用范围为类继承接口的情况，可以同时继承多个接口（接口跟接口之间采用逗号分隔）。

```java
public interface A {
    public void eat();
    public void sleep();
}
 
public interface B {
    public void show();
}
 
public class C implements A,B {
}
```

#### super与this关键字

**super 关键字：**我们可以通过 super 关键字来实现对父类成员的访问，用来引用当前对象的父类。

*私有的东西无法被继承，即无法通过super来调用父类中的私有部分*



**this 关键字：**指向自己的引用，引用当前对象，即它所在的方法或构造函数所属的对象实例。

```java
class Animal {
    void eat() {
        System.out.println("animal : eat");
    }
}
 
class Dog extends Animal {
    void eat() {
        System.out.println("dog : eat");
    }
    void eatTest() {
        this.eat();   // this 调用自己的方法
        super.eat();  // super 调用父类方法
    }
}
 
public class Test {
    public static void main(String[] args) {
        Animal a = new Animal();
        a.eat();
        Dog d = new Dog();
        d.eatTest();
    }
}
```

### 注意点

在继承的过程中也要注意有参构造与无参构造这回事

当父类没有无参构造时，子类不能拥有无参构造，如果子类要使用无参构造必须用super()调用有参构造

在调用子类的无参构造时，隐性调用了父类的无参构造，调用父类的构造器必须放在代码块的第一行

super必须只能出现在子列的方法或构造方法之中

super和this不饿能同时调用构造方法

### 重写

#### 定义

*重写都是方法的重写与属性无关*

重写（Override）是指子类定义了一个与其父类中具有相同名称、参数列表和返回类型的方法，并且子类方法的实现覆盖了父类方法的实现。 **即外壳不变，核心重写！**

重写的好处在于子类可以根据需要，定义特定于自己的行为。也就是说子类能够根据需要实现父类的方法。这样，在使用子类对象调用该方法时，将执行子类中的方法而不是父类中的方法。

重写方法不能抛出新的检查异常或者比被重写方法申明更加宽泛的异常。例如： 父类的一个方法申明了一个检查异常 IOException，但是在重写这个方法的时候不能抛出 Exception 异常，因为 Exception 是 IOException 的父类，抛出 IOException 异常或者 IOException 的子类异常。

#### 语法

示例

```java
class Animal{
   public void move(){
      System.out.println("动物可以移动");
   }
}
 
class Dog extends Animal{
   public void move(){
      System.out.println("狗可以跑和走");
   }
}
 
public class TestDog{
   public static void main(String args[]){
      Animal a = new Animal(); // Animal 对象
      Animal b = new Dog(); // Dog 对象
 
      a.move();// 执行 Animal 类的方法
 
      b.move();//执行 Dog 类的方法
   }
}
```

编译结果为

```
动物可以移动
狗可以跑和走
```

当需要在子类中调用父类的被重写方法时，要使用 super 关键字。

示例

```java
class Animal{
   public void move(){
      System.out.println("动物可以移动");
   }
}
 
class Dog extends Animal{
   public void move(){
      super.move(); // 应用super类的方法
      System.out.println("狗可以跑和走");
   }
}
 
public class TestDog{
   public static void main(String args[]){
 
      Animal b = new Dog(); // Dog 对象
      b.move(); //执行 Dog类的方法
 
   }
}
```

输出结果为

```java
动物可以移动
狗可以跑和走
```

##### 注意

重写是引用，其中"Animal b = new Dog();"这行代码中表示，b的数据类型为Animal但它的构造方法为Dog()

所以，b引用的方法中必须在父类Animal的构造器Animal()中拥有才能正常使用

示例

```java
class Animal{
   public void move(){
      System.out.println("动物可以移动");
   }
}
 
class Dog extends Animal{
   public void move(){
      System.out.println("狗可以跑和走");
   }
   public void bark(){
      System.out.println("狗可以吠叫");
   }
}
 
public class TestDog{
   public static void main(String args[]){
      //方法的调用只和左边定义的数据类型有关
      Animal a = new Animal(); // Animal 对象
      Animal b = new Dog(); // Dog 对象
 		 
      a.move();// 执行 Animal 类的方法
      b.move();//执行 Dog 类的方法
      b.bark();
   }
}
```

输出结果为

```
TestDog.java:30: cannot find symbol
symbol  : method bark()
location: class Animal
                b.bark();
                 ^
```

如上所示，b的数据类型"Animal"所对应的构造器"Animal()"中没有"bark()"这个方法，所以无法使用。

#### 重写的规则

- 参数列表与被重写方法的参数列表必须完全相同。

- 方法名必须相同

- 返回类型与被重写方法的返回类型可以不相同，但是必须是父类返回值的派生类（java5 及更早版本返回类型要一样，java7 及更高版本可以不同）。

- 访问权限不能比父类中被重写的方法的访问权限更低。例如：如果父类的一个方法被声明为 public，那么在子类中重写该方法就不能声明为 protected。

  ```
  public > protected > default > private
  ```

- 父类的成员方法只能被它的子类重写。
- 声明为 final 的方法不能被重写。
- 声明为 static 的方法不能被重写，但是能够被再次声明，static方法属于类，它不属于实例。
- 子类和父类在同一个包中，那么子类可以重写父类所有方法，除了声明为 private 和 final 的方法。
- 子类和父类不在同一个包中，那么子类只能够重写父类的声明为 public 和 protected 的非 final 方法。
- 重写的方法能够抛出任何非强制异常，无论被重写的方法是否抛出异常。但是，重写的方法不能抛出新的强制性异常，或者比被重写方法声明的更广泛的强制性异常，反之则可以。
- 构造方法不能被重写。
- 如果不能继承一个类，则不能重写该类的方法。
- 抛出的异常可以被缩小不能变大

重写，父类和子类的方法必须一致，方法体不同

#### 快捷键

Alt+Insert		override

## 多态

*多态是同一个行为具有多个不同表现形式或形态的能力。*

### 多态的优点

1. 消除类型之间的耦合关系
2. 可替换性
3. 可扩充性
4. 接口性
5. 灵活性
6. 简化性

### 多态的三个必然条件

- 继承
- 重写
- 父类引用指向子列对象



示例

```java
class Shape {
    void draw() {}
}
  
class Circle extends Shape {
    void draw() {
        System.out.println("Circle.draw()");
    }
}
  
class Square extends Shape {
    void draw() {
        System.out.println("Square.draw()");
    }
}
  
class Triangle extends Shape {
    void draw() {
        System.out.println("Triangle.draw()");
    }
}
```

当使用多态方式调用方法时，首先检查父类中是否有该方法，如果没有，则编译错误；如果有，再去调用子类的同名方法。

多态的好处：可以使程序有良好的扩展，并可以对所有类的对象进行通用处理。

示例

```java
public class Test {
    public static void main(String[] args) {
      show(new Cat());  // 以 Cat 对象调用 show 方法
      show(new Dog());  // 以 Dog 对象调用 show 方法
                
      Animal a = new Cat();  // 向上转型  
      a.eat();               // 调用的是 Cat 的 eat
      Cat c = (Cat)a;        // 向下转型  
      c.work();        // 调用的是 Cat 的 work
  }  
            
    public static void show(Animal a)  {
      a.eat();  
        // 类型判断
        if (a instanceof Cat)  {  // 猫做的事情 
            Cat c = (Cat)a;  
            c.work();  
        } else if (a instanceof Dog) { // 狗做的事情 
            Dog c = (Dog)a;  
            c.work();  
        }  
    }  
}
 
abstract class Animal {  
    abstract void eat();  
}  
  
class Cat extends Animal {  
    public void eat() {  
        System.out.println("吃鱼");  
    }  
    public void work() {  
        System.out.println("抓老鼠");  
    }  
}  
  
class Dog extends Animal {  
    public void eat() {  
        System.out.println("吃骨头");  
    }  
    public void work() {  
        System.out.println("看家");  
    }  
}
```

执行结果为

```
吃鱼
抓老鼠
吃骨头
看家
吃鱼
抓老鼠
```

### 多态的使用

当父类使用子类的方法时可以使用强制类型转换来使用

```java
public class Person {

    public void run(){

    }

}

public class Student extends Person {

    @Override
    public void run() {
        System.out.println("run" );
    }

    public void eat(){
        System.out.println("eat");
    }
}

public class Application {
    public static void main(String[] args) {

        Student s1 = new Student();
        Person s2 = new Student();
        Object s3 = new Student();


        ((Student) s2).eat();
        s1.eat();

    }
}
```

输出结果为

```java
eat
eat
```

### 注意点

1. 多态时方法的多态，属性没有多态
2. 父类和子类，有联系   类型转换异常    ClassCastException
3. 存在条件：继承关系，方法需要重写，父类引用指向子类
4. 子类转换为父类，向上转型；可能丢失一些自己的本来方法
5. 父类转化为子类，向下转型；强制类型转换
6. 方便方法的调用，减少重复的代码

### instanceof关键词

*该关键字是判断一个对象与被测对象是否为父子关系*

#### 语法

```java
对象 instanceof 被测类型
```

- 如果对象是被测类型的父类型则输出为"ture"
- 反之为"false"
- 如果无法编译则象征着它们不存在父子关系

示例

```java
package com.java_learn.OOP;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Application {
    public static void main(String[] args) {

        /*
        Object > String
        Object > Person > Student
        Object > Person > teacher
         */

        Object object = new Student();
        System.out.println(object instanceof Student);  //ture
        System.out.println(object instanceof Person);   //ture
        System.out.println(object instanceof Object);   //ture
        System.out.println(object instanceof Teacher);  //false
        System.out.println(object instanceof String);   //false

        System.out.println("===================================");

        Person person = new Student();
        System.out.println(person instanceof Student);  //ture
        System.out.println(person instanceof Person);   //ture
        System.out.println(person instanceof Object);   //ture
        System.out.println(person instanceof Teacher);  //false
        //System.out.println(person instanceof String); 无法编译

        System.out.println("===================================");

        Student student = new Student();
        System.out.println(student instanceof Student); //ture
        System.out.println(student instanceof Person);  //ture
        System.out.println(student instanceof Object);  //ture
        //System.out.println(student instanceof Teacher);   无法编译
        //System.out.println(student instanceof String);    无法编译

    }
}
```

输出结果为

```
true
true
true
false
false
===================================
true
true
true
false
===================================
true
true
true
```

## static静态小结

static静态，在程序的一开始随类一同加载，所以可以提前调用

无论代码块，方法，库等都是可以提前加载，在代码的一开始就可以调用

## 代码块

**分类**

- 静态代码块

  静态代码块在在程序的一开始随类一同加载

  只加载一次

- 匿名代码块

  在代码编译的开始载入

# 十四 抽象类

在面向对象的概念中，所有的对象都是通过类来描绘的，但是反过来，并不是所有的类都是用来描绘对象的，如果一个类中没有包含足够的信息来描绘一个具体的对象，这样的类就是抽象类。

抽象类除了不能实例化对象之外，类的其它功能依然存在，成员变量、成员方法和构造方法的访问方式和普通类一样。

***由于抽象类不能实例化对象，所以抽象类必须被继承，才能被使用。***

也是因为这个原因，通常在设计阶段决定要不要设计抽象类。

父类包含了子类集合的常见的方法，但是由于父类本身是抽象的，所以不能使用这些方法。

在 Java 中抽象类表示的是一种继承关系，一个类只能继承一个抽象类，而一个类却可以实现多个接口。

## 语法

```java
//abstract 抽象类
public abstract class 类名{
    //抽象方法
    //约束~有人帮我们实现~
    //abstract ,抽象方法，只有方法名字，没有方法的实现！
    public abstract 类型 方法名();
}
```

## 注意

1. 不能new这个抽象类，只能考子类去实现它。是为了约束代码的编写
2. 抽象类中可以写普通方法
3. 抽象方法必须写在抽象类中

***抽象的抽象***

## 抽象类规定

1. 抽象类不能被实例化(初学者很容易犯的错)，如果被实例化，就会报错，编译无法通过。只有抽象类的非抽象子类可以创建对象。
2. 抽象类中不一定包含抽象方法，但是有抽象方法的类必定是抽象类。
3. 抽象类中的抽象方法只是声明，不包含方法体，就是不给出方法的具体实现也就是方法的具体功能。
4. 构造方法，类方法（用 static 修饰的方法）不能声明为抽象方法。
5. 抽象类的子类必须给出抽象类中的抽象方法的具体实现，除非该子类也是抽象类。

# 十五 接口

[了解链接](https://www.runoob.com/java/java-interfaces.html)

 接口（英文：Interface），在JAVA编程语言中是一个抽象类型，是抽象方法的集合，接口通常以**"interface"**来声明。一个类通过继承接口的方式，从而来继承接口的抽象方法。

接口并不是类，编写接口的方式和类很相似，但是它们属于不同的概念。类描述对象的属性和方法。接口则包含类要实现的方法。

除非实现接口的类是抽象类，否则该类要定义接口中的所有方法。

接口无法被实例化，但是可以被实现。一个实现接口的类，必须实现接口内所描述的所有方法，否则就必须声明为抽象类。另外，在 Java 中，接口类型可用来声明一个变量，他们可以成为一个空指针，或是被绑定在一个以此接口实现的对象。

## 对比

普通类：只有具体的实现

抽象类：具体的实现和规范都有

接口：只有规范！自己无法写方法~专业的约束！可以实现约束和实现分离

***接口的本质是契约***

## 语法

### 接口的声明

```java
[可见度] interface 接口名称 [extends 其他的接口名] {
        // 声明变量
        // 抽象方法
}
```

例子

```java
/* 文件名 : NameOfInterface.java */
import java.lang.*;
//引入包
 
public interface NameOfInterface
{
   //任何类型 final, static 字段
   //抽象方法
}
```

接口有以下特性：

- 接口是隐式抽象的，当声明一个接口的时候，不必使用**abstract**关键字。
- 接口中每一个方法也是隐式抽象的，声明时同样不需要**abstract**关键字。
- 接口中的方法都是公有的。

```java
/* 文件名 : Animal.java ||接口*/
public interface Animal {

    public void eat();
    public void travel();

}
```

```java
/* 文件名 : TimeService.java ||接口*/

```



### 接口的实现

```java
/* 文件名 : AnimalImpl.java ||实现类*/
//类 可以使用接口 implements 接口
//实现了接口的类，必须要重写接口中的方法
public class AnimalImpl implements Animal,TimeService{

    @Override
    public void eat() {

    }

    @Override
    public void travel() {

    }

    @Override
    public void setTime() {
        
    }

    @Override
    public void getTime() {

    }
}

```

## 总结

1. 约束
2. 定义一些方法，让不同的人实现
3. public abstract
4. public static final
5. 接口不能被实例化，接口中没有构造方法
6. implements可以实现多个接口
7. 必须重写接口中的方法

# 十六 内部类

内部类就是在一个类的内部在定义一个类，比如A类中定义一个B类，那么B类相对A类来说就被称之为内部类，而A类相对于B类就是外部类。

## 分类

1. 成员内部类

   语法

   ```java
   public class Outer {
   
       private int id;
       public void out(){
           System.out.println("这是外部方法");
       }
   
       class Inner{
           public void in(){
               System.out.println("这是内部方法");
           }
       }
   
   }
   ```

   实例化

   ```java
   public class Application {
       public static void main(String[] args) {
   
           Outer outer = new Outer();
   		
           //通过Outer来实例化Inner类
           Outer.Inner inner= outer.new Inner();
   
           outer.out();
           inner.in();
   
       }
   }
   ```

   

2. 静态内部类

   ```java
   public class Outer {
   
       private int id;
       public void out(){
           System.out.println("这是外部方法");
       }
   
       public static class Inner{
           public void in(){
               System.out.println("这是内部方法");
           }
       }
   
   }
   ```

   

3. 局部内部类

   ```java
   public class Outer {
       public void method(){
           //局部内部类
           class Inner{
               public void in(){
                   System.out.println("这是内部方法");
               }
           }
       }
   }
   ```

   

4. 匿名内部类

   ```java
   ```

   

## 作用

可以通过内部类获取内部类的私有属性与私有方法

## 注意

一个Java文件中只有有一个"public class"，但可以有多个"class"

# 十六 异常

[异常的文档](https://www.runoob.com/java/java-exceptions.html)

[异常视频](https://www.bilibili.com/video/BV12J41137hu?spm_id_from=333.788.player.switch&vd_source=27f02d1a88a6a0a774cae78e29296617&p=77)
