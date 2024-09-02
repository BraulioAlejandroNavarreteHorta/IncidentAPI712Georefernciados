import 'dotenv/config'
import * as env from 'env-var'

export const envs = {
    PORT: env.get("PORT").asPortNumber(),
    MONGO_URL: env.get("MONGO_URL").asString(),
    MAIL_SERVICE: env.get("MAIL_SERVICE").asString(),
    MAIL_SECRET_KEY: env.get("MAIL_SECRET_KEY").asString(),
    MAIL_USER: env.get("MAIL_USER").asString(),
}
