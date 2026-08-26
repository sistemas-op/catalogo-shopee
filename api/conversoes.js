// /api/conversoes.js
// Uso: /api/conversoes?dias=7
// Mostra vendas/comissões geradas pelos seus links nos últimos N dias.

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const dias = Number(req.query.dias || 7);
  const fim = new Date();
  const inicio = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().slice(0, 10);

  const query = `query Conversoes($start:String,$end:String,$page:Int,$limit:Int){
    conversionReport(purchaseTimeStart:$start, purchaseTimeEnd:$end, page:$page, limit:$limit) {
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
      start: fmt(inicio),
      end: fmt(fim),
      page: 0,
      limit: 50,
    });
    res.status(200).json({ sucesso: true, periodo: `${fmt(inicio)} a ${fmt(fim)}`, vendas: data.conversionReport.nodes });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
