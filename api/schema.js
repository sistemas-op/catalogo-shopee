// /api/schema.js
// TEMPORÁRIO — só para descobrir os campos reais do tipo ConversionReport.
// Depois de resolver o painel de vendas, pode apagar este arquivo.
// Uso: acesse /api/schema no navegador (GET simples, sem parâmetros).

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const query = `query Introspect {
    __type(name: "ConversionReport") {
      name
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
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
