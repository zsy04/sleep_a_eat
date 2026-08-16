---
title: "Java 集合框架：List、Set、Map"
date: "2026-08-16"
tags: ["Java", "集合"]
minutes: 25
---

# 集合

*集合的作用是为了在对多个对象进行操作时提供一个容器，让对类的调用更简单或者减少复用类*

## 集合中经常用到的接口与实现类

### 接口

1. Collection
2. List
3. Set
4. Map

### 类

1. ArrayList
2. LinkedList
3. HashSet
4. HashMap

## 简单总结

在集合框架中集合共分两类

在这些集合之上还有一个公共的接口`Collection`，这个接口无序、无下表、元素不能重复

1. `List(Interface)`

   特点：有序、有下标、元素可重复

   1. `ArrayList(Class)`
   2. `LinkedList(Class)`
   3. `Vecter(Class)`

2. `Set(Interface)`

   特点：无序、无小标、元素不可重复

   1. `HashSet(Class)`
   2. `SortedSet(Interface)`
      1. `TreeSet(Class)`

## 泛型

Java 泛型（generics）是 JDK 5 中引入的一个新特性, 泛型提供了编译时类型安全检测机制，该机制允许程序员在编译时检测到非法的类型。

泛型的本质是参数化类型，也就是说所操作的数据类型被指定为一个参数。

在我的理解下，泛型最重要的是在使用集合的时候为了规范集合中参数的规范，与提高代码的复用性。

示例

```java
public class GenericMethodTest
{
   // 泛型方法 printArray                         
   public static < E > void printArray( E[] inputArray )
   {
      // 输出数组元素            
         for ( E element : inputArray ){        
            System.out.printf( "%s ", element );
         }
         System.out.println();
    }
 
    public static void main( String args[] )
    {
        // 创建不同类型数组： Integer, Double 和 Character
        Integer[] intArray = { 1, 2, 3, 4, 5 };
        Double[] doubleArray = { 1.1, 2.2, 3.3, 4.4 };
        Character[] charArray = { 'H', 'E', 'L', 'L', 'O' };
 
        System.out.println( "整型数组元素为:" );
        printArray( intArray  ); // 传递一个整型数组
 
        System.out.println( "\n双精度型数组元素为:" );
        printArray( doubleArray ); // 传递一个双精度型数组
 
        System.out.println( "\n字符型数组元素为:" );
        printArray( charArray ); // 传递一个字符型数组
    } 
}
```

代码结果为

```
整型数组元素为:
1 2 3 4 5 

双精度型数组元素为:
1.1 2.2 3.3 4.4 

字符型数组元素为:
H E L L O 
```

# Collection

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/Collection.html)

```java
public interface Collection<E>
extends Iterable<E>
```

*集合层次结构中的根接口。 集合表示一组对象，称为其元素 。 有些集合允许重复元素而其他集合则不允许。 有些是订购的，有些是无序的。 JDK不提供此接口的任何直接实现：它提供了更具体的子接口的实现，如`Set`和`List` 。 此接口通常用于传递集合并在需要最大通用性的情况下对其进行操作。*

## 方法

| 变量和类型               | 方法                                    | 描述                                                         |
| :----------------------- | :-------------------------------------- | :----------------------------------------------------------- |
| `boolean`                | `add(E e)`                              | 确保此集合包含指定的元素（可选操作）。                       |
| `boolean`                | `addAll(Collection<? extends E> c)`     | 将指定集合中的所有元素添加到此集合中（可选操作）。           |
| `void`                   | `clear()`                               | 从此集合中删除所有元素（可选操作）。                         |
| `boolean`                | `contains(Object o)`                    | 如果此collection包含指定的元素，则返回 `true` 。             |
| `boolean`                | `containsAll(Collection<?> c)`          | 如果此集合包含指定集合中的所有元素，则返回 `true` 。         |
| `boolean`                | `equals(Object o)`                      | 将指定对象与此集合进行比较以获得相等性。                     |
| `int`                    | `hashCode()`                            | 返回此集合的哈希码值。                                       |
| `boolean`                | `isEmpty()`                             | 如果此集合不包含任何元素，则返回 `true` 。                   |
| `Iterator<E>`            | `iterator()`                            | 返回此集合中元素的迭代器。                                   |
| `default Stream<E>`      | `parallelStream()`                      | 以此集合为源返回可能并行的 `Stream` 。                       |
| `boolean`                | `remove(Object o)`                      | 从此集合中移除指定元素的单个实例（如果存在）（可选操作）。   |
| `boolean`                | `removeAll(Collection<?> c)`            | 删除此集合的所有元素，这些元素也包含在指定的集合中（可选操作）。 |
| `default boolean`        | `removeIf(Predicate<? super E> filter)` | 删除此集合中满足给定谓词的所有元素。                         |
| `boolean`                | `retainAll(Collection<?> c)`            | 仅保留此集合中包含在指定集合中的元素（可选操作）。           |
| `int`                    | `size()`                                | 返回此集合中的元素数。                                       |
| `default Spliterator<E>` | `spliterator()`                         | 在此集合中的元素上创建[`Spliterator`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html) 。 |
| `default Stream<E>`      | `stream()`                              | 返回以此集合为源的顺序 `Stream` 。                           |
| `Object[]`               | `toArray()`                             | 返回包含此集合中所有元素的数组。                             |
| `default <T> T[]`        | `toArray(IntFunction<T[]> generator)`   | 返回包含此集合中所有元素的数组，使用提供的 `generator`函数分配返回的数组。 |
| `<T> T[]`                | `toArray(T[] a)`                        | 返回一个包含此collection中所有元素的数组; 返回数组的运行时类型是指定数组的运行时类型。 |

# List接口

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/List.html)

```java
public interface List<E>
extends Collection<E>
```

*有序集合（也称为序列 ）。 该接口的用户可以精确控制列表中每个元素的插入位置。 用户可以通过整数索引（列表中的位置）访问元素，并搜索列表中的元素。*

`List`接口提供了一个特殊的迭代器，称为`ListIterator` ，除了`Iterator`接口提供的正常操作外，还允许元素插入和替换以及双向访问。 提供了一种方法来获得从列表中的指定位置开始的列表迭代器。

## 方法

| 变量和类型               | 方法                                                         | 描述                                                         |
| :----------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `void`                   | `add(int index, E element)`                                  | 将指定元素插入此列表中的指定位置（可选操作）。               |
| `boolean`                | `add(E e)`                                                   | 将指定的元素追加到此列表的末尾（可选操作）。                 |
| `boolean`                | `addAll(int index, Collection<? extends E> c)`               | 将指定集合中的所有元素插入到指定位置的此列表中（可选操作）。 |
| `boolean`                | `addAll(Collection<? extends E> c)`                          | 将指定集合中的所有元素按指定集合的迭代器（可选操作）返回的顺序追加到此列表的末尾。 |
| `void`                   | `clear()`                                                    | 从此列表中删除所有元素（可选操作）。                         |
| `boolean`                | `contains(Object o)`                                         | 如果此列表包含指定的元素，则返回 `true` 。                   |
| `boolean`                | `containsAll(Collection<?> c)`                               | 如果此列表包含指定集合的所有元素，则返回 `true` 。           |
| `static <E> List<E>`     | `copyOf(Collection<? extends E> coll)`                       | 以迭代顺序返回包含给定Collection的元素的 [unmodifiable List](https://www.runoob.com/manual/jdk11api/java.base/java/util/List.html#unmodifiable) 。 |
| `boolean`                | `equals(Object o)`                                           | 将指定对象与此列表进行比较以获得相等性。                     |
| `E`                      | `get(int index)`                                             | 返回此列表中指定位置的元素。                                 |
| `int`                    | `hashCode()`                                                 | 返回此列表的哈希码值。                                       |
| `int`                    | `indexOf(Object o)`                                          | 返回此列表中第一次出现的指定元素的索引，如果此列表不包含该元素，则返回-1。 |
| `boolean`                | `isEmpty()`                                                  | 如果此列表不包含任何元素，则返回 `true` 。                   |
| `Iterator<E>`            | `iterator()`                                                 | 以适当的顺序返回此列表中元素的迭代器。                       |
| `int`                    | `lastIndexOf(Object o)`                                      | 返回此列表中指定元素最后一次出现的索引，如果此列表不包含该元素，则返回-1。 |
| `ListIterator<E>`        | `listIterator()`                                             | 返回此列表中元素的列表迭代器（按适当顺序）。                 |
| `ListIterator<E>`        | `listIterator(int index)`                                    | 从列表中的指定位置开始，返回列表中元素的列表迭代器（按正确顺序）。 |
| `static <E> List<E>`     | `of()`                                                       | 返回包含零元素的不可修改列表。                               |
| `static <E> List<E>`     | `of(E e1)`                                                   | 返回包含一个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E... elements)`                                          | 返回包含任意数量元素的不可修改列表。                         |
| `static <E> List<E>`     | `of(E e1, E e2)`                                             | 返回包含两个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E e1, E e2, E e3)`                                       | 返回包含三个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E e1, E e2, E e3, E e4)`                                 | 返回包含四个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E e1, E e2, E e3, E e4, E e5)`                           | 返回包含五个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E e1, E e2, E e3, E e4, E e5, E e6)`                     | 返回包含六个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E e1, E e2, E e3, E e4, E e5, E e6, E e7)`               | 返回包含七个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E e1, E e2, E e3, E e4, E e5, E e6, E e7, E e8)`         | 返回包含八个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E e1, E e2, E e3, E e4, E e5, E e6, E e7, E e8, E e9)`   | 返回包含九个元素的不可修改列表。                             |
| `static <E> List<E>`     | `of(E e1, E e2, E e3, E e4, E e5, E e6, E e7, E e8, E e9, E e10)` | 返回包含十个元素的不可修改列表。                             |
| `E`                      | `remove(int index)`                                          | 删除此列表中指定位置的元素（可选操作）。                     |
| `boolean`                | `remove(Object o)`                                           | 从该列表中删除指定元素的第一个匹配项（如果存在）（可选操作）。 |
| `boolean`                | `removeAll(Collection<?> c)`                                 | 从此列表中删除指定集合中包含的所有元素（可选操作）。         |
| `default void`           | `replaceAll(UnaryOperator<E> operator)`                      | 将该列表的每个元素替换为将运算符应用于该元素的结果。         |
| `boolean`                | `retainAll(Collection<?> c)`                                 | 仅保留此列表中包含在指定集合中的元素（可选操作）。           |
| `E`                      | `set(int index, E element)`                                  | 用指定的元素替换此列表中指定位置的元素（可选操作）。         |
| `int`                    | `size()`                                                     | 返回此列表中的元素数。                                       |
| `default void`           | `sort(Comparator<? super E> c)`                              | 根据指定的[`Comparator`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Comparator.html)引发的顺序对此列表进行排序。 |
| `default Spliterator<E>` | `spliterator()`                                              | 在此列表中的元素上创建[`Spliterator`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html) 。 |
| `List<E>`                | `subList(int fromIndex, int toIndex)`                        | 返回指定的 `fromIndex` （包含）和 `toIndex` （不包括）之间的此列表部分的视图。 |
| `Object[]`               | `toArray()`                                                  | 以适当的顺序（从第一个元素到最后一个元素）返回包含此列表中所有元素的数组。 |
| `<T> T[]`                | `toArray(T[] a)`                                             | 以适当的顺序返回包含此列表中所有元素的数组（从第一个元素到最后一个元素）; 返回数组的运行时类型是指定数组的运行时类型。 |

# ArrayList类

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/ArrayList.html)

```java
public class ArrayList<E>
extends AbstractList<E>
implements List<E>, RandomAccess, Cloneable, Serializable
```

ArrayList 类是一个可以动态修改的数组，与普通数组的区别就是它是没有固定大小的限制，我们可以添加或删除元素。

ArrayList 继承了 AbstractList ，并实现了 List 接口。

## 总结

- **特点：** 动态数组，可变大小。
- **优点：** 高效的随机访问和快速尾部插入。
- **缺点：** 中间插入和删除相对较慢。

## 方法

| 变量和类型        | 方法                                           | 描述                                                         |
| :---------------- | :--------------------------------------------- | :----------------------------------------------------------- |
| `void`            | `add(int index, E element)`                    | 将指定元素插入此列表中的指定位置。                           |
| `boolean`         | `add(E e)`                                     | 将指定的元素追加到此列表的末尾。                             |
| `boolean`         | `addAll(int index, Collection<? extends E> c)` | 从指定位置开始，将指定集合中的所有元素插入此列表。           |
| `boolean`         | `addAll(Collection<? extends E> c)`            | 将指定集合中的所有元素按指定集合的Iterator返回的顺序附加到此列表的末尾。 |
| `void`            | `clear()`                                      | 从此列表中删除所有元素。                                     |
| `Object`          | `clone()`                                      | 返回此 `ArrayList`实例的浅表副本。                           |
| `boolean`         | `contains(Object o)`                           | 如果此列表包含指定的元素，则返回 `true` 。                   |
| `void`            | `ensureCapacity(int minCapacity)`              | 如有必要，增加此 `ArrayList`实例的容量，以确保它至少可以容纳由minimum capacity参数指定的元素数。 |
| `void`            | `forEach(Consumer<? super E> action)`          | 对 `Iterable`每个元素执行给定操作，直到处理 `Iterable`所有元素或操作引发异常。 |
| `E`               | `get(int index)`                               | 返回此列表中指定位置的元素。                                 |
| `int`             | `indexOf(Object o)`                            | 返回此列表中第一次出现的指定元素的索引，如果此列表不包含该元素，则返回-1。 |
| `boolean`         | `isEmpty()`                                    | 如果此列表不包含任何元素，则返回 `true` 。                   |
| `Iterator<E>`     | `iterator()`                                   | 以适当的顺序返回此列表中元素的迭代器。                       |
| `int`             | `lastIndexOf(Object o)`                        | 返回此列表中指定元素最后一次出现的索引，如果此列表不包含该元素，则返回-1。 |
| `ListIterator<E>` | `listIterator()`                               | 返回此列表中元素的列表迭代器（按适当顺序）。                 |
| `ListIterator<E>` | `listIterator(int index)`                      | 从列表中的指定位置开始，返回列表中元素的列表迭代器（按正确顺序）。 |
| `E`               | `remove(int index)`                            | 删除此列表中指定位置的元素。                                 |
| `boolean`         | `remove(Object o)`                             | 从该列表中删除指定元素的第一个匹配项（如果存在）。           |
| `boolean`         | `removeAll(Collection<?> c)`                   | 从此列表中删除指定集合中包含的所有元素。                     |
| `boolean`         | `removeIf(Predicate<? super E> filter)`        | 删除此集合中满足给定谓词的所有元素。                         |
| `protected void`  | `removeRange(int fromIndex, int toIndex)`      | 从此列表中删除索引介于 `fromIndex` （含）和 `toIndex` （独占）之间的所有元素。 |
| `boolean`         | `retainAll(Collection<?> c)`                   | 仅保留此列表中包含在指定集合中的元素。                       |
| `E`               | `set(int index, E element)`                    | 用指定的元素替换此列表中指定位置的元素。                     |
| `int`             | `size()`                                       | 返回此列表中的元素数。                                       |
| `Spliterator<E>`  | `spliterator()`                                | 在此列表中的元素上创建*[late-binding](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html#binding)*和*故障快速* [`Spliterator`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html) 。 |
| `List<E>`         | `subList(int fromIndex, int toIndex)`          | 返回指定的 `fromIndex` （包含）和 `toIndex` （不包括）之间的此列表部分的视图。 |
| `Object[]`        | `toArray()`                                    | 以适当的顺序（从第一个元素到最后一个元素）返回包含此列表中所有元素的数组。 |
| `<T> T[]`         | `toArray(T[] a)`                               | 以适当的顺序返回包含此列表中所有元素的数组（从第一个元素到最后一个元素）; 返回数组的运行时类型是指定数组的运行时类型。 |
| `void`            | `trimToSize()`                                 | 将此 `ArrayList`实例的容量调整为列表的当前大小。             |

# LinkedList类

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/LinkedList.html)

```java
public class LinkedList<E>
extends AbstractSequentialList<E>
implements List<E>, Deque<E>, Cloneable, Serializable
```

链表（Linked list）是一种常见的基础数据结构，是一种线性表，但是并不会按线性的顺序存储数据，而是在每一个节点里存到下一个节点的地址。

Java LinkedList（链表） 类似于 ArrayList，是一种常用的数据容器。

与 ArrayList 相比，LinkedList 的增加和删除的操作效率更高，而查找和修改的操作效率较低。

**以下情况使用 ArrayList :**

- 频繁访问列表中的某一个元素。
- 只需要在列表末尾进行添加和删除元素操作。

**以下情况使用 LinkedList :**

- 你需要通过循环迭代来访问列表中的某些元素。
- 需要频繁的在列表开头、中间、末尾等位置进行添加和删除元素操作。

## 总结

- **特点：** 双向链表，元素之间通过指针连接。
- **优点：** 插入和删除元素高效，迭代器性能好。
- **缺点：** 随机访问相对较慢。

## 方法

| 变量和类型        | 方法                                           | 描述                                                         |
| :---------------- | :--------------------------------------------- | :----------------------------------------------------------- |
| `void`            | `add(int index, E element)`                    | 将指定元素插入此列表中的指定位置。                           |
| `boolean`         | `add(E e)`                                     | 将指定的元素追加到此列表的末尾。                             |
| `boolean`         | `addAll(int index, Collection<? extends E> c)` | 从指定位置开始，将指定集合中的所有元素插入此列表。           |
| `boolean`         | `addAll(Collection<? extends E> c)`            | 将指定集合中的所有元素按指定集合的迭代器返回的顺序附加到此列表的末尾。 |
| `void`            | `addFirst(E e)`                                | 在此列表的开头插入指定的元素。                               |
| `void`            | `addLast(E e)`                                 | 将指定的元素追加到此列表的末尾。                             |
| `void`            | `clear()`                                      | 从此列表中删除所有元素。                                     |
| `Object`          | `clone()`                                      | 返回此 `LinkedList`的浅表副本。                              |
| `boolean`         | `contains(Object o)`                           | 如果此列表包含指定的元素，则返回 `true` 。                   |
| `Iterator<E>`     | `descendingIterator()`                         | 以相反的顺序返回此双端队列中元素的迭代器。                   |
| `E`               | `element()`                                    | 检索但不删除此列表的头部（第一个元素）。                     |
| `E`               | `get(int index)`                               | 返回此列表中指定位置的元素。                                 |
| `E`               | `getFirst()`                                   | 返回此列表中的第一个元素。                                   |
| `E`               | `getLast()`                                    | 返回此列表中的最后一个元素。                                 |
| `int`             | `indexOf(Object o)`                            | 返回此列表中第一次出现的指定元素的索引，如果此列表不包含该元素，则返回-1。 |
| `int`             | `lastIndexOf(Object o)`                        | 返回此列表中指定元素最后一次出现的索引，如果此列表不包含该元素，则返回-1。 |
| `ListIterator<E>` | `listIterator(int index)`                      | 从列表中的指定位置开始，返回此列表中元素的列表迭代器（按正确顺序）。 |
| `boolean`         | `offer(E e)`                                   | 将指定的元素添加为此列表的尾部（最后一个元素）。             |
| `boolean`         | `offerFirst(E e)`                              | 在此列表的前面插入指定的元素。                               |
| `boolean`         | `offerLast(E e)`                               | 在此列表的末尾插入指定的元素。                               |
| `E`               | `peek()`                                       | 检索但不删除此列表的头部（第一个元素）。                     |
| `E`               | `peekFirst()`                                  | 检索但不删除此列表的第一个元素，如果此列表为空，则返回 `null` 。 |
| `E`               | `peekLast()`                                   | 检索但不删除此列表的最后一个元素，如果此列表为空，则返回 `null` 。 |
| `E`               | `poll()`                                       | 检索并删除此列表的头部（第一个元素）。                       |
| `E`               | `pollFirst()`                                  | 检索并删除此列表的第一个元素，如果此列表为空，则返回 `null` 。 |
| `E`               | `pollLast()`                                   | 检索并删除此列表的最后一个元素，如果此列表为空，则返回 `null` 。 |
| `E`               | `pop()`                                        | 弹出此列表所代表的堆栈中的元素。                             |
| `void`            | `push(E e)`                                    | 将元素推送到此列表所表示的堆栈上。                           |
| `E`               | `remove()`                                     | 检索并删除此列表的头部（第一个元素）。                       |
| `E`               | `remove(int index)`                            | 删除此列表中指定位置的元素。                                 |
| `boolean`         | `remove(Object o)`                             | 从该列表中删除指定元素的第一个匹配项（如果存在）。           |
| `E`               | `removeFirst()`                                | 从此列表中删除并返回第一个元素。                             |
| `boolean`         | `removeFirstOccurrence(Object o)`              | 删除此列表中第一次出现的指定元素（从头到尾遍历列表时）。     |
| `E`               | `removeLast()`                                 | 从此列表中删除并返回最后一个元素。                           |
| `boolean`         | `removeLastOccurrence(Object o)`               | 删除此列表中最后一次出现的指定元素（从头到尾遍历列表时）。   |
| `E`               | `set(int index, E element)`                    | 用指定的元素替换此列表中指定位置的元素。                     |
| `int`             | `size()`                                       | 返回此列表中的元素数。                                       |
| `Spliterator<E>`  | `spliterator()`                                | 在此列表中的元素上创建*[late-binding](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html#binding)*和*故障快速* [`Spliterator`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html) 。 |
| `Object[]`        | `toArray()`                                    | 以适当的顺序（从第一个元素到最后一个元素）返回包含此列表中所有元素的数组。 |
| `<T> T[]`         | `toArray(T[] a)`                               | 以适当的顺序返回包含此列表中所有元素的数组（从第一个元素到最后一个元素）; 返回数组的运行时类型是指定数组的运行时类型。 |

# Set接口

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/Set.html)

```java
public interface Set<E>
extends Collection<E>
```

集合（Sets）用于存储不重复的元素，常见的实现有 HashSet 和 TreeSet。

## 方法

| 变量和类型               | 方法                                                         | 描述                                                         |
| :----------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `boolean`                | `add(E e)`                                                   | 如果指定的元素尚不存在，则将其添加到此集合（可选操作）。     |
| `boolean`                | `addAll(Collection<? extends E> c)`                          | 如果指定集合中的所有元素尚未存在（可选操作），则将其添加到此集合中。 |
| `void`                   | `clear()`                                                    | 从该集合中删除所有元素（可选操作）。                         |
| `boolean`                | `contains(Object o)`                                         | 如果此set包含指定的元素，则返回 `true` 。                    |
| `boolean`                | `containsAll(Collection<?> c)`                               | 如果此集合包含指定集合的所有元素，则返回 `true` 。           |
| `static <E> Set<E>`      | `copyOf(Collection<? extends E> coll)`                       | 返回包含给定Collection的元素的 [unmodifiable Set](https://www.runoob.com/manual/jdk11api/java.base/java/util/Set.html#unmodifiable) 。 |
| `boolean`                | `equals(Object o)`                                           | 将指定对象与此set进行相等性比较。                            |
| `int`                    | `hashCode()`                                                 | 返回此set的哈希码值。                                        |
| `boolean`                | `isEmpty()`                                                  | 如果此集合不包含任何元素，则返回 `true` 。                   |
| `Iterator<E>`            | `iterator()`                                                 | 返回此set中元素的迭代器。                                    |
| `static <E> Set<E>`      | `of()`                                                       | 返回包含零元素的不可修改集。                                 |
| `static <E> Set<E>`      | `of(E e1)`                                                   | 返回包含一个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E... elements)`                                          | 返回包含任意数量元素的不可修改集。                           |
| `static <E> Set<E>`      | `of(E e1, E e2)`                                             | 返回包含两个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E e1, E e2, E e3)`                                       | 返回包含三个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E e1, E e2, E e3, E e4)`                                 | 返回包含四个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E e1, E e2, E e3, E e4, E e5)`                           | 返回包含五个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E e1, E e2, E e3, E e4, E e5, E e6)`                     | 返回包含六个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E e1, E e2, E e3, E e4, E e5, E e6, E e7)`               | 返回包含七个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E e1, E e2, E e3, E e4, E e5, E e6, E e7, E e8)`         | 返回包含八个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E e1, E e2, E e3, E e4, E e5, E e6, E e7, E e8, E e9)`   | 返回包含九个元素的不可修改集。                               |
| `static <E> Set<E>`      | `of(E e1, E e2, E e3, E e4, E e5, E e6, E e7, E e8, E e9, E e10)` | 返回包含十个元素的不可修改集。                               |
| `boolean`                | `remove(Object o)`                                           | 如果存在，则从该集合中移除指定的元素（可选操作）。           |
| `boolean`                | `removeAll(Collection<?> c)`                                 | 从此集合中删除指定集合中包含的所有元素（可选操作）。         |
| `boolean`                | `retainAll(Collection<?> c)`                                 | 仅保留此集合中包含在指定集合中的元素（可选操作）。           |
| `int`                    | `size()`                                                     | 返回此集合中的元素数（基数）。                               |
| `default Spliterator<E>` | `spliterator()`                                              | 在此集合中的元素上创建 `Spliterator` 。                      |
| `Object[]`               | `toArray()`                                                  | 返回包含此set中所有元素的数组。                              |
| `<T> T[]`                | `toArray(T[] a)`                                             | 返回一个包含此set中所有元素的数组; 返回数组的运行时类型是指定数组的运行时类型。 |

# HashSet类

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/HashSet.html)

```java
public class HashSet<E>
extends AbstractSet<E>
implements Set<E>, Cloneable, Serializable
```

HashSet 基于 HashMap 来实现的，是一个不允许有重复元素的集合。

HashSet 允许有 null 值。

HashSet 是无序的，即不会记录插入的顺序。

HashSet 不是线程安全的， 如果多个线程尝试同时修改 HashSet，则最终结果是不确定的。 您必须在多线程访问时显式同步对 HashSet 的并发访问。

## 总结

- **特点：** 无序集合，基于HashMap实现。
- **优点：** 高效的查找和插入操作。
- **缺点：** 不保证顺序。

## 方法

| 变量和类型       | 方法                 | 描述                                                         |
| :--------------- | :------------------- | :----------------------------------------------------------- |
| `boolean`        | `add(E e)`           | 如果指定的元素尚不存在，则将其添加到此集合中。               |
| `void`           | `clear()`            | 从该集中删除所有元素。                                       |
| `Object`         | `clone()`            | 返回此 `HashSet`实例的浅表副本：未克隆元素本身。             |
| `boolean`        | `contains(Object o)` | 如果此set包含指定的元素，则返回 `true` 。                    |
| `boolean`        | `isEmpty()`          | 如果此集合不包含任何元素，则返回 `true` 。                   |
| `Iterator<E>`    | `iterator()`         | 返回此set中元素的迭代器。                                    |
| `boolean`        | `remove(Object o)`   | 如果存在，则从该集合中移除指定的元素。                       |
| `int`            | `size()`             | 返回此集合中的元素数（基数）。                               |
| `Spliterator<E>` | `spliterator()`      | 在此集合中的元素上创建*[late-binding](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html#binding)*和*失败快速* [`Spliterator`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html) 。 |

# TreeSet类

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/TreeSet.html)

```java
public class TreeSet<E>
extends AbstractSet<E>
implements NavigableSet<E>, Cloneable, Serializable
```

## 总结

- **特点：**TreeSet 是有序集合，底层基于红黑树实现，不允许重复元素。
- **优点：** 提供自动排序功能，适用于需要按顺序存储元素的场景。
- **缺点：** 性能相对较差，不允许插入 null 元素。

## 方法

| 变量和类型        | 方法                                                         | 描述                                                         |
| :---------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `boolean`         | `add(E e)`                                                   | 如果指定的元素尚不存在，则将其添加到此集合中。               |
| `boolean`         | `addAll(Collection<? extends E> c)`                          | 将指定集合中的所有元素添加到此集合中。                       |
| `E`               | `ceiling(E e)`                                               | 返回此set中大于或等于给定元素的 `null`元素，如果没有这样的元素，则 `null` 。 |
| `void`            | `clear()`                                                    | 从该集中删除所有元素。                                       |
| `Object`          | `clone()`                                                    | 返回此 `TreeSet`实例的浅表副本。                             |
| `boolean`         | `contains(Object o)`                                         | 如果此set包含指定的元素，则返回 `true` 。                    |
| `Iterator<E>`     | `descendingIterator()`                                       | 以降序返回此集合中元素的迭代器。                             |
| `NavigableSet<E>` | `descendingSet()`                                            | 返回此set中包含的元素的逆序视图。                            |
| `E`               | `first()`                                                    | 返回此集合中当前的第一个（最低）元素。                       |
| `E`               | `floor(E e)`                                                 | 返回此set中小于或等于给定元素的最大元素，如果没有这样的元素，则 `null` 。 |
| `SortedSet<E>`    | `headSet(E toElement)`                                       | 返回此set的部分视图，其元素严格小于 `toElement` 。           |
| `NavigableSet<E>` | `headSet(E toElement, boolean inclusive)`                    | 返回此set的部分视图，其元素小于（或等于，如果 `inclusive`为true） `toElement` 。 |
| `E`               | `higher(E e)`                                                | 返回此集合中的最小元素严格大于给定元素，如果没有这样的元素，则 `null` 。 |
| `boolean`         | `isEmpty()`                                                  | 如果此集合不包含任何元素，则返回 `true` 。                   |
| `Iterator<E>`     | `iterator()`                                                 | 以升序返回此集合中元素的迭代器。                             |
| `E`               | `last()`                                                     | 返回此集合中当前的最后一个（最高）元素。                     |
| `E`               | `lower(E e)`                                                 | 返回此集合中的最大元素严格小于给定元素，如果没有这样的元素，则 `null` 。 |
| `E`               | `pollFirst()`                                                | 检索并删除第一个（最低）元素，如果此组为空，则返回 `null` 。 |
| `E`               | `pollLast()`                                                 | 检索并删除最后一个（最高）元素，如果此集合为空，则返回 `null` 。 |
| `boolean`         | `remove(Object o)`                                           | 如果存在，则从该集合中移除指定的元素。                       |
| `int`             | `size()`                                                     | 返回此集合中的元素数（基数）。                               |
| `Spliterator<E>`  | `spliterator()`                                              | 在此集合中的元素上创建*[late-binding](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html#binding)*和*故障快速* [`Spliterator`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Spliterator.html) 。 |
| `NavigableSet<E>` | `subSet(E fromElement, boolean fromInclusive, E toElement, boolean toInclusive)` | 返回此set的部分视图，其元素范围为 `fromElement`到 `toElement` 。 |
| `SortedSet<E>`    | `subSet(E fromElement, E toElement)`                         | 返回此set的部分视图，其元素范围从 `fromElement` （含）到 `toElement` （独占）。 |
| `SortedSet<E>`    | `tailSet(E fromElement)`                                     | 返回此set的部分视图，其元素大于或等于 `fromElement` 。       |
| `NavigableSet<E>` | `tailSet(E fromElement, boolean inclusive)`                  | 返回此set的部分视图，其元素大于（或等于，如果 `inclusive`为true） `fromElement` 。 |

# Map集合

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/Map.html)

```java
public interface Map<K,V>
```

1. Map(Interface)
   1. HashMap(Class)
   2. SortedMap(Interface)
      1. TreeMap(Class)

## 总结

1. 用于存储任意键值(Key-Value)
2. 键：无序、无下标、不允许重复(唯一)
3. 值：无序、无下标、允许重复

## 方法

| 变量和类型                   | 方法                                                         | 描述                                                         |
| :--------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `void`                       | `clear()`                                                    | 从此映射中删除所有映射（可选操作）。                         |
| `default V`                  | `compute(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)` | 尝试计算指定键及其当前映射值的映射（如果没有当前映射， `null` ）。 |
| `default V`                  | `computeIfAbsent(K key, Function<? super K,? extends V> mappingFunction)` | 如果指定的键尚未与值关联（或映射到 `null` ），则尝试使用给定的映射函数计算其值并将其输入此映射，除非 `null` 。 |
| `default V`                  | `computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)` | 如果指定键的值存在且为非null，则尝试在给定键及其当前映射值的情况下计算新映射。 |
| `boolean`                    | `containsKey(Object key)`                                    | 如果此映射包含指定键的映射，则返回 `true` 。                 |
| `boolean`                    | `containsValue(Object value)`                                | 如果此映射将一个或多个键映射到指定值，则返回 `true` 。       |
| `static <K,V>Map<K,V>`       | `copyOf(Map<? extends K,? extends V> map)`                   | 返回包含给定Map的条目的 [unmodifiable Map](https://www.runoob.com/manual/jdk11api/java.base/java/util/Map.html#unmodifiable) 。 |
| `static <K,V>Map.Entry<K,V>` | `entry(K k, V v)`                                            | 返回包含给定键和值的不可修改的[`Map.Entry`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Map.Entry.html) 。 |
| `Set<Map.Entry<K,V>>`        | `entrySet()`                                                 | 返回此映射中包含的映射的[`Set`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Set.html)视图。 |
| `boolean`                    | `equals(Object o)`                                           | 将指定对象与此映射进行比较以获得相等性。                     |
| `default void`               | `forEach(BiConsumer<? super K,? super V> action)`            | 对此映射中的每个条目执行给定操作，直到处理完所有条目或操作引发异常。 |
| `V`                          | `get(Object key)`                                            | 返回指定键映射到的值，如果此映射不包含键的映射，则返回 `null` 。 |
| `default V`                  | `getOrDefault(Object key, V defaultValue)`                   | 返回指定键映射到的值，如果此映射不包含键的映射，则返回 `defaultValue` 。 |
| `int`                        | `hashCode()`                                                 | 返回此映射的哈希码值。                                       |
| `boolean`                    | `isEmpty()`                                                  | 如果此映射不包含键 - 值映射，则返回 `true` 。                |
| `Set<K>`                     | `keySet()`                                                   | 返回此映射中包含的键的[`Set`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Set.html)视图。 |
| `default V`                  | `merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFunction)` | 如果指定的键尚未与值关联或与null关联，则将其与给定的非空值关联。 |
| `static <K,V>Map<K,V>`       | `of()`                                                       | 返回包含零映射的不可修改映射。                               |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1)`                                             | 返回包含单个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2)`                                 | 返回包含两个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2, K k3, V v3)`                     | 返回包含三个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4)`         | 返回包含四个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5)` | 返回包含五个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5, K k6, V v6)` | 返回包含六个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5, K k6, V v6, K k7, V v7)` | 返回包含七个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5, K k6, V v6, K k7, V v7, K k8, V v8)` | 返回包含八个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5, K k6, V v6, K k7, V v7, K k8, V v8, K k9, V v9)` | 返回包含九个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `of(K k1, V v1, K k2, V v2, K k3, V v3, K k4, V v4, K k5, V v5, K k6, V v6, K k7, V v7, K k8, V v8, K k9, V v9, K k10, V v10)` | 返回包含十个映射的不可修改的映射。                           |
| `static <K,V>Map<K,V>`       | `ofEntries(Map.Entry<? extends K,? extends V>... entries)`   | 返回包含从给定条目中提取的键和值的不可修改的映射。           |
| `V`                          | `put(K key, V value)`                                        | 将指定的值与此映射中的指定键相关联（可选操作）。             |
| `void`                       | `putAll(Map<? extends K,? extends V> m)`                     | 将指定映射中的所有映射复制到此映射（可选操作）。             |
| `default V`                  | `putIfAbsent(K key, V value)`                                | 如果指定的键尚未与值关联（或映射到 `null` ）， `null`其与给定值关联并返回 `null` ，否则返回当前值。 |
| `V`                          | `remove(Object key)`                                         | 如果存在，则从该映射中移除键的映射（可选操作）。             |
| `default boolean`            | `remove(Object key, Object value)`                           | 仅当指定键当前映射到指定值时才删除该条目的条目。             |
| `default V`                  | `replace(K key, V value)`                                    | 仅当指定键当前映射到某个值时，才替换该条目的条目。           |
| `default boolean`            | `replace(K key, V oldValue, V newValue)`                     | 仅当前映射到指定值时，才替换指定键的条目。                   |
| `default void`               | `replaceAll(BiFunction<? super K,? super V,? extends V> function)` | 将每个条目的值替换为在该条目上调用给定函数的结果，直到所有条目都已处理或函数抛出异常。 |
| `int`                        | `size()`                                                     | 返回此映射中键 - 值映射的数量。                              |
| `Collection<V>`              | `values()`                                                   | 返回此映射中包含的值的[`Collection`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Collection.html)视图。 |

# HashMap类

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/HashMap.html)

```java
public class HashMap<K,V>
extends AbstractMap<K,V>
implements Map<K,V>, Cloneable, Serializable
```

HashMap 是一个散列表，它存储的内容是键值对(key-value)映射。

HashMap 实现了 Map 接口，根据键的 HashCode 值存储数据，具有很快的访问速度，最多允许一条记录的键为 null，不支持线程同步。

HashMap 是无序的，即不会记录插入的顺序。

HashMap 继承于AbstractMap，实现了 Map、Cloneable、java.io.Serializable 接口。

## 总结

- **特点：** 基于哈希表实现的键值对存储结构。
- **优点：** 高效的查找、插入和删除操作。
- **缺点：** 无序，不保证顺序。

## 方法

| 变量和类型            | 方法                                                         | 描述                                                         |
| :-------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `void`                | `clear()`                                                    | 从此映射中删除所有映射。                                     |
| `Object`              | `clone()`                                                    | 返回此 `HashMap`实例的浅表副本：未克隆键和值本身。           |
| `V`                   | `compute(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)` | 尝试计算指定键及其当前映射值的映射（如果没有当前映射， `null` ）。 |
| `V`                   | `computeIfAbsent(K key, Function<? super K,? extends V> mappingFunction)` | 如果指定的键尚未与值关联（或映射到 `null` ），则尝试使用给定的映射函数计算其值并将其输入此映射，除非 `null` 。 |
| `V`                   | `computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)` | 如果指定键的值存在且为非null，则尝试在给定键及其当前映射值的情况下计算新映射。 |
| `boolean`             | `containsKey(Object key)`                                    | 如果此映射包含指定键的映射，则返回 `true` 。                 |
| `boolean`             | `containsValue(Object value)`                                | 如果此映射将一个或多个键映射到指定值，则返回 `true` 。       |
| `Set<Map.Entry<K,V>>` | `entrySet()`                                                 | 返回此映射中包含的映射的[`Set`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Set.html)视图。 |
| `V`                   | `get(Object key)`                                            | 返回指定键映射到的值，如果此映射不包含键的映射，则返回 `null` 。 |
| `boolean`             | `isEmpty()`                                                  | 如果此映射不包含键 - 值映射，则返回 `true` 。                |
| `Set<K>`              | `keySet()`                                                   | 返回此映射中包含的键的[`Set`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Set.html)视图。 |
| `V`                   | `merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFunction)` | 如果指定的键尚未与值关联或与null关联，则将其与给定的非空值关联。 |
| `V`                   | `put(K key, V value)`                                        | 将指定的值与此映射中的指定键相关联。                         |
| `void`                | `putAll(Map<? extends K,? extends V> m)`                     | 将指定映射中的所有映射复制到此映射。                         |
| `V`                   | `remove(Object key)`                                         | 从此映射中删除指定键的映射（如果存在）。                     |
| `int`                 | `size()`                                                     | 返回此映射中键 - 值映射的数量。                              |
| `Collection<V>`       | `values()`                                                   | 返回此映射中包含的值的[`Collection`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Collection.html)视图。 |

# TreeMap

[Api文档](https://www.runoob.com/manual/jdk11api/java.base/java/util/TreeMap.html)

```java
public class TreeMap<K,V>
extends AbstractMap<K,V>
implements NavigableMap<K,V>, Cloneable, Serializable
```

基于红黑树的`NavigableMap`实现。 该地图是根据排序`natural ordering`其密钥，或通过`Comparator`在地图创建时提供，这取决于所使用的构造方法。

此实现提供了保证的log（n）时间成本`containsKey` ， `get` ， `put`和`remove`操作。 算法是对Cormen，Leiserson和Rivest的*算法导论中的算法的*改编。

## 总结

- **特点：** 基于红黑树实现的有序键值对存储结构。
- **优点：** 有序，支持按照键的顺序遍历。
- **缺点：** 插入和删除相对较慢。

## 方法

| 变量和类型            | 方法                                                         | 描述                                                         |
| :-------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `Map.Entry<K,V>`      | `ceilingEntry(K key)`                                        | 返回与大于或等于给定键的最小键关联的键 - 值映射，如果没有此键，则 `null` 。 |
| `K`                   | `ceilingKey(K key)`                                          | 返回大于或等于给定键的 `null`键，如果没有这样的键，则 `null` 。 |
| `void`                | `clear()`                                                    | 从此映射中删除所有映射。                                     |
| `Object`              | `clone()`                                                    | 返回此 `TreeMap`实例的浅表副本。                             |
| `boolean`             | `containsKey(Object key)`                                    | 如果此映射包含指定键的映射，则返回 `true` 。                 |
| `boolean`             | `containsValue(Object value)`                                | 如果此映射将一个或多个键映射到指定值，则返回 `true` 。       |
| `NavigableSet<K>`     | `descendingKeySet()`                                         | 返回此映射中包含的键的反向顺序[`NavigableSet`](https://www.runoob.com/manual/jdk11api/java.base/java/util/NavigableSet.html)视图。 |
| `NavigableMap<K,V>`   | `descendingMap()`                                            | 返回此映射中包含的映射的逆序视图。                           |
| `Set<Map.Entry<K,V>>` | `entrySet()`                                                 | 返回此映射中包含的映射的[`Set`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Set.html)视图。 |
| `Map.Entry<K,V>`      | `firstEntry()`                                               | 返回与此映射中的最小键关联的键 - 值映射，如果映射为空，则 `null` 。 |
| `K`                   | `firstKey()`                                                 | 返回此映射中当前的第一个（最低）键。                         |
| `Map.Entry<K,V>`      | `floorEntry(K key)`                                          | 返回与小于或等于给定键的最大键关联的键 - 值映射，如果没有此键，则 `null` 。 |
| `K`                   | `floorKey(K key)`                                            | 返回小于或等于给定键的最大键，如果没有这样的键，则 `null` 。 |
| `V`                   | `get(Object key)`                                            | 返回指定键映射到的值，如果此映射不包含键的映射，则返回 `null` 。 |
| `SortedMap<K,V>`      | `headMap(K toKey)`                                           | 返回此映射的部分视图，其键严格小于 `toKey` 。                |
| `NavigableMap<K,V>`   | `headMap(K toKey, boolean inclusive)`                        | 返回此映射的部分视图，其键小于（或等于，如果 `inclusive`为真） `toKey` 。 |
| `Map.Entry<K,V>`      | `higherEntry(K key)`                                         | 返回与严格大于给定键的最小键关联的键 - 值映射，如果没有此键，则 `null` 。 |
| `K`                   | `higherKey(K key)`                                           | 返回严格大于给定键的最小键，如果没有这样的键，则返回 `null` 。 |
| `Set<K>`              | `keySet()`                                                   | 返回此映射中包含的键的[`Set`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Set.html)视图。 |
| `Map.Entry<K,V>`      | `lastEntry()`                                                | 返回与此映射中的最大键关联的键 - 值映射，如果映射为空，则 `null` 。 |
| `K`                   | `lastKey()`                                                  | 返回此映射中当前的最后一个（最高）键。                       |
| `Map.Entry<K,V>`      | `lowerEntry(K key)`                                          | 返回与严格小于给定键的最大键相关联的键 - 值映射，如果没有这样的键，则 `null` 。 |
| `K`                   | `lowerKey(K key)`                                            | 返回严格小于给定键的最大键，如果没有这样键，则返回 `null` 。 |
| `NavigableSet<K>`     | `navigableKeySet()`                                          | 返回此映射中包含的键的[`NavigableSet`](https://www.runoob.com/manual/jdk11api/java.base/java/util/NavigableSet.html)视图。 |
| `Map.Entry<K,V>`      | `pollFirstEntry()`                                           | 删除并返回与此映射中的最小键关联的键 - 值映射，如果映射为空，则 `null` 。 |
| `Map.Entry<K,V>`      | `pollLastEntry()`                                            | 删除并返回与此映射中的最大键关联的键 - 值映射，如果映射为空，则 `null` 。 |
| `V`                   | `put(K key, V value)`                                        | 将指定的值与此映射中的指定键相关联。                         |
| `void`                | `putAll(Map<? extends K,? extends V> map)`                   | 将指定映射中的所有映射复制到此映射。                         |
| `V`                   | `remove(Object key)`                                         | 如果存在，则从此TreeMap中删除此键的映射。                    |
| `int`                 | `size()`                                                     | 返回此映射中键 - 值映射的数量。                              |
| `NavigableMap<K,V>`   | `subMap(K fromKey, boolean fromInclusive, K toKey, boolean toInclusive)` | 返回此映射部分的视图，其键范围为 `fromKey`至 `toKey` 。      |
| `SortedMap<K,V>`      | `subMap(K fromKey, K toKey)`                                 | 返回此映射部分的视图，其键的范围从 `fromKey` （包括 `toKey` ）到 `toKey` （独占）。 |
| `SortedMap<K,V>`      | `tailMap(K fromKey)`                                         | 返回此映射的部分视图，其键大于或等于 `fromKey` 。            |
| `NavigableMap<K,V>`   | `tailMap(K fromKey, boolean inclusive)`                      | 返回此映射的部分视图，其键大于（或等于，如果 `inclusive`为真） `fromKey` 。 |
| `Collection<V>`       | `values()`                                                   | 返回此映射中包含的值的[`Collection`](https://www.runoob.com/manual/jdk11api/java.base/java/util/Collection.html)视图。 |

