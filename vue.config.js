const path = require('path');        //引入path模块
function resolve(dir){
    return path.join(__dirname,dir)  //path.join(__dirname)设置绝对路径
}
module.exports={
    chainWebpack:(config)=>{
        config.resolve.alias
            //set第一个参数：设置的别名，第二个参数：设置的路径
            // .set('@',resolve('src'))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'))
            .set('views',resolve('src/views'))
            .set('common',resolve('src/common'))
            .set('network',resolve('src/network'))
    }
}


// const path = require('path');
// function resolve (dir) {
//     return path.join(__dirname, dir)
// }


// module.exports = {
//     chainWebpack: config=>{
//         // 设置快捷路径， @ 表示 'src' ，components 表示 'src/components'
//         config.resolve.alias
//              // .set('@', resolve('src'))
//             .set('assets', resolve('@/assets'))
//             .set('components', resolve('@/components'))
//             .set('views', resolve('@/views'))
//     }
// }

