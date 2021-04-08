import { Transaction } from "server/model";
import type { Request } from "polka";
import type { ServerResponse as Response } from "http";
import * as session from "server/session";

export async function post(req: Request, res: Response) {
    if (session.check(req, res)) {
        const body = req.body;

        Transaction.findOne({
            where: { id: body.id }
        }).then(transaction => {
            transaction.itemId = body.itemId;
            transaction.customerId = body.customerId;
            transaction.date = body.date;
            transaction.qty = body.qty;
            transaction.totalPrice = body.totalPrice;
            transaction.discount = body.discount;
            transaction.priceAfterDiscount = body.priceAfterDiscount;
            transaction.save();
        });

        res.end();
    }
}