import { User } from "database/model";
import type { Request } from "polka";
import type { ServerResponse } from "http";

export async function post(req: Request, res: ServerResponse, next: () => void) {
    console.log(JSON.stringify(req.body));

    const { username, password } = req.body;
    const users = await User.findAll({
        where: {
            username: username,
            password: password
        }
    });

    if (users.length == 1) {
        res.statusCode = 200;
    } else {
        res.statusCode = 401;
    }
    res.end();
}