using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;

namespace Transportadora.Model.Repositories
{
    public class RepositoryEntrada : RepositoryBase<Entrada>, IEntrada
    {
        public RepositoryEntrada(bool SaveChanges = true) : base(SaveChanges)
        {

        }

        public string GerarNumero()
        {
            var contador = _DataContext.Entrada.Where(x => x.Erdata.Month == DateTime.Now.Month && x.Erdata.Year == DateTime.Now.Year).Count() + 1;
            if (contador == 0)
            {
                return "EN-001-" + DateTime.Now.Month.ToString().PadLeft(2, '0') + "-" + DateTime.Now.Year.ToString();
            }
            else
            {
                return "EN-" + contador.ToString().PadLeft(3, '0') + "-" + DateTime.Now.Month.ToString().PadLeft(2, '0') + "-" + DateTime.Now.Year.ToString();
            }
        }

        public void AlterarEntrada(Entrada entrada, List<EntradaItens> itens)
        {
            _DataContext.Entry(entrada).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _DataContext.SaveChanges();

            var entradaItens = _DataContext.EntradaItens.Where(x => x.EicodEntrada == entrada.Ercodigo).ToList();

            _DataContext.RemoveRange(entradaItens);
            _DataContext.SaveChanges();

            foreach (var item in itens)
            {
                item.EicodEntrada = entrada.Ercodigo;
                _DataContext.Entry(item).State = Microsoft.EntityFrameworkCore.EntityState.Added;
                _DataContext.SaveChanges();
            }
        }

        public void IncluirDevolucao(Entrada entrada, Entrada devolucao)
        {
            var itensEntrada = _DataContext.EntradaItens.AsNoTracking().Where(x => x.EicodEntrada == entrada.Ercodigo).ToList();
            _DataContext.Entry(devolucao).State = EntityState.Added;
            _DataContext.SaveChanges();

            foreach (var item in itensEntrada)
            {
                var entradaItem = new EntradaItens()
                {
                    Eialtura = item.Eialtura,
                    Eicomprimento = item.Eicomprimento,
                    Eidescricao = item.Eidescricao,
                    Eilargura = item.Eilargura,
                    Eipeso = item.Eipeso,
                    Eivalor = item.Eivalor,
                    EicodEntrada = devolucao.Ercodigo
                };
                _DataContext.SaveChanges();
                _DataContext.Entry(entradaItem).State = Microsoft.EntityFrameworkCore.EntityState.Added;
            };
        }
    }
}
