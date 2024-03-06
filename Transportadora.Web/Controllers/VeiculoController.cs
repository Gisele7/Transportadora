using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;
using Transportadora.Web.ViewModel;

namespace Transportadora.Web.Controllers
{
    public class VeiculoController : Controller
    {

        RepositoryVeiculo _RepositoryVeiculo = new RepositoryVeiculo();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VeiculoVM veiculoVM)
        {
            try
             {
                Veiculo veiculo = new Veiculo()
                {
                    Vedescricao = veiculoVM.Descricao,
                    Vetipo = veiculoVM.Tipo,
                    Veplaca = veiculoVM.Placa,
                    Veano = veiculoVM.Ano,
                    VecodUnidade = veiculoVM.CodUnidade,
                    VecorPredominante = veiculoVM.CorPredominante
                };

                _RepositoryVeiculo.Incluir(veiculo);
                return new JsonResult(new { data = veiculoVM, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = veiculoVM, status = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] VeiculoVM veiculoVM)
        {
            try
            {
                Veiculo veiculo = new Veiculo()
                {
                    Vedescricao = veiculoVM.Descricao,
                    Vetipo = veiculoVM.Tipo,
                    Veplaca = veiculoVM.Placa,
                    Veano = veiculoVM.Ano,
                    VecodUnidade = veiculoVM.CodUnidade,
                    VecorPredominante = veiculoVM.CorPredominante
                };

                _RepositoryVeiculo.Alterar(veiculo);
                return new JsonResult(new { data = veiculoVM, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = veiculoVM, status = ex.Message });
            }
        }

        public async Task<IActionResult> SelecionarVeiculo(int codVeiculo)
        {
            return new JsonResult(new { data = VeiculoVM.SelecionarVeiculo(codVeiculo) });
        }

        public IActionResult GetVeiculos()
        {
            return new JsonResult(new { data = VeiculoVM.ListarVeiculos()});
        }

      
    }
}
