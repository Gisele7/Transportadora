using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public  class RepositoryTransporte : RepositoryBase<Transporte>, ITransporte
    {
        public RepositoryTransporte(bool SaveChanges = true) : base(SaveChanges)
        {

        }


        public string GerarCodigoRastreio()
        {
            var contador = _DataContext.Transporte.Where(x => x.Cedata.Value.Month == DateTime.Now.Month && x.Cedata.Value.Year == DateTime.Now.Year).Count();
            if (contador == 0)
            {
                return "TR" + DateTime.Now.Month.ToString().PadLeft(2, '0')  + DateTime.Now.Year.ToString();
            }
            else
            {
                return "TR" + contador.ToString().PadLeft(3, '0') + DateTime.Now.Month.ToString().PadLeft(2, '0') + DateTime.Now.Year.ToString();
            }
        }

        public Transporte IniciarTransporte(int codEntrada)
        {
            Transporte transporte = new Transporte();
            transporte.Cedata = DateTime.Now;
            transporte.CecodigoRastreio = GerarCodigoRastreio();
            transporte.CecodEntrada = codEntrada;
            transporte.CecodStatus = 1; // arrumar

            _DataContext.Entry(transporte).State = Microsoft.EntityFrameworkCore.EntityState.Added;
            _DataContext.SaveChanges();

            var entrada = _DataContext.Entrada.FirstOrDefault(x => x.Ercodigo == codEntrada);

            entrada.ErtransporteIniciado = true;
            _DataContext.Entry(entrada).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _DataContext.SaveChanges();

            Movimentacao movimentacao = new Movimentacao();
            movimentacao.MotipoMovimentacao = "E";
            movimentacao.MoDataHora = DateTime.Now;
            movimentacao.MocodTransporte = transporte.Cecodigo;
            movimentacao.MocodUnidade = entrada.ErcodUnidade;
            _DataContext.Entry(movimentacao).State = Microsoft.EntityFrameworkCore.EntityState.Added;
            _DataContext.SaveChanges();

            return transporte;

        }

    }
}
