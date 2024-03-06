using System;

using System.Collections.Generic;

using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Mvc.Rendering;

using Microsoft.EntityFrameworkCore;

using Transportadora.Model.Models;

using Transportadora.Model.Repositories;

using Transportadora.Web.ViewModel;



namespace Transportadora.Web.Controllers

{

    public class UsuarioController : Controller

    {

        private readonly TRANSPORTADORAContext _context;

        RepositoryUsuario _RepositoryUsuario = new RepositoryUsuario();



        public UsuarioController(TRANSPORTADORAContext context)

        {

            _context = context;

        }

     
        public string CriptografarWithMD5(string input)
        {
            // Calcular o Hash
            MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // Converter byte array para string hexadecimal
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }


        [HttpPost]

        public async Task<IActionResult> CreateUsuario([FromBody] UsuarioVM usuarioVM)
        {
            try
            {
                var usuario = new Usuario()
                {
                    Usnome = usuarioVM.Nome,
                    Ussenha = CriptografarWithMD5(usuarioVM.Senha),
                    UscodUnidade = usuarioVM.CodUnidade
                };
                _RepositoryUsuario.Incluir(usuario);
                return new JsonResult(new { data = usuario, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = usuarioVM, status = ex.Message });
            }

        }

        [HttpGet]
        public async Task<IActionResult> ListarUsuarios()
        {
            try
            {
                return Ok(UsuarioVM.ListarUsuarios());
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditUsuario([FromBody] Usuario usuario)
        {
            try
            {
                _RepositoryUsuario.Alterar(usuario);
                return new JsonResult(new { data = usuario, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = usuario, status = ex.Message });
            }
        }

        public IActionResult GetUsuario()
        {
            return new JsonResult(new { data = _RepositoryUsuario.SelecionarTodos() });
        }

    }

}