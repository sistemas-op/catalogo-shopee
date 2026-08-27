// /api/schema.js
// TEMPORÁRIO — verifica se o tipo do produto (retornado por productOfferV2) tem
// campos de múltiplas fotos, além do imageUrl único que já usamos.
// Uso: acesse /api/schema no navegador (GET simples, sem parâmetros).

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const query = `query Introspect {
    __type(name: "ProductOfferV2") {
      name
      fields {
        name
        type { kind name ofType { kind name ofType { kind name } } }
      }
    }
  }`;

  try {
    const data = await shopeeQuery(query, {});
    res.status(200).json({ sucesso: true, schema: data.__type });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
