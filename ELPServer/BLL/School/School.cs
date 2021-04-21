using BLL.Shared;

namespace BLL.School
{
    public class School : User
    {
        public School() : base(EntityType.School) { }
        public long Id { set; get; }
    }
}