# 🛠️ web-cli 前端脚手架

> 快速搭建前端项目的工具

## 安装
### 要求
```
node版本 >= 14.17.0
```

#### 使用包管理器安装
```sh
npm install -g @midoumidou/web-cli

yarn global add @midoumidou/web-cli

pnpm add -g @midoumidou/web-cli
```

## 使用
在终端使用命令：`web-cli`

```sh
❯ web-cli

Usage: web-cli <子命令>

Options:
  -V, --version      显示版本号
  -h, --help         显示帮助信息

Commands:
  init [options]     初始化前端项目
  install [options]  安装前端项目依赖
  upgrade            更新模板
  help <子命令>         显示子命令帮助信息

```
### 添加远程模板
使用命令：`web-cli init -c`

**远程模板地址要保证是一个合法的git仓库地址**

## LICENSE
MIT