using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using DAL.Meeting;
using Microsoft.AspNetCore.Mvc;
using DAL.Shared;
using Microsoft.Extensions.Configuration;
using INTO.Controllers.Shared;

namespace INTO.Controllers
{
    public class ComController : SecureController<ComController>
    {
        public ComController(IConfiguration configuration) : base(configuration) { }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Call(string dest)
        {
            return Content(TwilioBase.Call(dest));
        }

        public IActionResult SMS(string dest, string msg)
        {
            return Content(TwilioBase.SMS(dest, msg));
        }

        public IActionResult WApp(string dest = null, int? lang = 1, string msg = null)
        {
            return Content(TwilioBase.WhatsAppMsg(dest, msg));
        }

        public IActionResult ATVid()
        {
            return Content(TwilioBase.AccessTokenVideo());
        }

        public IActionResult NewTwilioAPIKey(string name)
        {
            return Content(TwilioBase.NewAPIKey(name));
        }

        public IActionResult CreateBoard()
        {
            HttpClient client = new HttpClient();

            client.DefaultRequestHeaders.Accept.Add(new
            MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("Authorization", "Bearer QYcJVz9KuF3pfZB5f6ENLn9FRCc");
            //string body = "{\"name\":\"HKBoard\",\"sharingPolicy\":{\"access\":\"private\",\"teamAccess\":\"private\"}}";
            object data = new
            {
                name = "HKBoard",
                sharingPolicy = new { access = "private", teamAccess = "private" }
            };
            var myContent = JsonConvert.SerializeObject(data);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, client.BaseAddress);
            HttpResponseMessage response =
            client.PostAsync("https://api.miro.com/v1/boards", byteContent).Result;

            //Http Status code 200
            if (response.IsSuccessStatusCode)
            {
                //Read response content result into string variable
                string strJson = response.Content.ReadAsStringAsync().Result;
                //Deserialize the string to JSON object
                dynamic jObj = (JObject)JsonConvert.DeserializeObject(strJson);
            }
            ViewBag.Url = string.Concat("https://miro.com/app/live-embed/", 3074457352563391173);
            return Ok();
        }
    }
}
