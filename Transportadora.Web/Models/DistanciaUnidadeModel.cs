using Transportadora.Model.Models;

namespace Transportadora.Web.Models
{
    public class DistanciaUnidadeModel
    {
        public Unidades Origem { get; set; }
        public Unidades Destino { get; set; }
        public Endereco EndOrigem { get; set; }
        public Endereco EndDestino { get; set; }
        public decimal? Distancia { get; set; }

        public DistanciaUnidadeModel()
        {
            
        }

        public static DistanciaUnidadeModel BuscarUnidadeMaisPerto(int codRegiao, int codUnidade,bool hub = false)
        {
            var db = new TRANSPORTADORAContext();
            var retorno = new DistanciaUnidadeModel();

            var distanciaUnidade = (from p in db.DistanciaUnidade
                                    join origem in db.Unidades on p.DucodUnidadeOrigem equals origem.Uncodigo
                                    join destino in db.Unidades on p.DucodUnidadeDestino equals destino.Uncodigo
                                    join endOrigem in db.Endereco on origem.Uncodigo equals endOrigem.EncodUnidade
                                    join endDestino in db.Endereco on destino.Uncodigo equals endDestino.EncodUnidade
                                    where endDestino.EncodRegiao == codRegiao && destino.Unhub == hub  && p.DucodUnidadeDestino != codUnidade
                                    orderby p.Dudistancia select new DistanciaUnidadeModel { Distancia = p.Dudistancia, Origem = origem, Destino = destino, EndOrigem = endOrigem, EndDestino = endDestino }).FirstOrDefault();


            return distanciaUnidade;
        }

        public static DistanciaUnidade BuscaDistancia(int unidadeOrigem, int unidadeDestino)
        {
            var db = new TRANSPORTADORAContext();
            return db.DistanciaUnidade.FirstOrDefault(x => x.DucodUnidadeOrigem == unidadeOrigem && x.DucodUnidadeDestino == unidadeDestino);
        }

        public static DistanciaUnidadeModel BuscarUnidadeMaisPertoPorUnidade(int codUnidade, int codRegiao)
        {
            var db = new TRANSPORTADORAContext();
            var retorno = new DistanciaUnidadeModel();

            var distanciaUnidade = (from p in db.DistanciaUnidade
                                    join origem in db.Unidades on p.DucodUnidadeOrigem equals origem.Uncodigo
                                    join destino in db.Unidades on p.DucodUnidadeDestino equals destino.Uncodigo
                                    join endOrigem in db.Endereco on origem.Uncodigo equals endOrigem.EncodUnidade
                                    join endDestino in db.Endereco on destino.Uncodigo equals endDestino.EncodUnidade
                                    where endDestino.EncodRegiao == codRegiao && p.DucodUnidadeOrigem == codUnidade
                                    orderby p.Dudistancia
                                    select new DistanciaUnidadeModel { Distancia = p.Dudistancia, Origem = origem, Destino = destino, EndOrigem = endOrigem, EndDestino = endDestino }).FirstOrDefault();

            return distanciaUnidade;
        }
    }
}
