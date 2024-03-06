using Microsoft.EntityFrameworkCore.Internal;
using Transportadora.Model.Models;
using Transportadora.Web.Controllers;

namespace Transportadora.Web.ViewModel
{
    public class EntradaVM
    {
        public int CodigoEntrada { get; set; }
        public int? CodCliente { get; set; }
        public int? CodRemetente { get; set; }
        public string Remetente { get; set; }
        public string Cliente { get; set; }
        public string CPF { get; set; }
        public string CNPJ { get; set; }
        public int? CodPickup { get; set; }
        public string NumeroNotaFiscal { get; set; } = "";
        public decimal? Valor { get; set; }
        public string Numero { get; set; }
        public int CodUnidade { get; set; }
        public int CodUnidaDestino { get; set; }
        public string Unidade { get; set; }
        public string UnidadeDestino { get; set; }
        public bool? Urgente { get; set; }
        public bool? Fragil { get; set; }
        public bool? Agendado { get; set; }
        public bool? Seguro { get; set; }
        public List<EntradaItens> Itens { get; set; }
        public DateTime? DataAgendado { get; set; }
        public string NumeroRastreio { get; set; } = "";
        public decimal? ValorTotal { get; set; }


        public EntradaVM()
        {

        }

        public static List<EntradaVM> ListarEntradas(int codUnidade = 0, string termo = "")
        { 
            var retorno = new List<EntradaVM>();
            var db = new TRANSPORTADORAContext();
            var entradas = db.Entrada.ToList().Take(50);

            if (codUnidade > 0)
            {
                entradas = entradas.Where(x => x.ErcodUnidade == codUnidade).ToList();
            }

            foreach (var item in entradas)
            {
                var entradaVM = new EntradaVM();
                entradaVM.CodigoEntrada = item.Ercodigo;
                entradaVM.CodCliente = item.ErcodCliente;
                entradaVM.CodRemetente = item.Erremetente;
                entradaVM.Remetente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.Erremetente).Clnome;
                entradaVM.Cliente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clnome;
                entradaVM.CodUnidade = (int)item.ErcodUnidade;
                entradaVM.Numero = item.Ernumero;
                //entradaVM.CodUnidaDestino = (int)item.ErcodUnidadeDestino;
                entradaVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidade).Undescricao;
                //entradaVM.UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidadeDestino).Undescricao;
                entradaVM.CodPickup = item.ErcodPickup;
                entradaVM.NumeroNotaFiscal = item.ErnumeroNotaFiscal != null ? item.ErnumeroNotaFiscal.ToString() : "";
                entradaVM.Valor = item.Ervalor;
                entradaVM.Itens = db.EntradaItens.Where(x => x.EicodEntrada == item.Ercodigo).ToList();
                entradaVM.DataAgendado = item.ErdataAgendado;
                entradaVM.Fragil = item.Erfragil;
                entradaVM.Agendado = item.Eragendado;
                entradaVM.Seguro = item.Erseguro;
                entradaVM.Urgente = item.Erurgente;
                entradaVM.ValorTotal = item.ErvalorTotal;
                var transporte = db.Transporte.FirstOrDefault(x => x.CecodEntrada == item.Ercodigo);
                if (transporte != null)
                {
                    entradaVM.NumeroRastreio = transporte.CecodigoRastreio;
                }

                retorno.Add(entradaVM);
            }
            if (termo != "null")
            {
                return retorno.Where(x => x.NumeroRastreio.Contains(termo.ToUpper()) || x.NumeroNotaFiscal.ToString().Contains(termo) || x.Cliente.Contains(termo) || x.Unidade.Contains(termo)).ToList();
            }
            return retorno;
        }

        public static List<EntradaVM> PesquisarEntrada(int codCliente = 0, int codUnidade = 0)
        {
            var retorno = new List<EntradaVM>();
            var db = new TRANSPORTADORAContext();
            var entradas = db.Entrada.ToList();

            if (codCliente > 0)
            {
                entradas = entradas.Where(x => x.ErcodCliente == codCliente).ToList();
            }
            if (codUnidade > 0)
            {
                entradas = entradas.Where(x => x.ErcodUnidade == codUnidade).ToList();
            }

            foreach (var item in entradas)
            {
                var entradaVM = new EntradaVM();
                entradaVM.CodigoEntrada = item.Ercodigo;
                entradaVM.CodCliente = item.ErcodCliente;
                entradaVM.CodRemetente = item.Erremetente;
                entradaVM.Remetente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.Erremetente).Clnome;
                entradaVM.Cliente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clnome;
                entradaVM.Numero = item.Ernumero;
                entradaVM.CodUnidade = (int)item.ErcodUnidade;
                //entradaVM.CodUnidaDestino = (int)item.ErcodUnidadeDestino;
                entradaVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidade).Undescricao;
                //entradaVM.UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidadeDestino).Undescricao;
                entradaVM.CodPickup = item.ErcodPickup;
                entradaVM.NumeroNotaFiscal = item.ErnumeroNotaFiscal != null ? item.ErnumeroNotaFiscal.ToString() : "";
                entradaVM.Valor = item.Ervalor;
                entradaVM.Itens = db.EntradaItens.Where(x => x.EicodEntrada == item.Ercodigo).ToList();
                entradaVM.DataAgendado = item.ErdataAgendado;
                entradaVM.Fragil = item.Erfragil;
                entradaVM.Urgente = item.Erurgente;
                entradaVM.Seguro = item.Erseguro;
                entradaVM.Agendado = item.Eragendado;
                entradaVM.ValorTotal = item.ErvalorTotal;


                retorno.Add(entradaVM);
            }
            return retorno;
        }

        public static EntradaVM SelecionaEntrada(int codEntrada)
        {
            var db = new TRANSPORTADORAContext();
            var entrada = db.Entrada.FirstOrDefault(x => x.Ercodigo == codEntrada);
            var retorno = new EntradaVM();

            if (entrada != null)
            {
                retorno.CodigoEntrada = entrada.Ercodigo;
                retorno.CodCliente = entrada.ErcodCliente;
                retorno.CodRemetente = entrada.Erremetente;
                retorno.Remetente = db.Cliente.FirstOrDefault(x => x.Clcodigo == entrada.Erremetente).Clnome;
                retorno.Cliente = db.Cliente.FirstOrDefault(x => x.Clcodigo == entrada.ErcodCliente).Clnome;
                retorno.Numero = entrada.Ernumero;
                retorno.CodUnidade = (int)entrada.ErcodUnidade;
                retorno.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == entrada.ErcodUnidade).Undescricao;
                //retorno.CodUnidaDestino = (int)entrada.ErcodUnidadeDestino;
                //retorno.UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == entrada.ErcodUnidadeDestino).Undescricao;  
                retorno.CodPickup = entrada.ErcodPickup;
                retorno.NumeroNotaFiscal = entrada.ErnumeroNotaFiscal != null ? entrada.ErnumeroNotaFiscal.ToString() : "";
                retorno.Valor = entrada.Ervalor;
                retorno.Itens = db.EntradaItens.Where(x => x.EicodEntrada == entrada.Ercodigo).ToList();
                retorno.DataAgendado = entrada.ErdataAgendado;
                retorno.Fragil = entrada.Erfragil;
                retorno.Urgente = entrada.Erurgente;
                retorno.Seguro = entrada.Erseguro;
                retorno.Agendado = entrada.Eragendado;
                retorno.ValorTotal = entrada.ErvalorTotal;


            }

            return retorno;
        }

        public static List<EntradaVM> ListarTransportesNaoIniciados(int ano, int mes)
        {
            var retorno = new List<EntradaVM>();
            var db = new TRANSPORTADORAContext();

            var entradasNaoIniciadas = new List<Entrada>();
            if (mes == 0)
            {
                entradasNaoIniciadas = db.Entrada.Where(x => x.ErtransporteIniciado == false && x.Erdata.Year == ano).ToList();
            }
            else
            {
                entradasNaoIniciadas = db.Entrada.Where(x => x.ErtransporteIniciado == false && x.Erdata.Year == ano && x.Erdata.Month == mes).ToList();
            }


            foreach (var item in entradasNaoIniciadas)
            {
                var entradaVM = new EntradaVM();
                entradaVM.CodigoEntrada = item.Ercodigo;
                entradaVM.CodCliente = item.ErcodCliente;
                entradaVM.Cliente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clnome;
                entradaVM.CodRemetente = item.Erremetente;
                entradaVM.Remetente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.Erremetente).Clnome;
                entradaVM.CodUnidade = (int)item.ErcodUnidade;
                entradaVM.Numero = item.Ernumero;
                //entradaVM.CodUnidaDestino = (int)item.ErcodUnidadeDestino;
                entradaVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidade).Undescricao;
                //entradaVM.UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidadeDestino).Undescricao;
                entradaVM.CodPickup = item.ErcodPickup;
                entradaVM.NumeroNotaFiscal = item.ErnumeroNotaFiscal != null ? item.ErnumeroNotaFiscal.ToString() : "";
                entradaVM.Valor = item.Ervalor;
                entradaVM.Itens = db.EntradaItens.Where(x => x.EicodEntrada == item.Ercodigo).ToList();
                entradaVM.DataAgendado = item.ErdataAgendado;
                entradaVM.Fragil = item.Erfragil;
                entradaVM.Urgente = item.Erurgente;
                entradaVM.Seguro = item.Erseguro;
                entradaVM.Agendado = item.Eragendado;
                entradaVM.ValorTotal = item.ErvalorTotal;

                retorno.Add(entradaVM);
            }
            return retorno;
        }

        public static List<EntradaVM> ListarTransportesNaoIniciadosPorUsuario()
        {
            var retorno = new List<EntradaVM>();
            var db = new TRANSPORTADORAContext();

            var entradasNaoIniciadas = db.Entrada.Where(x => x.ErtransporteIniciado == true).ToList();

            foreach (var item in entradasNaoIniciadas)
            {
                var entradaVM = new EntradaVM();
                entradaVM.CodigoEntrada = item.Ercodigo;
                entradaVM.CodCliente = item.ErcodCliente;
                entradaVM.Cliente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clnome;
                entradaVM.CodRemetente = item.Erremetente;
                entradaVM.Remetente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.Erremetente).Clnome;
                entradaVM.CPF = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clcpf;
                entradaVM.CNPJ = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clcnpj;
                entradaVM.CodUnidade = (int)item.ErcodUnidade;
                entradaVM.Numero = item.Ernumero;
                //entradaVM.CodUnidaDestino = (int)item.ErcodUnidadeDestino;
                entradaVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidade).Undescricao;
                //entradaVM.UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidadeDestino).Undescricao;
                entradaVM.CodPickup = item.ErcodPickup;
                entradaVM.NumeroNotaFiscal = item.ErnumeroNotaFiscal != null ? item.ErnumeroNotaFiscal.ToString() : "";
                entradaVM.Valor = item.Ervalor;
                entradaVM.Itens = db.EntradaItens.Where(x => x.EicodEntrada == item.Ercodigo).ToList();
                entradaVM.DataAgendado = item.ErdataAgendado;
                entradaVM.Fragil = item.Erfragil;
                entradaVM.Urgente = item.Erurgente;
                entradaVM.Seguro = item.Erseguro;
                entradaVM.Agendado = item.Eragendado;
                entradaVM.ValorTotal = item.ErvalorTotal;

                retorno.Add(entradaVM);
            }
            return retorno;
        }

        public static List<EntradaVM> ListarEntradasAgendadas(int ano, int mes)
        {
            var retorno = new List<EntradaVM>();
            var db = new TRANSPORTADORAContext();

            var entradasAgendadas = new List<Entrada>();
            if(mes == 0)
            {
                entradasAgendadas = db.Entrada.Where(x => x.Eragendado == true && x.ErdataAgendado.Value.Year == ano).ToList();
            }
            else
            {
                entradasAgendadas = db.Entrada.Where(x => x.Eragendado == true && x.ErdataAgendado.Value.Year == ano && x.ErdataAgendado.Value.Month == mes).ToList();
            }

            foreach (var item in entradasAgendadas)
            {
                var entradaVM = new EntradaVM();
                entradaVM.CodigoEntrada = item.Ercodigo;
                entradaVM.CodCliente = item.ErcodCliente;
                entradaVM.Cliente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clnome;
                entradaVM.CPF = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clcpf;
                entradaVM.CNPJ = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clcnpj;
                entradaVM.CodUnidade = (int)item.ErcodUnidade;
                entradaVM.Numero = item.Ernumero;
                //entradaVM.CodUnidaDestino = (int)item.ErcodUnidadeDestino;
                entradaVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidade).Undescricao;
                //entradaVM.UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidadeDestino).Undescricao;
                entradaVM.CodPickup = item.ErcodPickup;
                entradaVM.NumeroNotaFiscal = item.ErnumeroNotaFiscal != null ? item.ErnumeroNotaFiscal.ToString() : "";
                entradaVM.Valor = item.Ervalor;
                entradaVM.Itens = db.EntradaItens.Where(x => x.EicodEntrada == item.Ercodigo).ToList();
                entradaVM.DataAgendado = item.ErdataAgendado;
                entradaVM.Fragil = item.Erfragil;
                entradaVM.Urgente = item.Erurgente;
                entradaVM.Seguro = item.Erseguro;
                entradaVM.Agendado = item.Eragendado;
                entradaVM.ValorTotal = item.ErvalorTotal;

                retorno.Add(entradaVM);
            }
            return retorno;
        }

        public static List<EntradaVM> ListarEntradasPorCPF(string CPFCNPJ)
        {
            var retorno = new List<EntradaVM>();
            var db = new TRANSPORTADORAContext();

            var cliente = db.Cliente.FirstOrDefault(x => x.Clcpf == CPFCNPJ || x.Clcnpj == CPFCNPJ);
            var entradasAgendadas = db.Entrada.Where(x => x.ErcodCliente == cliente.Clcodigo && x.ErtransporteIniciado == true).ToList().OrderByDescending(x => x.Erdata);

            foreach (var item in entradasAgendadas)
            {
                var entradaVM = new EntradaVM();
                entradaVM.CodigoEntrada = item.Ercodigo;
                entradaVM.CodCliente = item.ErcodCliente;
                entradaVM.Cliente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clnome;
                entradaVM.CPF = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clcpf;
                entradaVM.CNPJ = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clcnpj;
                entradaVM.CodUnidade = (int)item.ErcodUnidade;
                entradaVM.Numero = item.Ernumero;
                //entradaVM.CodUnidaDestino = (int)item.ErcodUnidadeDestino;
                entradaVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidade).Undescricao;
                //entradaVM.UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidadeDestino).Undescricao;
                entradaVM.CodPickup = item.ErcodPickup;
                entradaVM.NumeroNotaFiscal = item.ErnumeroNotaFiscal != null ? item.ErnumeroNotaFiscal.ToString() : "";
                entradaVM.Valor = item.Ervalor;
                entradaVM.Itens = db.EntradaItens.Where(x => x.EicodEntrada == item.Ercodigo).ToList();
                entradaVM.DataAgendado = item.ErdataAgendado;
                entradaVM.Fragil = item.Erfragil;
                entradaVM.Urgente = item.Erurgente;
                entradaVM.Seguro = item.Erseguro;
                entradaVM.Agendado = item.Eragendado;
                entradaVM.ValorTotal = item.ErvalorTotal;

                retorno.Add(entradaVM);
            }
            return retorno;
        }

        public static List<EntradaVM> ListarEntradasIniciadas(int ano, int mes)
        {
            var retorno = new List<EntradaVM>();
            var db = new TRANSPORTADORAContext();

            var entradasIniciadas = new List<Entrada>();
            if (mes == 0)
            {
                entradasIniciadas = db.Entrada.Where(x => x.ErtransporteIniciado == true && x.Erdata.Year == ano).ToList();
            }
            else
            {
                entradasIniciadas = db.Entrada.Where(x => x.ErtransporteIniciado == true && x.Erdata.Year == ano && x.Erdata.Month == mes).ToList();
            }

            foreach (var item in entradasIniciadas)
            {
                var entradaVM = new EntradaVM();
                entradaVM.CodigoEntrada = item.Ercodigo;
                entradaVM.CodCliente = item.ErcodCliente;
                entradaVM.Cliente = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clnome;
                entradaVM.CPF = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clcpf;
                entradaVM.CNPJ = db.Cliente.FirstOrDefault(x => x.Clcodigo == item.ErcodCliente).Clcnpj;
                entradaVM.CodUnidade = (int)item.ErcodUnidade;
                entradaVM.Numero = item.Ernumero;
                //entradaVM.CodUnidaDestino = (int)item.ErcodUnidadeDestino;
                entradaVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidade).Undescricao;
                //entradaVM.UnidadeDestino = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.ErcodUnidadeDestino).Undescricao;
                entradaVM.CodPickup = item.ErcodPickup;
                entradaVM.NumeroNotaFiscal = item.ErnumeroNotaFiscal != null ? item.ErnumeroNotaFiscal.ToString() : "";
                entradaVM.Valor = item.Ervalor;
                entradaVM.Itens = db.EntradaItens.Where(x => x.EicodEntrada == item.Ercodigo).ToList();
                entradaVM.DataAgendado = item.ErdataAgendado;
                entradaVM.Fragil = item.Erfragil;
                entradaVM.Urgente = item.Erurgente;
                entradaVM.Seguro = item.Erseguro;
                entradaVM.Agendado = item.Eragendado;
                entradaVM.ValorTotal = item.ErvalorTotal;

                retorno.Add(entradaVM);
            }
            return retorno;
        }
    }
}