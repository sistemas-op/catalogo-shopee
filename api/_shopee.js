const crypto = require('crypto');

const SHOPEE_ENDPOINT = 'https://open-api.affiliate.shopee.com.br/graphql';

async function shopeeQuery(query, variables = {}) {
  const appId = process.env.SHOPEE_APP_ID;
  const secret = process.env.SHOPEE_SECRET;

  if (!appId || !secret) {
    throw new Error('Faltam SHOPEE_APP_ID / SHOPEE_SECRET nas variáveis de ambiente.');
  }

  const bodyObj = { query, operationName: null, variables };
  const payload = JSON.stringify(bodyObj);
  const timestamp = Math.floor(Date.now() / 1000);
  const factor = `${appId}${timestamp}${payload}${secret}`;
  const signature = crypto.createHash('sha256').update(factor).digest('hex');

  const res = await fetch(SHOPEE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `SHA256 Credential=${appId},Timestamp=${timestamp},Signature=${signature}`,
    },
    body: payload,
  });

  const data = await res.json();
  if (data.errors) {
    const err = new Error('Shopee API retornou erro');
    err.details = data.errors;
    throw err;
  }
  return data.data;
}

module.exports = { shopeeQuery };
