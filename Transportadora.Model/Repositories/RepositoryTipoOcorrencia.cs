using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public  class RepositoryTipoOcorrencia : RepositoryBase<TipoOcorrencia>, ITipoOcorrencia
    {
        public RepositoryTipoOcorrencia(bool SaveChanges = true) : base(SaveChanges)
        {

        }
    }
}
