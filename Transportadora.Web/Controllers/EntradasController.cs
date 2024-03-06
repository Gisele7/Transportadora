using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using NuGet.Packaging.Signing;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;
using Transportadora.Web.Models;
using Transportadora.Web.ViewModel;

namespace Transportadora.Web.Controllers
{
    public class EntradasController : Controller
    {
        RepositoryCliente _RepositoryCliente = new RepositoryCliente();
        RepositoryEntrada _RepositoryEntrada = new RepositoryEntrada();
        RepositoryUnidades _RepositoryUnidades = new RepositoryUnidades();
        RepositoryEndereco _RepositoryEndereco = new RepositoryEndereco();
        RepositoryPickUp _RepositoryPickUp = new RepositoryPickUp();
        RepositoryTransporte _RepositoryTransporte = new RepositoryTransporte();
        RepositoryRota _RepositoryRota = new RepositoryRota();
        RepositoryEntradaItens _RepositoryEntradaItens = new RepositoryEntradaItens();
        RepositoryVWUtilizacaoMensal _RepositoryVWUtilizacaoMensal = new RepositoryVWUtilizacaoMensal();
        RepositoryVWEntradasAnual _RepositoryVWEntradasAnual = new RepositoryVWEntradasAnual();


        //public EntradasController(RepositoryCliente repositoryCliente, RepositoryEntrada repositoryEntrada, RepositoryUnidades repositoryUnidades, RepositoryEndereco repositoryEndereco, RepositoryPickUp repositoryPickUp)
        //{
        //    _RepositoryCliente = repositoryCliente;
        //    _RepositoryEntrada = repositoryEntrada;
        //    _RepositoryUnidades = repositoryUnidades;
        //    _RepositoryEndereco = repositoryEndereco;
        //    _RepositoryPickUp = repositoryPickUp;
        //}

        public void CarregaViewBag()
        {
            ViewData["ErcodCliente"] = new SelectList(_RepositoryCliente.SelecionarTodos(), "Clcodigo", "Clnome");
            ViewData["ErcodUnidade"] = new SelectList(_RepositoryUnidades.SelecionarTodos(), "Uncodigo", "Undescricao");
        }

        public IActionResult ListarPickUpPorCliente(int codCliente)
        {
            var retorno = _RepositoryPickUp.ListarPickUpsPorCliente(codCliente);
            return new JsonResult(retorno);
        }

        public ActionResult Create(int codEntrada = 0)
        {
            CarregaViewBag();
            if (codEntrada > 0)
            {
                var entrada = EntradaVM.SelecionaEntrada(codEntrada);
                return View(entrada);
            }
            return View();
        }


        // POST: EntradaController/Create
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] EntradaVM entradaVM)
        {

            try
            {

                Entrada entrada = new Entrada()
                {
                    ErcodCliente = entradaVM.CodCliente,
                    Erremetente = entradaVM.CodRemetente,
                    ErcodPickup = entradaVM.CodPickup,
                    ErnumeroNotaFiscal = entradaVM.NumeroNotaFiscal != "" ? int.Parse(entradaVM.NumeroNotaFiscal) : null,
                    Ervalor = entradaVM.Valor,
                    ErcodUnidade = entradaVM.CodUnidade,
                    Ernumero = _RepositoryEntrada.GerarNumero(),
                    ErdataAgendado = entradaVM.DataAgendado,
                    Eragendado = entradaVM.Agendado,
                    Erfragil = entradaVM.Fragil,
                    Erurgente = entradaVM.Urgente,
                    Erseguro = entradaVM.Seguro,
                    ErvalorTotal = entradaVM.ValorTotal

                };
                entrada.EntradaItens = entradaVM.Itens;
                _RepositoryEntrada.Incluir(entrada);

                using (var http = new HttpClient())
                {
                    var endUnidade = _RepositoryEndereco.SelecionaEnderecoUnidade(entradaVM.CodUnidade);
                    var endCliente = _RepositoryEndereco.SelecionaEndereco((int)entradaVM.CodCliente);
                    //calcula a distancia entre 2 pontos em km 
                    var url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={endUnidade.Enlatitude.ToString().Replace(",", ".")},{endUnidade.EnLongitude.ToString().Replace(",", ".")}&destinations={endCliente.Enlatitude.ToString().Replace(",", ".")},{endCliente.EnLongitude.ToString().Replace(",", ".")}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E";
                    var response = await http.GetAsync(url);
                    var json = await response.Content.ReadAsStringAsync();
                    //var resposta = JsonConvert.SerializeObject(response.Content.ReadAsStringAsync());

                    JObject dados = JObject.Parse(json);
                    var origens = dados.Root;

                    var enderecoDestino = origens["destination_addresses"].First;
                    var endereciOrigem = origens["origin_addresses"].First;

                    var rows = dados["rows"];
                    var resultados = rows.First["elements"];
                    var distancia = resultados.First["distance"]["value"];
                }
                CarregaViewBag();
                await CriarRota((int)entradaVM.CodCliente, entradaVM.CodUnidade, entrada.Ercodigo);
                entradaVM.Numero = entrada.Ernumero;
                return new JsonResult(new { data = entradaVM, status = "Ok" });
            }
            catch
            {
                return View();
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateDevolucao([FromBody] Entrada entrada)
        {
            try
            {
                Entrada devolucao = new Entrada()
                {
                    ErcodCliente = entrada.ErcodCliente,
                    Erremetente = entrada.Erremetente,
                    ErcodPickup = entrada.ErcodPickup,
                    ErnumeroNotaFiscal = entrada.ErnumeroNotaFiscal,
                    ErcodUnidade = entrada.ErcodUnidade,
                    Ernumero = _RepositoryEntrada.GerarNumero(),
                    ErdataAgendado = entrada.ErdataAgendado,
                    Eragendado = entrada.Eragendado,
                    Erfragil = entrada.Erfragil,
                    Erurgente = entrada.Erurgente,
                    Erseguro = entrada.Erseguro,
                    ErvalorTotal = entrada.ErvalorTotal

                };

                _RepositoryEntrada.IncluirDevolucao(entrada, devolucao);

                //using (var http = new HttpClient())
                //{
                //    var endUnidade = _RepositoryEndereco.SelecionaEnderecoUnidade(entradaVM.CodUnidade);
                //    var endCliente = _RepositoryEndereco.SelecionaEndereco((int)entradaVM.CodCliente);
                //    //calcula a distancia entre 2 pontos em km 
                //    var url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={endUnidade.Enlatitude.ToString().Replace(",", ".")},{endUnidade.EnLongitude.ToString().Replace(",", ".")}&destinations={endCliente.Enlatitude.ToString().Replace(",", ".")},{endCliente.EnLongitude.ToString().Replace(",", ".")}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E";
                //    var response = await http.GetAsync(url);
                //    var json = await response.Content.ReadAsStringAsync();
                //    //var resposta = JsonConvert.SerializeObject(response.Content.ReadAsStringAsync());

                //    JObject dados = JObject.Parse(json);
                //    var origens = dados.Root;

                //    var enderecoDestino = origens["destination_addresses"].First;
                //    var endereciOrigem = origens["origin_addresses"].First;

                //    var rows = dados["rows"];
                //    var resultados = rows.First["elements"];
                //    var distancia = resultados.First["distance"]["value"];
                //}
                CarregaViewBag();
                await CriarRota((int)devolucao.ErcodCliente, (int)devolucao.ErcodUnidade, devolucao.Ercodigo);
                return new JsonResult(new { data = entrada, status = "Ok" });
            }
            catch
            {
                return View();
            }
        }

        // POST: EntradaController/Edit
        [HttpPost]
        public async Task<ActionResult> Edit([FromBody] EntradaVM entradaVM)
        {

            try
            {

                Entrada entrada = new Entrada()
                {
                    Ercodigo = entradaVM.CodigoEntrada,
                    ErcodCliente = entradaVM.CodCliente,
                    Erremetente = entradaVM.CodRemetente,
                    ErcodPickup = entradaVM.CodPickup,
                    ErnumeroNotaFiscal = entradaVM.NumeroNotaFiscal != "" ? int.Parse(entradaVM.NumeroNotaFiscal) : null,
                    Ervalor = entradaVM.Valor,
                    ErcodUnidade = entradaVM.CodUnidade,
                    Ernumero = _RepositoryEntrada.GerarNumero(),
                    ErdataAgendado = entradaVM.DataAgendado,
                    Eragendado = entradaVM.Agendado,
                    Erfragil = entradaVM.Fragil,
                    Erurgente = entradaVM.Urgente,
                    Erseguro = entradaVM.Seguro,
                    ErvalorTotal = entradaVM.ValorTotal,
                    Erdata = DateTime.Now

                };
                _RepositoryEntrada.AlterarEntrada(entrada, entradaVM.Itens);

                using (var http = new HttpClient())
                {
                    var endUnidade = _RepositoryEndereco.SelecionaEnderecoUnidade(entradaVM.CodUnidade);
                    var endCliente = _RepositoryEndereco.SelecionaEndereco((int)entradaVM.CodCliente);
                    //calcula a distancia entre 2 pontos em km 
                    var url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={endUnidade.Enlatitude.ToString().Replace(",", ".")},{endUnidade.EnLongitude.ToString().Replace(",", ".")}&destinations={endCliente.Enlatitude.ToString().Replace(",", ".")},{endCliente.EnLongitude.ToString().Replace(",", ".")}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E";
                    var response = await http.GetAsync(url);
                    var json = await response.Content.ReadAsStringAsync();
                    //var resposta = JsonConvert.SerializeObject(response.Content.ReadAsStringAsync());

                    JObject dados = JObject.Parse(json);
                    var origens = dados.Root;

                    var enderecoDestino = origens["destination_addresses"].First;
                    var endereciOrigem = origens["origin_addresses"].First;

                    var rows = dados["rows"];
                    var resultados = rows.First["elements"];
                    var distancia = resultados.First["distance"]["value"];
                }
                CarregaViewBag();
                await CriarRota((int)entradaVM.CodCliente, entradaVM.CodUnidade, entrada.Ercodigo);
                entradaVM.Numero = entrada.Ernumero;
                return new JsonResult(new { data = entradaVM, status = "Ok" });
            }
            catch
            {
                return View();
            }
        }


        public IActionResult GetEntradas(int codUnidade = 0, string termo = "")
        {
            return new JsonResult(new { data = EntradaVM.ListarEntradas(codUnidade, termo) });
        }

        public IActionResult GetEntradasAgendadas(int ano, int mes)
        {
            return new JsonResult(new { data = EntradaVM.ListarEntradasAgendadas(ano, mes) });
        }

        public IActionResult GetEntradasIniciadas(int ano, int mes)
        {
            return new JsonResult(new { data = EntradaVM.ListarEntradasIniciadas(ano, mes) });
        }


        public async Task<IActionResult> Pesquisar(int codCliente = 0, int codUnidade = 0)
        {
            return new JsonResult(new { data = EntradaVM.PesquisarEntrada(codCliente, codUnidade) });
        }

        public IActionResult SelecionaEntrada(int codEntrada)
        {
            return Ok(new { data = EntradaVM.SelecionaEntrada(codEntrada) });
        }

        public IActionResult Excluir(int codEntrada)
        {
            try
            {
                _RepositoryEntrada.Excluir(codEntrada);
                return RedirectToAction("ListarEntradas", new { mensagem = "Entrada excluída com sucesso!" });
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public async Task<string> CalcularDistancia(decimal? latitudeOrigem, decimal? longitudeOrigem, decimal? latitudeDestino, decimal? longitudeDestino)
        {
            var http = new HttpClient();
            //var url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={latitudeOrigem},{unidadeOrigem.Longitude}&destinations={cliente.Latitude},{cliente.Longitude}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E";
            //calcula a distancia entre 2 pontos em km 
            //var response = await http.GetAsync("https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington%2C%20DC&destinations=New%20York%20City%2C%20NY&units=imperial&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
            var response = await http.GetAsync($"https://maps.googleapis.com/maps/api/distancematrix/json?origins={latitudeOrigem.ToString().Replace(",", ".")},{longitudeOrigem.ToString().Replace(",", ".")}&destinations={latitudeDestino.ToString().Replace(",", ".")},{longitudeDestino.ToString().Replace(",", ".")}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
            var json = await response.Content.ReadAsStringAsync();
            //var resposta = JsonConvert.SerializeObject(response.Content.ReadAsStringAsync());

            JObject dados = JObject.Parse(json);
            var origens = dados.Root;

            var enderecoDestino = origens["destination_addresses"].First;
            var endereciOrigem = origens["origin_addresses"].First;
            var rows = dados["rows"];
            var resultados = rows.First["elements"];

            return resultados.First["distance"]["value"].ToString();
        }



        public async Task<string> RetornaDistancia(string latitudeOrigem, string longitudeOrigem, string latidudeDestino, string longitudeDestino)
        {
            var http = new HttpClient();
            var response = await http.GetAsync($"https://maps.googleapis.com/maps/api/distancematrix/json?origins={latitudeOrigem},{longitudeOrigem}&destinations={latidudeDestino},{longitudeDestino}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
            var json = await response.Content.ReadAsStringAsync();
            JObject dados = JObject.Parse(json);
            var rows = dados["rows"];
            var resultados = rows.First["elements"];
            return resultados.First["distance"]["value"].ToString();
        }
        public async Task CriarRota(int codCliente, int codUnidadeOrigem, int codEntrada)
        {
            //1º caso: Unidade de origem é um hub e é do mesmo estado do cliente.
            var calculandoRota = true;
            var cliente = ClienteVM.SelecionaCliente(codCliente);
            var unidadeOrigem = UnidadeVM.SelecionaUnidade(codUnidadeOrigem);
            var regiao = cliente.CodRegiao;

            try
            {
                if (unidadeOrigem.CodRegiao == cliente.CodRegiao && unidadeOrigem.Hub)
                {
                    var rota = new Rota();
                    rota.RocodEntrada = codEntrada;
                    rota.RocodUnidadeOrigem = unidadeOrigem.Uncodigo;
                    rota.RocodUnidade = unidadeOrigem.Uncodigo;
                    rota.RoultimaEtapa = true;
                    _RepositoryRota.Incluir(rota);
                    return;
                }
                else if (unidadeOrigem.Unestado == cliente.Estado)
                {
                    var rota = new Rota();
                    rota.RocodEntrada = codEntrada;
                    rota.RocodUnidadeOrigem = unidadeOrigem.Uncodigo;
                    rota.RocodUnidade = unidadeOrigem.Uncodigo;
                    rota.RoultimaEtapa = true;
                    _RepositoryRota.Incluir(rota);
                    return;
                }
                else
                {
                    var hub = UnidadeVM.SelecionaHUB((int)unidadeOrigem.CodRegiao, unidadeOrigem.UF);
                    var codUnidadeTransferencia = hub.Uncodigo;
                    var distanciaEntreUnidadeOrigemECliente = await RetornaDistancia(unidadeOrigem.Latitude.ToString().Replace(",", "."), unidadeOrigem.Longitude.ToString().Replace(",", "."), cliente.Latitude.ToString().Replace(",", "."), cliente.Longitude.ToString().Replace(",", "."));
                    var distanciaEntreUnidadeOrigemEHUB = await RetornaDistancia(unidadeOrigem.Latitude.ToString().Replace(",", "."), unidadeOrigem.Longitude.ToString().Replace(",", "."), hub.Latitude.ToString().Replace(",", "."), hub.Longitude.ToString().Replace(",", "."));
                    //busco o proximo hub
                    if (int.Parse(distanciaEntreUnidadeOrigemECliente.ToString()) < int.Parse(distanciaEntreUnidadeOrigemEHUB.ToString()))
                    {
                        _RepositoryRota = new RepositoryRota();
                        var rota = new Rota();
                        rota.RocodEntrada = codEntrada;
                        rota.RocodUnidadeOrigem = hub.Uncodigo;
                        rota.RocodUnidade = unidadeOrigem.Uncodigo;
                        rota.RoultimaEtapa = true;
                        await _RepositoryRota.IncluirAsync(rota);
                        return;
                    }
                    else
                    {

                        var rota = new Rota();
                        rota.RocodEntrada = codEntrada;
                        rota.RocodUnidadeOrigem = unidadeOrigem.Uncodigo;
                        rota.RocodUnidade = hub.Uncodigo;
                        rota.RoultimaEtapa = false;
                        await _RepositoryRota.IncluirAsync(rota);

                        //}
                        var distancias = new List<Distancia>();
                        var unidades = UnidadeVM.ListarUnidades().Where(x => x.CodRegiao == cliente.CodRegiao && x.Hub == true).ToList();

                        foreach (var item in unidades)
                        {
                            var distanciaEntreOHubAtualeUnidade = await RetornaDistancia(hub.Latitude.ToString().Replace(",", "."), hub.Longitude.ToString().Replace(",", "."), item.Latitude.ToString().Replace(",", "."), item.Longitude.ToString().Replace(",", ".")); distancias.Add(new Distancia
                            {
                                CodigoUnidade = item.Uncodigo,
                                DistanciaKM = int.Parse(distanciaEntreOHubAtualeUnidade)
                            });
                        }
                        while (calculandoRota)
                        {

                            foreach (var item in distancias.OrderBy(x => x.DistanciaKM))
                            {
                                var unidade = UnidadeVM.SelecionaUnidade(item.CodigoUnidade);
                                if (unidade.UF == cliente.Estado)
                                {

                                    var rotaNova = new Rota();
                                    rotaNova.RocodEntrada = codEntrada;
                                    rotaNova.RocodUnidadeOrigem = hub.Uncodigo;
                                    rotaNova.RocodUnidade = unidade.Uncodigo;
                                    rotaNova.RoultimaEtapa = true;
                                    calculandoRota = false;
                                    await _RepositoryRota.IncluirAsync(rotaNova);
                                    return;

                                }
                                else
                                {

                                    var rotaNova = new Rota();
                                    rotaNova.RocodEntrada = codEntrada;
                                    rotaNova.RocodUnidadeOrigem = hub.Uncodigo;
                                    rotaNova.RocodUnidade = unidade.Uncodigo;
                                    rotaNova.RoultimaEtapa = false;
                                    await _RepositoryRota.IncluirAsync(rotaNova);

                                }
                                hub = unidade;

                            }


                        }


                    }


                }

            }
            catch (Exception ex)
            {

                throw;
            }


        }
        public IActionResult EncerrarEntrada(int codCliente = 5, int codEntrada = 18)
        {
            try
            {
                var transporte = new Transporte();
                transporte.CecodEntrada = codEntrada;
                transporte.CecodStatus = 1; //Criar enum para status
                transporte.CehoraCriacao = DateTime.Now;

                _RepositoryTransporte.Incluir(transporte);

                return RedirectToAction("Create", new { codEntrada = codEntrada });
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        [HttpPost]
        public IActionResult ListarClientesMaisUtilizaram([FromBody] DadosGrafico dados)
        {
            try
            {
                List<DadosGrafico> retorno = new List<DadosGrafico>();
                var meses = _RepositoryVWUtilizacaoMensal.ListaMensalUtilizacao(dados.Ano, dados.Mes);
                if (meses.Count > 0)
                {
                    foreach (var item in meses)
                    {
                        dados.Dados += item.Total.ToString() + ",";
                        dados.Cliente += item.ClNome + ",";
                    }
                dados.Dados = dados.Dados.Substring(0, dados.Dados.Length - 1);
                dados.Cliente = dados.Cliente.Substring(0, dados.Cliente.Length - 1);
                }
                return Ok(dados);

            }
            catch (Exception ex)
            {

                throw;
            }
        }

        [HttpPost]
        public IActionResult ListarEntradasAnuais([FromBody] DadosGrafico dados)
        {
            try
            {
                List<DadosGrafico> retorno = new List<DadosGrafico>();
                var meses = _RepositoryVWEntradasAnual.ListaAnualEntradas(dados.Ano);
                if (meses != null)
                {
                    if (dados.Mes == 0)
                    {
                        dados.Dados = meses.Janeiro + "," + meses.Fevereiro + "," + meses.Marco + "," + meses.Abril +
                                 "," + meses.Maio + "," + meses.Junho + "," + meses.Julho + "," + meses.Agosto +
                                 "," + meses.Setembro + "," + meses.Outubro + "," + meses.Novembro + "," + meses.Dezembro;

                        dados.TotalAno = (int)meses.Total;
                    }
                    else
                    {
                        var novoValorMes = _RepositoryVWEntradasAnual.ListaAnualEntradas(dados.Ano);

                        switch (dados.Mes)
                        {
                            case 1:
                                meses.Janeiro = novoValorMes.Janeiro;
                                break;
                            case 2:
                                meses.Fevereiro = novoValorMes.Fevereiro;
                                break;
                            case 3:
                                meses.Marco = novoValorMes.Marco;
                                break;
                            case 4:
                                meses.Abril = novoValorMes.Abril;
                                break;
                            case 5:
                                meses.Maio = novoValorMes.Maio;
                                break;
                            case 6:
                                meses.Junho = novoValorMes.Junho;
                                break;
                            case 7:
                                meses.Julho = novoValorMes.Julho;
                                break;
                            case 8:
                                meses.Agosto = novoValorMes.Agosto;
                                break;
                            case 9:
                                meses.Setembro = novoValorMes.Setembro;
                                break;
                            case 10:
                                meses.Outubro = novoValorMes.Outubro;
                                break;
                            case 11:
                                meses.Novembro = novoValorMes.Novembro;
                                break;
                            case 12:
                                meses.Dezembro = novoValorMes.Dezembro;
                                break;

                        }
                        dados.Dados = meses.Janeiro + "," + meses.Fevereiro + "," + meses.Marco + "," + meses.Abril +
                               "," + meses.Maio + "," + meses.Junho + "," + meses.Julho + "," + meses.Agosto +
                               "," + meses.Setembro + "," + meses.Outubro + "," + meses.Novembro + "," + meses.Dezembro;

                        dados.TotalAno = (int)meses.Total;
                    }
                }
                return Ok(dados);

            }
            catch (Exception ex)
            {

                throw;
            }
        }

    }
}