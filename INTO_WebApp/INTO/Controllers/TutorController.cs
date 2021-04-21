using BLL.Search;
using BLL.Shared;
using BLL.Tutor;
using DAL.Shared;
using DAL.Tutor;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Into.Controllers
{
    public class TutorController : SecureController<TutorController>
    {
        public TutorController(IConfiguration configuration) : base(configuration) { }

        // GET: TutorController
        public IActionResult Index()
        {
            LoginModel model = CurrentModel;
            if (model != null)
            {
                return View(model);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public IActionResult BasicInformation()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                try
                {
                    tutorModel.Resources = LookUpDB.GetTranslation("Pages.BasicInformation", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.Globals = LookUpDB.GetTranslation("Global", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    return View(tutorModel);
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
            }
            //tpm.Countries = LookUpDB.GetLookupDetails(13, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            //tpm.TypeOfDegrees = LookUpDB.GetLookupDetails(1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            //tpm.Recognition = LookUpDB.GetLookupDetails(2, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult AgreementsAndTerms()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                try
                {
                    tutorModel.Resources = LookUpDB.GetTranslation("Pages.HowINTOWorks", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.Globals = LookUpDB.GetTranslation("Global", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.contentStep5 = LookUpDB.GetAppContent("100141", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult PersonilizeProfile()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                try
                {
                    tutorModel.Resources = LookUpDB.GetTranslation("Pages.PersonilizeProfile", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.Globals = LookUpDB.GetTranslation("Global", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult HowINTOWorks()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                try
                {
                    tutorModel.Resources = LookUpDB.GetTranslation("Pages.HowINTOWorks", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.Globals = LookUpDB.GetTranslation("Global", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult Preferences()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                if (Request.QueryString != null && Request.QueryString.HasValue)
                {
                    long userId = Request.Query["user"].Equals(string.Empty) ? 0 : long.Parse(Request.Query["user"]);
                    long tutorId = Request.Query["tutor"].Equals(string.Empty) ? 0 : long.Parse(Request.Query["tutor"]);
                    if (userId > 0 && tutorId > 0)
                    {
                        bool isTeacher = bool.Parse(Request.Query["alreadyTeacher"]);
                        TutorPreferences pref = new TutorPreferences
                        {
                            TutorId = tutorId,
                            IsTeacher = isTeacher,
                            TeachingInstitute = isTeacher ? Request.Query["school"].ToString() : null,
                            HasCertification = isTeacher && Request.Query["hasCert"].Equals(string.Empty) ? false : bool.Parse(Request.Query["hasCert"]),
                            YearsOfExperience = isTeacher ? Request.Query["yearsOfExperience"].Equals(string.Empty) ? 0 : int.Parse(Request.Query["yearsOfExperience"]) : 0,
                            TutoringTypes = Request.Query["typeOfStudents"],
                            LessonTypes = Request.Query["lessonTypes"],
                            RewardingPoints = Request.Query["rewardings"],
                            HasCar = bool.Parse(Request.Query["alreadyTeacher"]),
                            IsInterested = bool.Parse(Request.Query["onlineTutoringInterest"]),
                            OutsideTutoringWeekHrs = Request.Query["hrsOutsideINTO"].Equals(string.Empty) ? 0 : int.Parse(Request.Query["hrsOutsideINTO"]),
                            Language = int.Parse(Request.Query["lang"]),
                            StepId = int.Parse(Request.Query["step"]),
                            EntityType = (EntityType)byte.Parse(Request.Query["entityType"])
                        };
                        int rows = TutorDB.SavePreferences(pref, userId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                        if (rows > 0)
                        {
                            RegistrationStep step = StepsDB.NextRegStep(userId, pref.StepId, (byte)pref.EntityType, pref.Language, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                            if (step != null)
                            {
                                return RedirectToAction(step.UIName, "Tutor");
                            }
                        }
                    }
                }
                try
                {
                    tutorModel.Resources = LookUpDB.GetTranslation("Pages.Preferences", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.Globals = LookUpDB.GetTranslation("Global", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.TutoringTypes = LookUpDB.GetLookupDetails(15, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.LessonTypes = LookUpDB.GetLookupDetails(16, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.RewardingPoints = LookUpDB.GetLookupDetails(17, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult Pref(long? tutor)
        {
            return Json(TutorDB.GetPreferences(tutor, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        //1To be Modified
        public void SaveTutorInfo(string tp)
        {
            Tutor tutor = JsonConvert.DeserializeObject<Tutor>(tp);
            TutorDB.SaveTutorProfile(tutor, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
        }

        public IActionResult SaveAgreement(int UId, int ObjEntityId, int RegistrationStepId, int StepStatus, string LegalFN, string LegalLN)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                int r = TutorDB.SaveAgreement(UId, ObjEntityId, RegistrationStepId, StepStatus, LegalFN, LegalLN, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                tutorModel.Tutor.AgreedOnTerms = r > 0;
                TempData["TutorModel"] = JsonConvert.SerializeObject(tutorModel.Tutor.Cache());
                return Json(new { AgreedOnTerms = r > 0 });
            }
            return Json(new { AgreedOnTerms = false });
        }

        public IActionResult EmailConfirmation(int userId, int objEntityId, int step, int? lang = 1)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                if (tutorModel.Tutor.AgreedOnTerms)
                {
                    string actUrl = string.Concat(BaseUrl, Url.Action(nameof(ReadyForInterview), "Tutor"));
                    Tutor tutor = TutorDB.PrepareForConfirmation(tutorModel.Tutor.UserId, (byte)tutorModel.Tutor.Type, step, actUrl, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.Tutor = tutor;
                    tutorModel.contentStep6 = (LookUpDB.GetAppContent("100017,100018", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
                    return View(tutorModel);
                }
                RegistrationStep regStep = StepsDB.NextRegStep(tutorModel.User.UserId, null, (byte)tutorModel.User.Type, tutorModel.Language, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                if (regStep != null)
                {
                    tutorModel.Tutor.CurrentStep = regStep;
                    TempData["TutorModel"] = JsonConvert.SerializeObject(tutorModel.Tutor.Cache());
                    return RedirectToAction(regStep.UIName, "tutor");
                }
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        [Route("tutor/ReadyForInterview/{id}/{code}/{step?}/{lang?}", Order = 1)]
        public IActionResult ReadyForInterview(long id = 0, string code = null, int step = 0, int lang = 1)
        {
            TutorModel model = base.TutorModel;
            step = 7;//todo: to load from db as lastStep
            bool ready = TutorDB.ReadyForInterview(id, code, step, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)) > 0;
            TempData["ReadyForInterview"] = ready;
            return RedirectToAction("details", "tutor");
        }
        public IActionResult NextStep(long uId = 0, int stepId = 0, byte? objEntityId = 0, int? lang = null)
        {
            return Json(StepsDB.NextRegStep(uId, stepId, objEntityId, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult StepVisit(long uId = 0, int stepId = 0, byte? objEntityId = 0)
        {
            return Json(StepsDB.VisitRegStep(uId, stepId, objEntityId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult StepComplete(long uId = 0, int stepId = 0, byte? objEntityId = 0)
        {
            return Json(StepsDB.CompleteRegStep(uId, stepId, objEntityId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public ActionResult FetchSteps(int uId, byte ObjEntityId, int? lang = null)
        {
            return Json(StepsDB.FetchSteps(uId, ObjEntityId, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult Subjects(LoginModel loginModel)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                try
                {
                    tutorModel.Resources = LookUpDB.GetTranslation("Pages.Subjects", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.Globals = LookUpDB.GetTranslation("Global", 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    tutorModel.Languages = AppContentDB.GetLanguages(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                }
                catch (Exception ex) {/*GetLogger().Log(LogLevel.Error, ex.Message);*/ }
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        public ActionResult GetCurriculumByLanguageId(int Id)
        {
            return Json(SubjectsDB.GetCurriculumByLanguageId(Id, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public ActionResult GetInstituteTypeByLanguageId(int Id)
        {
            return Json(SubjectsDB.GetInstituteTypeByLanguageId(Id, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public ActionResult GetCycleByLanguageId(int Id)
        {
            return Json(SubjectsDB.GetCycleByLanguageId(Id, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public ActionResult GetSubjectsMaterials(int instiType = 0, int cycleId = 0, int? lang = 1)
        {
            return Json(SubjectsDB.GetSubjectsMaterials(instiType, cycleId, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult SaveTutorSubjectsMaterials(string Sub, int? lang = 1)
        {
            DataTable dt = null;
            dt = JsonConvert.DeserializeAnonymousType<DataTable>(Sub, dt);
            return Json(TutorDB.SaveTutorSubjectsAndMaterials(dt, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        // GET: TutorController/Details/5
        public ActionResult DetailsSvc(int id)
        {
            return Json(TutorDB.GetProfile(id));// new { data= "Tutor data" });
        }

        public ActionResult SaveSvc(string json)
        {
            Tutor tutor = JsonConvert.DeserializeObject<Tutor>(json);
            return Json(TutorDB.GetProfile(1));// new { data= "Tutor data" });
        }

        public ActionResult AvailSvc(string json, long id, byte entityType)
        {
            Availability avail = json != null ? JsonConvert.DeserializeObject<Availability>(json) : null;
            return Json(ScheduleDB.Availability(id, entityType, avail, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult Details(long id)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                tutorModel.Languages = AppContentDB.GetLanguages(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }

        public IActionResult TitleSvc(long id, string title)
        {
            return Json(TutorDB.Title(id, title, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult FreeResponseSvc(long id, string freeResponse)
        {
            return Json(TutorDB.FreeResponse(id, freeResponse, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult CancelNoticeSvc(long id, int? notice, int lang = 1)
        {
            return Json(TutorDB.BizSettings(id, notice, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult Material(long id, string json, int lang = 1)
        {
            Material mat = null;
            if (json != null && json.Length > 0)
            {
                mat = JsonConvert.DeserializeObject<Material>(json);
            }
            return Json(TutorDB.Biz(mat, id, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult MaterialsSvc(long id, int? lang = null)
        {
            return Json(TutorDB.GetMaterials(id, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult RatesSvc(long? id = null, int? material = null, int lang = 1)
        {
            return Json(TutorDB.GetRates(id, material, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult GetEducation(long id, int? lang = null)
        {
            return Json(TutorDB.GetEducation(id, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public IActionResult SaveEducation(string json, long id, int? lang = null)
        {
            IList<TutorEducation> edus = json != null ? JsonConvert.DeserializeObject<IList<TutorEducation>>(json) : null;
            return Json(TutorDB.SaveEducation(edus, id, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }
        public ActionResult Create()
        {
            return View();
        }

        // POST: TutorController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: TutorController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: TutorController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: TutorController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: TutorController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
        public IActionResult Dashboard()
        {
            return View();
        }
        public IActionResult SearchForTutors()
        {
            IList<string> SearchStep1 = new List<string>();
            IList<string> SearchStep3 = new List<string>();
            IList<string> SearchStep4 = new List<string>();
            IList<string> SearchStep5 = new List<string>();
            IList<string> SearchStep6 = new List<string>();
            IList<string> SearchStep7 = new List<string>();
            IList<string> SearchStep8 = new List<string>();
            IList<string> SearchStep9 = new List<string>();

            SearchStep1.Add("Choose your tutoring service");
            SearchStep1.Add("Face to face");
            SearchStep1.Add("Tutor for school");
            SearchStep1.Add("Online");
            SearchStep1.Add("Individual");
            SearchStep1.Add("Home Teacher");
            SearchStep1.Add("Part Time");
            SearchStep1.Add("Full Time");
            SearchStep1.Add("Not sure yet");

            SearchStep3.Add("Choose your academic level");
            SearchStep4.Add("Pick your curriculum");
            SearchStep5.Add("Choos your class");
            SearchStep6.Add("Choose subject");
            SearchStep7.Add("Choose your language");
            SearchStep8.Add("Pick up your availability date and time");
            SearchStep9.Add("Choose when you want to start");
            SearchStep9.Add("Now");
            SearchStep9.Add("In one day");
            SearchStep9.Add("This week");
            SearchStep9.Add("Within two weeks");
            SearchStep9.Add("This month");

            ViewBag.SearchStep1 = SearchStep1;
            ViewBag.SearchStep3 = SearchStep3;
            ViewBag.SearchStep4 = SearchStep4;
            ViewBag.SearchStep5 = SearchStep5;
            ViewBag.SearchStep6 = SearchStep6;
            ViewBag.SearchStep7 = SearchStep7;
            ViewBag.SearchStep8 = SearchStep8;
            ViewBag.SearchStep9 = SearchStep9;

            return View(base.CurrentModel);
        }

        public IActionResult TutorsDetail()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetSubjectsClass(int classId)
        {
            IList<Material> SubjectsClass = new List<Material>();
            SubjectsClass = SubjectsDB.GetSubjectsClass(classId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(SubjectsClass);
        }

        //Tutor search result jinan
        public IActionResult Search()
        {
            SearchFilter searchFilter = new SearchFilter();
            int subj;
            int.TryParse(Request.Query["Subject"].ToString(), out subj);
            searchFilter.Subject = subj;
            int academicLevel;
            int.TryParse(Request.Query["AcademicLevel"].ToString(), out academicLevel);
            searchFilter.AcademicLevel = academicLevel;
            int country;
            int.TryParse(Request.Query["Country"].ToString(), out country);
            searchFilter.Country = country;
            int curriculum;
            int.TryParse(Request.Query["Curriculum"].ToString(), out curriculum);
            searchFilter.Curriculum = curriculum;
            int? educationClass = null;
            if (Request.Query.ContainsKey("EducationClass"))
            {
                int e;
                educationClass = int.TryParse(Request.Query["EducationClass"].ToString(), out e) ? e : default(int);
            }
            searchFilter.EducationClass = educationClass;
            int language = 1;
            if (Request.Query.ContainsKey("Language"))
            {
                int.TryParse(Request.Query["Language"].ToString(), out language);
            }
            searchFilter.Language = language;
            int? tutoringService = null;
            if (Request.Query.ContainsKey("TutoringService"))
            {
                int t;
                tutoringService = int.TryParse(Request.Query["TutoringService"].ToString(), out t) ? t : default(int?);
            }
            searchFilter.TutoringService = tutoringService;
            bool sortDir = false;
            if (Request.Query.ContainsKey("SortingDirection"))
            {
                bool.TryParse(Request.Query["SortingDirection"].ToString(), out sortDir);
            }
            searchFilter.SortingDirection = sortDir;
            decimal? minInPersRt = null;
            if (Request.Query.ContainsKey("MinInPersonHourRate"))
            {
                decimal m;
                minInPersRt = decimal.TryParse(Request.Query["MinInPersonHourRate"].ToString(), out m) ? m : default(decimal?);
            }
            searchFilter.MinInPersonHourRate = minInPersRt;
            decimal? maxInPersRt = null;
            if (Request.Query.ContainsKey("MaxInPersonHourRate"))
            {
                decimal m;
                maxInPersRt = decimal.TryParse(Request.Query["MaxInPersonHourRate"].ToString(), out m) ? m : default(decimal?);
            }
            searchFilter.MaxInPersonHourRate = maxInPersRt;
            decimal? minOnlineRt = null;
            if (Request.Query.ContainsKey("MinOnlineHourRate"))
            {
                decimal m;
                minOnlineRt = decimal.TryParse(Request.Query["MinOnlineHourRate"].ToString(), out m) ? m : default(decimal?);
            }
            searchFilter.MinOnlineHourRate = minOnlineRt;
            decimal? maxOnlineRt = null;
            if (Request.Query.ContainsKey("MaxOnlineHourRate"))
            {
                decimal m;
                maxOnlineRt = decimal.TryParse(Request.Query["MaxOnlineHourRate"].ToString(), out m) ? m : default(decimal?);
            }
            searchFilter.MaxOnlineHourRate = maxOnlineRt;
            int? minTutorAge = null;
            if (Request.Query.ContainsKey("MinTutorAge"))
            {
                int m;
                minTutorAge = int.TryParse(Request.Query["MinTutorAge"].ToString(), out m) ? m : default(int?);
            }
            searchFilter.MinTutorAge = minTutorAge;
            int? maxTutorAge = null;
            if (Request.Query.ContainsKey("MaxTutorAge"))
            {
                int m;
                maxTutorAge = int.TryParse(Request.Query["MaxTutorAge"].ToString(), out m) ? m : default(int?);
            }
            searchFilter.MaxTutorAge = maxTutorAge;
            try
            {
                searchFilter.StartingTime = Request.Query["StartingTime"];
            }
            catch (Exception)
            {

                searchFilter.StartingTime = null;
            }
            try
            {
                searchFilter.SortingColumn = Request.Query["SortingColumn"];
            }
            catch (Exception)
            {

                searchFilter.SortingColumn = null;
            }
            try
            {
                searchFilter.SearchColumn = Request.Query["SearchColumn"];
            }
            catch (Exception)
            {

                searchFilter.SearchColumn = null;
            }
            try
            {
                searchFilter.SearchValue = Request.Query["SearchValue"];
            }
            catch (Exception)
            {

                searchFilter.SearchValue = null;
            }
            try
            {
                searchFilter.Availability = JsonConvert.DeserializeObject<IList<BriefAvailability>>(Request.Query["availability"]);//, DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                searchFilter.Availability = new List<BriefAvailability>();
            }
            if (searchFilter.SortingColumn == null)
            {
                searchFilter.SortingColumn = DEFAUlt_TUTOR_SORTING_COLUMN;
            }
            int pageNo = 1;
            if (Request.Query.ContainsKey("PageNumber"))
            {
                int.TryParse(Request.Query["PageNumber"].ToString(), out pageNo);
            }
            searchFilter.PageNumber = pageNo;
            int pageSize = DEFAULT_TUTOR_SEARCH_PAGE_SIZE;
            if (Request.Query.ContainsKey("PageSize"))
            {
                int.TryParse(Request.Query["PageSize"].ToString(), out pageSize);
            }
            searchFilter.PageSize = pageSize;

            ICollection<SearchResult<Tutor>> searchResult = TutorDB.Search(searchFilter, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            string searchFilterStr = JsonConvert.SerializeObject(searchFilter);
            TempData["SearchFilterFunction"] = "setSearchFilter('" + searchFilterStr + "');";
            TempData.Keep("SearchFilterFunction");
            LoginModel model = TutorModel;
            User user = null;
            if (model == null)
            {
                model = StudentModel;
            }
            if(model == null)
            {
                user = new User { Type = EntityType.Anonymous };
            }
            else
            {
                user = model.User;
            }
            return View(new SearchModel<Tutor> { SearchFilter = searchFilter, SearchResults = searchResult, User = user }.DiscardSecurity());
        }

        //JINAN
        [Route("tutor/TutorPreview/{id}/{lang?}", Order = 1)]
        public IActionResult TutorPreview(long id, int lang = 1)
        {
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                return View(model);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
        //JINAN
        public IActionResult GetInTouch()
        {
            LoginModel model = base.TutorModel != null ? base.TutorModel : base.StudentModel;
            if (model != null)
            {
                return View(model);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);
        }
    }
}

