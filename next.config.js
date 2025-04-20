// module.exports = {
//   images: {
//     domains: ['www.notion.so', 'lh5.googleusercontent.com', 's3-us-west-2.amazonaws.com'],
//   },
// }

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ['lh5.googleusercontent.com', 's3-us-west-2.amazonaws.com'],
    unoptimized:true
  },
  output: 'export',
  distDir: 'out',
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // export 静态导出时 忽略/pages/sitemap.xml.js ， 否则和getServerSideProps这个动态文件冲突
    const pages = { ...defaultPathMap }
    delete pages['/sitemap.xml']
    return pages
  },
}
 
module.exports = nextConfig

