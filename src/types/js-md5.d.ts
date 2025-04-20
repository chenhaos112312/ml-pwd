// 声明 js-md5 模块
declare module 'js-md5' {
  // 定义 md5 函数的类型
  function md5(message: string | number[] | Uint8Array): string;
  
  // 如果有其他导出，可以继续声明
  export = md5;
}