﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class TipoCliente
    {
        public TipoCliente()
        {
            Cliente = new HashSet<Cliente>();
        }

        public int Tccodigo { get; set; }
        public string Tcdescricao { get; set; }

        public virtual ICollection<Cliente> Cliente { get; set; }
    }
}