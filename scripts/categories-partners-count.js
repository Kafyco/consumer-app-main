const https = require('https');

const hostname = 'api.supplyme.ae';
const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYzc1N2VlZWQtZjFmMy00Y2JlLWI4MDctNzQyZGRmZTlhOTMzIiwiY3JlYXRlZCI6IjIwMjEtMTEtMTIgMTg6MjY6MzMuNTE4MTg5In0.p-eROY8XPqoygG0ZELQD_9oFQv1TT6MAsYMflxYJDXc';

const ApiClient = {
  get: (path) =>
    new Promise((resolve, reject) => {
      const options = {
        hostname,
        path,
        port: 443,
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(body));
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    }),
};

const start = async () => {
  const categoriesTree = await ApiClient.get('/catalogue/categories/tree');
  const hash = categoriesTree.reduce((res, c1) => {
    c1.children.forEach(({ id, name }) => {
      res[id] = {
        id,
        path: [c1.name, name],
        count: 0,
      };
    });
    return res;
  }, {});

  const partnersList = await ApiClient.get('/partners');

  const requests = partnersList.map(({ id }) =>
    ApiClient.get(`/partners/${id}/catalogue/categories/list`),
  );
  Promise.all(requests).then((responses) => {
    responses.forEach((data) => {
      data.forEach((c) => {
        if (hash[c.id]) {
          hash[c.id].count += 1;
        }
      });
    });

    const table = Object.keys(hash).map((key) => {
      const str = hash[key].path.concat([hash[key].count]);
      return str.map((i) => String(i).replace(',', '+')).join(',');
    });

    console.log(table.sort().join('\n'));
  });
};

start();
