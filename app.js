const http = require('http');
const url = require('url');
require('dotenv').config();

const routes = require('./src/routes/index');
const uiRoutes = require('./src/routes/uiRoutes')

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const path = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    let handler = (routes[path] && routes[path][method]) || uiRoutes[path] && uiRoutes[path][method];

    if (!handler) {
        const routeKeys = Object.keys(routes).filter((key) => key.includes(":"));
        const matchedKey = routeKeys.find((key) => {
            const regex = new RegExp(`^${key.replace(/:[^/]+/g, "([^/]+)")}$`);
            return regex.test(path);
        });

        if (matchedKey) {
            const regex = new RegExp(`^${matchedKey.replace(/:[^/]+/g, "([^/]+)")}$`);
            const dynamicParams = regex.exec(path).slice(1);
            const dynamicHandler = routes[matchedKey][method];

            const paramKeys = matchedKey
                .match(/:[^/]+/g)
                .map((key) => key.substring(1));

            const params = dynamicParams.reduce(
                (acc, val, i) => ({ ...acc, [paramKeys[i]]: val }),
                {}
            );

            req.params = params;
            handler = dynamicHandler;
        }
    }

    if (!handler) {
        handler = routes.notFound;
    }

    req.query = {};
    for (const key in query) {
        req.query[key] = query[key];
    }

    handler(req, res);
});

const serverInstance = server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = {server, serverInstance};
