using BLL.Shared;
using BLL.Student;
using BLL.Tutor;
using DAL.Home;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Diagnostics;

namespace INTO.Controllers
{
    public class HomeController : AppController<HomeController>
    {
        public HomeController(IConfiguration config) : base(config) { }

        public IActionResult Index(int id = 0)
        {
            LoginModel loginModel = null;
            //if (TempData["LoginModel"] != null)
            //{
            //    TempData.Keep("LoginModel");
            //    string userStr = TempData["LoginModel"].ToString();
            //    UserCache userCache = JsonConvert.DeserializeObject<UserCache>(userStr);
            //    loginModel = new LoginModel { User = userCache.Extract() };
            //}
            //else
            if (TempData["TutorModel"] != null)
            {
                TempData.Keep("TutorModel");
                TutorCache tutorCache = JsonConvert.DeserializeObject<TutorCache>(TempData["TutorModel"].ToString());
                loginModel = new TutorModel
                {
                    User = tutorCache.Extract()
                };
            }
            if (TempData["StudentModel"] != null)
            {
                TempData.Keep("StudentModel");
                StudentCache studentCache = JsonConvert.DeserializeObject<StudentCache>(TempData["StudentModel"].ToString());
                loginModel = new StudentModel
                {
                    User = studentCache.Extract()
                };
            }

            if (loginModel == null)
            {
                loginModel = new LoginModel { SecurityDiscarded = true };
            }

            //Start Nabih
            if (id != 0) loginModel.Language = id;
            loginModel.Reviews = HomeDB.GetReviews(loginModel.Language, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            loginModel.Languages = HomeDB.GetLanguages(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            loginModel.Stats = HomeDB.GetStatistics(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return View(loginModel);
            //End Nabih
            //return View(new LoginModel { SecurityDiscarded = true }); ;// RedirectToAction("Logout", "Login");//View(new LoginModel { Date = DateTime.Now, User = null });
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
