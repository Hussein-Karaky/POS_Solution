using System;

namespace POS_Solutions.BLL.Shared
{
    public class WeekDay
    {
        public WeekDay() { }
        public WeekDay(Day day) { this.Index = (byte)day; this.Value = Enum.GetName(typeof(Day), this.Index); }
        public byte Index { set; get; }
        public string Value { set; get; }
    }

    public enum Day
    {
        Sunday = 0,
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6
    }
}
