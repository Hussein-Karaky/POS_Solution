using BLL.Shared;
using BLL.Shared.Auth;
using BLL.Tutor;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using BLL.Student;

namespace INTO.Controllers.Shared
{
    public class SecureController<T> : AppController<T> where T : Controller
    {
        //private static IDictionary<string, string> SecurityMap = new ConcurrentDictionary<string, string>();
        public SecureController(IConfiguration config) : base(config)
        {
        }
        protected TutorModel TutorModel
        {
            get
            {
                if (TempData["TutorModel"] != null)
                {
                    TutorCache tutorCache = JsonConvert.DeserializeObject<TutorCache>(TempData["TutorModel"].ToString());
                    TutorModel tutorModel = new TutorModel
                    {
                        User = tutorCache.Extract()
                    };
                    TempData.Keep("TutorModel");
                    return tutorModel;
                }
                return null;
            }
        }
        protected StudentModel StudentModel
        {
            get
            {
                if (TempData["StudentModel"] != null)
                {
                    StudentCache studentCache = JsonConvert.DeserializeObject<StudentCache>(TempData["StudentModel"].ToString());
                    StudentModel studentModel = new StudentModel
                    {
                        User = studentCache.Extract()
                    };
                    TempData.Keep("StudentModel");
                    return studentModel;
                }
                return null;
            }
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);
            this.CurrentAction = ((ControllerActionDescriptor)context.ActionDescriptor).ActionName;
            this.CurrentController = ((ControllerActionDescriptor)context.ActionDescriptor).ControllerName;
            //((ControllerActionDescriptor)context.ActionDescriptor).Parameters;
        }
        protected IActionResult AssureLogin(string redirectController, string redirectAction, object param = null)//LoginModel model = null)
        {
            string jsonModel = JsonConvert.SerializeObject(new { RedirectAction= redirectAction, RedirectController = redirectController, Param = param });
            string jsFunction = "showSignIn('" + jsonModel + "');";
            TempData["JavaScriptFunction"] = jsFunction;
            return RedirectToAction("Index", "Home");
        }
    }
}
