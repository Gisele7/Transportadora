using Microsoft.AspNetCore.Mvc;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;

namespace Transportadora.Web.Controllers
{
    public class LoginController : Controller
    {
        RepositoryUsuario _RepositoryUsuario = new RepositoryUsuario();



        [HttpPost]
        public async Task<IActionResult> PostLogin([FromBody] Usuario usuario)
        {
            var retorno = _RepositoryUsuario.VerificaLogin(usuario.Usnome, usuario.Ussenha);
            if(retorno != null)
            {
                return new JsonResult(new {data = retorno, status = "Ok"});
            }
            else
            {
                return new JsonResult(new { data = retorno, status = "Erro" });
            }
        }

       
    }
}
