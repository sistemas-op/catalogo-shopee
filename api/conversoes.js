// /api/conversoes.js
// Uso: /api/conversoes?dias=7
// Mostra vendas/comissões geradas pelos seus links nos últimos N dias.

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const dias = Number(req.query.dias || 7);
  const fimData = new Date();
  const inicioData = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
  const toUnix = (d) => Math.floor(d.getTime() / 1000);

  const query = `query Conversoes($start:Int64,$end:Int64,$limit:Int){
    conversionReport(purchaseTimeStart:$start, purchaseTimeEnd:$end, limit:$limit) {
      nodes {
        orderId
        itemName
        commission
        commissionStatus
        purchaseTime
        subId
      }
    }
  }`;

  try {
    const data = await shopeeQuery(query, {
      start: toUnix(inicioData),
      end: toUnix(fimData),
      limit: 50,
    });
    res.status(200).json({ sucesso: true, periodo: `${dias} dias`, vendas: data.conversionReport.nodes });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
