using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using INTO.Models;
using Microsoft.Extensions.Configuration;
using DAL.Shared;
using DAL.Tutor;
using BLL.Tutor.TutorQuestion;
using BLL.Shared;
using System.Data;
using Newtonsoft.Json;
using cloudscribe.Pagination.Models;
using BLL.Tutor;
using BLL;
using System.Threading;
using INTO.Controllers.Shared;

namespace INTO.Controllers
{
    public class TutorQuestionController : SecureController<TutorQuestionController>
    {
        public TutorQuestionController(IConfiguration configuration) : base(configuration) { }

        [Route("TutorQuestion/AddTutorQuestionAnswer/{TQuestionId?}")]
        public IActionResult AddTutorQuestionAnswer(long TQuestionId)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);

            /*if (TempData["TutorModel"] != null)
            {
                TutorCache tutorCache = JsonConvert.DeserializeObject<TutorCache>(TempData["TutorModel"].ToString());
                TempData.Keep("TutorModel");
                TutorQuestionModel tqm = new TutorQuestionModel
                {
                    User = tutorCache.Extract()
                };
                if (TQuestionId != 0)
                {
                    tqm.tQuestion = TutorQuestionDB.GetQuestionById(TutorId, TQuestionId, configuration.GetConnectionString("DefaultConnection"));
                    tqm.RandomTags = TutorQuestionDB.GetTagsRandomly(configuration.GetConnectionString("DefaultConnection"));
                    return View(tqm);
                }
                else
                {
                    return RedirectToAction("TutorQuestion", "TutorQuestion");
                }
            }
            return RedirectToAction("Index", "Home");*/
        }
        public IActionResult TutorQuestion(int lang = 1)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);

            /*if (TempData["TutorModel"] != null)
            {
                TutorCache tutorCache = JsonConvert.DeserializeObject<TutorCache>(TempData["TutorModel"].ToString());
                TempData.Keep("TutorModel");
                TutorQuestionModel tqm = new TutorQuestionModel
                {
                    User = tutorCache.Extract()
                };
                //36 is the lookupId for tutorQuestionDDL

                tqm.DDL = LookUpDB.FillTutorQuestionDropDown(36, lang, configuration.GetConnectionString("DefaultConnection"));
                tqm.RandomTags = TutorQuestionDB.GetTagsRandomly(configuration.GetConnectionString("DefaultConnection"));
                tqm.all = TutorQuestionDB.GetTutorQuestionsCategories(tutorCache.Id, tutorCache.UserId, configuration.GetConnectionString("DefaultConnection"));
                tqm.QuestionAdded = tqm.all[0];
                tqm.QuestionAnswered = tqm.all[1];
                tqm.QuestionFollowed = tqm.all[2];
                return View(tqm);
            }
            return RedirectToAction("Index", "Home");
            */
        }
        [Route("TutorQuestion/AllQuestionsByTag/{TagName?}")]
        public IActionResult AllQuestionsByTag(string TagName = "")
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);

            /*if (TempData["TutorModel"] != null)
            {
                TutorCache tutorCache = JsonConvert.DeserializeObject<TutorCache>(TempData["TutorModel"].ToString());
                TempData.Keep("TutorModel");
                int ExcludeRecords = (pageSize * pageNumber) - pageSize;
                TutorQuestionModel tqm = new TutorQuestionModel
                {
                    User = tutorCache.Extract()
                };
                tqm.allQuestionsByTag = TutorQuestionDB.GetAllQuestionsByTag(TagName, configuration.GetConnectionString("DefaultConnection"));
                tqm.RandomTags = TutorQuestionDB.GetTagsRandomly(configuration.GetConnectionString("DefaultConnection"));
                int totalitems = tqm.allQuestionsByTag.Count;
                var tutorQuestions = tqm.allQuestionsByTag.Skip(ExcludeRecords).Take(pageSize);
                var questions = new PagedResult<TutorQuestion>
                {
                    Data = tutorQuestions.ToList(),
                    TotalItems = totalitems,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
                tqm.paging = questions;
                return View(tqm);
            }
            return RedirectToAction("Index", "Home");
            */
        }

        public IActionResult AllQuestions(int pageNumber = 1, int pageSize = 5)
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);

            /*if (TempData["TutorModel"] != null)
            {
                TutorCache tutorCache = JsonConvert.DeserializeObject<TutorCache>(TempData["TutorModel"].ToString());
                TempData.Keep("TutorModel");
                int ExcludeRecords = (pageSize * pageNumber) - pageSize;
                TutorQuestionModel tqm = new TutorQuestionModel
                {
                    User = tutorCache.Extract()
                };
                tqm.all = TutorQuestionDB.GetTutorQuestions(configuration.GetConnectionString("DefaultConnection"));
                tqm.RandomTags = TutorQuestionDB.GetTagsRandomly(configuration.GetConnectionString("DefaultConnection"));
                int totalitems = tqm.all[0].Count;
                var tutorQuestions = tqm.all[0].Skip(ExcludeRecords).Take(pageSize);
                var questions = new PagedResult<TutorQuestion>
                {
                    Data = tutorQuestions.ToList(),
                    TotalItems = totalitems,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
                tqm.paging = questions;
                return View(tqm);
            }
            return RedirectToAction("Index", "Home");
            */
        }
        public IActionResult AddTutorQuestion()
        {
            TutorModel tutorModel = base.TutorModel;
            if (tutorModel != null)
            {
                return View(tutorModel);
            }
            return base.AssureLogin(this.CurrentController, this.CurrentAction);

            /*if (TempData["TutorModel"] != null)
            {
                TutorCache tutorCache = JsonConvert.DeserializeObject<TutorCache>(TempData["TutorModel"].ToString());
                TempData.Keep("TutorModel");
                TutorQuestionModel tqm = new TutorQuestionModel
                {
                    User = tutorCache.Extract()
                };
                tqm.dataListTags = TutorQuestionDB.GetAllTags(configuration.GetConnectionString("DefaultConnection"));
                return View(tqm);
            }
            return RedirectToAction("Index", "Home"); 
            */
        }

        public IActionResult SubmitTutorQuestion(string title, string description, long tutorId, string tagNames)
        {
            DataTable dtTags = null;
            dtTags = JsonConvert.DeserializeAnonymousType<DataTable>(tagNames, dtTags);
            int x = TutorQuestionDB.SubmitTutorQuestion(title, description, tutorId, dtTags, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            if (x > 0)
            {
                Notify("AddedQuestion", "" + x);
            }
            return Json(x);
        }
        public IActionResult SubmitTutorQuestionAnswer(long TQuestionId, string description, long UID, long ObjEntityId)
        {
            int x = TutorQuestionDB.SubmitTutorQuestionAnswer(TQuestionId, description, UID, ObjEntityId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            if (x > 0)
            {
                Notify("SubmitedAnswer", "" + TQuestionId);
            }

            return Json(x);
        }

        public IActionResult SubmitTutorQuestionComment(long TQuestionId, long UID, long ObjEntityId, string Description)
        {
            TQuestionComment newTutorQuestionComment = new TQuestionComment();
            newTutorQuestionComment = TutorQuestionDB.AddTutorQuestionComment(TQuestionId, UID, ObjEntityId, Description, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            if (newTutorQuestionComment != null)
            {
                Notify("CommentedQuestion", "" + TQuestionId);
            }
            return Json(newTutorQuestionComment);
        }
        public IActionResult SubmitTutorQuestionAnswerComment(long TQuestionAnswerId, long UID, long ObjEntityId, string Description)
        {
            TQuestionAnswerComment newTutorQuestionAnswerComment = new TQuestionAnswerComment();
            newTutorQuestionAnswerComment = TutorQuestionDB.AddTutorQuestionAnswerComment(TQuestionAnswerId, UID, ObjEntityId, Description, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            if (newTutorQuestionAnswerComment != null)
            {
                Notify("CommentedAnswer", "" + TQuestionAnswerId);
            }
            return Json(newTutorQuestionAnswerComment);
        }

        [HttpPost]
        public int CloseQuestion(long TQuestionId, long tutorID)
        {
            int x = TutorQuestionDB.CloseQuestion(TQuestionId, tutorID, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            if (x == 1)
            {
                Notify("Closed", "" + TQuestionId);
            }
            return x;
        }

        [HttpPost]
        public IActionResult Follow(long TQuestionId, long UID, int ObjEntityId)
        {
            int x = TutorQuestionDB.Follow(TQuestionId, UID, ObjEntityId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            if (x == 1)
            {
                Notify("Follow");
            }
            else if (x == -1)
            {
                Notify("Unfollow");

            }
            return Json(x);
        }
        [HttpPost]
        public IActionResult Vote(long TQuestionAnswerId, long UID, int ObjEntityId, int UpDownVote)
        {
            int x = TutorQuestionDB.Vote(TQuestionAnswerId, UID, ObjEntityId, UpDownVote, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            if (x == 1)
            {
                Notify(UpDownVote == 1 ? "Like" : "Dislike");
            }
            return Json(x);
        }
        [HttpPost]
        public IActionResult GetAllQuestions(int pageNumber = 1, int pageSize = 5, long UID = 0, string tag = "")
        {
            QAResponse<List<TutorQuestion>> response = TutorQuestionDB.GetAllTutorQuestions(pageNumber, pageSize, UID, tag, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetTutorQuestions(int pageNumber = 1, int pageSize = 5, long UID = 0, long tutorId = 0, int selectType = 1)
        {
            QAResponse<List<TutorQuestion>> response = TutorQuestionDB.GetTutorQuestions(pageNumber, pageSize, UID, tutorId, selectType, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetTutorQuestionsDDL(int lang = 1)
        {
            // 36 is the lookupId for tutorQuestionDDL
            QAResponse<IList<LookUpDetails>> response = new QAResponse<IList<LookUpDetails>>();
            response.Content = LookUpDB.FillTutorQuestionDropDown(36, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult Getlookups(int lang = 1, int LookupId = 0)
        {
            QAResponse<IList<LookUpDetails>> response = new QAResponse<IList<LookUpDetails>>();
            response.Content = LookUpDB.GetLookUpDetails(LookupId, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetAllTags()
        {
            QAResponse<IList<string>> response = new QAResponse<IList<string>>();
            response.Content = TutorQuestionDB.GetAllTagsUnique(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }


        /* Tutor Question Answer Section*/
        [HttpPost]
        public IActionResult GetQuestion(long UID = 0, long TQuestionId = 0)
        {
            QAResponse<TutorQuestion> response = new QAResponse<TutorQuestion>();
            response = TutorQuestionDB.GetTutorQuestion(UID, TQuestionId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetTutorQuestionAnswers(long UID = 0, long TQuestionId = 0)
        {
            QAResponse<List<TQuestionAnswer>> response = new QAResponse<List<TQuestionAnswer>>();
            response = TutorQuestionDB.GetAllTutorQuestionAnswers(UID, TQuestionId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetCommentsByQuestionId(long TQuestionId = 0)
        {
            QAResponse<List<TQuestionComment>> response = new QAResponse<List<TQuestionComment>>();
            response = TutorQuestionDB.GetCommentsByQuestionId(TQuestionId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetCommentsByQuestionAnswerId(long TutorQuestionAnswerId = 0)
        {
            QAResponse<List<TQuestionAnswerComment>> response = new QAResponse<List<TQuestionAnswerComment>>();
            response = TutorQuestionDB.GetCommentsByQuestionAnswerId(TutorQuestionAnswerId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetFollowersByQuestionId(long TutorQuestionId = 0)
        {
            QAResponse<List<TQuestionFollower>> response = new QAResponse<List<TQuestionFollower>>();
            response = TutorQuestionDB.GetFollowersByQuestionId(TutorQuestionId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetLikersByQuestionAnswerId(long TutorQuestionAnswerId = 0)
        {
            QAResponse<List<TQuestionAnswerLiker>> response = new QAResponse<List<TQuestionAnswerLiker>>();
            response = TutorQuestionDB.GetLikersByQuestionAnswerId(TutorQuestionAnswerId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }
        [HttpPost]
        public IActionResult GetDisLikersByQuestionAnswerId(long TutorQuestionAnswerId = 0)
        {
            QAResponse<List<TQuestionAnswerDisliker>> response = new QAResponse<List<TQuestionAnswerDisliker>>();
            response = TutorQuestionDB.GetDisLikersByQuestionAnswerId(TutorQuestionAnswerId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(response);
        }


        /*End Tutor Question Answer Section*/

        // Notification Section
        public IActionResult Notify(string type = "", string extra = "")
        {

            return null;
        }

    }
}
