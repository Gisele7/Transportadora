﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class GrupoUsuario
    {
        public int Gucodigo { get; set; }
        public int? GucodGrupo { get; set; }
        public int? GucodUsuario { get; set; }

        public virtual Grupo GucodGrupoNavigation { get; set; }
        public virtual Usuario GucodUsuarioNavigation { get; set; }
    }
}