using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ELPServer.Models;
using Microsoft.AspNetCore.Routing;
using ELPServer.Controllers.Shared;

namespace ELPServer.Controllers
{
    public class HomeController : AppController<HomeController>
    {
        public HomeController(ILogger<HomeController> logger) : base(logger) { }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult EClass()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public PartialViewResult Login()
        {
            return PartialView("LoginView");
        }
        public ActionResult Logout()
        {
            //FormsAuthentication.SignOut();
            return new RedirectToRouteResult(
                new RouteValueDictionary(
                    new
                    {
                        area = "Administration",
                        controller = "Home",
                        action = "Index"
                    }
                )
            );
        }
    }
}
