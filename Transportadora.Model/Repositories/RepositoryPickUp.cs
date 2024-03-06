using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public class RepositoryPickUp : RepositoryBase<Pickup>, IPickUp
    {
        public RepositoryPickUp(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public List<Pickup> ListarPickUpsPorCliente(int codCliente)
        {
            return _DataContext.Pickup.Where(x => x.PccodCliente == codCliente).ToList();
        }

        public string GerarNumero()
        {
            var contador = _DataContext.Pickup.Where(x => x.Pcdata.Value.Month == DateTime.Now.Month && x.Pcdata.Value.Year == DateTime.Now.Year).Count();
            if (contador == 0)
            {
                return "PC/001/" + DateTime.Now.Month.ToString().PadLeft(2, '0') + "/" + DateTime.Now.Year.ToString();
            }
            else
            {
                return "PC/" + contador.ToString().PadLeft(3, '0') + "/" + DateTime.Now.Month.ToString().PadLeft(2, '0') + "/" + DateTime.Now.Year.ToString();
            }
        }
    }
}
