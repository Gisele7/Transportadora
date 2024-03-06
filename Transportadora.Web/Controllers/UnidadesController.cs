using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;
using Transportadora.Web.Helpers;
using Transportadora.Web.Models;
using Transportadora.Web.ViewModel;
using static Transportadora.Web.Helpers.Enums;

namespace Transportadora.Web.Controllers
{
    public class UnidadesController : Controller
    {
        RepositoryUnidades _RepositoryUnidades = new RepositoryUnidades();
        RepositoryEndereco _RepositoryEndereco = new RepositoryEndereco();
        RepositoryDistancia _RepositoryDistancia = new RepositoryDistancia();

        DistanciaUnidade distanciaUnidade2;
        List<DistanciaUnidade> listaDistanciaUnidade = new List<DistanciaUnidade>();

        public async Task<string> CarregaDistancia(UnidadeVM origem, UnidadeVM destino)
        {
            var distancia = "";
            var http = new HttpClient();
            var url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origem.Latitude},{origem.Longitude}&destinations={destino.Latitude},{destino.Longitude}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E";
            //calcula a distancia entre 2 pontos em km 
            //var response = await http.GetAsync("https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington%2C%20DC&destinations=New%20York%20City%2C%20NY&units=imperial&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
            var response = await http.GetAsync($"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origem.Latitude.ToString().Replace(",", ".")},{origem.Longitude.ToString().Replace(",", ".")}&destinations={destino.Latitude.ToString().Replace(",", ".")},{destino.Longitude.ToString().Replace(",", ".")}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
            var json = await response.Content.ReadAsStringAsync();
            //var resposta = JsonConvert.SerializeObject(response.Content.ReadAsStringAsync());

            JObject dados = JObject.Parse(json);
            var origens = dados.Root;

            var enderecoDestino = origens["destination_addresses"].First;
            var endereciOrigem = origens["origin_addresses"].First;

            var rows = dados["rows"];
            var resultados = rows.First["elements"];
            distancia = resultados.First["distance"]["value"].ToString();
            return distancia;

            //_RepositoryDistancia.IncluirLista(listaDistanciaUnidade);
        }



        public void Incluir()
        {
            _RepositoryDistancia.IncluirLista(listaDistanciaUnidade);
        }
        // GET: UnidadesController
        public async Task<IActionResult> Index()
        {
            var listaUnidadesOrigem = UnidadeVM.ListarUnidades();
            var listaUnidadesDestino = listaUnidadesOrigem;
            foreach (var origem in listaUnidadesOrigem)
            {
                foreach (var destino in listaUnidadesDestino)
                {
                    if (origem.Uncodigo != destino.Uncodigo)
                    {

                        var distancia = "";
                        var http = new HttpClient();
                        var url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origem.Latitude},{origem.Longitude}&destinations={destino.Latitude},{destino.Longitude}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E";
                        //calcula a distancia entre 2 pontos em km 
                        //var response = await http.GetAsync("https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington%2C%20DC&destinations=New%20York%20City%2C%20NY&units=imperial&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
                        var response = await http.GetAsync($"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origem.Latitude.ToString().Replace(",", ".")},{origem.Longitude.ToString().Replace(",", ".")}&destinations={destino.Latitude.ToString().Replace(",", ".")},{destino.Longitude.ToString().Replace(",", ".")}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
                        var json = await response.Content.ReadAsStringAsync();
                        //var resposta = JsonConvert.SerializeObject(response.Content.ReadAsStringAsync());

                        JObject dados = JObject.Parse(json);
                        var origens = dados.Root;

                        var enderecoDestino = origens["destination_addresses"].First;
                        var endereciOrigem = origens["origin_addresses"].First;

                        var rows = dados["rows"];
                        var resultados = rows.First["elements"];
                        distancia = resultados.First["distance"]["value"].ToString();



                        var distanciaUnidade = new DistanciaUnidade();
                        {
                            distanciaUnidade.DucodUnidadeOrigem = origem.Uncodigo;
                            distanciaUnidade.DucodUnidadeDestino = destino.Uncodigo;
                            distanciaUnidade.Dudistancia = decimal.Parse(distancia);
                        };
                        listaDistanciaUnidade.Add(distanciaUnidade);
                    }
                }

            }
            Incluir();
            return View();
        }
        public IActionResult GetUnidades()
        {
            return new JsonResult(new { data = UnidadeVM.ListarUnidades() });
        }

        public IActionResult SelecionaEndereco(int codUnidade)
        {
            return Ok(new { data = _RepositoryEndereco.SelecionaEnderecoUnidade(codUnidade) });
        }

        // POST: UnidadesController
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UnidadeVM unidadeVM)
        {
            try
            {
                Unidades unidade = new Unidades()
                {
                    Undescricao = unidadeVM.Undescricao,
                    Unhub = unidadeVM.Hub
                };

                List<Endereco> listaEndereco = new List<Endereco>();

                var estadosRegiaoSul = new List<string>();
                var estadosRegiaoSudeste = new List<string>();
                var estadosRegiaoNorte = new List<string>();
                var estadosRegiaoNordeste = new List<string>();
                var estadosRegiaoCentroOeste = new List<string>();

                var estadosSul = "RS;SC;PR";
                var estadosSudeste = "ES;SP;RJ;MG";
                var estadosNorte = "AM;PA;AC;RR;RO;AP;TO";
                var estadosNordeste = "MA;PI;CE;RN;PB;PE;AL;SE;BA";
                var estadosCentroOeste = "GO;MT;MS;DF";

                estadosRegiaoSul = estadosSul.Split(";").ToList();
                estadosRegiaoSudeste = estadosSudeste.Split(";").ToList();
                estadosRegiaoNorte = estadosNorte.Split(";").ToList();
                estadosRegiaoNordeste = estadosNordeste.Split(";").ToList();
                estadosRegiaoCentroOeste = estadosCentroOeste.Split(";").ToList();

                int codigoRegiao = 0;

                if (estadosRegiaoSul.Contains(unidadeVM.UF))
                {
                    codigoRegiao = (int)eRegiao.Sul;
                }
                else if (estadosRegiaoSudeste.Contains(unidadeVM.UF))
                {
                    codigoRegiao = (int)eRegiao.Sudeste;
                }
                else if (estadosNorte.Contains(unidadeVM.UF))
                {
                    codigoRegiao = (int)eRegiao.Norte;
                }
                else if (estadosRegiaoNordeste.Contains(unidadeVM.UF))
                {
                    codigoRegiao = (int)eRegiao.Nordeste;
                }
                else if (estadosRegiaoCentroOeste.Contains(unidadeVM.UF))
                {
                    codigoRegiao = (int)eRegiao.CentroOeste;
                }

                Endereco endereco = new Endereco()
                {
                    Enbairro = unidadeVM.Bairro,
                    Encidade = unidadeVM.Cidade,
                    Enestado = unidadeVM.UF,
                    Encomplemento = unidadeVM.Complemento,
                    Enlogradouro = unidadeVM.Logradouro,
                    Encep = unidadeVM.CEP,
                    Ennumero = unidadeVM.Numero,
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

                List<Endereco> listaEnderecos = new List<Endereco>();
                listaEnderecos.Add(endereco);
                unidade.Endereco = listaEnderecos;
                _RepositoryUnidades.Incluir(unidade);
                return new JsonResult(new { data = unidadeVM, status = "Ok" });

            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = unidadeVM, status = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditUnidade([FromBody] UnidadeVM unidadeVM)
        {
            try
            {
                Unidades unidade = new Unidades()
                {
                    Undescricao = unidadeVM.Undescricao,
                    Uncodigo = unidadeVM.Uncodigo

                };

                Endereco endereco = new Endereco()
                {
                    Enbairro = unidadeVM.Bairro,
                    Encidade = unidadeVM.Cidade,
                    Enestado = unidadeVM.UF,
                    Encomplemento = unidadeVM.Complemento,
                    Enlogradouro = unidadeVM.Logradouro,
                    Encep = unidadeVM.CEP,
                    Ennumero = unidadeVM.Numero,
                    Encodigo = unidadeVM.Encodigo

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

                List<Endereco> listaEnderecos = new List<Endereco>();
                listaEnderecos.Add(endereco);
                unidade.Endereco = listaEnderecos;
                _RepositoryUnidades.Alterar(unidade);
                return new JsonResult(new { data = unidadeVM, status = "Ok" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { data = unidadeVM, status = ex.Message });
            }
        }

        // GET: UnidadesController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: UnidadesController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: UnidadesController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: UnidadesController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: UnidadesController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
