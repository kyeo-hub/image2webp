// 导入必要的模块
const express = require('express'); // 用于创建web服务器
const multer = require('multer'); // 用于处理文件上传
const sharp = require('sharp'); // 用于图像处理和转换


// 创建Express应用实例
const app = express();
// 配置Multer中间件，用于处理上传的文件
const upload = multer();

// 定义POST请求的路由，用于处理图片转换为WebP格式的请求
app.get('/', (req, res) => {
    res.send('欢迎来到图片转换服务！');
});
app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        // 检查是否有文件上传
        if (!req.file) {
            return res.status(400).send('没有上传文件。');
        }

        // 将上传的文件转换为sharp可以处理的格式
        const fileStream = req.file.buffer;
        // 使用sharp将上传的图片转换为WebP格式，并输出到buffer
        const webpBuffer = await sharp(fileStream)
            .toFormat('webp')
            .toBuffer();

        // 设置响应头，指定内容类型为WebP图像
        res.set('Content-Type', 'image/webp');
        // 直接返回WebP图像数据
        res.send(webpBuffer);
    } catch (error) {
        // 如果转换过程中出现错误，记录错误信息并返回500状态码
        console.error(error);
        res.status(500).send('转换图片为WebP格式时出错。');
    }
});

// 设置服务器监听的端口
const PORT = process.env.PORT || 3000;
// 启动服务器并在指定端口上运行
app.listen(PORT, () => {
    console.log(`服务器正在监听端口${PORT}`);
});