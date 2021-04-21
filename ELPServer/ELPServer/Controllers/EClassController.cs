using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using ELPServer.Controllers.Shared;
using ELPServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ELPServer.Controllers
{
    public class EClassController : AppController<EClassController>
    {
        public EClassController(ILogger<EClassController> logger) : base(logger) { }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult EClass()
        {
            return View(new EClassViewModel());
        }

        public IActionResult Welcome(string name, int ID = 1)
        {
            return View();// HttpUtility.HtmlEncode("Hello " + name + ", ID: " + ID);
        }
    }
}
