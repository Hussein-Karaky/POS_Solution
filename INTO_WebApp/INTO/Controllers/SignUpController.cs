using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.Shared;
using DAL.Shared;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace INTO.Controllers.Authentication
{
    public class SignUpController : AppController<SignUpController>
    {
        public SignUpController(IConfiguration configuration) : base(configuration) { }

        public IActionResult Index()
        {
            return View(new LoginModel { });
        }
        public IActionResult SignUp(int langId = 1)
        {
            return View(new SignUpModel { TermsAndConditions = LookUpDB.GetAppContent(100141, langId, null, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)) });
        }
        public IActionResult Register(int langId = 1)
        {
            return View(new SignUpModel { TermsAndConditions = LookUpDB.GetAppContent(100141, langId, null, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)) });
        }
        //TO CHECK IF EMAIL EXIST OR NOT 
        public IActionResult CheckIfEmailExist(string email)
        {
            //var Username = JsonConvert.DeserializeObject<string>(email);
            bool isUsername = false;
            if (email != null)
            {
                isUsername = UserDB.CheckIfEmailExist(email, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            }
            ViewBag.msgExist = isUsername;
            return Json(isUsername);
        }
        public IActionResult DoSignUp(SignUpModel signUpModel)
        {
            byte entityType = byte.Parse(TempData["ObjEntityId"].ToString());
            //LoginModel loginModel = JsonConvert.DeserializeObject<LoginModel>(json);
            if (signUpModel != null && signUpModel.User != null)
            {
                string actUrl = string.Concat(BaseUrl, Url.Action("activate", "signup"));
                signUpModel.User = UserDB.UserSignUp(signUpModel.User, actUrl, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            }
            if(signUpModel.User != null)
            {
                ViewBag.UserName = signUpModel.User.FirstName;
                ViewBag.Email = signUpModel.User.Email;
                TempData["NewUser"] = JsonConvert.SerializeObject(signUpModel);
                return RedirectToAction("SignUpNotif", "SignUp");
            }
            return RedirectToAction("TutorThirdDocumentary", "SignUp", 1);
        }
        public IActionResult SignUpNotif()
        {
            if(TempData["NewUser"] != null)
            {
                SignUpModel model = JsonConvert.DeserializeObject<SignUpModel>(TempData["NewUser"].ToString());
                return View(model);
            }
            return View();
        }
        public IActionResult Activate(long id, string activationCode)
        {
            User user = UserDB.ActivateUser(id, activationCode, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return View(new LoginModel { User = user });
        }
        public IActionResult SignUpSvc(string json)
        {

            LoginModel loginModel = JsonConvert.DeserializeObject<LoginModel>(json);
            if (loginModel != null && loginModel.User != null)
            {
                loginModel.User = UserDB.UserSignUp(loginModel.User, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            }
            return Json(loginModel);
        }
        public IActionResult TutorDocumentary(int docId, int eType)
        {
            ViewBag.Id = docId;
            TempData["ObjEntityId"] = eType;
            return View(new LoginModel { });
        }

        public IActionResult TutorSecondDocumentary(int documentId, byte eType)
        {
            ViewBag.Id = documentId;
            TempData.Keep("ObjEntityId");
            return View(new LoginModel { });
        }

        public IActionResult TutorThirdDocumentary(int documentId, byte eType)
        {
            ViewBag.Id = documentId;
            TempData.Keep("ObjEntityId");
            return View(new LoginModel { });
        }
        public IActionResult Facebook()
        {
            return View();
        }
        public IActionResult FacebookSignUpForm()
        {
            return View();
        }
    }
}
