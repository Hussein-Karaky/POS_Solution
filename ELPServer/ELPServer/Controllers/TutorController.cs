using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.Shared;
using BLL.Tutor;
using DAL.Shared;
using DAL.Tutor;
using ELPServer.Controllers.Shared;
using ELPServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace ELPServer.Controllers
{
    public class TutorController : AppController<TutorController>
    {
        public TutorController(IConfiguration configuration) : base(configuration) { }
        // GET: TutorController
        public ActionResult Index()
        {
            return View();
        }

        // GET: TutorController/Details/5
        public ActionResult DetailsSvc(int id)
        {
            return Json(TutorDB.FetchProfile(id));// new { data= "Tutor data" });
        }

        public ActionResult SaveSvc(string json)
        {
            Tutor tutor = JsonConvert.DeserializeObject<Tutor>(json);
            return Json(TutorDB.FetchProfile(1));// new { data= "Tutor data" });
        }
        public ActionResult SaveAvailSvc(string json)
        {
            Availability avail = JsonConvert.DeserializeObject<Availability>(json);
            ScheduleDB.SaveAvailability(avail, GetConfiguration().GetConnectionString("DefaultConnection"));
            return Json(TutorDB.FetchProfile(1));// new { data= "Tutor data" });
        }

        public ActionResult GetAvailSvc()
        {
            Availability avail = ScheduleDB.GetAvailability(GetConfiguration().GetConnectionString("DefaultConnection"));
            return Json(avail);// new { data= "Tutor data" });
        }

        public ActionResult Details(int id)
        {
            TutorViewModel tutor = new TutorViewModel();
            if(tutor.Profile == null)
            {
                return new RedirectToRouteResult(
                new RouteValueDictionary(
                    new
                    {
                        area = "Default",
                        controller = "Home",
                        action = "Index"
                    }
                )
            );
            }
            TutorProfile tutorProfile = TutorDB.FetchProfile(id);
            tutor.Profile = tutorProfile;
            return View(tutor);// new { data= "Tutor data" });
        }

        // GET: TutorController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: TutorController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: TutorController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: TutorController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: TutorController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: TutorController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        public class Tutor
        {
            public long Id { set; get; }
            public List<Limit> Limits { set; get; }

        }
        public class Limit
        {
            public LimitPoint From { set; get; }
            public LimitPoint To { set; get; }
            public Extra Extra { set; get; }
        }
        public class LimitPoint
        {
            public int Index { set; get; }
            public string Value { set; get; }
        }
        public class Extra
        {
            public bool OnlineOnly { set; get; }
        }
    }
}
