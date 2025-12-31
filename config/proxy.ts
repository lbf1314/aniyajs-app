import defaultSettings from './defaultSettings';

const { debugLocal, debugLocalDomain } = defaultSettings;
const targetApiUrl = debugLocal ? debugLocalDomain : 'http://localhost:8889';

export default {
  '/api': {
    target: targetApiUrl,
    changeOrigin: true,
    pathRewrite: { '^/api': () => '' },
  },
}
