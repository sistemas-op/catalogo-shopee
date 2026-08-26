// /api/conversoes.js
// Uso: /api/conversoes?dias=7
// Mostra vendas/comissões geradas pelos seus links nos últimos N dias.
// Estrutura real da Shopee: conversionReport -> orders -> items (por isso "achatamos"
// tudo em uma lista de "vendas", uma linha por item vendido).

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const dias = Number(req.query.dias || 7);
  const fimData = new Date();
  const inicioData = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
  const toUnix = (d) => Math.floor(d.getTime() / 1000);

  const query = `query Conversoes($start:Int64,$end:Int64,$limit:Int){
    conversionReport(purchaseTimeStart:$start, purchaseTimeEnd:$end, limit:$limit) {
      nodes {
        purchaseTime
        conversionStatus
        totalCommission
        netCommission
        orders {
          orderId
          orderStatus
          items {
            itemName
            itemPrice
            qty
            imageUrl
            itemCommission
            itemTotalCommission
          }
        }
      }
    }
  }`;

  try {
    const data = await shopeeQuery(query, {
      start: toUnix(inicioData),
      end: toUnix(fimData),
      limit: 50,
    });

    // Achata: cada item de cada pedido vira uma linha de venda
    const vendas = [];
    for (const node of data.conversionReport.nodes) {
      for (const order of node.orders || []) {
        for (const item of order.items || []) {
          vendas.push({
            purchaseTime: node.purchaseTime,
            conversionStatus: node.conversionStatus,
            orderId: order.orderId,
            orderStatus: order.orderStatus,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            qty: item.qty,
            imageUrl: item.imageUrl,
            itemCommission: item.itemCommission,
            itemTotalCommission: item.itemTotalCommission,
          });
        }
      }
    }

    res.status(200).json({ sucesso: true, periodo: `${dias} dias`, vendas });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
