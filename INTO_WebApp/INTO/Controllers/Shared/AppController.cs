using BLL.Shared;
using BLL.Student;
using BLL.Tutor;
using DAL.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace INTO.Controllers.Shared
{
    public abstract class AppController<T> : Controller where T : Controller
    {
        protected LoginModel CurrentModel
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
                if (TempData["ParentModel"] != null)
                {
                    ParentModel parentModel = JsonConvert.DeserializeObject<ParentModel>(TempData["ParentModel"].ToString());
                    TempData.Keep("ParentModel");
                    return parentModel;
                }
                if (TempData["SchoolModel"] != null)
                {
                    SchoolModel schoolModel = JsonConvert.DeserializeObject<SchoolModel>(TempData["SchoolModel"].ToString());
                    TempData.Keep("SchoolModel");
                    return schoolModel;
                }
                if (TempData["LoginModel"] != null)
                {
                    string userStr = TempData["LoginModel"].ToString();
                    UserCache userCache = JsonConvert.DeserializeObject<UserCache>(userStr);
                    LoginModel loginModel = new LoginModel { User = userCache.Extract() };
                    TempData.Keep("LoginModel");
                    return loginModel;
                }
                return new LoginModel();
            }
        }
        protected string CurrentController { get; set; }
        protected string CurrentAction { get; set; }
        public static readonly CookieOptions cookieOptions = new CookieOptions
        {
            // Set the secure flag, which Chrome's changes will require for SameSite none.
            // Note this will also require you to be running on HTTPS.
            Secure = true,

            // Set the cookie to HTTP only which is good practice unless you really do need
            // to access it client side in scripts.
            HttpOnly = true,

            // Add the SameSite attribute, this will emit the attribute with a value of none.
            // To not emit the attribute at all set
            // SameSite = (SameSiteMode)(-1)
            SameSite = SameSiteMode.None
        };

        public static string DEFAULT_CONNECTION = "DefaultConnection";
        public string BaseUrl { get { return $"{this.Request.Scheme}://{this.Request.Host.Value.ToString()}{this.Request.PathBase.Value.ToString()}"; } }
        private readonly IConfiguration configuration;
        public static JsonSerializerSettings DefaultJsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            },
            Formatting = Formatting.Indented
        };
        public static int DEFAULT_TUTOR_SEARCH_PAGE_SIZE = 8;
        public static string DEFAUlt_TUTOR_SORTING_COLUMN = "Potential";
        static AppController()//just for testing but later to be instances
        {
            LoginModel.AllCountries = AppContentDB.GetCountries(Startup.StaticConfig.GetConnectionString(DEFAULT_CONNECTION));
            LoginModel.InstituteTypes = LookUpDB.GetInstituteTypes(Startup.StaticConfig.GetConnectionString(DEFAULT_CONNECTION));
            LoginModel.Curriculums = LookUpDB.GetAllCurriculum(Startup.StaticConfig.GetConnectionString(DEFAULT_CONNECTION));
            LoginModel.Classes = LookUpDB.GetAllClasses(Startup.StaticConfig.GetConnectionString(DEFAULT_CONNECTION));
            LoginModel.AllLanguages = AppContentDB.GetLanguages(Startup.StaticConfig.GetConnectionString(DEFAULT_CONNECTION));
            LoginModel.Subjects = LookUpDB.GetAllSubjects(Startup.StaticConfig.GetConnectionString(DEFAULT_CONNECTION));
            LoginModel.TutorService = LookUpDB.GetAllTutorServices(Startup.StaticConfig.GetConnectionString(DEFAULT_CONNECTION));
        }
        //private readonly ILogger<T> _logger;
        public AppController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        //public AppController(ILogger<T> logger)
        //{
        //    this._logger = logger;
        //}
        //public AppController(IConfiguration configuration, ILogger<T> logger)
        //{
        //    this.configuration = configuration;
        //    this._logger = logger;
        //}
        public IConfiguration GetConfiguration()
        {
            return this.configuration;
        }
        //public ILogger<T> GetLogger()
        //{
        //    return this._logger;
        //}
    }
}
