using Transportadora.Model.Models;

namespace Transportadora.Web.ViewModel
{
    public class ClienteVM
    {
        //Cliente
        public int Codigo { get; set; }
        public string Nome { get; set; }
        public int? CodTipoCliente { get; set; }
        public string TipoCliente { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public string CNPJ { get; set; }
        public string Telefone { get; set; }
        public string RG { get; set; }
        public string NomeMae { get; set; }
        public string NomePai { get; set; }
        public DateTime? DataNascimento { get; set; }
        public DateTime? DataCadastro { get; set; }
        public string Sexo { get; set; }

        //Endereco
        public int CodigoEndereco { get; set; }
        public int? CodCliente { get; set; }
        public int? CodTipoLogradouro { get; set; }
        public string Logradouro { get; set; }
        public string Numero { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string CEP { get; set; }
        public int? CodRegiao { get; set; }

        public ClienteVM()
        {

        }

        public static ClienteVM SelecionaCliente(int codCliente)
        {
            var db = new TRANSPORTADORAContext();
            var cliente = db.Cliente.Find(codCliente);

            var endereco = db.Endereco.FirstOrDefault(x => x.EncodCliente == codCliente);

            var retorno = new ClienteVM()
            {
                Bairro = endereco.Enbairro,
                CEP = endereco.Encep,
                Cidade = endereco.Encidade,
                CNPJ = cliente.Clcnpj,
                CodCliente = cliente.Clcodigo,
                Codigo = cliente.Clcodigo,
                CodigoEndereco = endereco.Encodigo,
                CodRegiao = endereco.EncodRegiao,
                CodTipoCliente = cliente.ClcodTipoCliente,
                RG = cliente.Clrg,
                TipoCliente = db.TipoCliente.FirstOrDefault(x => x.Tccodigo == cliente.ClcodTipoCliente).Tcdescricao,
                Nome = cliente.Clnome,
                Numero = endereco.Ennumero,
                Sexo = cliente.Clsexo,
                Telefone = cliente.Cltelefone,
                CodTipoLogradouro = endereco.EncodTipoLogradouro,
                Complemento = endereco.Encomplemento,
                CPF = cliente.Clcpf,
                DataCadastro = cliente.CldataCadastro,
                DataNascimento = cliente.CldataNascimento,
                Email = cliente.Clemail,
                Estado = endereco.Enestado,
                Latitude = endereco.Enlatitude,
                Longitude = endereco.EnLongitude,
                Logradouro = endereco.Enlogradouro,
            };

            return retorno;
        }

        public static List<ClienteVM> ListarClientes(string nome = null, string telefone = null, string cpf = null)
        {
            var db = new TRANSPORTADORAContext();
            var listaRetorno = new List<ClienteVM>();

            if (nome != null || telefone != null || cpf != null)
            {
                var clientes = db.Cliente.ToList();
                if (nome != null)
                {
                    clientes = clientes.Where(x => x.Clnome.Contains(nome)).ToList();
                }

                if (telefone != null)
                {
                    clientes = clientes.Where(x => x.Cltelefone != null && x.Cltelefone.Contains(telefone)).ToList();
                }
                if (cpf != null)
                {
                    clientes = clientes.Where(x => x.Clcpf.Contains(cpf)).ToList();
                }

                foreach (var cliente in clientes)
                {
                    var endereco = db.Endereco.FirstOrDefault(x => x.EncodCliente == cliente.Clcodigo);
                    var retorno = new ClienteVM()
                    {
                        Bairro = endereco.Enbairro,
                        CEP = endereco.Encep,
                        Cidade = endereco.Encidade,
                        CNPJ = cliente.Clcnpj,
                        CodCliente = cliente.Clcodigo,
                        Codigo = cliente.Clcodigo,
                        CodigoEndereco = endereco.Encodigo,
                        CodRegiao = endereco.EncodRegiao,
                        RG = cliente.Clrg,
                        CodTipoCliente = cliente.ClcodTipoCliente,
                        TipoCliente = db.TipoCliente.FirstOrDefault(x => x.Tccodigo == cliente.ClcodTipoCliente).Tcdescricao,
                        Sexo = cliente.Clsexo,
                        Nome = cliente.Clnome,
                        Telefone = cliente.Cltelefone,
                        CodTipoLogradouro = endereco.EncodTipoLogradouro,
                        Complemento = endereco.Encomplemento,
                        CPF = cliente.Clcpf,
                        DataCadastro = cliente.CldataCadastro,
                        DataNascimento = cliente.CldataNascimento,
                        Email = cliente.Clemail,
                        Estado = endereco.Enestado,
                        Latitude = endereco.Enlatitude,
                        Longitude = endereco.EnLongitude,
                        Logradouro = endereco.Enlogradouro,

                        //Adicionar campos
                    };

                    listaRetorno.Add(retorno);
                }
            }

            return listaRetorno;
        }

    }
}
