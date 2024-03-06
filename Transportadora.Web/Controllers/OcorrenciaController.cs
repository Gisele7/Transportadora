using Microsoft.AspNetCore.Mvc;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;
using Transportadora.Web.ViewModel;

namespace Transportadora.Web.Controllers
{
    public class OcorrenciaController : Controller
    {
        RepositoryTipoOcorrencia _RepositoryTipoOcorrencia = new RepositoryTipoOcorrencia();
        RepositoryResultadoOcorrencia _RepositoryResultadoOcorrencia = new RepositoryResultadoOcorrencia();
        RepositoryOcorrencia _RepositoryOcorrencia = new RepositoryOcorrencia();
        public IActionResult GetTipoOcorrencia()
        {
            return new JsonResult(new { data = _RepositoryTipoOcorrencia.SelecionarTodos() });
        }

        public IActionResult GetResultadoOcorrencia()
        {
            return new JsonResult(new { data = _RepositoryResultadoOcorrencia.SelecionarTodos() });
        }

        [HttpPost]
        public async Task<IActionResult> CreateOcorrencia([FromBody] Ocorrencia ocorrencia)
        {
            try
            {
                _RepositoryOcorrencia.Incluir(ocorrencia);
                return new JsonResult(new { data = ocorrencia, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = ocorrencia, status = ex.Message });
            }
        }

        public IActionResult GetOcorrencias()
        {
            return new JsonResult(new { data = OcorrenciaVM.ListarOcorrencias() });
        }

    }
}
