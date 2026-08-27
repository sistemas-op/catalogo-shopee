// /api/produtos.js
// Uso: /api/produtos?termo=fone+bluetooth&comissaoMin=10&sortType=5
// sortType: 1=Relevância 2=Mais vendidos 3=Maior preço 4=Menor preço 5=Maior comissão

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  // A Shopee só respeita "sortType" quando existe keyword de busca.
  // Sem termo digitado, usamos uma palavra-chave ampla como padrão.
  const termo = req.query.termo || 'promoção';
  const comissaoMin = Number(req.query.comissaoMin || 0); // em %
  const sortType = Number(req.query.sortType || 5);

  const query = `query Buscar($keyword:String,$sortType:Int,$page:Int,$limit:Int){
    productOfferV2(keyword:$keyword, sortType:$sortType, page:$page, limit:$limit) {
      nodes {
        itemId
        productName
        priceMin
        priceMax
        commissionRate
        commission
        sales
        periodStartTime
        periodEndTime
        productLink
        offerLink
        imageUrl
      }
    }
  }`;

  try {
    const data = await shopeeQuery(query, { keyword: termo, sortType, page: 0, limit: 20 });
    let produtos = data.productOfferV2.nodes;

    if (comissaoMin > 0) {
      produtos = produtos.filter((p) => Number(p.commissionRate) * 100 >= comissaoMin);
    }

    res.status(200).json({ sucesso: true, total: produtos.length, produtos });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
