﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class Grupo
    {
        public Grupo()
        {
            GrupoUsuario = new HashSet<GrupoUsuario>();
        }

        public int Gpcodigo { get; set; }
        public string Gpdescricao { get; set; }

        public virtual ICollection<GrupoUsuario> GrupoUsuario { get; set; }
    }
}