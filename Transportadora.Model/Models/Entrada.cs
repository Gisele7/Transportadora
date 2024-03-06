﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Transportadora.Model.Models
{
    public partial class Entrada
    {
        public Entrada()
        {
            EntradaItens = new HashSet<EntradaItens>();
            Ocorrencia = new HashSet<Ocorrencia>();
            Rota = new HashSet<Rota>();
        }

        public int Ercodigo { get; set; }
        public int? ErcodCliente { get; set; }
        public int? ErcodPickup { get; set; }
        public int? ErnumeroNotaFiscal { get; set; }
        public decimal? Ervalor { get; set; }
        public int? ErcodUnidade { get; set; }
        public int? ErcodUnidadeDestino { get; set; }
        public DateTime Erdata { get; set; }
        public string Ernumero { get; set; }
        public bool? ErtransporteIniciado { get; set; }
        public DateTime? ErdataAgendado { get; set; }
        public bool? Erfragil { get; set; }
        public bool? Erurgente { get; set; }
        public bool? Eragendado { get; set; }
        public int? Erremetente { get; set; }
        public bool? Erseguro { get; set; }
        public decimal? ErvalorTotal { get; set; }

        public virtual Cliente ErcodClienteNavigation { get; set; }
        public virtual Pickup ErcodPickupNavigation { get; set; }
        public virtual Unidades ErcodUnidadeDestinoNavigation { get; set; }
        public virtual Unidades ErcodUnidadeNavigation { get; set; }
        public virtual ICollection<EntradaItens> EntradaItens { get; set; }
        public virtual ICollection<Ocorrencia> Ocorrencia { get; set; }
        public virtual ICollection<Rota> Rota { get; set; }
    }
}