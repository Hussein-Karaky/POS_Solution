using BLL.Shared;

namespace BLL.Student
{
    public class Student : User
    {
        public Student() : base(EntityType.Student) { }
        public long Id { set; get; }
    }
}