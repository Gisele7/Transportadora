
using Transportadora.Model.Models;

namespace Transportadora.Web.ViewModel
{
    public class OcorrenciaVM
    {
        public string Descricao { get; set; }
        public int CodTipoOcorrencia { get; set; }
        public string TipoOcorrencia { get; set; }
        public DateTime Data { get; set; }
        public int CodResultadoOcorrencia { get; set; }
        public string ResultadoOcorrencia { get; set; }
        public string CodEntrada { get; set; }

        public OcorrenciaVM()
        {

        }


        public static List<OcorrenciaVM> ListarOcorrencias()
        {
            var db = new TRANSPORTADORAContext();
            var listaRetorno = new List<OcorrenciaVM>();
            var ocorrencias = db.Ocorrencia.ToList();

            foreach (var ocorrencia in ocorrencias)
            {
                var retorno = new OcorrenciaVM()
                {
                    CodEntrada = db.Entrada.FirstOrDefault(x=> x.Ercodigo == ocorrencia.OccodEntrada).Ernumero,
                    CodResultadoOcorrencia = (int)ocorrencia.OccodResultadoOcorrencia,
                    CodTipoOcorrencia = (int)ocorrencia.OccodTipoOcorrencia,
                    Descricao = ocorrencia.Ocdescricao,
                    Data = (DateTime)ocorrencia.Ocdata,
                    ResultadoOcorrencia = db.ResultadoOcorrencia.FirstOrDefault(x => x.Rccodigo == ocorrencia.OccodResultadoOcorrencia).Rcdescricao,
                    TipoOcorrencia = db.TipoOcorrencia.FirstOrDefault(x => x.Tccodigo == ocorrencia.OccodTipoOcorrencia).Tcdescricao
                };

                listaRetorno.Add(retorno);
            }
            return listaRetorno;
        }

    }
}
