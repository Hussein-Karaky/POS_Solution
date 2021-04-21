using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace BLL.Search
{
    public class BriefAvailabilityDay
    {
        public byte Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public Day WeekDay { get; set; }

    }
}
