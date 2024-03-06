using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public  class RepositoryDistancia : RepositoryBase<DistanciaUnidade>, IDistancia
    {
        public RepositoryDistancia(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public void IncluirLista(List<DistanciaUnidade> lista)
        {
            var db = new TRANSPORTADORAContext();
            var listaDistanciaUnidade = db.DistanciaUnidade.ToList();
            db.DistanciaUnidade.RemoveRange(listaDistanciaUnidade);
            db.SaveChanges();
            foreach (var item in lista)
            {
                db.Entry(item).State = Microsoft.EntityFrameworkCore.EntityState.Added;
                db.SaveChanges();
            }
            //_DataContext.AddRange(lista);
            //_DataContext.SaveChanges();
        }
    }
}
