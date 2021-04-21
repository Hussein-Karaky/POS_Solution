using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.Shared;
using BLL.Student;
using DAL.Shared;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace INTO.Controllers
{
    public class StudentController : SecureController<StudentController>
    {
        public StudentController(IConfiguration configuration) : base(configuration) { }
        public IActionResult Index()
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult DashboardDisplay(int? uId = null, int? langId = 1)
        {
            //User user = new User();
            //user = UserDB.GetUser(uId, langId, GetConfiguration().GetConnectionString("DefaultConnection"));
            //return View(new LoginModel { User = user });
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public JsonResult EditProfile(int UId, DateTime dOB, string schoolName, int schoolYear, int countryId, string address, string address2, string city)
        {
            Student student = new Student();
            LoginModel loginModel = new LoginModel();
            student.UserId = UId;
            student.DOB = dOB;
            student.SchoolName = schoolName;
            student.SchoolYear = schoolYear;
            student.LocationSettings = new LocationSettings
            {
                Country = new Country
                {
                    Id = countryId
                },
                City = city,
                Address = address,
                SecondAddress = address2
            };
            //loginModel.CountryId = countryId;
            //loginModel.User.Address = address;
            //loginModel.User.Address2 = address2;
            //loginModel.User.City = city;

            //we can send user instead of address,address2,city each param alone
            Student studentProfile = UserDB.EditStudentProfile(student, countryId,address,address2,city, GetConfiguration().GetConnectionString("DefaultConnection"));
            return Json(studentProfile);
        }
        public IActionResult StudentHome(LoginModel loginModel)
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    //studentModel.Resources = LookUpDB.GetTranslation("Pages.StudentHome", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    //studentModel.Globals = LookUpDB.GetTranslation("Global", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult Booking()
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult HelpCenter()
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult ContactUs()
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult EditPassword(int? usrId = null, int? langId = 1)
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    //User user = new User();
                    //user = UserDB.GetUser(usrId, langId, GetConfiguration().GetConnectionString("DefaultConnection"));
                    //return View(new LoginModel { User = user });
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
            
        }
        public JsonResult EditNewPassword(int UId, string ConfirmNewPasswrod)
        {
            Student student = new Student();
            student.Password = ConfirmNewPasswrod;
            student.UserId = UId;

            Student studentNewPassword = UserDB.EditStudentPassword(student, GetConfiguration().GetConnectionString("DefaultConnection"));
            return Json(studentNewPassword);
        }
        public IActionResult AmbitionSvc(long id, string ambition)
        {
            return Json(UserDB.Ambition(id, ambition, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult InviteFriends()
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public JsonResult InviteUserFriend(string FriendEmail)
        {
            bool result = UserDB.InviteUserFriend(FriendEmail, GetConfiguration().GetConnectionString("DefaultConnection"));
            return Json(result);
        }
        public IActionResult ContactForm()
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult FAQS()
        {
            StudentModel studentModel = base.StudentModel;
            if (studentModel != null)
            {
                try
                {
                    return View(studentModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
    }
}
