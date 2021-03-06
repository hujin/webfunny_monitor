const Router = require('koa-router');
const { Common } = require("../controllers/controllers.js")
const router = new Router({
    prefix: '/socket'
})
// 获取连线用户的实时日志记录
router.get('/wsGetDebugInfo', async function (ctx) {
    try {
        let intervalObj = null
        const conn = ctx.websocket
        conn.on('message', async function (message) {
            const param = JSON.parse(message)
            // 返回给前端的数据
            intervalObj = setInterval(async () => {
                const result = await Common.getDebugInfoFromConnectUser(param)
                const res = result ? JSON.stringify(result) : ""
                ctx.websocket.send(res)
            }, 1000)
        })
        // 连接关闭了
        conn.on("close", function (code, reason) {
            if (intervalObj) clearInterval(intervalObj)
            console.log("wsGetDebugInfo Connection closed")
        })
        // 必须监控error, 每当浏览器刷新时会断开链接报错
        conn.on("error", function (error) {
            if (intervalObj) clearInterval(intervalObj)
            console.log("wsGetDebugInfo Connection error", error)
        })
    } catch(e) {
        console.log(e)
    }
})

module.exports = router
