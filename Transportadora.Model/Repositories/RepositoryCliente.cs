using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public class RepositoryCliente : RepositoryBase<Cliente>, ICliente
    {
        public RepositoryCliente(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public void AlterarCliente(Cliente cliente)
        {
            _DataContext.Entry(cliente).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _DataContext.SaveChanges();

            var endereco = cliente.Endereco.FirstOrDefault();
            _DataContext.Entry(endereco).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _DataContext.SaveChanges();
        }
    }
}
