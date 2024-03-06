using Transportadora.Model.Models;

namespace Transportadora.Web.ViewModel
{
    public class VeiculoVM
    {
        public int Codigo { get; set; }
        public string Descricao { get; set; }
        public string Tipo { get; set; }
        public string Placa { get; set; }
        public int Ano { get; set; }
        public string CorPredominante { get; set; }
        public int CodUnidade { get; set; }
        public string Unidade { get; set; }


        public VeiculoVM()
        {

        }

        public static List<VeiculoVM> ListarVeiculos()
        {
            var retorno = new List<VeiculoVM>();
            var db = new TRANSPORTADORAContext();

            foreach (var item in db.Veiculo.ToList().Take(50))
            {
                var veiculoVM = new VeiculoVM();
                veiculoVM.Codigo = item.Vecodigo; 
                veiculoVM.Descricao = item.Vedescricao;
                veiculoVM.Tipo = item.Vetipo;
                veiculoVM.Placa = item.Veplaca;
                veiculoVM.Ano = (int)item.Veano;
                veiculoVM.CorPredominante = item.VecorPredominante;
                veiculoVM.CodUnidade = (int)item.VecodUnidade; ;
                veiculoVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.VecodUnidade).Undescricao;

                retorno.Add(veiculoVM);
            }
            return retorno;
        }


        public static VeiculoVM SelecionarVeiculo(int codVeiculo)
        {
            var db = new TRANSPORTADORAContext();
            var veiculo = db.Veiculo.FirstOrDefault(x => x.Vecodigo == codVeiculo);
            var retorno = new VeiculoVM();

            if (veiculo != null)
            {
                retorno.Codigo = veiculo.Vecodigo;
                retorno.Descricao = veiculo.Vedescricao;
                retorno.Tipo = veiculo.Vetipo;
                retorno.Placa = veiculo.Veplaca;
                retorno.Ano = (int)veiculo.Veano;
                retorno.CorPredominante = veiculo.VecorPredominante;
                retorno.CodUnidade = (int)veiculo.VecodUnidade; ;
                retorno.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == veiculo.VecodUnidade).Undescricao;
            }

            return retorno;
        }
    }
}
