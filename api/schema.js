// /api/schema.js
// TEMPORÁRIO — testa várias combinações de formato para purchaseTimeStart/End
// e reporta qual delas a Shopee aceita. Depois de resolver, pode apagar este arquivo.
// Uso: acesse /api/schema no navegador (GET simples, sem parâmetros).

const { shopeeQuery } = require('./_shopee');

const agora = Date.now();
const seteDiasMs = 7 * 24 * 60 * 60 * 1000;

const candidatos = [
  { nome: 'segundos como number',      start: Math.floor((agora - seteDiasMs) / 1000),           end: Math.floor(agora / 1000) },
  { nome: 'segundos como string',      start: String(Math.floor((agora - seteDiasMs) / 1000)),   end: String(Math.floor(agora / 1000)) },
  { nome: 'milissegundos como number', start: agora - seteDiasMs,                                 end: agora },
  { nome: 'milissegundos como string', start: String(agora - seteDiasMs),                         end: String(agora) },
];

const query = `query Conversoes($start:Int64,$end:Int64,$limit:Int){
  conversionReport(purchaseTimeStart:$start, purchaseTimeEnd:$end, limit:$limit) {
    nodes { purchaseTime conversionStatus totalCommission }
  }
}`;

module.exports = async (req, res) => {
  const resultados = [];
  for (const c of candidatos) {
    try {
      const data = await shopeeQuery(query, { start: c.start, end: c.end, limit: 5 });
      resultados.push({ formato: c.nome, sucesso: true, totalEncontrado: data.conversionReport.nodes.length });
    } catch (err) {
      resultados.push({ formato: c.nome, sucesso: false, erro: err.message, detalhes: err.details });
    }
  }
  res.status(200).json({ resultados });
};
