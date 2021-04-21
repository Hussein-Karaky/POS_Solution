using BLL.Shared;

namespace BLL.Parent
{
    public class Parent : User
    {
        public Parent() : base(EntityType.Parent) { }
        public long Id { set; get; }
    }
}