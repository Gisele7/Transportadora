﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class Movimentacao
    {
        public int Mocodigo { get; set; }
        public int? MocodTransporte { get; set; }
        public DateTime? MoDataHora { get; set; }
        public string MotipoMovimentacao { get; set; }
        public int? MocodUsuario { get; set; }
        public int? MocodUnidade { get; set; }
        public int? MocodEntregador { get; set; }
        public bool? MoforaRota { get; set; }
        public int? MocoEntregador { get; set; }
        public DateTime? MoDataEntrega { get; set; }
        public string MoObservacoes { get; set; }
        public bool? Modevolucao { get; set; }
        public bool? MoclienteNaoEncontrado { get; set; }
        public string Momotivo { get; set; }

        public virtual Entregadores MocoEntregadorNavigation { get; set; }
        public virtual Entregadores MocodEntregadorNavigation { get; set; }
        public virtual Transporte MocodTransporteNavigation { get; set; }
        public virtual Unidades MocodUnidadeNavigation { get; set; }
    }
}