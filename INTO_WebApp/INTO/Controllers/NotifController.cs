using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using DAL.Utilities;
using Microsoft.AspNetCore.Mvc;
using INTO.Controllers.Shared;
using Microsoft.Extensions.Configuration;
using INTO.Models;
using DAL.Shared;
using static BLL.Shared.Notif.Notification;

namespace INTO.Controllers
{
    public class NotifController : SecureController<NotifController>
    {
        public NotifController(IConfiguration configuration) : base(configuration) { }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Mail(string htmlString)
        {
            try
            {
                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress("into.devteam@gmail.com");
                message.To.Add(new MailAddress("karakyhussein@gmail.com"));
                message.Subject = "Test";
                message.IsBodyHtml = true; //to make message body as html  
                message.Body = htmlString;
                smtp.Port = 587;
                smtp.Host = "smtp.gmail.com"; //for gmail host  
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential("into.devteam@gmail.com", "INT01234");
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Send(message);
            }
            catch (Exception ex) {
                Console.WriteLine(ex);
            }
            return Ok();
        }

        public IActionResult CountDowns()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult Notifications(long id, int tzOffset, DateTime? from = null, DateTime? to = null, int lang = 1, byte limit = 5)
        {
            return Json(ScheduleDB.GetNotifications(id, NotificationType.Push, tzOffset, from, to, lang, limit, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
    }
}
