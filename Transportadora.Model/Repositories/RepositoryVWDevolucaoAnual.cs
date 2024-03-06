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
    public class RepositoryVWDevolucaoAnual : RepositoryBase<VwDevolucaoAnual>, IVWDevolucaoAnual
    {
        public RepositoryVWDevolucaoAnual(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public VwDevolucaoAnual ListaAnualDevolucoes(int ano)
        {
            return _DataContext.VwDevolucaoAnual.AsNoTracking().FirstOrDefault((VwDevolucaoAnual x) => x.Ano == ano);
        }
    }
}
