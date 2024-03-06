using Microsoft.AspNetCore.Mvc;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;
using Transportadora.Web.Models;
using Transportadora.Web.ViewModel;

namespace Transportadora.Web.Controllers
{
    public class MovimentacaoController : Controller
    {
        RepositoryMovimentacao _RepositoryMovimentacao = new RepositoryMovimentacao();
        RepositoryVWDevolucaoAnual _RepositoryVWDevolucaoAnual = new RepositoryVWDevolucaoAnual();
        //[HttpPost]
        //public IActionResult CreateMovimentacao(string codRastreio, int codUnidade, string tipoMovimentacao, int codEntregador = 0)
        //{
        //    return Ok(_RepositoryMovimentacao.CriarMovimentacao(codRastreio, codUnidade, tipoMovimentacao, codEntregador));
        //}

        [HttpPost]
        public IActionResult CreateMovimentacao([FromBody] MovimentacaoVM movimentacaoVM)
        {   
            return Ok(_RepositoryMovimentacao.CriarMovimentacao(movimentacaoVM.Rastreio, movimentacaoVM.CodUnidade, movimentacaoVM.TipoMovimentacao, movimentacaoVM.CodEntregador??0));
        }

        public IActionResult BuscarMovimentacao(string codRastreio)
        {
            return Ok(MovimentacaoVM.BuscarMovimentacao(codRastreio));
        }

        public IActionResult BuscarUltimaRota(string rastreio, int codUnidade)
        {
            return Ok(_RepositoryMovimentacao.VerificaUltimaRota(rastreio, codUnidade)); 
        }


        [HttpPost]
        public IActionResult RegistrarEntrega([FromBody] Rastreio rastreio)
        {
            return Ok(_RepositoryMovimentacao.RegistrarEntrega(rastreio.CodTransporte, rastreio.Data, rastreio.Observacoes, rastreio.Devolucao, rastreio.Motivo, rastreio.DestinatarioAusente));
        }

        [HttpPost]
        public IActionResult ListarDevolvidos([FromBody] DadosGrafico dados)
        {
            try
            {
                List<DadosGrafico> retorno = new List<DadosGrafico>();
                var meses = _RepositoryVWDevolucaoAnual.ListaAnualDevolucoes(dados.Ano);
                if(meses != null)
                {
                    if(dados.Mes == 0)
                    {
                        dados.Dados = meses.Janeiro + "," + meses.Fevereiro + "," + meses.Março + "," + meses.Abril +
                                 "," + meses.Maio + "," + meses.Junho + "," + meses.Julho + "," + meses.Agosto +
                                 "," + meses.Setembro + "," + meses.Outubro + "," + meses.Novembro + "," + meses.Dezembro;

                        dados.TotalAno = (int)meses.TotalAnual;
                    }
                    else
                    {
                        var novoValorMes = _RepositoryVWDevolucaoAnual.ListaAnualDevolucoes(dados.Ano);

                        switch (dados.Mes)
                        {
                            case 1:
                                meses.Janeiro = novoValorMes.Janeiro;
                                break;
                            case 2:
                                meses.Fevereiro = novoValorMes.Fevereiro;
                                break;
                            case 3:
                                meses.Março = novoValorMes.Março;
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
                        dados.Dados = meses.Janeiro + "," + meses.Fevereiro + "," + meses.Março + "," + meses.Abril +
                               "," + meses.Maio + "," + meses.Junho + "," + meses.Julho + "," + meses.Agosto +
                               "," + meses.Setembro + "," + meses.Outubro + "," + meses.Novembro + "," + meses.Dezembro;

                        dados.TotalAno = (int)meses.TotalAnual;
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
