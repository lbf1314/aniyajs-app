import Mock from 'better-mock'

export default {
  // 获取用户信息
  "POST /user/info": async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (!req?.headers?.token) {
      res.send({
        code: 403,
        msg: "暂无权限",
        result: null,
      })
      return
    }
    
    res.send(
      Mock.mock({
        code: 200,
        msg: "success",
        result: {
          avatar: "@image(200x100, #6fdad6, #fff, '人')",
          email: "@email",
          id: "@guid",
          nickName: "@cname",
          phone: "@phone",
          username: "@cname",
        },
      })
    )
  },
  // 获取验证码
  'POST /user/getCode': async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 生成随机颜色
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const bgColor = randomColor();
    const textColor = randomColor();
    
    res.send(
      Mock.mock({
        code: 200,
        msg: "success",
        result: `@image(200x100, ${bgColor}, ${textColor}, ${Math.floor(Math.random() * 9000 + 1000)})`,
      })
    )
  },
  // 登录
  'POST /user/login': async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { account, password, verificationCode } = req.body

    // if (verificationCode !== '1234') {
    //   res.send({
    //     code: 201,
    //     msg: "验证码错误",
    //     result: null,
    //   })
    //   return
    // }

    if (account !== 'admin' || password !== '123456') {
      res.send({
        code: 201,
        msg: '账号或密码错误',
        result: null,
      })
      return
    }

    res.send(
      Mock.mock({
        code: 200,
        msg: "success",
        result: {
          token: '@guid'
        },
      })
    )
  },
  // 注册
  'POST /user/register': async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    res.send({
      code: 200,
      msg: "注册成功",
      result: null,
    })
  }
}