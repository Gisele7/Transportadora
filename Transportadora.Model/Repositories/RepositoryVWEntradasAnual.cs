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
    public class RepositoryVWEntradasAnual : RepositoryBase<VwEntradasAnual>, IVWEntradasAnual
    {
        public RepositoryVWEntradasAnual(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public VwEntradasAnual ListaAnualEntradas(int ano)
        {
            return _DataContext.VwEntradasAnual.AsNoTracking().FirstOrDefault((VwEntradasAnual x) => x.Ano == ano);
        }
    }
}
