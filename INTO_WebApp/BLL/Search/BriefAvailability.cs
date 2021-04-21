using BLL.Shared;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Search
{
    public class BriefAvailability
    {
        public BriefAvailabilityDay Day { get; set; }

        public BriefAvailabilityDayTime Time { get; set; }
    }
}
