﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class DistanciaUnidade
    {
        public int Ducodigo { get; set; }
        public int? DucodUnidadeOrigem { get; set; }
        public int? DucodUnidadeDestino { get; set; }
        public decimal? Dudistancia { get; set; }

        public virtual Unidades DucodUnidadeDestinoNavigation { get; set; }
        public virtual Unidades DucodUnidadeOrigemNavigation { get; set; }
    }
}