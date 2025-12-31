import { useSelector } from '@aniyajs/plugin-tooltik';
import React from 'react'

export default (): React.ReactNode => {
  const state = useSelector((state: RootState) => state.settings)

  return (
    <div className={`min-h-[650px] bg-${state?.navTheme} flex items-center justify-center`}>
      <div className={`text-center p-8 rounded-2xl shadow-xl bg-white max-w-2xl w-full mx-4`}>
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            欢迎使用 <span className="text-primary-600">ANIYAJS</span>
          </h1>
          <p className="text-lg text-neutral-600 mt-4">
            您已成功启动 ANIYAJS 应用程序！这是一个现代化的前端开发框架，
            帮助您快速构建高质量的 Web 应用。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => window.open('https://lbf1314.github.io/aniyajs-doc', '_blank')}
            className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            查看文档
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-100">
          <p className="text-neutral-500 text-sm">
            ANIYAJS - 让前端开发更简单高效
          </p>
        </div>
      </div>
    </div>
  )
}