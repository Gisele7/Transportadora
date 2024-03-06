using Transportadora.Model.Models;

namespace Transportadora.Web.ViewModel
{
    public class ItensForaRotaVM
    {
        public int CodEntrada { get; set; }
        public Cliente Cliente { get; set; }

        public ItensForaRotaVM()
        {
                
        }

        public static List<ItensForaRotaVM> ListarItensForaRota()
        {
            var db = new TRANSPORTADORAContext();
            var retorno = new List<ItensForaRotaVM>();
            var listaMovimentacoes = db.Movimentacao.Where(x => x.MoforaRota == true).ToList();

            foreach (var item in listaMovimentacoes)
            {
                ItensForaRotaVM itensForaRotaVM = new ItensForaRotaVM();
                var codigoEntrada = db.Transporte.FirstOrDefault(x => x.CecodEntrada == itensForaRotaVM.CodEntrada).CecodEntrada;
                itensForaRotaVM.CodEntrada = db.Entrada.FirstOrDefault(x => x.Ercodigo == codigoEntrada).Ercodigo;

                retorno.Add(itensForaRotaVM);
            }

            return retorno;



        }

    }
}
