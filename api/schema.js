// /api/schema.js
// TEMPORÁRIO — descobre os campos de ConversionReport -> orders -> items.
// Depois de resolver o painel de vendas, pode apagar este arquivo.
// Uso: acesse /api/schema no navegador (GET simples, sem parâmetros).

const { shopeeQuery } = require('./_shopee');

function unwrapNome(tipo) {
  let t = tipo;
  for (let i = 0; i < 5 && t; i++) {
    if (t.name) return t.name;
    t = t.ofType;
  }
  return null;
}

async function introspectTipo(nome) {
  const query = `query IntrospectTipo($n:String!) {
    __type(name: $n) {
      name
      fields { name type { kind name ofType { kind name ofType { kind name } } } }
    }
  }`;
  const data = await shopeeQuery(query, { n: nome });
  return data.__type;
}

module.exports = async (req, res) => {
  try {
    const conversionReport = await introspectTipo('ConversionReport');
    const campoOrders = conversionReport.fields.find((f) => f.name === 'orders');
    const nomeOrder = unwrapNome(campoOrders.type);

    const orderSchema = nomeOrder ? await introspectTipo(nomeOrder) : null;
    const campoItems = orderSchema && orderSchema.fields.find((f) => f.name === 'items');
    const nomeItem = campoItems ? unwrapNome(campoItems.type) : null;

    const itemSchema = nomeItem ? await introspectTipo(nomeItem) : null;

    res.status(200).json({
      sucesso: true,
      conversionReport,
      order: { nome: nomeOrder, schema: orderSchema },
      item: { nome: nomeItem, schema: itemSchema },
    });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
