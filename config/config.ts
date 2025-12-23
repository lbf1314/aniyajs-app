import routes from './routes'
import proxy from './proxy'

export default {
  outputPath: "docs",
  // 静态资源文件路径前缀
  publicPath: './',
  // 开发服务器配置
  devServer: {
    port: 9994,
    host: "localhost",
    https: false,
    // ssl_srt_file: "ssl/server.crt",
    // ssl_key_file: "ssl/server.key",
  },
  // 是否自动打开浏览器
  open: false,
  // 是否禁用eslint
  disableESLintPlugin: true,
  // 是否使用 tailwind css
  useTailwindcss: true,
  // 是否使用 react-tooltik
  toolTik: true,
  // aniya插件名称
  aniyaPlugins: [
    '@aniyajs/plugin-tooltik',
    '@aniyajs/plugin-router'
  ],
  // 热刷新
  fastRefresh: false,
  // 路径别名
  alias: {
    '@asset': "asset",
  },
  // 路由配置
  routes,
  // 代理配置
  proxy,
  // 全局变量
  define: {
    'GLOBAL_VARIABLE': '这是一个测试的全局变量'
  }
}