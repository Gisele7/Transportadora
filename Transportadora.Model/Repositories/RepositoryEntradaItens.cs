using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public class RepositoryEntradaItens : RepositoryBase<EntradaItens>, IEntradaItens
    {
        public RepositoryEntradaItens(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public List<EntradaItens> ListarItensEntrada(int codigoEntrada)
        {
            return _DataContext.EntradaItens.AsNoTracking().Where(x => x.EicodEntrada == codigoEntrada).ToList();
        }

    }
}
