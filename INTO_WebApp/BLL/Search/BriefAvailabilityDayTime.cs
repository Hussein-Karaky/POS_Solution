using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace BLL.Search
{
    public class BriefAvailabilityDayTime
    {
        public byte Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public BriefAvailabilityTime DayTime { get; set; }

    }
    public enum BriefAvailabilityTime
    {
        BeforeNoon = 0,
        AfterNoon = 1,
        Evening = 2
    }
}
