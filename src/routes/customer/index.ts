import { Customer } from "server/model";
import type { Request } from "polka";
import type { ServerResponse as Response } from "http";


export async function get(req: Request, res: Response) {
    const customers = await Customer.findAll();
}