import cookie from "cookie"
import Database from "@/server/database"

class Backend {
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

    const user = await Database.User.findByPk(token.user_id)
    if (!user) return null
    return user
  }

  hasAuthTokenExpired(token) {
    return Date.now() - new Date(token.createdAt).getTime() + 60 * 60 <= 0
  }
}

export default new Backend()
