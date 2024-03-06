﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class Transporte
    {
        public Transporte()
        {
            Devolucao = new HashSet<Devolucao>();
            Movimentacao = new HashSet<Movimentacao>();
        }

        public int Cecodigo { get; set; }
        public string CecodigoRastreio { get; set; }
        public int? CecodEntrada { get; set; }
        public int? CecodStatus { get; set; }
        public DateTime? Cedata { get; set; }
        public DateTime? CehoraCriacao { get; set; }

        public virtual Status CecodStatusNavigation { get; set; }
        public virtual ICollection<Devolucao> Devolucao { get; set; }
        public virtual ICollection<Movimentacao> Movimentacao { get; set; }
    }
}