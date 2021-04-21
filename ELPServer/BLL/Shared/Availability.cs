using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static BLL.Shared.WeekDay;

namespace BLL.Shared
{
    public class Availability
    {
        public AvailabilityDay [] Days = Enum.GetValues(typeof(Day)).Cast<Day>().Select(d => new AvailabilityDay(d)).ToArray();
    }
}
