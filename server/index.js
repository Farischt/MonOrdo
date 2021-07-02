import Database from "@/server/database"
import cookie from "cookie"
import formidable from "formidable"

class Backend {
  async parseMultipart(context) {
    return await new Promise((resolve, reject) => {
      formidable().parse(context.req, (error, body, files) => {
        if (error) return reject(error)

        context.req.body = body
        context.req.files = files
        return resolve({ body, files })
      })
    })
  }

  async login(context, token) {
    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/",
      })
    )
  }

  async logout(context) {
    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", null, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      })
    )
  }

  async getAuthenticatedUser(context) {
    if (!context.req.cookies.authToken) {
      return null
    }

    const token = await Database.AuthToken.findByPk(
      context.req.cookies.authToken
    )

    if (!token) {
      return null
    } else if (this.hasAuthTokenExpired(token)) {
      context.res.setHeader(
        "Set-Cookie",
        cookie.serialize("authToken", null, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 0,
          path: "/",
        })
      )
      return null
    }

    const user = token.user_id
      ? await Database.User.findByPk(token.user_id)
      : await Database.Doctor.findByPk(token.doctor_id)
    if (!user) return null
    return user
  }

  async isAuthenticatedUserAdmin(context) {
    const user = await this.getAuthenticatedUser(context)
    return user !== null ? user.admin : false
  }

  hasAuthTokenExpired(token) {
    return Date.now() - new Date(token.createdAt).getTime() + 60 * 60 <= 0
  }
}

export default new Backend()
