const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const routes = require('./src/routes/index');
const uiRoutes = require('./src/routes/uiRoutes');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const pathname = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // Check if the request is for an image
    if (pathname.startsWith('/images/')) {
        // Construct the full path to the requested image
        const imagePath = path.join(__dirname, 'public', pathname);

        // Read the image file
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                // If the image is not found, return a 404 response
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            } else {
                // Set the appropriate content type and send the image data
                const ext = path.extname(imagePath).toLowerCase();
                const contentType = {
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                }[ext];

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    } else {
        let handler = (routes[pathname] && routes[pathname][method]) || (uiRoutes[pathname] && uiRoutes[pathname][method]);

        if (!handler) {
            let routeKeys = Object.keys(routes).filter((key) => key.includes(":"));
            const uiRouteKeys = Object.keys(uiRoutes).filter((key) => key.includes(":"));
            routeKeys = routeKeys.concat(uiRouteKeys);
            const allRoutes = Object.assign({}, routes, uiRoutes);
            const matchedKey = routeKeys.find((key) => {
                const regex = new RegExp(`^${key.replace(/:[^/]+/g, "([^/]+)")}$`);
                return regex.test(pathname);
            });

            if (matchedKey) {
                const regex = new RegExp(`^${matchedKey.replace(/:[^/]+/g, "([^/]+)")}$`);
                const dynamicParams = regex.exec(pathname).slice(1);
                const dynamicHandler = allRoutes[matchedKey][method];

                const paramKeys = matchedKey.match(/:[^/]+/g).map((key) => key.substring(1));

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
    }
});

const serverInstance = server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { server, serverInstance };
