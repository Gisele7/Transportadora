using Transportadora.Model.Models;

namespace Transportadora.Web.ViewModel
{
    public class UnidadeVM
    {
        public int Uncodigo { get; set; }
        public string Undescricao { get; set; }
        public string Uncidade { get; set; }
        public string Unestado { get; set; }

        public int Encodigo { get; set; }
        public int? EncodCliente { get; set; }
        public int? EncodUnidade { get; set; }
        public int? CodRegiao { get; set; }
        public string CEP { get; set; }
        public string Logradouro { get; set; }
        public string? Complemento { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string UF { get; set; }
        public string Numero { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        public bool Hub { get; set; } = false;


        public UnidadeVM()
        {

        }
        public static List<UnidadeVM> ListarUnidades()
        {
            var db = new TRANSPORTADORAContext();
            return (from p in db.Unidades
                    join q in db.Endereco on p.Uncodigo equals q.EncodUnidade
                    select new UnidadeVM
                    {
                        Uncodigo = p.Uncodigo,
                        Latitude = q.Enlatitude,
                        Longitude = q.EnLongitude,
                        Undescricao = p.Undescricao,
                        CodRegiao = q.EncodRegiao,
                        CEP = q.Encep,
                        Cidade = q.Encidade,
                        UF = q.Enestado,
                        Logradouro = q.Enlogradouro,
                        Bairro = q.Enbairro,
                        Numero = q.Ennumero,
                        Complemento = q.Encomplemento,
                        Encodigo = q.Encodigo,
                        Hub = p.Unhub

                    }).ToList();
        }

        public static UnidadeVM SelecionaUnidade(int codUnidade)
        {
            var db = new TRANSPORTADORAContext();
            return (from p in db.Unidades
                    join q in db.Endereco on p.Uncodigo equals q.EncodUnidade
                    where p.Uncodigo == codUnidade
                    select new UnidadeVM
                    {
                        Uncodigo = p.Uncodigo,
                        Latitude = q.Enlatitude,
                        Longitude = q.EnLongitude,
                        Undescricao = p.Undescricao,
                        CEP = q.Encep,
                        CodRegiao = q.EncodRegiao,
                        Cidade = q.Encidade,
                        UF = q.Enestado,
                        Logradouro = q.Enlogradouro,
                        Bairro = q.Enbairro,
                        Numero = q.Ennumero,
                        Complemento = q.Encomplemento,
                        Encodigo = q.Encodigo,
                        Hub = p.Unhub
                    }).FirstOrDefault();

        }

        public static UnidadeVM SelecionaHUB(int codRegiao, string siglaEstado)
        {

            var db = new TRANSPORTADORAContext();
            return (from p in db.Unidades
                    join q in db.Endereco on p.Uncodigo equals q.EncodUnidade
                    where p.Unhub == true && q.EncodRegiao == codRegiao && q.Enestado == siglaEstado
                    select new UnidadeVM
                    {
                        Uncodigo = p.Uncodigo,
                        Latitude = q.Enlatitude,
                        Longitude = q.EnLongitude,
                        Undescricao = p.Undescricao,
                        CEP = q.Encep,
                        CodRegiao = q.EncodRegiao,
                        Cidade = q.Encidade,
                        UF = q.Enestado,
                        Logradouro = q.Enlogradouro,
                        Bairro = q.Enbairro,
                        Numero = q.Ennumero,
                        Complemento = q.Encomplemento,
                        Encodigo = q.Encodigo,
                        Hub = p.Unhub
                    }).FirstOrDefault();


        }

    }
}