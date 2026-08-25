// Uso: /api/produtos?termo=fone+bluetooth&comissaoMin=10&sortType=5
// sortType: 1=Relevância 2=Mais vendidos 3=Maior preço 4=Menor preço 5=Maior comissão

const { shopeeQuery } = require('./_shopee');

module.exports = async (req, res) => {
  const termo = req.query.termo || '';
  const comissaoMin = Number(req.query.comissaoMin || 0); // em %
  const sortType = Number(req.query.sortType || 5);

  const query = `query Buscar($keyword:String,$sortType:Int,$page:Int,$limit:Int){
    productOfferV2(keyword:$keyword, sortType:$sortType, page:$page, limit:$limit) {
      nodes {
        itemId
        productName
