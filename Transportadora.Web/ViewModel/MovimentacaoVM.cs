using Transportadora.Model.Models;

namespace Transportadora.Web.ViewModel
{
    public class MovimentacaoVM
    {
        public int? CodTransporte { get; set; }
        public string Rastreio{ get; set; }
        public int CodUnidade { get; set; }
        public int CodCliente { get; set; }
        public string NomeCliente { get; set; }
        public string Unidade { get; set; }
        public string TipoMovimentacao{ get; set; }
        public int? CodEntregador { get; set; }
        public string Entregador { get; set; }
        public string Status { get; set; }
        public bool? ForaRota{ get; set; }
        public string DestinatarioAusente{ get; set; }

        public MovimentacaoVM()
        {
                
        }

        public static List<MovimentacaoVM> BuscarMovimentacao(string codRastreio)
        {
            var db = new TRANSPORTADORAContext();
            var transporte = db.Transporte.FirstOrDefault(x => x.CecodigoRastreio == codRastreio);
            var retorno = new List<MovimentacaoVM>();
            var listaMovimentacoes = db.Movimentacao.Where(x => x.MocodTransporte == transporte.Cecodigo).ToList();

            foreach (var item in listaMovimentacoes)
            {
                MovimentacaoVM movimentacaoVM = new MovimentacaoVM();

                movimentacaoVM.TipoMovimentacao = item.MotipoMovimentacao == "E" ? "Entrada" : "Saída";
                movimentacaoVM.CodTransporte = (int)item.MocodTransporte;
                movimentacaoVM.CodEntregador = item.MocodEntregador;
                movimentacaoVM.ForaRota = item.MoforaRota;
                movimentacaoVM.DestinatarioAusente = item.MoclienteNaoEncontrado == true ?  "Destinatário Ausente" : "";
                if(item.MocodEntregador != null)
                {
                movimentacaoVM.Entregador = db.Entregadores.FirstOrDefault(x => x.Etcodigo == item.MocodEntregador).Etnome;
                }
                movimentacaoVM.CodUnidade = (int)item.MocodUnidade;
                movimentacaoVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.MocodUnidade).Undescricao;
                movimentacaoVM.Rastreio = transporte.CecodigoRastreio;
                movimentacaoVM.Status = db.Status.FirstOrDefault(x => x.Stcodigo == transporte.CecodStatus).Stdescricao;

                retorno.Add(movimentacaoVM);
            }

            return retorno;

        }


    }
}
