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
    public class EntregadoresController : Controller
    {
        private readonly TRANSPORTADORAContext _context;
        RepositoryEntregador _RepositoryEntregador = new RepositoryEntregador();

        //public EntregadoresController(TRANSPORTADORAContext context)
        //{
        //    _context = context;
        //}

        // GET: Entregadores
        public async Task<IActionResult> Index()
        {
            return View(await _context.Entregadores.ToListAsync());
        }

        // GET: Entregadores/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Entregadores == null)
            {
                return NotFound();
            }

            var entregadores = await _context.Entregadores
                .FirstOrDefaultAsync(m => m.Etcodigo == id);
            if (entregadores == null)
            {
                return NotFound();
            }

            return View(entregadores);
        }

        //// GET: Entregadores/Create
        //public IActionResult Create()
        //{
        //    return View();
        //}


        [HttpPost]
        public IActionResult Create([FromBody] Entregadores entregador)
        {
            try
            {
                _RepositoryEntregador.Incluir(entregador);
                return Ok(new { data = entregador, status = "Ok" });
            }
            catch (Exception ex)
            {
                return Ok(new { data = entregador, status = "Error", ex.Message });
            }
        }

        [HttpGet]
        public IActionResult ListarEntregadores()
        {
            try
            {
                return Ok(_RepositoryEntregador.SelecionarTodos());
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IActionResult> ListarEntregadoresPorUnidade(int codUnidade)
        {
            try
            {
                return Ok(_RepositoryEntregador.SelecionarTodos().Where(x=> x.EtcodUnidade == codUnidade).ToList());
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] Entregadores entregador)
        {
            try
            {
                _RepositoryEntregador.Alterar(entregador);
                return new JsonResult(new { data = entregador, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = entregador, status = ex.Message });
            }
        }

        public IActionResult GetEntregadores()
        {
            return Ok(new { data = _RepositoryEntregador.SelecionarTodos() });
        }



        [HttpDelete]
        public async Task<IActionResult> Delete(int codEntregador)
        {
            try
            {
                _RepositoryEntregador.Excluir(codEntregador);
                return new JsonResult(new { data = codEntregador, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = codEntregador, status = ex.Message });
            }
        }


        private bool EntregadoresExists(int id)
        {
            return _context.Entregadores.Any(e => e.Etcodigo == id);
        }
    }
}
