using Transportadora.Model.Models;



namespace Transportadora.Web.ViewModel

{

    public class UsuarioVM

    {

        public string Nome { get; set; }

        public string Senha { get; set; }

        public string Unidade { get; set; }

        public int? CodUnidade { get; set; }

        public List<GrupoUsuario> GrupoUsuario { get; set; }
        public List<Grupo> Grupos { get; set; }
        public bool Administrador { get; set; } = false;



        public UsuarioVM()

        {



        }



        public static List<UsuarioVM> ListarUsuarios()
        {
            var db = new TRANSPORTADORAContext();
            var retorno = new List<UsuarioVM>();
            var listaUsuarios = db.Usuario.ToList();
            

            foreach (var item in listaUsuarios)
            {

                UsuarioVM usuarioVM = new UsuarioVM();

                usuarioVM.Nome = item.Usnome;
                usuarioVM.Senha = item.Ussenha;
                usuarioVM.CodUnidade = item.UscodUnidade;

                if (item.UscodUnidade != null)

                {

                    usuarioVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == item.UscodUnidade).Undescricao;

                }

                usuarioVM.GrupoUsuario = db.GrupoUsuario.Where(x => x.GucodUsuario == item.Uscodigo).ToList();
                var listaGrupos = usuarioVM.GrupoUsuario.Select(x => x.GucodGrupo).ToList();
                usuarioVM.Grupos = (from p in db.Grupo where listaGrupos.Contains(p.Gpcodigo) select p).ToList();
                retorno.Add(usuarioVM);

            }



            return retorno;

        }



        public static UsuarioVM SelecionarUsuario(int codUsuario)

        {

            var db = new TRANSPORTADORAContext();
            var usuario = db.Usuario.Find(codUsuario);

            UsuarioVM usuarioVM = new UsuarioVM();



            if (usuario != null)
            {
                var grupoAdmin = db.GrupoUsuario.FirstOrDefault(x => x.GucodUsuario == usuario.Uscodigo && x.GucodGrupo == 1);

                usuarioVM.Administrador = grupoAdmin == null ? false : true;
                usuarioVM.Nome = usuario.Usnome;
                usuarioVM.Senha = usuario.Ussenha;
                usuarioVM.CodUnidade = (int)usuario.UscodUnidade;

                usuarioVM.Unidade = db.Unidades.FirstOrDefault(x => x.Uncodigo == usuario.UscodUnidade).Undescricao;

                usuarioVM.GrupoUsuario = db.GrupoUsuario.Where(x => x.GucodUsuario == usuario.Uscodigo).ToList();

            }



            return usuarioVM;

        }

    }

}