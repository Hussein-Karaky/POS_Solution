using BLL.Shared;
using BLL.Shared.Notif;
using DAL.Shared;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.IO;

namespace INTO.Controllers
{
    public class AccountController : SecureController<AccountController>
    {
        public AccountController(IConfiguration configuration) : base(configuration) { }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Register(RegisterViewModel model)
        {
            return View();
        }
        public IActionResult Picture(string picture, string miniPicture, long userId)
        {
            string content = UserDB.UpdatePicture(picture, miniPicture, userId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            MemoryStream stream = new MemoryStream();
            StreamWriter writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;
            return new FileStreamResult(stream, MediaTypeHeaderValue.Parse("image/png"));
        }
        public IActionResult SaveBasicInfo(string dob, bool gender, long id)
        {
            return Json(UserDB.SaveBasicInfo(dob, gender, id, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }

        public IActionResult Location(int countryId, string city, string address, string address2, decimal? privacyRadius, decimal? travelRadius, decimal? latitude, decimal? longitude, long userId)
        {
            return Json(UserDB.UpdateLocation(countryId, city, address, address2, privacyRadius, travelRadius, latitude, longitude, userId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }

        public IActionResult ForgotPassword()
        {
            return View(new SignUpModel());
        }

        public IActionResult PrepareResetPassword(string email)
        {
            string resetUrl = string.Concat(BaseUrl, Url.Action("ResetPassword", "Account"));
            User user = UserDB.ResetPassword(email, resetUrl, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            ViewBag.Email = email;
            return View(new SignUpModel { User = user });
        }

        public IActionResult ResetPassword(long id)
        {
            string resetCode = Request.Query["rcode"];
            User user = new User { UserId = id, ActivationCode = resetCode };
            return View(new SignUpModel { User = user });
        }
        public IActionResult DoResetPassword(SignUpModel signUpModel)
        {
            User user = UserDB.ResetPassword(signUpModel.User, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return View(new SignUpModel { User = user });
        }
        public IActionResult TestOurPlatform()
        {
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                    return View(model);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult Notifications()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult GetNotifications(int page = 1, int pageSize = 5)
        {
            int langId = 1;
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                QAResponse<ICollection<Notif>> notifs = ScheduleDB.GetNotificationsPage
                    (
                    model.User.UserId,
                    Notification.NotificationType.Push,
                    0 - (short)DateTimeOffset.Now.Offset.TotalMinutes,
                    //DateTime.Now.AddHours(-100),
                    //DateTime.Now.AddHours(100),
                    null,
                    null,
                    langId,
                    page,
                    pageSize,
                    GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)
                    );
                return Json(notifs);
            }
            return null;
        }
        public IActionResult Messages()
        {
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                try
                {
                    return View(model);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult GetMiniNotifications(int page = 1, int pageSize = 5)
        {
            int langId = 1;
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                QAResponse<ICollection<Notif>> notifs = ScheduleDB.GetNotificationsPage
                    (
                    model.User.UserId,
                    Notification.NotificationType.Push,
                    0 - (short)DateTimeOffset.Now.Offset.TotalMinutes,
                    //DateTime.Now.AddHours(-100),
                    //DateTime.Now.AddHours(100),
                    null,
                    null,
                    langId,
                    page,
                    pageSize,
                    GetConfiguration().GetConnectionString(DEFAULT_CONNECTION),
                    false
                    );
                notifs.Extras.Remove("RemainingPages");
                notifs.Extras.Add("RemainingPages", "-1");
                return Json(notifs);
            }
            return null;
        }
        public IActionResult Langs()
        {
            return Json(AppContentDB.GetLanguages(Startup.StaticConfig.GetConnectionString(DEFAULT_CONNECTION)));
        }

        public IActionResult Lang(long userId, int lang = 1)
        {
            return Json(UserDB.UpdateLang(userId, lang = 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult MyNet()
        {
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                return View(model);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult Like(long userId, long objId, byte objType, bool? like = null, int lang = 1)
        {
            return Json(UserDB.Like(userId, objId, objType, like, lang = 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult Rate(long userId, long objId, byte objType, decimal? value = null, int lang = 1)
        {
            return Json(UserDB.Rate(userId, objId, objType, value, lang = 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult Review(long userId, long objId, byte objType, string review = null, int lang = 1)
        {
            return Json(UserDB.Review(userId, objId, objType, review, lang = 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult Ratings(long userId, long objId, byte objType, int lang = 1)
        {
            return Json(UserDB.Ratings(userId, objId, objType, lang = 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult Friend(long requester, long requestee, int lang = 1)
        {
            return Json(UserDB.Friend(requester, requestee, lang = 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
    }
}
