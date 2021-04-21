using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Shared;
using ELPServer.Controllers.Shared;
using Into.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace ELPServer.Controllers
{
    public class UserLoginController : AppController<UserLoginController>
    {
        public UserLoginController(IConfiguration configuration):base(configuration){}
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Login(UserLoginModel u)
        {
            bool status;
            TutorProfileModel tp = new TutorProfileModel();
            UserDB udb = new UserDB();
            StepsDB sdb = new StepsDB();
            tp.TutorProfile = udb.UserLogin(u.Email, u.Password, GetConfiguration().GetConnectionString("DefaultConnection"));
            if (tp.TutorProfile != null)
            {
                HttpContext.Session.SetString("UserName", tp.TutorProfile.FirstName + "." + tp.TutorProfile.LastName);
                HttpContext.Session.SetInt32("UserId", (int)tp.TutorProfile.UserId);
                HttpContext.Session.SetInt32("TutorId", (int)tp.TutorProfile.Id);
                status = sdb.CheckCompletedSteps(tp.TutorProfile.UserId, 1, tp.TutorProfile.Id, GetConfiguration().GetConnectionString("DefaultConnection"));
                if (status == true)
                {
                    return RedirectToAction("Subjects", "TutorProfile");
                }
                else
                {
                    return RedirectToAction("Questionnaire", "TutorProfile");
                }
            }
            else
            {
                ViewData["Message"] = "User Login Details failed !!";
            }
            return View();
        }
        //public IActionResult Login(string json)
        //{
        //    bool status;
        //    TutorProfileModel tp = new TutorProfileModel();
        //    UserDB udb = new UserDB();
        //    StepsDB sdb = new StepsDB();
        //    tp.TutorProfile = udb.UserLogin(u.Email, u.Password, GetConfiguration().GetConnectionString("DefaultConnection"));
        //    if (tp.TutorProfile != null)
        //    {
        //        HttpContext.Session.SetString("UserName", tp.TutorProfile.FirstName + "." + tp.TutorProfile.LastName);
        //        HttpContext.Session.SetInt32("UserId", (int)tp.TutorProfile.UserId);
        //        HttpContext.Session.SetInt32("TutorId", (int)tp.TutorProfile.Id);
        //        status = sdb.CheckCompletedSteps(tp.TutorProfile.UserId, 1, tp.TutorProfile.Id, GetConfiguration().GetConnectionString("DefaultConnection"));
        //        if (status == true)
        //        {
        //            return RedirectToAction("Subjects", "TutorProfile");
        //        }
        //        else
        //        {
        //            return RedirectToAction("Questionnaire", "TutorProfile");
        //        }

        //    }
        //    else
        //    {
        //        ViewData["Message"] = "User Login Details failed !!";
        //    }
        //    return View();
        //}
        [HttpPost]
        public IActionResult SignUp(UserSignUpModel u)
        {
            TutorProfileModel tp = new TutorProfileModel();
            UserDB udb = new UserDB();
            tp.TutorProfile = udb.UserSignUp(u.LegalFN, u.LegalLN, u.Email, u.Password, u.CountryId, GetConfiguration().GetConnectionString("DefaultConnection"));
            if (tp.TutorProfile != null)
            {
                HttpContext.Session.SetString("UserName", tp.TutorProfile.FirstName + "." + tp.TutorProfile.LastName);
                HttpContext.Session.SetInt32("UserId", (int)tp.TutorProfile.UserId);
                return RedirectToAction("Questionnaire", "TutorProfile");
            }
            else
            {
                ViewData["Message"] = "User Login Details failed !!";
            }
            return View();
        }
    }
}
