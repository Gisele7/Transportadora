﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class Pickup
    {
        public Pickup()
        {
            Entrada = new HashSet<Entrada>();
        }

        public int Pccodigo { get; set; }
        public int? PccodCliente { get; set; }
        public DateTime? Pcdata { get; set; }
        public int? PccodEntregador { get; set; }
        public string Pcobservacao { get; set; }
        public int? PccodUnidade { get; set; }
        public int? Pcdistancia { get; set; }
        public string Pcnumero { get; set; }

        public virtual Entregadores PccodEntregadorNavigation { get; set; }
        public virtual Unidades PccodUnidadeNavigation { get; set; }
        public virtual ICollection<Entrada> Entrada { get; set; }
    }
}