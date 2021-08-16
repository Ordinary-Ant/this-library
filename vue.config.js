module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        store: '@/store',
        components: '@/components',
        api: '@/api',
        utils: '@/utils',
        views: '@/views'
      }
    }
  }
}
