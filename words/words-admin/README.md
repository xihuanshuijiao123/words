# words

next.js 单词后台管理系统和h5 应用开发

## 应用形式

- 后台管理系统
- h5 应用
- 多端开发

## 亮点

- github 高星的 单词资料库
- 数据清洗 (选择、格式化、审核)
- supabase 云端类psql数据库
- 关系型数据库
- 支持向量数据库
- 云端 BASS数据库
  Backend as a Service
- ORM
  不用写sql语句, 不用做数据库的底层处理
  对象关系映射
  todo.save() 保存
  对象和数据库一行记录 对应起来

## 后台管理系统

### 单词书管理

维护单词书的创建、删除、更新、查询等操作
交给小编管理员

### 管理员管理

- 注册一个超级管理员, 一个人
- 添加管理员

/ -> 注册超级管理员页面 -> 登录
/ -> 登录页
-> 登录成功后, 跳转到单词书管理页面

## shadcn/ui UI 组件库

- 80% 前端组件业务趋同, 不用
  重复造轮子, 选用第三方组件库。
- element-ui / Ant Design
- shadcn 定制化很好
  tailwindcss 配合使用
  语义化, ai友好
  按需加载

## supabase

BASS 数据库云服务
性能、安全、可拓展性、部署成本
几乎为0

- psql
  **Conventional Commit（约定式提交）**是一种轻量级的提交信息规范，它通过一套简单易懂的规则，让 Git 提交历史变得清晰、可读且能自动化处理。

简单来说，它给 commit message 规定了一套格式，让你和团队能一眼看出这次提交做了什么、影响范围有多大。

📝 基本格式
一个标准的约定式提交信息长这样：

text
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]

1. 类型（Type）
   描述这次提交的性质，常用类型包括：

类型 说明 示例
feat 新功能（feature） feat: 添加用户登录功能
fix 修复 Bug fix: 修复登录按钮无响应问题
docs 文档变更 docs: 更新 API 使用说明
style 代码格式调整（不影响功能，如空格、分号等） style: 格式化代码缩进
refactor 重构（既不是新功能，也不是修复 Bug） refactor: 重构用户认证模块
perf 性能优化 perf: 优化图片加载速度
test 测试相关 test: 添加登录功能的单元测试
chore 构建工具或辅助工具变更（不影响业务代码） chore: 升级 Next.js 到 16.3.3
revert 回滚之前的提交 revert: 回滚 feat: 添加用户登录功能 2. 范围（Scope，可选）
用括号括起来，说明本次变更影响的具体模块或文件，比如：

feat(auth): 添加 JWT 令牌刷新机制

fix(api): 修复用户列表接口超时问题

3. 描述（Subject）
   简短、用现在时态、不超过 50 个字符的一句话总结。

4. 正文（Body，可选）
   对本次提交的详细说明，可以多行，解释“为什么做”以及“怎么做的”。

5. 脚注（Footer，可选）
   用于关联 Issue 或说明重大变更（BREAKING CHANGE）。

## ORM

- 数据库supabase 已云端创建
  .env DATABASE_URL
- next.js 面相对象编程 Object Oriented Programming (OOP)
  不同国家的人
  User user.save() -> sql insert into
  drizzle orm 映射 翻译
  psql User Table 低级 sql
- drizzle 接手数据库 .env
  不需要建表, 建立schema 映射的就是数据表
  migrate 数据表迁移

## drizzle

ORM 对象关系映射 Object Relational Mapping
ORM 工具 一种、 一系列的包和命令

- db 目录
  - index.ts 数据库配置
    链接并返回db 数据库操作句柄
  - schema.ts
    对象定义数据表结构
- 配套一系列的脚本
- generate 生成数据库迁移文件
  数据库加表, 改字段、添加索引等
  多一个schema 文件, 就多一个数据库迁移文件
- migrate 数据库迁移
- push 数据库推算
- studio 数据库可视化工import type { NextConfig } from "next";
