using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Models;

namespace Transportadora.Model.Interfaces
{
    public interface IDistancia : InterfaceModel<DistanciaUnidade>
    {
        public void IncluirLista(List<DistanciaUnidade> lista);
         
    }
}
