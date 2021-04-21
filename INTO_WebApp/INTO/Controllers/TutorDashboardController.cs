using BLL.Tutor;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Tutor;
using BLL.Shared;
using BLL.Tutor.TutorDashboard;

namespace INTO.Controllers
{
    public class TutorDashboardController : SecureController<TutorDashboardController>
    {
        public TutorDashboardController(IConfiguration configuration) : base(configuration) { }
        public IActionResult Index()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult GetBoardData()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                QAResponse<List<BoardItem>> response = new QAResponse<List<BoardItem>>();
                response = TutorDashboardDB.GetBoardData(tutorModel.User.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                return Json(response);
            }
            return null;
        }
    }
}
