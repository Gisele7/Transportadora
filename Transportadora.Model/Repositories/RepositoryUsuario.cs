using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public class RepositoryUsuario : RepositoryBase<Usuario>, IUsuario
    {
        public RepositoryUsuario(bool SaveChanges = true) : base(SaveChanges)
        {

        }


        public Usuario VerificaLogin(string usuario, string senha)
        {
            try
            {
            return _DataContext.Usuario.FirstOrDefault(x => x.Usnome == usuario && x.Ussenha == senha);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

       
    }
}
