// @ts-check
import { join } from 'path';
import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Shopify, LATEST_API_VERSION } from '@shopify/shopify-api';
import { Page } from '@shopify/shopify-api/dist/rest-resources/2022-07/index.js';

import applyAuthMiddleware from './middleware/auth.js';
import verifyRequest from './middleware/verify-request.js';
import { setupGDPRWebHooks } from './gdpr.js';
import productCreator from './helpers/product-creator.js';
import { BillingInterval } from './helpers/ensure-billing.js';
import { AppInstallations } from './app_installations.js';

const USE_ONLINE_TOKENS = false;
const TOP_LEVEL_OAUTH_COOKIE = 'shopify_top_level_oauth';

// @ts-ignore
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

const DB_PATH = `${process.cwd()}/database.sqlite`;

Shopify.Context.initialize({
    // @ts-ignore
    API_KEY: process.env.SHOPIFY_API_KEY,
    // @ts-ignore
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    // @ts-ignore
    SCOPES: process.env.SCOPES.split(','),
    // @ts-ignore
    HOST_NAME: process.env.HOST.replace(/https?:\/\//, ''),
    // @ts-ignore
    HOST_SCHEME: process.env.HOST.split('://')[0],
    API_VERSION: LATEST_API_VERSION,
    IS_EMBEDDED_APP: true,
    // This should be replaced with your preferred storage strategy
    SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
});

Shopify.Webhooks.Registry.addHandler('APP_UNINSTALLED', {
    path: '/api/webhooks',
    webhookHandler: async (_topic, shop, _body) => {
        await AppInstallations.delete(shop);
    },
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
    required: false,
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    // chargeName: "My Shopify One-Time Charge",
    // amount: 5.0,
    // currencyCode: "USD",
    // interval: BillingInterval.OneTime,
};

// This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
// in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
setupGDPRWebHooks('/api/webhooks');

// export for test use only
export async function createServer(
    root = process.cwd(),
    isProd = process.env.NODE_ENV === 'production',
    billingSettings = BILLING_SETTINGS,
) {
    const app = express();
    app.set('top-level-oauth-cookie', TOP_LEVEL_OAUTH_COOKIE);
    app.set('use-online-tokens', USE_ONLINE_TOKENS);

    app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

    applyAuthMiddleware(app, {
        // @ts-ignore
        billing: billingSettings,
    });

    // Do not call app.use(express.json()) before processing webhooks with
    // Shopify.Webhooks.Registry.process().
    // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
    // for more details.
    app.post('/api/webhooks', async (req, res) => {
        try {
            await Shopify.Webhooks.Registry.process(req, res);
            console.log(`Webhook processed, returned status code 200`);
        } catch (e) {
            console.log(`Failed to process webhook: ${e.message}`);
            if (!res.headersSent) {
                res.status(500).send(e.message);
            }
        }
    });

    // All endpoints after this point will require an active session
    app.use(
        '/api/*',
        verifyRequest(app, {
            // @ts-ignore
            billing: billingSettings,
        }),
    );

    //----------------App page clone---------------------------

    //Retrieves a list of pages
    app.get('/api/pages', async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'));
            // @ts-ignore
            const listPage = await Page.all({ session });
            res.json(listPage);
        } catch (error) {
            console.log('error');
            res.json(error);
        }
    });

    //Create a new page
    app.post('/api/page', express.json(), async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'));
            // @ts-ignore
            const page = new Page({ session });
            page.title = req.body.title;
            page.body_html = req.body.content;
            await page.save({
                update: true,
            });
            res.json({ success: 'success' });
        } catch (error) {
            res.json(error);
        }
    });

    //Get a page by id
    app.get('/api/page/:id', async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'));
            const page = await Page.find({
                // @ts-ignore
                session,
                id: req.params.id,
            });
            res.json(page);
        } catch (error) {
            console.log('error');
            res.json(error);
        }
    });

    //Update a page by id
    app.put('/api/page/:id', express.json(), async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'));
            // @ts-ignore
            const page = new Page({ session });
            page.title = req.body.title;
            page.body_html = req.body.content;
            // @ts-ignore
            page.id = req.params.id + 1;
            await page.save({
                update: true,
            });
            res.json({ success: 'success' });
        } catch (error) {
            console.log(error);
            res.json(error);
        }
    });

    //Delete a page by id
    app.delete('/api/page/:id', async (req, res) => {
        try {
            const listId = req.params.id.split(',');
            const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'));
            listId.forEach(async (id) => {
                await Page.delete({
                    // @ts-ignore
                    session,
                    // @ts-ignore
                    id: id,
                });
            });
            res.json({ success: 'success' });
        } catch (error) {
            console.log('error');
            res.json(error);
        }
    });

    app.get('/api/products/count', async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'));
        const { Product } = await import(
            `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
        );

        const countData = await Product.count({ session });
        res.status(200).send(countData);
    });

    app.get('/api/products/create', async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'));
        let status = 200;
        let error = null;

        try {
            await productCreator(session);
        } catch (e) {
            console.log(`Failed to process products/create: ${e.message}`);
            status = 500;
            error = e.message;
        }
        res.status(status).send({ success: status === 200, error });
    });

    // All endpoints after this point will have access to a request.body
    // attribute, as a result of the express.json() middleware

    app.use((req, res, next) => {
        const shop = req.query.shop;
        if (Shopify.Context.IS_EMBEDDED_APP && shop) {
            res.setHeader('Content-Security-Policy', `frame-ancestors https://${shop} https://admin.shopify.com;`);
        } else {
            res.setHeader('Content-Security-Policy', `frame-ancestors 'none';`);
        }
        next();
    });

    if (isProd) {
        const compression = await import('compression').then(({ default: fn }) => fn);
        const serveStatic = await import('serve-static').then(({ default: fn }) => fn);
        app.use(compression());
        app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
    }

    app.use('/*', async (req, res, next) => {
        const shop = req.query.shop;
        const appInstalled = await AppInstallations.includes(shop);

        if (shop && !appInstalled) {
            res.redirect(`/api/auth?shop=${shop}`);
        } else {
            // res.set('X-Shopify-App-Nothing-To-See-Here', '1');
            const fs = await import('fs');
            const fallbackFile = join(isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH, 'index.html');
            res.status(200).set('Content-Type', 'text/html').send(fs.readFileSync(fallbackFile));
        }
    });

    return { app };
}

createServer().then(({ app }) => app.listen(PORT));
