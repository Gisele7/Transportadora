using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public  class RepositoryEndereco : RepositoryBase<Endereco>, IEndereco
    {
        public RepositoryEndereco(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public Endereco SelecionaEndereco(int codCliente)
        {
            return _DataContext.Endereco.FirstOrDefault(x => x.EncodCliente == codCliente);
        }

        public Endereco SelecionaEnderecoUnidade(int codUnidade)
        {
            return _DataContext.Endereco.FirstOrDefault(x => x.EncodUnidade == codUnidade);
        }
    }
}
