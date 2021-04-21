using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.Shared;
using DAL.Shared;
using INTO.Controllers.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace INTO.Controllers
{

    public class LookUpController : AppController<LookUpController>
    {
        public LookUpController(IConfiguration configuration) : base(configuration) { }
        public IActionResult Index(int lang, string key)
        {
            return Get(0, 1, key, lang);
        }
        public IActionResult TutorDegrees()
        {
            IList<LookUpDetails> degrees = LookUpDB.GetLookupDetails(1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(degrees);
        }

        [HttpPost]
        public IActionResult Get(int lkp, int objEntityId, string key = null, int? lang = 1)
        {
            IList<LookUpDetails> lookups = LookUpDB.GetLookupDetails(0, key, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(lookups);
        }

        [Route("lookup/val/{lang}/{key}", Order = 1)]
        [Route("lookup/val/{lang}/{key}/{dataType}", Order = 2)]
        public IActionResult Val(int lkp, int objEntityId, string key = null, int? lang = 1, string dataType = null)
        {
            IList<LookUpDetails> lookups = LookUpDB.GetLookupDetails(0, key, lang, dataType, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(lookups);
        }
        //Nabih
        [Route("lookup/GetLkpDetails/{keyword}/{lang}", Order = 1)]
        public IActionResult GetLkpDetails(string keyword = null, int? lang = 1)
        {
            IList<LookUpDetails> lookups = LookUpDB.GetLkupByAb(keyword, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(lookups);
        }
    }
}
