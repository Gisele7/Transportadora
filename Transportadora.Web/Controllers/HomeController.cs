using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Transportadora.Model.Repositories;
using Transportadora.Web.Models;
using Transportadora.Web.ViewModel;

namespace Transportadora.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
     
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }


        public IActionResult ListarTransportesNaoIniciados(int ano, int mes)
         {
            try
            {
                return Ok(EntradaVM.ListarTransportesNaoIniciados(ano, mes));
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        //public IActionResult ListarItensForaRota(string codRastreio)
        //{
        //    try
        //    {
        //        return Ok(MovimentacaoVM.ListarItensForaRota(codRastreio));
        //    }
        //    catch (Exception ex)
        //    {

        //        throw;
        //    }
        //}

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}