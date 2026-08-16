---
title: "Java IO 流详解：字节流、字符流、对象流"
date: "2026-08-16"
tags: ["Java", "IO", "流"]
minutes: 35
---

# 流

## 定义/概念

内存到存储设备直接传输数据的通道

 ## 分类

- 按方向
  1. 输出流：将<存储数据>中的内容读入到<内存>中
  2. 输出流：将<内存>中的数据读入到<存储数据>中
- 按单位
  1. 字节流：以字节为单位，可以读取所有类型的数据
  2. 字符流：以字符为单位，只能读取文本类型的数据
- 按功能
  1. 节点流：具有世界传输数据的读写功能
  2. 过滤流：在节点流的基础之上增强功能

# 字节流

[字节流查看api文档]()

- 字节流的父类(抽象类):

  - InputStream:字节输入流

    *所有的方法*

    |      变量和类型      |                   方法                   | 描述                                                         |
    | :------------------: | :--------------------------------------: | ------------------------------------------------------------ |
    |        `int`         |              `available()`               | 返回可以从此输入流中无阻塞地读取（或跳过）的字节数的估计值，可以是0，或者在检测到流结束时为0。 |
    |        `void`        |                `close()`                 | 关闭此输入流并释放与该流关联的所有系统资源。                 |
    |        `void`        |          `mark(int readlimit)`           | 标记此输入流中的当前位置。                                   |
    |      `boolean`       |            `markSupported()`             | 测试此输入流是否支持 `mark`和 `reset`方法。                  |
    | `static InputStream` |           `nullInputStream()`            | 返回一个不读取任何字节的新 `InputStream` 。                  |
    |    `abstract int`    |                 `read()`                 | 从输入流中读取下一个数据字节。                               |
    |        `int`         |             `read(byte[] b)`             | 从输入流中读取一些字节数并将它们存储到缓冲区数组 `b` 。      |
    |        `int`         |    `read(byte[] b, int off, int len)`    | 从输入流 `len`最多 `len`字节的数据读入一个字节数组。         |
    |       `byte[]`       |             `readAllBytes()`             | 从输入流中读取所有剩余字节。                                 |
    |        `int`         | `readNBytes(byte[] b, int off, int len)` | 从输入流中读取请求的字节数到给定的字节数组中。               |
    |       `byte[]`       |          `readNBytes(int len)`           | 从输入流中读取指定的字节数。                                 |
    |        `void`        |                `reset()`                 | 将此流重新定位到上次在此输入流上调用 `mark`方法时的位置。    |
    |        `long`        |              `skip(long n)`              | 跳过并丢弃此输入流中的 `n`字节数据。                         |
    |        `long`        |      `transferTo(OutputStream out)`      | 从该输入流中读取所有字节，并按读取顺序将字节写入给定的输出流。 |
  
    **在这其中最重要的是要记住read(),close().**
  
  - OutputStream:字节输出流
  
    *所有的方法*
  
    |      变量和类型       |                方法                 |                             描述                             |
    | :-------------------: | :---------------------------------: | :----------------------------------------------------------: |
    |        `void`         |              `close()`              |         关闭此输出流并释放与此流关联的所有系统资源。         |
    |        `void`         |              `flush()`              |          刷新此输出流并强制写出任何缓冲的输出字节。          |
    | `static OutputStream` |        `nullOutputStream()`         |        返回一个新的 `OutputStream` ，它丢弃所有字节。        |
    |        `void`         |          `write(byte[] b)`          |       将 `b.length`字节从指定的字节数组写入此输出流。        |
    |        `void`         | `write(byte[] b, int off, int len)` | 将从偏移量 `off`开始的指定字节数组中的 `len`字节写入此输出流。 |
    |    `abstract void`    |           `write(int b)`            |                  将指定的字节写入此输出流。                  |
  
## 文件字节流

### FileInputStream（字节输入流）

  - FileInputStream:
  
    [API文档](https://www.runoob.com/manual/jdk11api/java.base/java/io/FileInputStream.html)
  
    *所有方法*
  
    |    变量和类型    |                方法                |                             描述                             |
    | :--------------: | :--------------------------------: | :----------------------------------------------------------: |
    |      `int`       |           `available()`            | 返回可以从此输入流中读取（或跳过）的剩余字节数的估计值，而不会被下一次调用此输入流的方法阻塞。 |
    |      `void`      |             `close()`              |       关闭此文件输入流并释放与该流关联的所有系统资源。       |
    | `protected void` |            `finalize()`            | **不推荐使用，要删除：此API元素将在以后的版本中删除。**`finalize`方法已被弃用，将被删除。 |
    |  `FileChannel`   |           `getChannel()`           | 返回与此文件输入流关联的唯一[`FileChannel`](https://www.runoob.com/manual/jdk11api/java.base/java/nio/channels/FileChannel.html)对象。 |
    | `FileDescriptor` |             `getFD()`              | 返回 `FileDescriptor`对象，该对象表示与此 `FileInputStream`正在使用的文件系统中的实际文件的连接。 |
    |      `int`       |              `read()`              |               从此输入流中读取一个字节的数据。               |
    |      `int`       |          `read(byte[] b)`          | 从此输入流 `b.length`最多 `b.length`字节的数据读 `b.length`字节数组。 |
    |      `int`       | `read(byte[] b, int off, int len)` |    从此输入流 `len`最多 `len`字节的数据读入一个字节数组。    |
    |      `long`      |           `skip(long n)`           |             跳过并从输入流中丢弃 `n`字节的数据。             |
  
    ```java
    public int read(byte[] b);
    //从流中读取多个数据，将督导的内容存入数组b，返回实际读到的字节数；如果到达文件的尾部，则返回-1FileOutputStream
    ```


### FileOutputStream（字节输出流）

- FileOutputStream：

  [API文档](https://www.runoob.com/manual/jdk11api/java.base/java/io/FileOutputStream.html)

  *所有方法*

  |    变量和类型    |                方法                 |                             描述                             |
  | :--------------: | :---------------------------------: | :----------------------------------------------------------: |
  |      `void`      |              `close()`              |       关闭此文件输出流并释放与此流关联的所有系统资源。       |
  | `protected void` |            `finalize()`             | **不推荐使用，要删除：此API元素将在以后的版本中删除。**`finalize`方法已被弃用，将被删除。 |
  |  `FileChannel`   |           `getChannel()`            | 返回与此文件输出流关联的唯一[`FileChannel`](https://www.runoob.com/manual/jdk11api/java.base/java/nio/channels/FileChannel.html)对象。 |
  | `FileDescriptor` |              `getFD()`              |                 返回与此流关联的文件描述符。                 |
  |      `void`      |          `write(byte[] b)`          |     将指定字节数组中的 `b.length`字节写入此文件输出流。      |
  |      `void`      | `write(byte[] b, int off, int len)` | 将从偏移量 `off`开始的指定字节数组中的 `len`字节写入此文件输出流。 |
  |      `void`      |           `write(int b)`            |                将指定的字节写入此文件输出流。                |

实例

*FileInputStream*

```java
package src.com.java_learn.IO;


import java.io.FileInputStream;

public class Dome1 {
    public static void main(String[] args) throws Exception{

        FileInputStream fil1 = new FileInputStream("...\\tjc.txt");
        byte[] num1 = new byte[3];
        int data = 0;
        while((data = fil1.read()) != -1){

            System.out.println((char)data);

        }

        fil1.close();

        FileInputStream fil2 = new FileInputStream("...\\tjc.txt");
        int count1 = fil2.read(num1);
        System.out.println(new String(num1));

        fil2.close();


        //如果使用了read查看数据只能读写数据一次？
    }
}
```

输出结果为

```
s
e
h
f
n
a
d
i
h
f
e
n
f
s
f
a
seh
```

*FileOutputStream*

```java
package src.com.java_learn.IO;

import java.io.FileOutputStream;

public class DomeOutputStream {
    public static void main(String[] args) throws Exception {

        FileOutputStream filOut1 = new FileOutputStream("...\\ticsb.txt", true);
        byte[] but = new byte[50];
        String str = "holleword";

        for (int index = 0; index < but.length; index++) {

            but[index] = 'i';

        }


        filOut1.write('a');
        filOut1.write(but);
        filOut1.write(str.getBytes());


        filOut1.close();

        System.out.println(filOut1);

    }
}
```

输出结果为

```
java.io.FileOutputStream@4eec7777
```



### 练习/复制文件

```java
package src.com.java_learn.IO;

import java.io.FileInputStream;
import java.io.FileOutputStream;

public class Test1 {
    public static void main(String[] args) throws Exception{

        //1.输入流与输出流的创建
        FileInputStream fis = new FileInputStream("...\\G_rWpaxbAAYdYlE.jpg");
        FileOutputStream fos = new FileOutputStream("...\\G_rWpaxbAAYdYlE_副本.jpg");
		
        //2.储存缓冲区的建立
        Byte [] but = new Byte[1024];
        int data = 0;
		
        //3.将文件进行复制
        while ((data = fis.read())!= -1){
            fos.write(data);
        }
		
        //4.关闭流
        fis.close();
        fos.close();
    }
}
```

### BufferedInputStream（缓冲字节输入流）

*向另一个输入流添加功能 - 即缓冲输入并支持`mark`和`reset`方法的功能。 创建`BufferedInputStream`将创建内部缓冲区阵列。 当读取或跳过来自流的字节时，内部缓冲区根据需要从包含的输入流中重新填充，一次多个字节。 `mark`操作会记住输入流中的一个点，并且`reset`操作会导致在从包含的输入流中获取新字节之前重新读取自最近的`mark`操作以来读取的所有字节。*

**方法**

| 变量和类型 | 方法                               | 描述                                                         |
| :--------- | :--------------------------------- | :----------------------------------------------------------- |
| `int`      | `available()`                      | 返回可以从此输入流中读取（或跳过）的字节数的估计值，而不会被下一次调用此输入流的方法阻塞。 |
| `void`     | `close()`                          | 关闭此输入流并释放与该流关联的所有系统资源。                 |
| `void`     | `mark(int readlimit)`              | 参见 `mark`方法 `InputStream`的总合同。                      |
| `boolean`  | `markSupported()`                  | 测试此输入流是否支持 `mark`和 `reset`方法。                  |
| `int`      | `read()`                           | 参见 `read`方法 `InputStream`的总合同。                      |
| `int`      | `read(byte[] b, int off, int len)` | 从给定的偏移量开始，将此字节输入流中的字节读入指定的字节数组。 |
| `void`     | `reset()`                          | 参见 `reset`方法 `InputStream`的总合同。                     |
| `long`     | `skip(long n)`                     | 见的总承包 `skip`的方法 `InputStream` 。                     |

### BufferedOutputStream（缓冲输出流）

*该类实现缓冲输出流。 通过设置这样的输出流，应用程序可以将字节写入基础输出流，而不必为写入的每个字节调用底层系统。*

**方法**

| 变量和类型 | 方法                                | 描述                                                         |
| :--------- | :---------------------------------- | :----------------------------------------------------------- |
| `void`     | `flush()`                           | 刷新此缓冲的输出流。                                         |
| `void`     | `write(byte[] b, int off, int len)` | 将从偏移量 `off`开始的指定字节数组中的 `len`字节写入此缓冲输出流。 |
| `void`     | `write(int b)`                      | 将指定的字节写入此缓冲的输出流。                             |

### 练习通过缓冲区来完成文件的复制

**dome1(失败)**

*完成了对文件的复制，但对文件编码过程中出现了乱码与漏码*

```java
package src.com.java_learn.IO;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;

public class BufferStreamDome {
    //目标通过缓冲输入输出流来完成文件的复制与粘贴

    public static void main(String[] args) throws Exception {
        //1.创建输入流与输出流
        FileInputStream fil = new FileInputStream("...\\新建 文本文档 (3).txt");
        FileOutputStream fol = new FileOutputStream("...\\新建 文本文档 (3)_副本.txt");

        //2.创建缓冲输入流与缓冲输出流
        BufferedInputStream bFil = new BufferedInputStream(fil);
        BufferedOutputStream bFol = new BufferedOutputStream(fol);



        //3.通过循环来完成文件的复制与粘贴
        while (bFil.read() != -1){
            bFol.write(bFil.read());
            bFol.flush();
        }

        //4.关闭缓冲区的流（关注缓冲区的流自动关闭字节流）
        bFil.close();
        bFol.close();

        //好像无法直接通过缓冲区来完成文件的传输
    }
}
```

**原因：**

1. 必须通过数组缓冲区才能完成对文件的输入和输出

**dome2(成功)**

```java
package src.com.java_learn.IO;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;

public class BufferStreamDome {
    //目标通过缓冲输入输出流来完成文件的复制与粘贴

    public static void main(String[] args) throws Exception {
        //1.创建输入流与输出流
        FileInputStream fil = new FileInputStream("...\\新建 文本文档 (3).txt");
        FileOutputStream fol = new FileOutputStream("...\\新建 文本文档 (3)_副本.txt");

        //2.创建缓冲输入流与缓冲输出流
        BufferedInputStream bFil = new BufferedInputStream(fil);
        BufferedOutputStream bFol = new BufferedOutputStream(fol);

        //数据缓冲区
        byte[] but = new byte[1024*8];
        int data;

        //3.通过循环来完成文件的复制与粘贴
        while((data = bFil.read(but)) != -1){
            bFol.write(data);
        }

        bFol.flush();

        //4.关闭缓冲区的流（关注缓冲区的流自动关闭字节流）
        bFil.close();
        bFol.close();
    }
}
```

## 对象流

```java
ObjectOutputStream;
ObjectInputStream;
```



- 增强了缓冲区功能
- 增强了读写8中基本数据类型和字符串功能
- 增强了读写对象的功能
  - readObject()从流中读取一个对象
  - writeObject(Object obj)向流中写入一个对象

使用流传输对象的过程成为序列化、反序列化

### ObjectInputStream(对象输入流)/反序列化

**方法**

| 变量和类型                    | 方法                                                      | 描述                                                         |
| :---------------------------- | :-------------------------------------------------------- | :----------------------------------------------------------- |
| `int`                         | `available()`                                             | 返回可以不阻塞地读取的字节数。                               |
| `void`                        | `close()`                                                 | 关闭输入流。                                                 |
| `void`                        | `defaultReadObject()`                                     | 从此流中读取当前类的非静态和非瞬态字段。                     |
| `protected boolean`           | `enableResolveObject(boolean enable)`                     | 使流能够替换从流中读取的对象。                               |
| `ObjectInputFilter`           | `getObjectInputFilter()`                                  | 返回此流的序列化过滤器。                                     |
| `int`                         | `read()`                                                  | 读取一个字节的数据。                                         |
| `int`                         | `read(byte[] buf, int off, int len)`                      | 读入一个字节数组。                                           |
| `boolean`                     | `readBoolean()`                                           | 读入布尔值。                                                 |
| `byte`                        | `readByte()`                                              | 读取一个8位字节。                                            |
| `char`                        | `readChar()`                                              | 读取16位字符。                                               |
| `protected ObjectStreamClass` | `readClassDescriptor()`                                   | 从序列化流中读取类描述符。                                   |
| `double`                      | `readDouble()`                                            | 读取64位双精度数。                                           |
| `ObjectInputStream.GetField`  | `readFields()`                                            | 从流中读取持久字段并使其按名称可用。                         |
| `float`                       | `readFloat()`                                             | 读取32位浮点数。                                             |
| `void`                        | `readFully(byte[] buf)`                                   | 读取字节，阻塞直到读取所有字节。                             |
| `void`                        | `readFully(byte[] buf, int off, int len)`                 | 读取字节，阻塞直到读取所有字节。                             |
| `int`                         | `readInt()`                                               | 读取32位int。                                                |
| `String`                      | `readLine()`                                              | **已过时。**此方法无法将字节正确转换为字符。                 |
| `long`                        | `readLong()`                                              | 读长64位。                                                   |
| `Object`                      | `readObject()`                                            | 从ObjectInputStream中读取一个对象。                          |
| `protected Object`            | `readObjectOverride()`                                    | ObjectOutputStream的可信子类调用此方法，该子类使用受保护的无参数构造函数构造ObjectOutputStream。 |
| `short`                       | `readShort()`                                             | 读取16位短路。                                               |
| `protected void`              | `readStreamHeader()`                                      | 提供readStreamHeader方法以允许子类读取和验证自己的流标头。   |
| `Object`                      | `readUnshared()`                                          | 从ObjectInputStream中读取“非共享”对象。                      |
| `int`                         | `readUnsignedByte()`                                      | 读取无符号的8位字节。                                        |
| `int`                         | `readUnsignedShort()`                                     | 读取无符号16位短路。                                         |
| `String`                      | `readUTF()`                                               | 以 [modified UTF-8](https://www.runoob.com/manual/jdk11api/java.base/java/io/DataInput.html#modified-utf-8)格式读取字符串。 |
| `void`                        | `registerValidation(ObjectInputValidation obj, int prio)` | 在返回图形之前注册要验证的对象。                             |
| `protected 类<?>`             | `resolveClass(ObjectStreamClass desc)`                    | 加载等效于指定流类描述的本地类。                             |
| `protected Object`            | `resolveObject(Object obj)`                               | 此方法将允许ObjectInputStream的受信任子类在反序列化期间将一个对象替换为另一个对象。 |
| `protected 类<?>`             | `resolveProxyClass(String[] interfaces)`                  | 返回实现代理类描述符中指定的接口的代理类; 子类可以实现此方法以从流中读取自定义数据以及动态代理类的描述符，从而允许它们为接口和代理类使用备用加载机制。 |
| `void`                        | `setObjectInputFilter(ObjectInputFilter filter)`          | 设置流的序列化过滤器。                                       |
| `int`                         | `skipBytes(int len)`                                      | 跳过字节。                                                   |

### ObjectOutputStream(对象输出流)/序列化

**方法**

| 变量和类型                    | 方法                                           | 描述                                                         |
| :---------------------------- | :--------------------------------------------- | :----------------------------------------------------------- |
| `protected void`              | `annotateClass(类<?> cl)`                      | 子类可以实现此方法以允许类数据存储在流中。                   |
| `protected void`              | `annotateProxyClass(类<?> cl)`                 | 子类可以实现此方法以将流中的自定义数据与动态代理类的描述符一起存储。 |
| `void`                        | `close()`                                      | 关闭流。                                                     |
| `void`                        | `defaultWriteObject()`                         | 将当前类的非静态和非瞬态字段写入此流。                       |
| `protected void`              | `drain()`                                      | 排除ObjectOutputStream中的所有缓冲数据。                     |
| `protected boolean`           | `enableReplaceObject(boolean enable)`          | 使流能够替换写入流的对象。                                   |
| `void`                        | `flush()`                                      | 刷新流。                                                     |
| `ObjectOutputStream.PutField` | `putFields()`                                  | 检索用于缓冲要写入流的持久字段的对象。                       |
| `protected Object`            | `replaceObject(Object obj)`                    | 此方法将允许ObjectOutputStream的受信任子类在序列化期间将一个对象替换为另一个对象。 |
| `void`                        | `reset()`                                      | 重置将忽略已写入流的任何对象的状态。                         |
| `void`                        | `useProtocolVersion(int version)`              | 指定写入流时要使用的流协议版本。                             |
| `void`                        | `write(byte[] buf)`                            | 写一个字节数组。                                             |
| `void`                        | `write(byte[] buf, int off, int len)`          | 写一个子字节数组。                                           |
| `void`                        | `write(int val)`                               | 写一个字节。                                                 |
| `void`                        | `writeBoolean(boolean val)`                    | 写一个布尔值。                                               |
| `void`                        | `writeByte(int val)`                           | 写一个8位字节。                                              |
| `void`                        | `writeBytes(String str)`                       | 将String写为字节序列。                                       |
| `void`                        | `writeChar(int val)`                           | 写一个16位字符。                                             |
| `void`                        | `writeChars(String str)`                       | 将String写为一系列字符。                                     |
| `protected void`              | `writeClassDescriptor(ObjectStreamClass desc)` | 将指定的类描述符写入ObjectOutputStream。                     |
| `void`                        | `writeDouble(double val)`                      | 写一个64位双。                                               |
| `void`                        | `writeFields()`                                | 将缓冲的字段写入流。                                         |
| `void`                        | `writeFloat(float val)`                        | 写一个32位浮点数。                                           |
| `void`                        | `writeInt(int val)`                            | 写一个32位的int。                                            |
| `void`                        | `writeLong(long val)`                          | 写入64位长。                                                 |
| `void`                        | `writeObject(Object obj)`                      | 将指定的对象写入ObjectOutputStream。                         |
| `protected void`              | `writeObjectOverride(Object obj)`              | 子类用于覆盖默认writeObject方法的方法。                      |
| `void`                        | `writeShort(int val)`                          | 写一个16位的短。                                             |
| `protected void`              | `writeStreamHeader()`                          | 提供了writeStreamHeader方法，因此子类可以将自己的标头附加或预先添加到流中。 |
| `void`                        | `writeUnshared(Object obj)`                    | 将“非共享”对象写入ObjectOutputStream。                       |
| `void`                        | `writeUTF(String str)`                         | 原始数据以 [modified UTF-8](https://www.runoob.com/manual/jdk11api/java.base/java/io/DataInput.html#modified-utf-8)格式写入此字符串。 |

### 注意事项

1. 序列化类必须要实现`Serializable`接口

2. 序列化类中对象属性也要求实现`Serializable`接口

3. 序列化版本号ID，保证序列化的类和反序列话的类是同一个类

   `serialVersionUID`序列化版本号ID

4. 使用`transient`(瞬时的)修饰属性，这个属性不能序列化

5. 静态属性不能序列化

6. 序列化多个对象可以使用集合

### 实例

**学生类**

```java
package src.com.java_learn.IO;

import java.io.Serializable;

public class Student implements Serializable {
    private String name;
    private int age;
    private int id;

    public Student() {
    }

    public Student(String name, int age, int id) {
        this.name = name;
        this.age = age;
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", id=" + id +
                '}';
    }
}
```

**序列化**

```java
package src.com.java_learn.IO;

import java.io.FileOutputStream;
import java.io.ObjectOutputStream;

public class ObjectOutDome {
    public static void main(String[] args)throws Exception {
        //1.创建序列化流
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("...\\博客\\stu.bin"));

        //2.写入操作
        Student zhang = new Student("张三", 21,1223);
        oos.writeObject(zhang);

        //3.关闭
        oos.close();
    }
}
```

**反序列化**

```java
package src.com.java_learn.IO;

import java.io.FileInputStream;
import java.io.FilterInputStream;
import java.io.ObjectInputStream;

public class ObjectInDome {
    public static void main(String[] args) throws Exception{
        //反序列化
        //1.创建反序列化流
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream("...\\博客\\stu.bin"));

        //2.反序列化
        Student stu1 = (Student)ois.readObject();
        System.out.println(stu1.toString());

        //3.关闭
        ois.close();

    }
}
```

# 字符流

*字符流的总体与字节流的差距不大所以不再列举实例代码仅展示方法*

- 字符流的父类（抽象类）

  - Reader：字符输入流

    - ```java
      public int read(){};
      ```

    - ```java
      public int read(char[] c){};
      ```

    - ```java
      public int read(char[] b, int off, int len){};
      ```

  - Writer：字符输出流

    - ```java
      public void write(int n){};
      ```

    - ```java
      public void write(String str){};
      ```

    - ```java
      public void write(char[] c){};
      ```

  

  

## FileReader(文件字符输入流)

*使用默认缓冲区大小从字符文件中读取文本。 从字节到字符的解码使用指定的[charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html)或平台的[default charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset()) 。*

*`FileReader`用于读取字符流。 要读取原始字节流，请考虑使用`FileInputStream` 。*

  ```java
  public int read(char [] c);
  //从流中读取多个字符，将读到的内容存入数组c，返回实际读到的字符数，如果到达文件的尾部，则返回-1.
  ```

**构造方法**

| 构造器                                         | 描述                                                         |
| :--------------------------------------------- | :----------------------------------------------------------- |
| `FileReader(File file)`                        | 使用平台 `FileReader` ，在 `File`读取时创建一个新的 [FileReader](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset()) 。 |
| `FileReader(FileDescriptor fd)`                | 使用平台 [default charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset())创建一个新的 `FileReader` ，给定 `FileDescriptor`进行读取。 |
| `FileReader(File file, Charset charset)`       | 创建一个新的`FileReader` ，给出`File`读取和[charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html) 。 |
| `FileReader(String fileName)`                  | 使用平台 [default charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset())创建一个新的 `FileReader` ，给定要读取的文件的 [名称](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset()) 。 |
| `FileReader(String fileName, Charset charset)` | 给定要读取的文件的名称和`FileReader` ，创建一个新的[FileReader](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html) 。 |

**方法**

没有自己方法，都是从父类中继承而来。

##  FileWriter(文件字符输出流)

*使用默认缓冲区大小将文本写入字符文件。 从字符到字节的编码使用指定的[charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html)或平台的[default charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset()) 。*

*文件是否可用或是否可以创建取决于底层平台。 特别是某些平台允许一次仅打开一个文件以供写入`FileWriter` （或其他文件写入对象）。 在这种情况下，如果涉及的文件已经打开，则此类中的构造函数将失败。*

*`FileWriter`用于编写字符流。 要写入原始字节流，请考虑使用`FileOutputStream` 。*

```java
public void write(String str);
//一次写多个字符，将b数组中所有字符，写入输出流
```

**构造方法**

| 构造器                                                       | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| `FileWriter(File file)`                                      | 给 `File`写一个 `FileWriter` ，使用平台的 [default charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset()) |
| `FileWriter(FileDescriptor fd)`                              | 构造一个 `FileWriter`给出的文件描述符，使用该平台的 [default charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset()) 。 |
| `FileWriter(File file, boolean append)`                      | 在给出要写入的 `FileWriter`下构造 `File` ，并使用平台的 [default charset构造](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset())一个布尔值，指示是否附加写入的数据。 |
| `FileWriter(File file, Charset charset)`                     | 构造一个`FileWriter`给予`File`编写和[charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html) 。 |
| `FileWriter(File file, Charset charset, boolean append)`     | 构造`FileWriter`给出`File`写入， [charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html)和一个布尔值，指示是否附加写入的数据。 |
| `FileWriter(String fileName)`                                | 构造一个 `FileWriter`给出文件名，使用平台的 [default charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset()) |
| `FileWriter(String fileName, boolean append)`                | 使用平台的 [default charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html#defaultCharset())构造一个 `FileWriter`给定一个文件名和一个布尔值，指示是否附加写入的数据。 |
| `FileWriter(String fileName, Charset charset)`               | 构造一个`FileWriter`给出文件名和[charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html) 。 |
| `FileWriter(String fileName, Charset charset, boolean append)` | 构造一个`FileWriter`给定一个文件名， [charset](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html)和一个布尔值，指示是否附加写入的数据。 |

## BufferedReader(字符缓冲输入流)

*从字符输入流中读取文本，缓冲字符，以便有效地读取字符，数组和行。*

*可以指定缓冲区大小，或者可以使用默认大小。 对于大多数用途，默认值足够大。*

**方法**

| 变量和类型       | 方法                                  | 描述                                                    |
| :--------------- | :------------------------------------ | :------------------------------------------------------ |
| `Stream<String>` | `lines()`                             | 返回 `Stream` ，其元素是从此 `BufferedReader`读取的行。 |
| `void`           | `mark(int readAheadLimit)`            | 标记流中的当前位置。                                    |
| `boolean`        | `markSupported()`                     | 判断此流是否支持mark（）操作。                          |
| `int`            | `read()`                              | 读一个字符。                                            |
| `int`            | `read(char[] cbuf, int off, int len)` | 将字符读入数组的一部分。                                |
| `String`         | `readLine()`                          | 读一行文字。                                            |
| `boolean`        | `ready()`                             | 判断此流是否可以读取。                                  |
| `void`           | `reset()`                             | 将流重置为最新标记。                                    |
| `long`           | `skip(long n)`                        | 跳过字符。                                              |

## BufferedWriter(字符缓冲输出流)

*将文本写入字符输出流，缓冲字符，以便有效地写入单个字符，数组和字符串。*

*可以指定缓冲区大小，或者可以接受默认大小。 对于大多数用途，默认值足够大。*

**方法**

| 变量和类型 | 方法                                   | 描述                     |
| :--------- | :------------------------------------- | :----------------------- |
| `void`     | `flush()`                              | 刷新流。                 |
| `void`     | `newLine()`                            | 写一个行分隔符。         |
| `void`     | `write(char[] cbuf, int off, int len)` | 写一个字符数组的一部分。 |
| `void`     | `write(int c)`                         | 写一个字符。             |
| `void`     | `write(String s, int off, int len)`    | 写一个字符串的一部分。   |

## 缓冲流注意

- 高效读写
- 可输入换行符
- 可一次读一行，写一行

## PrintWriter(打印流)

- 封装了`print()`和`println()`方法，支持写入后换行
- 支持数据原样打印

*将对象的格式化表示打印到文本输出流。 这个类实现所有的`print`中发现的方法[`PrintStream`](https://www.runoob.com/manual/jdk11api/java.base/java/io/PrintStream.html) 。 它不包含写入原始字节的方法，程序应使用未编码的字节流。*

*不像[`PrintStream`](https://www.runoob.com/manual/jdk11api/java.base/java/io/PrintStream.html)类，如果启用自动刷新，将只有当一个做`println` ， `printf` ，或`format`被调用的方法，而不是当一个换行符恰好是输出。 这些方法使用平台自己的行分隔符概念而不是换行符。*

*这个类中的方法永远不会抛出I / O异常，尽管它的一些构造函数可能会。 客户端可以通过调用[`checkError()`](https://www.runoob.com/manual/jdk11api/java.base/java/io/PrintWriter.html#checkError())来查询是否发生了任何错误。*

*此类始终使用charset的默认替换字符串替换格式错误且不可映射的字符序列。 当需要对编码过程进行更多控制时，应使用[CharsetEncoder](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/CharsetEncoder.html)类。*

**方法**

| 变量和类型       | 方法                                              | 描述                                                         |
| :--------------- | :------------------------------------------------ | :----------------------------------------------------------- |
| `PrintWriter`    | `append(char c)`                                  | 将指定的字符追加到此writer。                                 |
| `PrintWriter`    | `append(CharSequence csq)`                        | 将指定的字符序列追加到此writer。                             |
| `PrintWriter`    | `append(CharSequence csq, int start, int end)`    | 将指定字符序列的子序列追加到此writer。                       |
| `boolean`        | `checkError()`                                    | 如果流未关闭则刷新流并检查其错误状态。                       |
| `protected void` | `clearError()`                                    | 清除此流的错误状态。                                         |
| `void`           | `close()`                                         | 关闭流并释放与其关联的所有系统资源。                         |
| `void`           | `flush()`                                         | 刷新流。                                                     |
| `PrintWriter`    | `format(String format, Object... args)`           | 使用指定的格式字符串和参数将格式化的字符串写入此writer。     |
| `PrintWriter`    | `format(Locale l, String format, Object... args)` | 使用指定的格式字符串和参数将格式化的字符串写入此writer。     |
| `void`           | `print(boolean b)`                                | 打印一个布尔值。                                             |
| `void`           | `print(char c)`                                   | 打印一个角色。                                               |
| `void`           | `print(char[] s)`                                 | 打印一个字符数组。                                           |
| `void`           | `print(double d)`                                 | 打印双精度浮点数。                                           |
| `void`           | `print(float f)`                                  | 打印浮点数。                                                 |
| `void`           | `print(int i)`                                    | 打印整数。                                                   |
| `void`           | `print(long l)`                                   | 打印一个长整数。                                             |
| `void`           | `print(Object obj)`                               | 打印一个对象。                                               |
| `void`           | `print(String s)`                                 | 打印一个字符串。                                             |
| `PrintWriter`    | `printf(String format, Object... args)`           | 使用指定的格式字符串和参数将格式化字符串写入此writer的便捷方法。 |
| `PrintWriter`    | `printf(Locale l, String format, Object... args)` | 使用指定的格式字符串和参数将格式化字符串写入此writer的便捷方法。 |
| `void`           | `println()`                                       | 通过写行分隔符字符串来终止当前行。                           |
| `void`           | `println(boolean x)`                              | 打印一个布尔值，然后终止该行。                               |
| `void`           | `println(char x)`                                 | 打印一个字符，然后终止该行。                                 |
| `void`           | `println(char[] x)`                               | 打印一个字符数组，然后终止该行。                             |
| `void`           | `println(double x)`                               | 打印双精度浮点数，然后终止该行。                             |
| `void`           | `println(float x)`                                | 打印一个浮点数，然后终止该行。                               |
| `void`           | `println(int x)`                                  | 打印一个整数，然后终止该行。                                 |
| `void`           | `println(long x)`                                 | 打印一个长整数，然后终止该行。                               |
| `void`           | `println(Object x)`                               | 打印一个对象，然后终止该行。                                 |
| `void`           | `println(String x)`                               | 打印一个字符串，然后终止该行。                               |
| `protected void` | `setError()`                                      | 表示发生了错误。                                             |
| `void`           | `write(char[] buf)`                               | 写一个字符数组。                                             |
| `void`           | `write(char[] buf, int off, int len)`             | 写入一个字符数组的一部分。                                   |
| `void`           | `write(int c)`                                    | 写一个字符。                                                 |
| `void`           | `write(String s)`                                 | 写一个字符串。                                               |
| `void`           | `write(String s, int off, int len)`               | 写一个字符串的一部分。                                       |

# 转换流

- 桥转换流

  `InputStreamReader`和`OutputStreamWriter`

  - 可将字节流转化为字符流
  - 可设置字符的编码形式

## InputStreamReader

*InputStreamReader是从字节流到字符流的桥接器：它使用指定的[`charset`](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html)读取字节并将其解码为字符。 它使用的字符集可以通过名称指定，也可以明确指定，或者可以接受平台的默认字符集。*

*每次调用一个InputStreamReader的read（）方法都可能导致从底层字节输入流中读取一个或多个字节。 为了实现字节到字符的有效转换，可以从基础流中提取比满足当前读取操作所需的更多字节。*

*为了获得最高效率，请考虑在BufferedReader中包装InputStreamReader。*

例如

```java
  BufferedReader in
   = new BufferedReader(new InputStreamReader(System.in)); 
```

**方法**

| 变量和类型 | 方法                                        | 描述                           |
| :--------- | :------------------------------------------ | :----------------------------- |
| `String`   | `getEncoding()`                             | 返回此流使用的字符编码的名称。 |
| `int`      | `read()`                                    | 读一个字符。                   |
| `int`      | `read(char[] cbuf, int offset, int length)` | 将字符读入数组的一部分。       |
| `boolean`  | `ready()`                                   | 判断此流是否可以读取           |

## OutputStreamWriter

*OutputStreamWriter是从字符流到字节流的桥接器：使用指定的[`charset`将](https://www.runoob.com/manual/jdk11api/java.base/java/nio/charset/Charset.html)写入其中的字符编码为字节。 它使用的字符集可以通过名称指定，也可以明确指定，或者可以接受平台的默认字符集。*

*每次调用write（）方法都会导致在给定字符上调用编码转换器。 生成的字节在写入底层输出流之前在缓冲区中累积。 请注意，传递给write（）方法的字符不会被缓冲。*

*为了获得最高效率，请考虑在BufferedWriter中包装OutputStreamWriter，以避免频繁的转换器调用。*

例如

```java
  Writer out
   = new BufferedWriter(new OutputStreamWriter(System.out)); 
```

**方法**

| 变量和类型 | 方法                                   | 描述                           |
| :--------- | :------------------------------------- | :----------------------------- |
| `void`     | `flush()`                              | 刷新流。                       |
| `String`   | `getEncoding()`                        | 返回此流使用的字符编码的名称。 |
| `void`     | `write(char[] cbuf, int off, int len)` | 写一个字符数组的一部分。       |
| `void`     | `write(int c)`                         | 写一个字符。                   |
| `void`     | `write(String str, int off, int len)`  | 写一个字符串的一部分。         |

# File类

[File类api文档](https://www.runoob.com/manual/jdk11api/java.base/java/io/File.html)

**方法**

| 变量和类型      | 方法                                                         | 描述                                                         |
| :-------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `boolean`       | `canExecute()`                                               | 测试应用程序是否可以执行此抽象路径名表示的文件。             |
| `boolean`       | `canRead()`                                                  | 测试应用程序是否可以读取此抽象路径名表示的文件。             |
| `boolean`       | `canWrite()`                                                 | 测试应用程序是否可以修改此抽象路径名表示的文件。             |
| `int`           | `compareTo(File pathname)`                                   | 按字典顺序比较两个抽象路径名。                               |
| `boolean`       | `createNewFile()`                                            | 当且仅当具有此名称的文件尚不存在时，以原子方式创建由此抽象路径名命名的新空文件。 |
| `static File`   | `createTempFile(String prefix, String suffix)`               | 在默认临时文件目录中创建一个空文件，使用给定的前缀和后缀生成其名称。 |
| `static File`   | `createTempFile(String prefix, String suffix, File directory)` | 在指定目录中创建一个新的空文件，使用给定的前缀和后缀字符串生成其名称。 |
| `boolean`       | `delete()`                                                   | 删除此抽象路径名表示的文件或目录。                           |
| `void`          | `deleteOnExit()`                                             | 请求在虚拟机终止时删除此抽象路径名表示的文件或目录。         |
| `boolean`       | `equals(Object obj)`                                         | 测试此抽象路径名与给定对象的相等性。                         |
| `boolean`       | `exists()`                                                   | 测试此抽象路径名表示的文件或目录是否存在。                   |
| `File`          | `getAbsoluteFile()`                                          | 返回此抽象路径名的绝对形式。                                 |
| `String`        | `getAbsolutePath()`                                          | 返回此抽象路径名的绝对路径名字符串。                         |
| `File`          | `getCanonicalFile()`                                         | 返回此抽象路径名的规范形式。                                 |
| `String`        | `getCanonicalPath()`                                         | 返回此抽象路径名的规范路径名字符串。                         |
| `long`          | `getFreeSpace()`                                             | 通过此抽象路径名返回分区 [named](https://www.runoob.com/manual/jdk11api/java.base/java/io/File.html#partName)中未分配的字节数。 |
| `String`        | `getName()`                                                  | 返回此抽象路径名表示的文件或目录的名称。                     |
| `String`        | `getParent()`                                                | 返回此抽象路径名父项的路径名字符串，如果此路径名未指定父目录，则返回 `null` 。 |
| `File`          | `getParentFile()`                                            | 返回此抽象路径名父项的抽象路径名，如果此路径名未指定父目录，则返回 `null` 。 |
| `String`        | `getPath()`                                                  | 将此抽象路径名转换为路径名字符串。                           |
| `long`          | `getTotalSpace()`                                            | 通过此抽象路径名返回分区 [named](https://www.runoob.com/manual/jdk11api/java.base/java/io/File.html#partName)的大小。 |
| `long`          | `getUsableSpace()`                                           | 通过此抽象路径名返回分区 [named](https://www.runoob.com/manual/jdk11api/java.base/java/io/File.html#partName)上此虚拟机可用的字节数。 |
| `int`           | `hashCode()`                                                 | 计算此抽象路径名的哈希码。                                   |
| `boolean`       | `isAbsolute()`                                               | 测试此抽象路径名是否为绝对路径。                             |
| `boolean`       | `isDirectory()`                                              | 测试此抽象路径名表示的文件是否为目录。                       |
| `boolean`       | `isFile()`                                                   | 测试此抽象路径名表示的文件是否为普通文件。                   |
| `boolean`       | `isHidden()`                                                 | 测试此抽象路径名指定的文件是否为隐藏文件。                   |
| `long`          | `lastModified()`                                             | 返回上次修改此抽象路径名表示的文件的时间。                   |
| `long`          | `length()`                                                   | 返回此抽象路径名表示的文件的长度。                           |
| `String[]`      | `list()`                                                     | 返回一个字符串数组，用于命名此抽象路径名表示的目录中的文件和目录。 |
| `String[]`      | `list(FilenameFilter filter)`                                | 返回一个字符串数组，用于命名由此抽象路径名表示的目录中的文件和目录，以满足指定的过滤器。 |
| `File[]`        | `listFiles()`                                                | 返回一个抽象路径名数组，表示此抽象路径名表示的目录中的文件。 |
| `File[]`        | `listFiles(FileFilter filter)`                               | 返回一个抽象路径名数组，表示此抽象路径名表示的目录中满足指定过滤器的文件和目录。 |
| `File[]`        | `listFiles(FilenameFilter filter)`                           | 返回一个抽象路径名数组，表示此抽象路径名表示的目录中满足指定过滤器的文件和目录。 |
| `static File[]` | `listRoots()`                                                | 列出可用的文件系统根目录。                                   |
| `boolean`       | `mkdir()`                                                    | 创建此抽象路径名指定的目录。                                 |
| `boolean`       | `mkdirs()`                                                   | 创建此抽象路径名指定的目录，包括任何必需但不存在的父目录。   |
| `boolean`       | `renameTo(File dest)`                                        | 重命名此抽象路径名表示的文件。                               |
| `boolean`       | `setExecutable(boolean executable)`                          | 一种方便的方法，用于设置此抽象路径名的所有者执行权限。       |
| `boolean`       | `setExecutable(boolean executable, boolean ownerOnly)`       | 设置此抽象路径名的所有者或每个人的执行权限。                 |
| `boolean`       | `setLastModified(long time)`                                 | 设置此抽象路径名指定的文件或目录的上次修改时间。             |
| `boolean`       | `setReadable(boolean readable)`                              | 一种方便的方法，用于设置此抽象路径名的所有者读取权限。       |
| `boolean`       | `setReadable(boolean readable, boolean ownerOnly)`           | 设置此抽象路径名的所有者或每个人的读取权限。                 |
| `boolean`       | `setReadOnly()`                                              | 标记此抽象路径名指定的文件或目录，以便仅允许读取操作。       |
| `boolean`       | `setWritable(boolean writable)`                              | 一种方便的方法，用于设置此抽象路径名的所有者写入权限。       |
| `boolean`       | `setWritable(boolean writable, boolean ownerOnly)`           | 设置此抽象路径名的所有者或每个人的写入权限。                 |
| `Path`          | `toPath()`                                                   | 返回从此抽象路径构造的[`java.nio.file.Path`](https://www.runoob.com/manual/jdk11api/java.base/java/nio/file/Path.html)对象。 |
| `String`        | `toString()`                                                 | 返回此抽象路径名的路径名字符串。                             |
| `URI`           | `toURI()`                                                    | 构造一个表示此抽象路径名的 `file:` URI。                     |
| `URL`           | `toURL()`                                                    | **已过时。**此方法不会自动转义URL中非法的字符。              |

## FileFilter接口

[FileFilterAPI文档](https://www.runoob.com/manual/jdk11api/java.base/java/io/FileFilter.html)

*这是一个功能接口，因此可以用作lambda表达式或方法引用的赋值目标。*

*抽象路径名的过滤器。*

*可以将此接口的实例传递给`File`类的`listFiles(FileFilter)`方法。*

**方法**

| 变量和类型 | 方法                    | 描述                                           |
| :--------- | :---------------------- | :--------------------------------------------- |
| `boolean`  | `accept(File pathname)` | 测试指定的抽象路径名是否应包含在路径名列表中。 |
