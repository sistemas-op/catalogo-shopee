// /api/schema.js
// TEMPORÁRIO — descobre o tipo EXATO de cada argumento aceito por conversionReport.
// Depois de resolver o painel de vendas, pode apagar este arquivo.
// Uso: acesse /api/schema no navegador (GET simples, sem parâmetros).

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const query = `query IntrospectArgs {
    __schema {
      queryType {
        fields {
          name
          args {
            name
            type {
              kind
              name
              ofType { kind name ofType { kind name } }
            }
          }
        }
      }
    }
  }`;

  try {
    const data = await shopeeQuery(query, {});
    const campo = data.__schema.queryType.fields.find((f) => f.name === 'conversionReport');
    res.status(200).json({ sucesso: true, argumentosDeConversionReport: campo });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
