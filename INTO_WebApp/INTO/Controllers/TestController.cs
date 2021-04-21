using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using BLL;
using BLL.Shared;
using BLL.Test;
using BLL.Tutor;
using DAL.Test;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using INTO.Controllers.Shared;

namespace INTO.Controllers
{
    public class TestController : SecureController<TestController>
    {
        public TestController(IConfiguration configuration) : base(configuration) { }
        public IActionResult Test(int material = 0, int lang = 1)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return RedirectToAction("QATemplate", "Test", new { material = material, lang = lang });
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult QATemplate(int material = 0, int lang = 1)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);

        }

        public QAResponse<IList<Question>> Load(int material = 0, int lang = 1)
        {
            QAResponse<IList<Question>> testContent = TestDB.LoadTest(material, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return testContent;
        }

        public QAResponse<IList<Question>> LoadQuestions(int material = 0, int lang = 1)
        {
            QAResponse<IList<Question>> testQuestions = TestDB.LoadTestQuestions(material, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return testQuestions;
        }

        public IActionResult StartTest(int QATempId = 0, long UID = 0)
        {
            int r = TestDB.StartTest(QATempId, UID, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(r);
        }
        public IActionResult EndTest(string Sub, int QATempId = 0, long UID = 0)
        {
            DataTable dt = null;
            DataTable UserAnswer = null;

            dt = JsonConvert.DeserializeAnonymousType<DataTable>(Sub, dt);
            UserAnswer = TestDB.EndTest(dt, QATempId, UID, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(UserAnswer);
        }
    }
}
