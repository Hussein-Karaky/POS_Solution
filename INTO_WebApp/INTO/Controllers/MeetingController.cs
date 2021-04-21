using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using INTO.Controllers.Shared;
using Microsoft.Extensions.Configuration;
using BLL.Shared.Collaboration;
using Newtonsoft.Json;
using DAL.Shared;

namespace INTO.Controllers
{
    public class MeetingController : SecureController<MeetingController>
    {
        public MeetingController(IConfiguration configuration) : base(configuration) { }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult TokenHst()
        {
            string apiKey = "gChSzqMZQLav35uSAH0Yvg";// "apiKey";
            string apiSecret = "1eEmhjoEvMADjRAQS5xYJQhN4zXeoeDzjnJq";// "apiSecret";
            string meetingNumber = "";
            String ts = (Zoom.Program.ToTimestamp(DateTime.UtcNow.ToUniversalTime()) - 30000).ToString();
            string role = "1";
            string token = Zoom.Program.GenerateToken(apiKey, apiSecret, meetingNumber, ts, role);
            return Content(token);
            //return Json(new { signature = token });
        }
        public IActionResult Token()
        {
            string apiKey = "gChSzqMZQLav35uSAH0Yvg";// "apiKey";
            string apiSecret = "1eEmhjoEvMADjRAQS5xYJQhN4zXeoeDzjnJq";// "apiSecret";
            string meetingNumber = "77722030286";
            String ts = (Zoom.Program.ToTimestamp(DateTime.UtcNow.ToUniversalTime()) - 30000).ToString();
            string role = "0";
            string token = Zoom.Program.GenerateToken(apiKey, apiSecret, meetingNumber, ts, role);

            return Content(token);
            //return Json(new { signature = token });
        }

        public IActionResult JWT()
        {
            var client = new RestSharp.RestClient("https://api.zoom.us/v2/users?status=active&page_size=30&page_number=1");
            var request = new RestRequest(Method.GET);
            request.AddHeader("content-type", "application/json");
            request.AddHeader("authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImdDaFN6cU1aUUxhdjM1dVNBSDBZdmciLCJleHAiOjE2MDUwOTQ2MjcsImlhdCI6MTYwNTA4OTIyN30.yJlshQdeshG4klm_bdOidY6eX-fz5qOvRo61KY6ScfI");
            IRestResponse response = client.Execute(request);
            return Content(Convert.ToBase64String(response.RawBytes));
        }

        public IActionResult Schedule()
        {
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                return View(model);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult SaveRoom(string json, int tzOffset, int lang = 1)
        {
            VirtualRoom room = null;
            if (json != null && json.Length > 0)
            {
                room = JsonConvert.DeserializeObject<VirtualRoom>(json);

            }
            return Json(ScheduleDB.SaveRoom(room, tzOffset, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }

        [Route("meeting/ScheduledBy/{host}/{tZOS}/{lang?}", Order = 1)]
        public IActionResult ScheduledBy(long host, int tZOS, int lang = 1)
        {
            return Json(ScheduleDB.ScheduledBy(host, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }

        [Route("meeting/ScheduledTo/{participant}/{tZOS}/{lang?}", Order = 1)]
        public IActionResult ScheduledTo(long participant, int tZOS, int lang = 1)
        {
            return Json(ScheduleDB.ScheduledTo(participant, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }

        [Route("meeting/RoomInfo/{id}/{tZOS}/{lang?}", Order = 1)]
        public IActionResult RoomInfo(long id, int tZOS, int lang)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                ViewBag.RoomId = id;
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        //[Route("meeting/room/{id}/{tZOS}/{lang?}", Order = 1)]
        public IActionResult Room(long id, int tZOS, int lang = 1)
        {
            return Json(ScheduleDB.Room(id, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }

        //[Route("meeting/Scheduled/{roomId}/{tZOS}/{lang?}", Order = 1)]
        public IActionResult Scheduled(long roomId, int tZOS, int lang = 1)
        {
            return Json(ScheduleDB.Room(roomId, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        [Route("meeting/confirm/{eventId}/{user}/{tZOS}/{lang?}", Order = 1)]
        public IActionResult Confirm(long eventId, long user, int tZOS, int lang = 1)
        {
            bool confirmed = ScheduleDB.Confirm(eventId, user, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            string jsFunction = "greet(\"Meeting confirmed!\");";
            if (!confirmed)
            {
                jsFunction = "warn(\"Meeting could not be confirmed! please contact our staff. Thank you\");";
            }
            TempData["JavaScriptFunction"] = jsFunction;
            return RedirectToAction("Index", "Home");
        }
        [Route("meeting/excuse/{eventId}/{user}/{tzOs}/{lang?}", Order = 1)]
        public IActionResult Excuse(long eventId, long user, int tzOs, int lang = 1)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                ViewBag.EventId = eventId;
                ViewBag.UserId = user;
                ViewBag.Lang = lang;
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction, new { EventId = eventId, User = user, TzOs = tzOs, Lang = lang });
        }
        public IActionResult Postponed(long eventId, long userId, int tzOs, string excuse, int lang = 1)
        {
            ViewBag.EventId = eventId;
            ViewBag.UserId = userId;
            ViewBag.Lang = lang;
            //return Json(ScheduleDB.Reject(eventId, user, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
            return View();
        }

        public IActionResult Join(long id, long participant, int tzOffset, int lang = 1)
        {
            return Json(ScheduleDB.Join(id, participant, tzOffset, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }

        public IActionResult Abandon(long id, long participant, byte rating, string feedback, int tzOffset, int lang = 1)
        {
            return Json(ScheduleDB.Abandon(id, participant, rating, feedback, tzOffset, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
    }
}
