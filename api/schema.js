// /api/schema.js
// TEMPORÁRIO — descobre os campos de ConversionReport E do tipo aninhado em "orders".
// Depois de resolver o painel de vendas, pode apagar este arquivo.
// Uso: acesse /api/schema no navegador (GET simples, sem parâmetros).

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const queryPai = `query Introspect {
    __type(name: "ConversionReport") {
      name
      fields {
        name
        type {
          kind
          name
          ofType { kind name ofType { kind name } }
        }
      }
    }
  }`;

  try {
    const dataPai = await shopeeQuery(queryPai, {});
    const campoOrders = dataPai.__type.fields.find((f) => f.name === 'orders');

    // Descobre o nome real do tipo dentro da lista "orders"
    let nomeTipoFilho = null;
    let t = campoOrders && campoOrders.type;
    for (let i = 0; i < 4 && t; i++) {
      if (t.name) { nomeTipoFilho = t.name; break; }
      t = t.ofType;
    }

    let filhoSchema = null;
    if (nomeTipoFilho) {
      const queryFilho = `query IntrospectFilho($n:String!) {
        __type(name: $n) {
          name
          fields { name type { kind name ofType { kind name } } }
        }
      }`;
      const dataFilho = await shopeeQuery(queryFilho, { n: nomeTipoFilho });
      filhoSchema = dataFilho.__type;
    }

    res.status(200).json({
      sucesso: true,
      conversionReport: dataPai.__type,
      nomeTipoDentroDeOrders: nomeTipoFilho,
      camposDeOrders: filhoSchema,
    });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
