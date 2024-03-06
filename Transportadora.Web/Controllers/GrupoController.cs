using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;

namespace Transportadora.Web.Controllers
{
    public class GrupoController : Controller
    {
        private readonly TRANSPORTADORAContext _context;
        RepositoryGrupo _RepositoryGrupo = new RepositoryGrupo();

        public GrupoController(TRANSPORTADORAContext context)
        {
            _context = context;
        }


        [HttpPost]
        public async Task<IActionResult> CreateGrupo([FromBody] Grupo grupo)
        {
            try
            {
                _RepositoryGrupo.Incluir(grupo);
                return new JsonResult(new { data = grupo, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = grupo, status = ex.Message });
            }
        }


        [HttpPut]
        public async Task<IActionResult> EditGrupo([FromBody] Grupo grupo)
        {
            try
            {
                _RepositoryGrupo.Alterar(grupo);
                return new JsonResult(new { data = grupo, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = grupo, status = ex.Message });
            }
        }

        public IActionResult GetGrupo()
        {
            return new JsonResult(new { data = _RepositoryGrupo.SelecionarTodos() });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int codGrupo)
        {
            try
            {
                _RepositoryGrupo.Excluir(codGrupo);
                return new JsonResult(new { data = codGrupo, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = codGrupo, status = ex.Message });
            }
        }
    }
}
