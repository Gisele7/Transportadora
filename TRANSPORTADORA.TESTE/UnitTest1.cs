using Microsoft.AspNetCore.Mvc;
using Transportadora.Model.Models;
using Transportadora.Web.Controllers;

namespace TRANSPORTADORA.TESTE
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void Entregador()
        {
            var controller = new EntregadoresController();
            var result = controller.ListarEntregadores() as IActionResult;
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            //var entregadorResult = (Entregadores) result.
        }

        [TestMethod]
        public void SelecionaEndereco()
        {
            var controller = new UnidadesController();
            var result = controller.SelecionaEndereco(3) as IActionResult;
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            //var entregadorResult = (Entregadores) result.
        }

        [TestMethod]
        public void SelecionaEntrada()
        {
            var controller = new EntradasController();
            var result = controller.SelecionaEntrada(43) as IActionResult;
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            //var entregadorResult = (Entregadores) result.
        }

        [TestMethod]
        public void CreateEntregador()
        {
            var controller = new EntregadoresController();
            Entregadores entregadores = new Entregadores()
            {
                EtcodUnidade = 3,
                Etnome = "Gisele",
                Ettelefone = "(11) 55555-5555"
            };
            var result = controller.Create(entregadores) as IActionResult;
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            //var entregadorResult = (Entregadores) result.
        }
    }
}