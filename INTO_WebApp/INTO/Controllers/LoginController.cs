using BLL.Shared;
using BLL.Shared.Auth;
using BLL.Student;
using BLL.Tutor;
using DAL.Shared;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Mime;

namespace INTO.Controllers
{
    public class LoginController : AppController<LoginController>
    {
        public LoginController(IConfiguration configuration) : base(configuration) { }
        public IActionResult Index()
        {
            LoginModel user = new LoginModel();
            return View(user);
        }
        public IActionResult SignUp()
        {
            SignUpModel usi = new SignUpModel();
            usi.Countries = LookUpDB.GetLookupDetails(13, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return View(usi);
        }
        public IActionResult FAQ()
        {
            return View();
        }
        public IActionResult LoginView(LoginModel model)
        {
            string conStr = GetConfiguration().GetConnectionString(DEFAULT_CONNECTION);
            if(model == null && TempData["LoginModel"] != null)
            {
                string modelStr = TempData["LoginModel"].ToString();
                model = JsonConvert.DeserializeObject<LoginModel>(modelStr);
            }
            User user = UserDB.Login(model.User.Type, model.User.Email, model.User.Password, model.User.TimezoneOffset, conStr);
            if (user != null)
            {
                if (model.Token != null)
                {
                    model.Token.Approved = true;
                }
                else
                {
                    model.Token = new AccessToken { Approved = false };
                }
                user.Picture = null;//because picture is too long for the uri
                HttpContext.Response.Cookies.Append("user", JsonConvert.SerializeObject(user), cookieOptions); //new CookieOptions() { Path = "/", Domain = null, IsEssential = true });
                if (user.Type == EntityType.Tutor)
                {
                    Tutor tutor = (Tutor)user;
                    TutorModel tutorModel = new TutorModel { User = tutor, Languages = AppContentDB.GetLanguages(conStr) };
                    string tutorStr = JsonConvert.SerializeObject(tutorModel);
                    HttpContext.Response.Cookies.Append("tutor", tutorStr, cookieOptions);
                    TempData["TutorModel"] = tutorStr;
                    if (tutorModel.RedirectController != null && tutorModel.RedirectController.Length > 0)
                    {
                        string controller = tutorModel.RedirectController;
                        tutorModel.RedirectController = null;
                        if (tutorModel.RedirectAction != null && tutorModel.RedirectAction.Length > 0)
                        {
                            string action = tutorModel.RedirectAction;
                            tutorModel.RedirectAction = null;
                            return RedirectToAction(action, controller);//, tutorModel);
                        }
                        return RedirectToAction(null, controller);//, tutorModel);
                    }
                    RegistrationStep step = StepsDB.NextRegStep(user.UserId, 1, (byte)user.Type, model.Language, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    if (step != null)
                    {
                        return RedirectToAction(step.UIName, "Tutor");
                    }
                }
                else if (user.Type == EntityType.Student)
                {
                    //jinan
                    Student student = (Student)user;
                    HttpContext.Session.Set("StudentId", NumberUtil.ToBytes(student.Id));
                    student.RegStepsCompleted = StepsDB.CheckCompletedSteps(user.UserId, 1, (byte)user.Type, conStr);
                    StudentModel studentModel = new StudentModel { User = student, Languages = AppContentDB.GetLanguages(conStr) };
                    string studentStr = JsonConvert.SerializeObject(studentModel);
                    HttpContext.Response.Cookies.Append("student", studentStr, cookieOptions);
                    TempData["StudentModel"] = studentStr;
                    if (studentModel.RedirectController != null && studentModel.RedirectController.Length > 0)
                    {
                        string controller = studentModel.RedirectController;
                        studentModel.RedirectController = null;
                        if (studentModel.RedirectAction != null && studentModel.RedirectAction.Length > 0)
                        {
                            string action = studentModel.RedirectAction;
                            studentModel.RedirectAction = null;
                            return RedirectToAction(action, controller);//, studentModel);
                        }
                        return RedirectToAction(null, controller);//, studentModel);
                    }
                    if (student.RegStepsCompleted)
                    {
                        return RedirectToAction("DisplayDashboard", "Student");
                    }
                }
            }
            else
            {
                ViewData["Message"] = "User Login failed !!";
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            return RedirectToAction("Index", "Home");
        }

        public IActionResult LoginSvc(string json)
        {
            //User user = JsonConvert.DeserializeObject<User>(json);
            LoginModel loginModel = JsonConvert.DeserializeObject<LoginModel>(json);
            if (loginModel != null && loginModel.User != null)
            {
                loginModel.User = UserDB.Login(loginModel.User.Type, loginModel.User.Email, loginModel.User.Password, loginModel.User.TimezoneOffset, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                if (loginModel.User == null)
                {
                    ViewData["Message"] = "User Login Details failed !!";
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Content("Login failed!", MediaTypeNames.Text.Plain);
                }
                if (!loginModel.User.Active.HasValue || !loginModel.User.Active.Value)
                {
                    return Unauthorized();
                }
                Response.StatusCode = (int)HttpStatusCode.OK;

                loginModel.User.Picture = null;
                //HttpContext.Response.Cookies.Append("user", JsonConvert.SerializeObject(loginModel.User), cookieOptions);
                switch (loginModel.User.Type)
                {
                    case EntityType.Tutor:
                        Tutor tutor = (Tutor)loginModel.User;
                        //HttpContext.Response.Cookies.Append("user", JsonConvert.SerializeObject(loginModel.User), cookieOptions);
                        TutorModel tutorModel = new TutorModel { 
                            Date = DateTime.Now, 
                            User = tutor, 
                            RedirectAction = loginModel.RedirectAction, 
                            RedirectController = loginModel.RedirectController, 
                            Languages = AppContentDB.GetLanguages(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)) 
                        };
                        string tutorStr = null;
                        if (tutorModel.RedirectController != null && tutorModel.RedirectController.Length > 0 || tutorModel.RedirectAction != null && tutorModel.RedirectAction.Length > 0)
                        {
                            tutorStr = JsonConvert.SerializeObject(tutorModel);
                            TempData["TutorModel"] = JsonConvert.SerializeObject(tutorModel.Tutor.Cache());
                            return Json(tutorModel);
                        }
                        RegistrationStep step = StepsDB.NextRegStep(loginModel.User.UserId, null, (byte)loginModel.User.Type, loginModel.Language, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                        if (step != null)
                        {
                            tutorModel.RedirectAction = step.UIName;
                            tutorModel.RedirectController = "tutor";
                            tutorModel.Tutor.CurrentStep = step;
                        }
                        else
                        {
                            tutorModel.RedirectAction = "details";
                            tutorModel.RedirectController = "tutor";
                            tutorModel.Tutor.CurrentStep = step;
                        }

                        tutorStr = JsonConvert.SerializeObject(tutorModel);
                        TempData["TutorModel"] = JsonConvert.SerializeObject(tutorModel.Tutor.Cache());
                        return Json(tutorModel);
                    case EntityType.Student:
                        //jinan
                        Student student = (Student)loginModel.User;
                        //HttpContext.Session.SetString("StudentModel", JsonConvert.SerializeObject(new StudentModel { User = student }));
                        //HttpContext.Session.Set("StudentId", NumberUtil.ToBytes(student.Id));
                        //HttpContext.Response.Cookies.Append("user", JsonConvert.SerializeObject(loginModel.User), cookieOptions);
                        StudentModel studentModel = new StudentModel {
                            Date = DateTime.Now, 
                            User = student, 
                            RedirectAction = loginModel.RedirectAction, 
                            RedirectController = loginModel.RedirectController, 
                            Languages = AppContentDB.GetLanguages(GetConfiguration().GetConnectionString("DefaultConnection")) 
                        };
                        string studentStr = JsonConvert.SerializeObject(studentModel.Student.Cache());
                        //HttpContext.Response.Cookies.Append("student", studentStr, cookieOptions);
                        TempData["StudentModel"] = studentStr;
                        if (studentModel.RedirectController == null || studentModel.RedirectController.Length == 0)
                        {
                            //studentModel.RedirectAction = "DashboardDisplay";
                            //studentModel.RedirectController = "Student";
                            studentModel.RedirectAction = "StudentHome";
                            studentModel.RedirectController = "Student";
                            return Json(studentModel);
                        }
                        return Json(studentModel);
                    case EntityType.Parent:
                        break;
                    case EntityType.School:
                        break;
                }
            }
            loginModel = new LoginModel { Date = DateTime.Now, User = null, RedirectAction = "Index", RedirectController = "Home", Token = new AccessToken { Approved = false } };
            return Json(loginModel);
        }

        public IActionResult Logout()
        {
            LoginModel model = CurrentModel;
            bool loggedOut = false;
            if(model != null && model.User != null)
            {
                loggedOut = UserDB.Logout(model.User.UserId, model.User.Language != null ? model.User.Language.Id : 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            }
            if (loggedOut)
            {
                TempData["LoginModel"] = null;
                TempData["TutorModel"] = null;
                TempData["StudentModel"] = null;
                HttpContext.Response.Cookies.Delete("user");
                HttpContext.Response.Cookies.Delete("tutor");
                TempData["JavaScriptFunction"] = "accountManager.assureLogout();";
                //LoginModel loginModel = new LoginModel { Date = DateTime.Now, RedirectAction = "Index", RedirectController = "Home" };
                //TempData["LoginModel"] = JsonConvert.SerializeObject(loginModel);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return RedirectToAction(CurrentAction, CurrentController);
            }
        }

        public IActionResult LogoutSvc()
        {
            LoginModel model = CurrentModel;
            bool loggedOut = false;
            if (model != null && model.User != null)
            {
                loggedOut = UserDB.Logout(model.User.UserId, model.User.Language != null ? model.User.Language.Id : 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            }
            if (loggedOut)
            {
                TempData["LoginModel"] = null;
                TempData["TutorModel"] = null;
                TempData["StudentModel"] = null;
                HttpContext.Response.Cookies.Delete("user");
                HttpContext.Response.Cookies.Delete("tutor");
                LoginModel loginModel = new LoginModel { Date = DateTime.Now, RedirectAction = "Index", RedirectController = "Home" };
                TempData["LoginModel"] = JsonConvert.SerializeObject(loginModel);
                return Json(loginModel);
            }
            return Json(new { Success = false });
        }

        public IActionResult UserNameExists(string Email)
        {
            return Json(UserDB.UserNameExists(Email, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult RoomInf(long id, int tZOS, int lang = 1)
        {
            return Json(ScheduleDB.Room(id, tZOS, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
    }
}
