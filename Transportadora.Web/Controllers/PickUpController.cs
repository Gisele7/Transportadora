using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;

namespace Transportadora.Web.Controllers
{
    public class PickUpController : Controller
    {
        RepositoryPickUp _RepositoryPickUp = new RepositoryPickUp();
        RepositoryEntregador _RepositoryEntregador = new RepositoryEntregador();
        RepositoryCliente _RepositoryCliente = new RepositoryCliente();
        RepositoryEndereco _RepositoryEndereco = new RepositoryEndereco();
        RepositoryUnidades _RepositoryUnidades = new RepositoryUnidades();

        public void CarregaViewBag()
        {
            ViewData["PccodEntregador"] = new SelectList(_RepositoryEntregador.SelecionarTodos(), "Etcodigo", "Etnome");
            ViewData["PccodCliente"] = new SelectList(_RepositoryCliente.SelecionarTodos(), "Clcodigo", "Clnome");
            ViewData["PccodUnidade"] = new SelectList(_RepositoryUnidades.SelecionarTodos(), "Uncodigo", "Undescricao");
        }
        public IActionResult Index()
        {
            CarregaViewBag();
            return View();
        }

        [HttpPost]
        public IActionResult Index(Pickup pickup)
        {
            try
            {
                _RepositoryPickUp.Incluir(pickup);
                CarregaViewBag();
                return new JsonResult(new { data = pickup, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = pickup, status = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult CreatePickUp([FromBody] Pickup pickup)
        {
            try
            {
                pickup.Pcnumero = _RepositoryPickUp.GerarNumero();
                _RepositoryPickUp.Incluir(pickup);
                CarregaViewBag();
                return new JsonResult(new { data = pickup, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = pickup, status = ex.Message });
            }
        }

        public async Task<IActionResult> GetPickUp(int codCliente)
        {
            var retorno = _RepositoryPickUp.ListarPickUpsPorCliente(codCliente);
            return Ok(retorno);
        }



        public IActionResult SelecionaEndereco(int codCliente)
        {
            var endereco = _RepositoryEndereco.SelecionaEndereco(codCliente);
            return new JsonResult(new { data = endereco });
        }
    }
}
