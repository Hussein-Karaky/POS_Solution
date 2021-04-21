using BLL.Shared;
using BLL.Shared.Auth;
using BLL.Shared.Collaboration;
using BLL.Shared.Struct;
using BLL.Tutor;
using DAL.Shared;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;

namespace INTO.Controllers
{
    public class CollaborationController : SecureController<CollaborationController>
    {
        public CollaborationController(IConfiguration config) : base(config) { }

        public IActionResult Index2(LoginModel loginModel)
        {
            if (loginModel != null && loginModel.User != null)
            {
                return View(loginModel);
            }
            string userStr = HttpContext.Request.Cookies["user"];
            if (userStr != null && userStr.Length > 0)
            {
                User user = JsonConvert.DeserializeObject<User>(userStr);
                if (user != null)
                {
                    loginModel = new LoginModel
                    {
                        User = user,
                        Token = new AccessToken { Approved = false }
                    };
                    TempData["LoginModel"] = JsonConvert.SerializeObject(loginModel);
                    return View(loginModel);
                }
            }
            //if (loginModel == null || loginModel.Token == null || !loginModel.Token.Approved)
            //{
            //    //loginModel.RedirectAction = "EClass";
            //    loginModel.RedirectController = "Collaboration";
            //    return base.AssureLogin(new LoginModel { RedirectController = "Collaboration" });
            //}
            return View(loginModel);
        }
        public IActionResult EClass2()
        {
            LoginModel loginModel = null;
            if (TempData["LoginModel"] != null)
            {
                string userStr = TempData["LoginModel"].ToString();
                loginModel = userStr != null ? JsonConvert.DeserializeObject<TutorModel>(userStr) : new LoginModel();
                if (loginModel != null && loginModel.User != null)
                {
                    TempData.Keep("LoginModel");
                    return View(loginModel);
                }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        [Route("collaboration/room/{id}/{tZOS}/{lang?}", Order = 1)]
        public IActionResult Room(long id, int tZOS, int lang)
        {
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                DataList<Event> events = ScheduleDB.Room(id, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                if (events.Data.Count > 0)
                {
                    IEnumerator<Event> enumerator = events.Data.GetEnumerator();
                    enumerator.MoveNext();
                    if (enumerator.Current.Running && enumerator.Current.Joined.Contains(model.User.UserId))
                    {
                        string jsFunction = "warn(\"You are alrady in room! If you feel anything wrong please login again.\");";
                        TempData["JavaScriptFunction"] = jsFunction;
                        return RedirectToAction("Index", "Home");
                    }
                    ViewBag.Event = enumerator.Current;
                }
                return View(model);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        [Route("collaboration/trialroom/{id}/{tZOS}/{lang?}", Order = 1)]
        public IActionResult TrialRoom(string id, int tZOS, int lang)
        {
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                ViewBag.RoomId = id;
                return View(model);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult Index()
        {
            LoginModel loginModel = null;
            if (TempData["LoginModel"] != null)
            {
                string userStr = TempData["LoginModel"].ToString();
                loginModel = userStr != null ? JsonConvert.DeserializeObject<LoginModel>(userStr) : new LoginModel();
            }
            else
    if (TempData["TutorModel"] != null)
            {
                TempData.Keep("TutorModel");
                string userStr = TempData["TutorModel"].ToString();
                //HttpContext.Response.Coo\kies.Append("tutor", userStr, cookieOptions);
                loginModel = userStr != null ? JsonConvert.DeserializeObject<TutorModel>(userStr) : new TutorModel();
            }
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
                ViewBag.Url = string.Concat("https://miro.com/app/live-embed/", 3074457352563391173);
                if (loginModel != null)
                {
                    return View(loginModel);
                }
            }
            return RedirectToAction("Logout", "Login");
        }
        public IActionResult GetRoom(long id, int tZOS, int lang = 1)
        {
            return Json(ScheduleDB.Room(id, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
    }
}
