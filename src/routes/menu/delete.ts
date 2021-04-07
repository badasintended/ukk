import { Menu } from "server/model";
import type { Request } from "polka";
import type { ServerResponse as Response } from "http";


export async function del(req: Request, res: Response) {
    const menus = await Menu.findAll();

    const response = [];
    menus.forEach(menu => {
        response.push({
            id: menu.id,
            code: menu.code,
            name: menu.name,
            price: menu.price
        })
    });

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(response));
}