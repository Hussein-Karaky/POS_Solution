using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Search
{
   public class SearchFilter
    {
        public int? Country { get; set; }
        public int? TutoringService { get; set; }
        public int? AcademicLevel { get; set; }
        public int? Curriculum { get; set; }
        public int? Language { get; set; }
        public int? EducationClass { get; set; }
        public int? Subject { get; set; }
        public IList<BriefAvailability> Availability { get; set; }
        public string StartingTime { get; set; }
        public decimal? MinInPersonHourRate { get; set; }
        public decimal? MaxInPersonHourRate { get; set; }
        public int? InPersonCur { get; set; }
        public decimal? MinOnlineHourRate { get; set; }
        public decimal? MaxOnlineHourRate { get; set; }
        public int? OnlineCurId { get; set; }
        public bool? Gender { get; set; }
        public string SearchColumn { get; set; }
        public string SearchValue { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SortingColumn { get; set; }
        public bool SortingDirection { get; set; }
        public int? MinTutorAge { get; set; }
        public int? MaxTutorAge { get; set; }
    }
}