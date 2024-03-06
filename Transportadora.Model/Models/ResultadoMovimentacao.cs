namespace Transportadora.Model.Models
{
    public class ResultadoMovimentacao
    {
        public bool RotaCorreta { get; set; }
        public bool UltimaEtapa { get; set; }
        public bool Erro { get; set; } = false;
        public string Mensagem { get; set; }

        public ResultadoMovimentacao()
        {
                
        }
    }
}
