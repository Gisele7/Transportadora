using Microsoft.AspNetCore.Mvc;
using Transportadora.Web.ViewModel;

namespace Transportadora.Web.Controllers
{
    public class RastreioController : Controller
    {
        public IActionResult GetEntradasNaoIniciadas()
        {
            try
            {
                var entradasIniciadas = EntradaVM.ListarTransportesNaoIniciadosPorUsuario();
                return Ok(entradasIniciadas);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public IActionResult GetRastreio(int codEntrada)
        {
            return new JsonResult(new { data = RastreioVM.GetRastreio(codEntrada) });
        }

        public IActionResult GetMapa(int codEntrada)
        {
            return new JsonResult(new { data = RastreioVM.GetMapa(codEntrada) });
        }

        public IActionResult GetEntradasPorCliente(string CPFCNPJ)
        {
            return new JsonResult(new { data = EntradaVM.ListarEntradasPorCPF(CPFCNPJ) });
        }
    }
}
