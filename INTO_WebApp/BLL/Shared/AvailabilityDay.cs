using System.Collections.Generic;

namespace BLL.Shared
{
    public class AvailabilityDay
    {
        public AvailabilityDay() { }
        public AvailabilityDay(Day day) { this.Day = new WeekDay(day); }
        public bool Active { set; get; }
        public WeekDay Day { set; get; }
        public IList<TimeLimit> Limits = new List<TimeLimit>();
        public void Validate()
        {
            this.Active = this.Limits != null && this.Limits.Count > 0;
        }

        public IList<TimeLimit> Add(TimeLimit limit)
        {
            if (this.Limits == null) { this.Limits = new List<TimeLimit>(); }
            this.Limits.Add(limit);
            this.Validate();
            return this.Limits;
        }

        public IList<TimeLimit> Remove(TimeLimit limit)
        {
            if (this.Limits != null && limit != null)
            {
                this.Limits.Remove(limit);
            }
            this.Validate();
            return this.Limits;
        }
    }
}