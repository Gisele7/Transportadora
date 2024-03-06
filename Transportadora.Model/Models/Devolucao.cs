﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class Devolucao
    {
        public int Decodigo { get; set; }
        public int? DecodUnidadeOrigem { get; set; }
        public int? DecodUnidadeDestino { get; set; }
        public string Depeso { get; set; }
        public int? DecodClienteEntrega { get; set; }
        public int? DecodStatus { get; set; }
        public decimal? Cevalor { get; set; }
        public int? DecodTransporte { get; set; }

        public virtual Status DecodStatusNavigation { get; set; }
        public virtual Transporte DecodTransporteNavigation { get; set; }
        public virtual Unidades DecodUnidadeDestinoNavigation { get; set; }
        public virtual Unidades DecodUnidadeOrigemNavigation { get; set; }
    }
}