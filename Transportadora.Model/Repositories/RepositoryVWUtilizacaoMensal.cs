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
    public class RepositoryVWUtilizacaoMensal : RepositoryBase<VwUtilizacaoMes>, IVWUtilizacaoMensal
    {
        public RepositoryVWUtilizacaoMensal(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public List<VwUtilizacaoMes> ListaMensalUtilizacao(int ano, int mes)
        {
            return _DataContext.VwUtilizacaoMes.AsNoTracking().Where((VwUtilizacaoMes x) => x.Ano == ano && x.Mes == mes).ToList();
        }
    }
}
