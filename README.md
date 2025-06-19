


          
# HourlyBuys

一个帮助用户计算时薪购买力的Web应用，让你直观了解工作一小时能购买多少生活必需品。

## 功能特点
- 税后时薪输入与验证
- 位置自动检测与手动输入
- 直观的购买力计算结果展示
- 响应式设计，适配各种设备

## 技术栈
- **前端框架**: Next.js 15.3.3
- **UI库**: React 18.3.1
- **状态管理**: Zustand
- **UI组件**: shadcn/ui, Lucide Icons
- **样式解决方案**: Tailwind CSS
- **类型检查**: TypeScript
- **部署选项**: Docker

## 快速开始

### 前提条件
- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/yourusername/hourlybuys.git
cd hourlybuys

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 http://localhost:9002 运行

### 使用Docker部署
```bash
# 构建镜像
docker build -t hourlybuys .

# 运行容器
docker run -p 3000:3000 hourlybuys
```

## 使用方法
1. 在首页输入您的税后时薪（单位：人民币）
2. 允许位置权限自动检测位置，或手动输入城市名称
3. 点击"Next Step → View Purchasing Power"按钮查看结果
4. 查看您的时薪可以购买的各类生活必需品数量

## 项目结构
```
/src
  /app           # Next.js 15 App Router
  /components    # UI组件
  /hooks         # 自定义React Hooks
  /lib           # 工具函数和状态管理
  /types         # TypeScript类型定义
```

## 主要页面
- `/salary` - 时薪和位置输入页面
- `/results` - 购买力结果展示页面

## 许可证
[MIT](LICENSE)
        
