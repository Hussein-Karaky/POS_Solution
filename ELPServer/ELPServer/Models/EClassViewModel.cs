using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELPServer.Models
{
    public class EClassViewModel
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
