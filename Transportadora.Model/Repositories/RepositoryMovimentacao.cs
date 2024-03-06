using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public class RepositoryMovimentacao : RepositoryBase<Movimentacao>, IMovimentacao
    {
        public RepositoryMovimentacao(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public ResultadoMovimentacao CriarMovimentacao(string codRastreio, int codUnidade, string tipoMovimentacao, int codEntregador = 0)
        {
            var transporte = _DataContext.Transporte.FirstOrDefault(x => x.CecodigoRastreio == codRastreio);
            //var rota = _DataContext.Rota.FirstOrDefault(x => x.RocodEntrada == transporte.CecodEntrada && x.RocodUnidade == codUnidade);
            var ultimaRota = _DataContext.Rota.FirstOrDefault(x => x.RocodEntrada == transporte.CecodEntrada && x.RocodUnidadeOrigem == codUnidade && x.RoultimaEtapa == true);

            var ultimaMovimentacao = _DataContext.Movimentacao.Where(x => x.MocodTransporte == transporte.Cecodigo).OrderByDescending(x => x.MoDataHora).FirstOrDefault();

            if (ultimaMovimentacao.MotipoMovimentacao == tipoMovimentacao)
            {
                return new ResultadoMovimentacao()
                {
                    Erro = true,
                    Mensagem = "Você não pode criar uma entrada sem ter dado uma saída"
                };

            }


            if (codEntregador > 0)
            {
                Movimentacao movimentacao = new Movimentacao();
                movimentacao.MotipoMovimentacao = tipoMovimentacao;
                movimentacao.MocodTransporte = transporte.Cecodigo;
                movimentacao.MocodUnidade = codUnidade;
                movimentacao.MoDataHora = DateTime.Now;
                movimentacao.MocodEntregador = codEntregador;

                _DataContext.Entry(movimentacao).State = Microsoft.EntityFrameworkCore.EntityState.Added;
                _DataContext.SaveChanges();

                return new ResultadoMovimentacao()
                {
                    Mensagem = "Saída para entrega registrada com sucesso!"
                };
            }
            if (tipoMovimentacao == "S")
            {
                var rota = _DataContext.Rota.FirstOrDefault(x => x.RocodUnidadeOrigem == codUnidade && x.RocodEntrada == transporte.CecodEntrada);
                var entrada = _DataContext.Movimentacao.FirstOrDefault(x => x.MotipoMovimentacao == "E" && x.MocodUnidade == codUnidade && x.MocodTransporte == transporte.Cecodigo);
                if (rota != null && entrada != null)
                {
                    Movimentacao movimentacao = new Movimentacao();
                    movimentacao.MoforaRota = rota != null ? false : true;
                    movimentacao.MotipoMovimentacao = tipoMovimentacao;
                    movimentacao.MocodTransporte = transporte.Cecodigo;
                    movimentacao.MocodUnidade = codUnidade;
                    movimentacao.MoDataHora = DateTime.Now;

                    _DataContext.Entry(movimentacao).State = Microsoft.EntityFrameworkCore.EntityState.Added;
                    _DataContext.SaveChanges();

                    return new ResultadoMovimentacao()
                    {
                        Mensagem = "Saída efetuada com sucesso!"
                    };
                }
                else
                {
                    return new ResultadoMovimentacao()
                    {
                        Erro = true,
                        Mensagem = "Você não pode criar uma saída sem ter dado uma entrada nessa unidade"
                    };
                }

            }
            else
            {
                var rota = _DataContext.Rota.FirstOrDefault(x => x.RocodUnidade == codUnidade && x.RocodEntrada == transporte.CecodEntrada);
                if (rota != null)
                {
                    Movimentacao movimentacao = new Movimentacao();
                    movimentacao.MoforaRota = rota != null ? false : true;
                    movimentacao.MotipoMovimentacao = tipoMovimentacao;
                    movimentacao.MocodTransporte = transporte.Cecodigo;
                    movimentacao.MocodUnidade = codUnidade;
                    movimentacao.MoDataHora = DateTime.Now;

                    _DataContext.Entry(movimentacao).State = Microsoft.EntityFrameworkCore.EntityState.Added;
                    _DataContext.SaveChanges();

                    return new ResultadoMovimentacao()
                    {
                        Mensagem = "Entrada efetuada com sucesso!"
                    };
                }
                else
                {
                    return new ResultadoMovimentacao()
                    {
                        Erro = true,
                        Mensagem = "Você não pode criar uma entrada sem ter dado uma saída na unidade anterior"
                    };

                }
            }
            //Movimentacao movimentacao = new Movimentacao();
            //movimentacao.MoforaRota = rota != null ? false : true;
            //movimentacao.MotipoMovimentacao = tipoMovimentacao;
            //movimentacao.MocodTransporte = transporte.Cecodigo;
            //movimentacao.MocodUnidade = codUnidade;
            //movimentacao.MoDataEntrega = DateTime.Now;

            //if (codEntregador > 0)
            //{
            //    movimentacao.MocodEntregador = codEntregador;
            //    transporte.CecodStatus = 2;
            //    _DataContext.Entry(transporte).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            //    _DataContext.SaveChanges();
            //}


            //var resultadoMovimentacao = new ResultadoMovimentacao()
            //{
            //    RotaCorreta = rota != null ? true : false,
            //    UltimaEtapa = ultimaRota != null ? true : false,
            //};

            //return resultadoMovimentacao;

        }

        public bool VerificaUltimaRota(string rastreio, int codUnidade)
        {
            var codEntrada = _DataContext.Transporte.FirstOrDefault(x => x.CecodigoRastreio == rastreio)!.CecodEntrada;
            var rota = _DataContext.Rota.FirstOrDefault(x => x.RocodEntrada == codEntrada && x.RocodUnidade == codUnidade && x.RoultimaEtapa == true);

            if (rota != null)
            {
                return true;
            }
            return false;
        }

        public async Task<bool> RegistrarEntrega(int codTransporte, DateTime data, string observacoes, bool devolucao = false, string motivo = null, bool destinatarioAusente = false)
        {
            try
            {
                var movimentacao = _DataContext.Movimentacao.FirstOrDefault(x => x.MocodTransporte == codTransporte && x.MocodEntregador != null);
                movimentacao.Modevolucao = devolucao;
                movimentacao.MoclienteNaoEncontrado = destinatarioAusente;
                if (devolucao == true)
                {
                    movimentacao.MoDataEntrega = null;
                    movimentacao.Momotivo = motivo;
                    movimentacao.MoDataEntrega = data;
                    movimentacao.MoObservacoes = observacoes;
                    var transporte = _DataContext.Transporte.FirstOrDefault(x => x.Cecodigo == codTransporte);
                    var entrada = _DataContext.Entrada.AsNoTracking().FirstOrDefault(x => x.Ercodigo == transporte.CecodEntrada);
                    entrada.ErcodUnidade = movimentacao.MocodUnidade;
                    var remetente = entrada.Erremetente;
                    entrada.Erremetente = entrada.ErcodCliente;
                    entrada.ErcodCliente = remetente;
                    //var itensEntrada = _DataContext.EntradaItens.FirstOrDefault(x => x.EicodEntrada == entrada.Ercodigo);
                    //entrada.EntradaItens.Add(itensEntrada);
                    using (var http = new HttpClient())
                    {
                        var json = JsonConvert.SerializeObject(entrada);
                        var dados = new StringContent(json, Encoding.UTF8, "application/json");
                        var reposta = await http.PostAsync("https://localhost:63605/Entradas/CreateDevolucao", dados);
                    };
                }
                else
                {
                    movimentacao.MoDataEntrega = data;
                    movimentacao.MoObservacoes = observacoes;
                }

                _DataContext.Entry(movimentacao).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                _DataContext.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
