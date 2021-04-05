require("dotenv").config();

import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { json } from 'body-parser';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka({
    onError: (err, req, res, next) => {
        console.log("error", err);
    }
})
    .use(
        json(),
        compression({ threshold: 0 }) as any,
        sirv("static", { dev }),
        sapper.middleware()
    )
    .listen(PORT)

