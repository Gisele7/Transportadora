using System.ComponentModel.DataAnnotations;
using Transportadora.Model.Models;

namespace Transportadora.Web.ViewModel
{
    public class RastreioVM
    {
        public int CodigoEntrada { get; set; }
        public string CodigoRastreio { get; set; }
        public DateTime DataMovimentacao { get; set; }
        public int CodUnidade { get; set; }
        public string Unidade { get; set; }
        public string Tipo { get; set; }
        public string Entregador { get; set; }
        public DateTime? DataEntrega { get; set; }
        public string Status { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? LatitudeCliente { get; set; }
        public decimal? LongitudeCliente { get; set; }
        public int CodUnidadeDestino { get; set; }
        public string UnidadeDestino { get; set; }

        public RastreioVM()
        {

        }

        public static List<RastreioVM> GetRastreio(int codEntrada)
        {
            var retorno = new List<RastreioVM>();
            var db = new TRANSPORTADORAContext();
            var codigoRastreio = db.Transporte.FirstOrDefault(x => x.CecodEntrada == codEntrada).Cecodigo;
            var listaMovimentacoes = db.Movimentacao.Where(x => x.MocodTransporte == codigoRastreio).ToList();

            foreach (var item in listaMovimentacoes)
            {
                RastreioVM rastreioVM = new RastreioVM();
                rastreioVM.CodigoEntrada = codEntrada;
                rastreioVM.DataMovimentacao = (DateTime)item.MoDataHora;
                rastreioVM.CodUnidade = (int)item.MocodUnidade;
                rastreioVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.MocodUnidade).Undescricao;
                rastreioVM.Tipo = item.MotipoMovimentacao;
                rastreioVM.Latitude = db.Endereco.FirstOrDefault(x => x.EncodUnidade == item.MocodUnidade).Enlatitude;
                rastreioVM.Longitude = db.Endereco.FirstOrDefault(x => x.EncodUnidade == item.MocodUnidade).EnLongitude;

                if (item.MotipoMovimentacao == "S")
                {
                    rastreioVM.Tipo = "Saída";
                }
                else if (item.MotipoMovimentacao == "E")
                {
                    rastreioVM.Tipo = "Entrada";
                }
                if (item.MocodEntregador != null)
                {
                    rastreioVM.Entregador = db.Entregadores.FirstOrDefault(x => x.Etcodigo == item.MocodEntregador).Etnome;
                }
                rastreioVM.DataEntrega = item.MoDataEntrega;
                if (item.MocodEntregador != null && item.MoDataEntrega == null)
                {
                    rastreioVM.Status = "Em rota de entrega";
                }
                else if (item.MocodEntregador != null && item.MoDataEntrega != null)
                {
                    rastreioVM.Status = "Encomenda entregue";
                }
                else
                {
                    rastreioVM.Status = "Em transferência";
                }

                retorno.Add(rastreioVM);
            }
            return retorno;
        }

        public static RastreioVM GetMapa(int codEntrada)
        {
            var db = new TRANSPORTADORAContext();
            var entrada = db.Entrada.FirstOrDefault(x => x.Ercodigo == codEntrada);

            var retorno = new RastreioVM()
            {
                CodUnidade = (int)entrada.ErcodUnidade,
                Unidade = db.Unidades.FirstOrDefault(x=> x.Uncodigo == entrada.ErcodUnidade).Undescricao,
                CodUnidadeDestino = (int)entrada.ErcodUnidadeDestino,
                UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == entrada.ErcodUnidadeDestino).Undescricao,
                Latitude = db.Endereco.FirstOrDefault(x => x.EncodUnidade == entrada.ErcodUnidade).Enlatitude,
                Longitude = db.Endereco.FirstOrDefault(x => x.EncodUnidade == entrada.ErcodUnidade).EnLongitude,
                LatitudeCliente = db.Endereco.FirstOrDefault(x => x.EncodCliente == entrada.ErcodCliente).Enlatitude,
                LongitudeCliente = db.Endereco.FirstOrDefault(x => x.EncodCliente == entrada.ErcodCliente).EnLongitude

            };

            return retorno;
        }

    }
}
