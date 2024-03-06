using Microsoft.AspNetCore.Mvc;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;
using Transportadora.Web.ViewModel;

namespace Transportadora.Web.Controllers
{
    public class TransporteController : Controller
    {
        RepositoryTransporte _RepositoryTransporte = new RepositoryTransporte();
        public IActionResult IniciarTransporte(int codEntrada)
        {
            try
            {
                return Ok(_RepositoryTransporte.IniciarTransporte(codEntrada));
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public IActionResult GetNumeroRastreio()
        {
            return new JsonResult(new { data = _RepositoryTransporte.SelecionarTodos() });
        }

    }
}
