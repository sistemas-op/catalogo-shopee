// /api/campanhas.js
// Uso: /api/campanhas
// Lista campanhas/promoções ativas da Shopee — bom pra roteiro com "só hoje", "promoção relâmpago" etc.

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const query = `query Campanhas($page:Int,$limit:Int){
    shopeeOfferV2(page:$page, limit:$limit) {
      nodes {
        offerName
        offerLink
        startTime
        endTime
        categoryName
      }
    }
  }`;

  try {
    const data = await shopeeQuery(query, { page: 0, limit: 20 });
    res.status(200).json({ sucesso: true, campanhas: data.shopeeOfferV2.nodes });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message, detalhes: err.details });
  }
};
