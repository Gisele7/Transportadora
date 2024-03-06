namespace Transportadora.Web.Models
{
    public class Rastreio
    {
        public int CodTransporte{ get; set; }
        public DateTime Data{ get; set; }
        public string Observacoes{ get; set; }
        public bool Devolucao { get; set; } 
        public string Motivo { get; set; }
        public bool DestinatarioAusente { get; set; }

    }
}
