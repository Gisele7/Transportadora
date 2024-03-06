using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json.Linq;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;
using Transportadora.Web.ViewModel;
using static Transportadora.Web.Helpers.Enums;

namespace Transportadora.Web.Controllers
{
    public class ClienteController : Controller
    {
        RepositoryCliente _RepositoryCliente = new RepositoryCliente();
        RepositoryEndereco _RepositoryEndereco = new RepositoryEndereco();
        RepositoryTipoCliente _RepositoryTipoCliente = new RepositoryTipoCliente();

        // GET: ClienteController/Create
        public ActionResult Create()
        {
            CarregaViewData();
            return View();
        }
        public void CarregaViewData()
        {
            ViewData["ClcodTipoCliente"] = new SelectList(_RepositoryTipoCliente.SelecionarTodos(), "Tccodigo", "Tcdescricao");

        }

        // POST: ClienteController/Create
        [HttpPost]
        public async Task<ActionResult> CreateCliente([FromBody] ClienteVM clienteVM)
        {
            try
            {
                Cliente cliente = new Cliente()
                {
                    Clcnpj = clienteVM.CNPJ,
                    ClcodTipoCliente = clienteVM.CodTipoCliente,
                    Clcpf = clienteVM.CPF,
                    CldataCadastro = DateTime.Now,
                    Clemail = clienteVM.Email,
                    CldataNascimento = clienteVM.DataNascimento,
                    Clnome = clienteVM.Nome,
                    Clrg = clienteVM.RG,
                    Clsexo = clienteVM.Sexo,
                    Cltelefone = clienteVM.Telefone,
                };

                List<Endereco> listaEndereco = new List<Endereco>();

                var estadosRegiaoSul = new List<string>();
                var estadosRegiaoSudeste = new List<string>();
                
                var estadosSul = "RS;SC;PR";
                var estadosSudeste = "ES;SP;RJ;MG";

                estadosRegiaoSul = estadosSul.Split(";").ToList();
                estadosRegiaoSudeste = estadosSudeste.Split(";").ToList();

                int codigoRegiao = 0;

                if (estadosRegiaoSul.Contains(clienteVM.Estado))
                {
                    codigoRegiao = (int)eRegiao.Sul;
                }
                else if (estadosRegiaoSudeste.Contains(clienteVM.Estado))
                {
                    codigoRegiao = (int)eRegiao.Sudeste;
                }

                Endereco endereco = new Endereco()
                {
                    Enbairro = clienteVM.Bairro,
                    Encidade = clienteVM.Cidade,
                    Enestado = clienteVM.Estado,
                    Encomplemento = clienteVM.Complemento,
                    Enlogradouro = clienteVM.Logradouro,
                    Encep = clienteVM.CEP,
                    Ennumero = clienteVM.Numero,
                    EncodRegiao = (int)codigoRegiao
                };

                using (var http = new HttpClient())
                {
                    var bairro = endereco.Enbairro.Replace(' ', '+');
                    var logradouro = endereco.Enlogradouro.Replace(' ', '+');
                    var cidade = endereco.Encidade.Replace(' ', '+');

                    var urlBase = "https://maps.googleapis.com/maps/api/geocode/json?";
                    var response = await http.GetAsync($"{urlBase}address={logradouro}+{endereco.Ennumero},{bairro},{cidade},{endereco.Enestado}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
                    JObject dados = JObject.Parse(await response.Content.ReadAsStringAsync());
                    var results = dados.Root;

                    var latitude = dados["results"].First["geometry"]["location"]["lat"];
                    var longitude = dados["results"].First["geometry"]["location"]["lng"];
                    endereco.Enlatitude = decimal.Parse(latitude.ToString());
                    endereco.EnLongitude = decimal.Parse(longitude.ToString());

                    //ViewBag.place_id = dados["results"].First["place_id"];

                }


                listaEndereco.Add(endereco);
                cliente.Endereco = listaEndereco;
                _RepositoryCliente.Incluir(cliente);
                CarregaViewData();
                return new JsonResult(new { data = clienteVM, status = "Ok" });
            }
            catch
            {
                return new JsonResult(new { data = clienteVM, status = "error" });
            }
        }

        [HttpPut]
        public async Task<ActionResult> EditCliente([FromBody] ClienteVM clienteVM)
        {
            try
            {
                Cliente cliente = new Cliente()
                {
                    Clcodigo = (int)clienteVM.CodCliente,
                    Clcnpj = clienteVM.CNPJ,
                    ClcodTipoCliente = clienteVM.CodTipoCliente,
                    Clcpf = clienteVM.CPF,
                    CldataCadastro = DateTime.Now,
                    Clemail = clienteVM.Email,
                    CldataNascimento = clienteVM.DataNascimento,
                    Clnome = clienteVM.Nome,
                    Clrg = clienteVM.RG,
                    Clsexo = clienteVM.Sexo,
                    Cltelefone = clienteVM.Telefone,
                };

                List<Endereco> listaEndereco = new List<Endereco>();
                Endereco endereco = new Endereco()
                {
                    Encodigo = clienteVM.CodigoEndereco,
                    Enbairro = clienteVM.Bairro,
                    Encidade = clienteVM.Cidade,
                    Enestado = clienteVM.Estado,
                    Encomplemento = clienteVM.Complemento,
                    Enlogradouro = clienteVM.Logradouro,
                    Encep = clienteVM.CEP,
                    Ennumero = clienteVM.Numero
                };
                using (var http = new HttpClient())
                {
                    var bairro = endereco.Enbairro.Replace(' ', '+');
                    var logradouro = endereco.Enlogradouro.Replace(' ', '+');
                    var cidade = endereco.Encidade.Replace(' ', '+');

                    var urlBase = "https://maps.googleapis.com/maps/api/geocode/json?";
                    var response = await http.GetAsync($"{urlBase}address={logradouro}+{endereco.Ennumero},{bairro},{cidade},{endereco.Enestado}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
                    JObject dados = JObject.Parse(await response.Content.ReadAsStringAsync());
                    var results = dados.Root;

                    var latitude = dados["results"].First["geometry"]["location"]["lat"];
                    var longitude = dados["results"].First["geometry"]["location"]["lng"];
                    endereco.Enlatitude = decimal.Parse(latitude.ToString());
                    endereco.EnLongitude = decimal.Parse(longitude.ToString());

                    //ViewBag.place_id = dados["results"].First["place_id"];

                }


                listaEndereco.Add(endereco);
                cliente.Endereco = listaEndereco;
                _RepositoryCliente.AlterarCliente(cliente);
                CarregaViewData();
                return new JsonResult(new { data = clienteVM, status = "Ok" });
            }
            catch
            {
                return new JsonResult(new { data = clienteVM, status = "error" });
            }
        }

        public async Task<IActionResult> Pesquisar(string nome = null, string telefone = null, string cpf = null)
        {
            return new JsonResult(new { data = ClienteVM.ListarClientes(nome, telefone, cpf) });
        }

        public async Task<IActionResult> SelecionaCliente(int codCliente)
        {
            return new JsonResult(new { data = ClienteVM.SelecionaCliente(codCliente) });
        }

        public IActionResult SelecionaEndereco(int codCliente)
        {
            var endereco = _RepositoryEndereco.SelecionaEndereco(codCliente);
            return new JsonResult(new { data = endereco });
        }

        public IActionResult GetClientes()
        {
            return new JsonResult(new { data = _RepositoryCliente.SelecionarTodos() });
        }
    }
}
