using Newtonsoft.Json;

namespace BLL.Shared
{
    public class TimeLimit
    {
        public TimePoint From { set; get; }
        public TimePoint To { set; get; }
        public TimeLimitExtra Extra { set; get; }
        public override bool Equals(object obj)
        {
            return obj is TimeLimit && this.From == ((TimeLimit)obj).From && this.To == ((TimeLimit)obj).To;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }

    public class TimePoint
    {
        [JsonIgnore]
        public static TimePoint[] Times = new TimePoint[] {
        new TimePoint{ Index = 0, Value = "Midnight" },//translation to be loaded from resources
        new TimePoint{ Index = 1, Value = "1 am" },
        new TimePoint{ Index = 2, Value = "2 am" },
        new TimePoint{ Index = 3, Value = "3 am" },
        new TimePoint{ Index = 4, Value = "4 am" },
        new TimePoint{ Index = 5, Value = "5 am" },
        new TimePoint{ Index = 6, Value = "6 am" },
        new TimePoint{ Index = 7, Value = "7 am" },
        new TimePoint{ Index = 8, Value = "8 am" },
        new TimePoint{ Index = 9, Value = "9 am" },
        new TimePoint{ Index = 10, Value = "10 am" },
        new TimePoint{ Index = 11, Value = "11 am" },
        new TimePoint{ Index = 12, Value = "Noon" },
        new TimePoint{ Index = 13, Value = "1 pm" },
        new TimePoint{ Index = 14, Value = "2 pm" },
        new TimePoint{ Index = 15, Value = "3 pm" },
        new TimePoint{ Index = 16, Value = "4 pm" },
        new TimePoint{ Index = 17, Value = "5 pm" },
        new TimePoint{ Index = 18, Value = "6 pm" },
        new TimePoint{ Index = 19, Value = "7 pm" },
        new TimePoint{ Index = 20, Value = "8 pm" },
        new TimePoint{ Index = 21, Value = "9 pm" },
        new TimePoint{ Index = 22, Value = "10 pm" },
        new TimePoint{ Index = 23, Value = "11 pm" }
        };
        public byte Index { set; get; }
        public string Value { set; get; }
    }
}