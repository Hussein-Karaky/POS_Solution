using System;
using System.Linq;

namespace POS_Solutions.BLL.Shared
{
    public class Availability : DataEntity<DataEntityCache<Availability>, Availability>
    {
        public AvailabilityDay[] Days = Enum.GetValues(typeof(Day)).Cast<Day>().Select(d => new AvailabilityDay(d)).ToArray();

        public override DataEntityCache<Availability> Cache(DataEntityCache<Availability> cache = null)
        {
            throw new NotImplementedException();
        }
    }
}
