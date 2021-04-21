using System;

namespace INTO.Models
{
    public class EClassViewModel : LoginModel
    {
        private Guid id = Guid.NewGuid();

        private string name = "Math";

        public Guid GetId()
        {
            return this.id;
        }

        public string GetName()
        {
            return this.name;
        }
    }
}
