using Newtonsoft.Json.Linq;
using Transportadora.Model.Models;
using Transportadora.Web.Models;

namespace Transportadora.Web.Helpers
{
    public class Funcoes
    {
        public async static Task<GeoLocalizacao> RetornaLatitudeLongitude(Endereco endereco)
        {
            var retorno = new GeoLocalizacao();
            using (var http = new HttpClient())
            {
                var bairro = endereco.Enbairro.Replace(' ', '+');
                var logradouro = endereco.Enlogradouro.Replace(' ', '+');
                var cidade = endereco.Encidade.Replace(' ', '+');

                var urlBase = "https://maps.googleapis.com/maps/api/geocode/json?";
                var response = await http.GetAsync($"{urlBase}address={logradouro}+{endereco.Ennumero},{bairro},{cidade},{endereco.Enestado}&key=AIzaSyBXuoBcyNzqbObSA5e403g1zx66UAXP39E");
                JObject dados = JObject.Parse(await response.Content.ReadAsStringAsync());
                var results = dados.Root;

                var latitude = dados["results"].First["geometry"]["location"]["lat"];
                var longitude = dados["results"].First["geometry"]["location"]["lng"];
                retorno.Latitude = double.Parse(latitude.ToString());
                retorno.Longitude = double.Parse(longitude.ToString());
                //ViewBag.place_id = dados["results"].First["place_id"];
                
                return retorno;
            }
        }
    }
}
