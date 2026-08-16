---
title: "图书管理系统 2.0：MyBatis 版本"
date: "2026-08-16"
tags: ["Java", "MyBatis", "项目实战"]
minutes: 20
---

# 错版

```java
package com.bookborrwor.util;

import lombok.extern.java.Log;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.util.function.Consumer;

@Log
public class SqlUtil {

    private SqlUtil() {}

    private static final SqlSessionFactory factory;
    public static SqlSession session;
    static {
        try {
            factory = new SqlSessionFactoryBuilder().build(Resources.getResourceAsReader("mybatis-config.xml"));
        } catch (IOException e) {
            log.warning("MyBatis初始化失败"+e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public static SqlSession openSqlSession(){
        return factory.openSession(true);
    }

    public static<T> void doSqlWork(Class<T> mapperclass,Consumer<T> consumer){
        consumer.accept(session.getMapper(mapperclass));
    }
}

```

# 对版

```java
package com.bookborrwor.util;

import lombok.extern.java.Log;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.util.function.Consumer;

@Log
public class SqlUtil {

    private SqlUtil() {}

    public static SqlSession session;
    static {
        try {
            SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(Resources.getResourceAsReader("mybatis-config.xml"));
            session = factory.openSession(true);
        } catch (IOException e) {
            log.warning("MyBatis初始化失败"+e.getMessage());
            throw new RuntimeException(e);
        }
    }


    public static<T> void doSqlWork(Class<T> mapperclass,Consumer<T> consumer){
        consumer.accept(session.getMapper(mapperclass));
    }
}
```



主要问题是空指针，没办法锁定的到`session`是哪一个，通过将`OpenSesssion()`这个方法删除，并且将其送入`session`中即可确定一个准确的`session`

